from django.urls import path
from .views import StartTestView, SubmitAnswerView, Test_History_View, GetTestDetailView

urlpatterns = [
    path('start_test/', StartTestView.as_view(), name='start_test'),
    path('submit_answer/', SubmitAnswerView.as_view(), name='submit_answer'),
    path('test_history/', Test_History_View.as_view(), name='test_history'),
    path('test/<int:test_id>/', GetTestDetailView.as_view(), name='test_detail'),
]