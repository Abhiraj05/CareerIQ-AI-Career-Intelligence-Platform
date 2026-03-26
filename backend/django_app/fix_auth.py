import os

path = r'c:\Users\mayur\OneDrive\Desktop\careeriq\backend\django_app\authentication\views.py'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Truncate to the last valid line we know
# Line 162 was: return Response({"message": "Invalid or expired token.."}, status=status.HTTP_400_BAD_REQUEST)
# However, let's find it by content to be safe.
target_lines = []
for line in lines:
    target_lines.append(line)
    if 'Invalid or expired token..' in line:
        break

content = "".join(target_lines)
content += """

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

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("File fixed successfully")
