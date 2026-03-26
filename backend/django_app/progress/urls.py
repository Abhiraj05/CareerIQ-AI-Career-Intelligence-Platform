from django.urls import path
from progress.views import ProgressSummaryView

urlpatterns = [
    path('summary/', ProgressSummaryView.as_view(), name='progress_summary'),
]