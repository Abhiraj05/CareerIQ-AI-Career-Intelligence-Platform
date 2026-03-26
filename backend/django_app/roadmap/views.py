from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
import requests
from roadmap.serializers import RoadMapSerializer, CareerRoleSerializer
from roadmap.models import CareerRole, RoadMap
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
import json


class RoadmapHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        roles = CareerRole.objects.filter(user=request.user).order_by('-created_at')
        data = []
        for role in roles:
            rm = RoadMap.objects.filter(role=role).order_by('-created_at').first()
            if rm:
                total = sum(len(p.get("modules", [])) for p in (rm.roadmap or []))
                completed = len(rm.completed_modules or [])
                data.append({
                    "roadmap_id": rm.id,
                    "career_role": role.role_name,
                    "experience_level": role.experience_level,
                    "total_modules": total,
                    "completed_modules": completed,
                    "progress_pct": round((completed / total) * 100) if total > 0 else 0,
                    "created_at": role.created_at.strftime("%b %d, %Y %I:%M %p"),
                })
        return JsonResponse({"history": data})


# Create your views here.
class GenerateRoadmapView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        career_serializer = CareerRoleSerializer(data=request.data)
        if career_serializer.is_valid():
            role_name = request.data.get("role_name")
            experience_level = request.data.get("experience_level")
            current_skills = request.data.get("current_skills")

            # Call FastAPI to generate roadmap
            response = requests.post("http://127.0.0.1:8001/generate_roadmap", json={
                "role_name": role_name,
                "experience_level": experience_level,
                "current_skills": current_skills
            })

            if response.status_code != 200:
                return JsonResponse({"error": "Failed to generate roadmap."}, status=500)

            outer = response.json()
            # FastAPI returns: { "roadmap": { "career_role": "...", "roadmap": [...], ... } }
            llm_data = outer.get("roadmap", {})
            if isinstance(llm_data, dict):
                roadmap_data = llm_data.get("roadmap", [])
                career_role_label = llm_data.get("career_role", role_name)
            else:
                # fallback: already a list
                roadmap_data = llm_data
                career_role_label = role_name

            # Save CareerRole to DB
            career_role_obj = CareerRole.objects.create(
                user=request.user,
                role_name=role_name,
                experience_level=experience_level,
                current_skills=current_skills if isinstance(current_skills, list) else []
            )

            # Save RoadMap to DB
            roadmap_obj = RoadMap.objects.create(
                role=career_role_obj,
                roadmap=roadmap_data,
                completed_modules=[]
            )

            return JsonResponse({
                "roadmap_id": roadmap_obj.id,
                "career_role": career_role_label,
                "roadmap": roadmap_data
            })
        else:
            return Response(career_serializer.errors, status=400)


class GetLatestRoadmapView(APIView):
    """Returns the user's most recently generated roadmap with completion state."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Get latest CareerRole for this user
            latest_role = CareerRole.objects.filter(user=request.user).order_by('-created_at').first()
            if not latest_role:
                return JsonResponse({"roadmap_id": None, "roadmap": [], "completed_modules": [], "career_role": ""})

            roadmap_obj = RoadMap.objects.filter(role=latest_role).order_by('-created_at').first()
            if not roadmap_obj:
                return JsonResponse({"roadmap_id": None, "roadmap": [], "completed_modules": [], "career_role": ""})

            return JsonResponse({
                "roadmap_id": roadmap_obj.id,
                "career_role": latest_role.role_name,
                "roadmap": roadmap_obj.roadmap,
                "completed_modules": roadmap_obj.completed_modules or []
            })
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)


class ToggleModuleView(APIView):
    """Toggle a module's completed state in the RoadMap."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        roadmap_id = request.data.get("roadmap_id")
        module_key = request.data.get("module_key")  # e.g. "0-1"

        if not roadmap_id or module_key is None:
            return Response({"error": "roadmap_id and module_key are required."}, status=400)

        try:
            roadmap_obj = RoadMap.objects.get(id=roadmap_id, role__user=request.user)
        except RoadMap.DoesNotExist:
            return Response({"error": "Roadmap not found."}, status=404)

        completed = list(roadmap_obj.completed_modules or [])
        if module_key in completed:
            completed.remove(module_key)
        else:
            completed.append(module_key)

        roadmap_obj.completed_modules = completed
        roadmap_obj.save()

        return JsonResponse({"completed_modules": completed})


class GetRoadmapByIdView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, roadmap_id):
        try:
            roadmap_obj = RoadMap.objects.get(id=roadmap_id, role__user=request.user)
            return JsonResponse({
                "roadmap_id": roadmap_obj.id,
                "career_role": roadmap_obj.role.role_name,
                "roadmap": roadmap_obj.roadmap,
                "completed_modules": roadmap_obj.completed_modules or []
            })
        except RoadMap.DoesNotExist:
            return JsonResponse({"error": "Roadmap not found."}, status=404)