from django.http import JsonResponse
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from resume.models import UserResume, ResumeAnalysis
import uuid
from resume.serializers import ResumeUploadSerializer
from markitdown import MarkItDown
import os

# To extract text from resume file
def file_text_extract(file):
    extract = MarkItDown()
    temp_path = f"temp_{uuid.uuid4()}_{file.name}"
    with open(temp_path, "wb") as f:
        for chunk in file.chunks():
            f.write(chunk)
    text = None
    try:
        result = extract.convert(temp_path)
        text = result.text_content
    except Exception as e:
        print(e)
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)
    return text


# Resume Uploading View and sending api request to llm
class ResumeUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ResumeUploadSerializer(data=request.data)
        if serializer.is_valid():
            resume_file = serializer.validated_data['resume_file']
            text = file_text_extract(resume_file)
            if text is None:
                return Response({'error': 'Failed to extract text from the resume.'}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                response = requests.post("http://127.0.0.1:8001/analyze_resume", json={"resume_text": text}, timeout=60)
                if response.status_code != 200:
                    return Response({'error': f'AI Analysis failed with status {response.status_code}', 'detail': response.text}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
                analysis_data = response.json()
                ResumeAnalysis.objects.create(user_id=request.user, analysis_result=analysis_data)
                return JsonResponse(analysis_data)
            except requests.exceptions.RequestException as e:
                return Response({'error': f'Failed to connect to AI Service: {str(e)}'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Fetching users Resume Analysis Video
class ResumeHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        analyses = ResumeAnalysis.objects.filter(user_id=request.user).order_by('-created_at')
        data = []
        for a in analyses:
            result = a.analysis_result or {}
            ar = result.get("analysis_result", result)
            data.append({
                "id": a.id,
                "overall_score": ar.get("overall_score", 0),
                "overall_label": ar.get("overall_label", ""),
                "created_at": a.created_at.strftime("%b %d, %Y %I:%M %p"),
            })
        return JsonResponse({"history": data})


# Fetch detailed results for a specific resume analysis session
class ResumeDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, analysis_id):
        try:
            a = ResumeAnalysis.objects.get(id=analysis_id, user_id=request.user)
            return JsonResponse({"id": a.id, "analysis_result": a.analysis_result, "created_at": a.created_at.strftime("%b %d, %Y")})
        except ResumeAnalysis.DoesNotExist:
            return JsonResponse({"error": "Not found."}, status=404)
