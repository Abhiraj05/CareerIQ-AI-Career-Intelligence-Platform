import os

# 1. Update views.py: Add MeView cleanly
view_path = r'c:\Users\mayur\OneDrive\Desktop\careeriq\backend\django_app\authentication\views.py'
with open(view_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# find if MeView already exists (it shouldn't if I rolled back)
filtered_lines = []
for line in lines:
    if 'class MeView' in line:
        break
    filtered_lines.append(line)

me_view_code = """
class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "id": request.user.id,
            "name": request.user.name,
            "email": request.user.email,
            "plan": "Pro"
        })
"""

with open(view_path, 'w', encoding='utf-8') as f:
    f.writelines(filtered_lines)
    f.write(me_view_code)

# 2. Update urls.py: Add me/ route
url_path = r'c:\Users\mayur\OneDrive\Desktop\careeriq\backend\django_app\authentication\urls.py'
url_content = """from django.urls import path
from .views import UserSignupView, UserLoginView, MeView

urlpatterns = [
    path('signup/', UserSignupView.as_view(), name='user_signup'),
    path('login/', UserLoginView.as_view(), name='user_login'),
    path('me/', MeView.as_view(), name='user_me'),
]
"""
with open(url_path, 'w', encoding='utf-8') as f:
    f.write(url_content)

print("Backend MeView restored correctly")
