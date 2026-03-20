from django.contrib import admin
from django.urls import path
from interview.views import Generate_questions

urlpatterns = [
    path('admin/', admin.site.urls),
    path('generate_qns/', Generate_questions.as_view(), name='generate_questions'),
]