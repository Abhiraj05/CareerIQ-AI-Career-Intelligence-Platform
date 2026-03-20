from django.contrib import admin
from django.urls import path
from roadmap.views import GenerateRoadmapView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('generate_roadmap/',GenerateRoadmapView.as_view(),name='generate_roadmap')
]