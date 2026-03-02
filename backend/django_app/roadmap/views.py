from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
import requests

# Create your views here.
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_roadmap(request):
    user_input=request.data.get("")
    requests.get("",json={"user_input":user_input})