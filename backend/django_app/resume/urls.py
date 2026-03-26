from django.urls import path
from resume.views import ResumeUploadView, ResumeHistoryView, ResumeDetailView

urlpatterns = [
    path('upload/', ResumeUploadView.as_view(), name='resume_upload'),
    path('history/', ResumeHistoryView.as_view(), name='resume_history'),
    path('detail/<int:analysis_id>/', ResumeDetailView.as_view(), name='resume_detail'),
]