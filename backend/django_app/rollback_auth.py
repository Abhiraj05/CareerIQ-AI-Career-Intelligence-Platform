import os

# Fix views.py
view_path = r'c:\Users\mayur\OneDrive\Desktop\careeriq\backend\django_app\authentication\views.py'
with open(view_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_view_content = []
for line in lines:
    if 'class MeView' in line:
        break
    new_view_content.append(line)

# Ensure no extra newlines at end
content = "".join(new_view_content).rstrip() + "\n"

with open(view_path, 'w', encoding='utf-8') as f:
    f.write(content)

# Fix urls.py
url_path = r'c:\Users\mayur\OneDrive\Desktop\careeriq\backend\django_app\authentication\urls.py'
url_content = """from django.urls import path
from .views import UserSignupView, UserLoginView

urlpatterns = [
    path('signup/', UserSignupView.as_view(), name='user_signup'),
    path('login/', UserLoginView.as_view(), name='user_login'),
]
"""
with open(url_path, 'w', encoding='utf-8') as f:
    f.write(url_content)

print("Reverted views.py and urls.py successfully")
