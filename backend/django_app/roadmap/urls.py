from django.urls import path
from roadmap.views import GenerateRoadmapView, GetLatestRoadmapView, ToggleModuleView, RoadmapHistoryView, GetRoadmapByIdView

urlpatterns = [
    path('generate_roadmap/', GenerateRoadmapView.as_view(), name='generate_roadmap'),
    path('get_latest/', GetLatestRoadmapView.as_view(), name='get_latest_roadmap'),
    path('toggle_module/', ToggleModuleView.as_view(), name='toggle_module'),
    path('history/', RoadmapHistoryView.as_view(), name='roadmap_history'),
    path('get_by_id/<int:roadmap_id>/', GetRoadmapByIdView.as_view(), name='get_roadmap_by_id'),
]