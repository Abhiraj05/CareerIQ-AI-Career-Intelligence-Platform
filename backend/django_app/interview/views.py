from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
# Create your views here.
class Generate_questions(APIView):
    def post(self, request):
        
        return Response({"message": "Interview questions generated successfully"})