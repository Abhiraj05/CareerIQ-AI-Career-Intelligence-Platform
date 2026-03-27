import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from .serializers import InterviewPrepSerializer
from .models import InterviewPrep, InterviewQuestion
from user.models import UserProfile as User


# Generate a set of interview questions
class Generate_questions(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = InterviewPrepSerializer(data=request.data)
        if serializer.is_valid():
            target_role = request.data.get('target_role')
            company_type = request.data.get('company')
            experience_level = request.data.get('experience_level')
            tech_stack = request.data.get('tech_stack')
            user_obj = User.objects.get(id=request.user.id)
            db_obj = InterviewPrep.objects.create(
                user_id=user_obj, target_role=target_role, company=company_type,
                experience_level=experience_level, tech_stack=tech_stack
            )
            response = requests.post("http://127.0.0.1:8001/generate_interview_questions", json={
                "target_role": target_role, "company_type": company_type,
                "experience_level": experience_level, "tech_stack": tech_stack
            })
            questions_data = response.json().get("interview_questions", [])
            InterviewQuestion.objects.create(interview_prep=db_obj, question_answer_text=questions_data)
            return JsonResponse({"session_id": db_obj.id, "interview_questions": questions_data})
        return Response(serializer.errors, status=400)


# Fetch the user's interview history
class InterviewHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_obj = User.objects.get(id=request.user.id)
        sessions = InterviewPrep.objects.filter(user_id=user_obj).order_by('-created_at')
        data = []
        for s in sessions:
            data.append({
                "id": s.id,
                "target_role": s.target_role,
                "company": s.company,
                "experience_level": s.experience_level,
                "tech_stack": s.tech_stack,
                "created_at": s.created_at.strftime("%b %d, %Y %I:%M %p"),
            })
        return JsonResponse({"history": data})


# Retrieve details and questions for a specific interview session
class InterviewSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, session_id):
        user_obj = User.objects.get(id=request.user.id)
        try:
            session = InterviewPrep.objects.get(id=session_id, user_id=user_obj)
            iq = InterviewQuestion.objects.filter(interview_prep=session).first()
            questions = iq.question_answer_text if iq else []
            return JsonResponse({
                "session_id": session.id,
                "target_role": session.target_role,
                "company": session.company,
                "experience_level": session.experience_level,
                "tech_stack": session.tech_stack,
                "reviewed_questions": session.reviewed_questions or [],
                "interview_questions": questions,
                "created_at": session.created_at.strftime("%b %d, %Y"),
            })
        except InterviewPrep.DoesNotExist:
            return JsonResponse({"error": "Session not found."}, status=404)


# Toggle the reviewed status of a specific interview question
class MarkReviewedView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        session_id = request.data.get("session_id")
        question_index = request.data.get("question_index")
        user_obj = User.objects.get(id=request.user.id)
        try:
            session = InterviewPrep.objects.get(id=session_id, user_id=user_obj)
        except InterviewPrep.DoesNotExist:
            return Response({"error": "Session not found."}, status=404)
        reviewed = list(session.reviewed_questions or [])
        if question_index in reviewed:
            reviewed.remove(question_index)
        else:
            reviewed.append(question_index)
        session.reviewed_questions = reviewed
        session.save()
        return JsonResponse({"reviewed_questions": reviewed})


# Fetch the most recent interview session for the dashboard
class GetLatestInterviewView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_obj = User.objects.get(id=request.user.id)
        session = InterviewPrep.objects.filter(user_id=user_obj).order_by('-created_at').first()
        if not session:
            return JsonResponse({"session_id": None, "interview_questions": [], "reviewed_questions": []})
        iq = InterviewQuestion.objects.filter(interview_prep=session).first()
        questions = iq.question_answer_text if iq else []
        return JsonResponse({
            "session_id": session.id,
            "target_role": session.target_role,
            "company": session.company,
            "experience_level": session.experience_level,
            "tech_stack": session.tech_stack,
            "reviewed_questions": session.reviewed_questions or [],
            "interview_questions": questions,
        })
