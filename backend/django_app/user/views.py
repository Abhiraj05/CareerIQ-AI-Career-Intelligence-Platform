from django.utils import timezone
from datetime import timedelta
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import UserProfile

# Fetch user Profile Data
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    # Fetch User Profile Information
    def get(self, request):
        user = request.user
        data = {
            "name": user.name,
            "email": user.email,
            "current_role": user.current_role or "",
            "company": user.company or "",
            "preferences": {
                "email_notifications": user.email_notifications,
                "weekly_report": user.weekly_report,
                "dark_mode": user.dark_mode,
                "ai_suggestions": user.ai_suggestions,
            }
        }
        return Response(data)
    # Update User Profile Data
    def put(self, request):
        user = request.user
        data = request.data
        
        user.name = data.get("name", user.name)
        user.current_role = data.get("current_role", user.current_role)
        user.company = data.get("company", user.company)
        
        prefs = data.get("preferences", {})
        user.email_notifications = prefs.get("email_notifications", user.email_notifications)
        user.weekly_report = prefs.get("weekly_report", user.weekly_report)
        user.dark_mode = prefs.get("dark_mode", user.dark_mode)
        user.ai_suggestions = prefs.get("ai_suggestions", user.ai_suggestions)
        
        user.save()
        return Response({"message": "Profile updated successfully"})
    # To Delete User Account
    def delete(self, request):
        user = request.user
        user.scheduled_deletion_on = timezone.now() + timedelta(days=10)
        user.is_active = False
        user.save()
        return Response({"message": "Account scheduled for deletion in 10 days."})
    
    ##Export User Data
    # def post(self, request):
    #     if request.data.get("action") == "export":
    #         user = request.user
    #         export_data = {
    #             "profile": {
    #                 "name": user.name,
    #                 "email": user.email,
    #                 "role": user.current_role,
    #                 "company": user.company
    #             },
    #             "preferences": {
    #                 "email_notifications": user.email_notifications,
    #                 "weekly_report": user.weekly_report,
    #                 "dark_mode": user.dark_mode,
    #                 "ai_suggestions": user.ai_suggestions
    #             }
    #         }
    #         return Response(export_data)
    #     return Response({"error": "Invalid action"}, status=status.HTTP_400_BAD_REQUEST)
