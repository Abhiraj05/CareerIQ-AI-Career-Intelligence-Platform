from django.urls import path
from interview.views import (
    Generate_questions, InterviewHistoryView,
    InterviewSessionView, MarkReviewedView, GetLatestInterviewView
)

urlpatterns = [
    path('generate_qns/', Generate_questions.as_view(), name='generate_questions'),
    path('history/', InterviewHistoryView.as_view(), name='interview_history'),
    path('session/<int:session_id>/', InterviewSessionView.as_view(), name='interview_session'),
    path('mark_reviewed/', MarkReviewedView.as_view(), name='mark_reviewed'),
    path('get_latest/', GetLatestInterviewView.as_view(), name='get_latest_interview'),
]