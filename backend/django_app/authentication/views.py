from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import UserSignup, UserLogin
from user.models import UserProfile as User
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from django.contrib.auth import authenticate
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from common.email import send_email
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
# Create your views here.

# Register or Signup new user
class UserSignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSignup(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            name = data.get('name')
            email = data.get('email')
            password = data.get('password')
            confirm_password = data.get('confirm_password')
            if password != confirm_password:
                return Response({'message': 'password and confirm password do not match'},
                    status=status.HTTP_400_BAD_REQUEST)
            if User.objects.filter(email=email).exists():
                return Response({'message': 'email id already registered'},
                    status=status.HTTP_400_BAD_REQUEST)
            
            user = User.objects.create(
                name=name,
                email=email
            )
            user.set_password(password)
            user.save()

            return Response(
                {'message': 'form submitted successfully'},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Authenticate and login New user
class UserLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserLogin(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            email = data.get("email")
            password = data.get("password")
            
            try:
                user_obj = User.objects.get(email=email)
                user = authenticate(email=user_obj.email, password=password)
            except User.DoesNotExist:
                user = None
            
            if user is None:
                return Response(
                    {"error": "Invalid credentials"},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            if user.scheduled_deletion_on:
                return Response(
                    {"error": "This account is scheduled for deletion and is no longer accessible."},
                    status=status.HTTP_403_FORBIDDEN
                )

            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'user logged in successfully',
                'access': str(refresh.access_token),
                'refresh': str(refresh)
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# generates password reset link email & sends it to user
class reset_password(APIView):
    permission_classes = [AllowAny]
    def reset_password(request):
        reset_email = request.data.get("email")
        user = User.objects.filter(email=reset_email).first()
        if not user:
            return Response({"message": "user not found!"}, status=status.HTTP_404_NOT_FOUND)

        uid = urlsafe_base64_encode(force_bytes(user.id))
        token = PasswordResetTokenGenerator().make_token(user)
        default_email = "support@careeriq.com"
        mail_sub = "Password Reset Link"

        message = f"""
        Hello,

        You requested a password reset for your account. Click on the link below to set a new password:

       http://localhost:5173/setnewpassword/?uid={uid}&token={token}

        If you did not request this, please ignore this email.

        Best regards,
        CareerIQ Support Team
        """

        try:
            send_email(request, default_email, reset_email, message, mail_sub)
        except Exception as e:
            print(f"Reset email failed: {str(e)}")

        return Response({"message": "Reset link generated and sent to your email."})


# sets the new password 
class set_new_password(APIView):
    def set_new_password(request):
        uid = request.data.get('uid')
        token = request.data.get('token')
        new_pass = request.data.get('newpassword')

        if not uid or not token or not new_pass:
            return Response({"message": "uid, token and new_password are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_id = urlsafe_base64_decode(uid).decode()
            user = User.objects.get(id=user_id)
        except:
            return Response({"message": "invalid uid"}, status=status.HTTP_400_BAD_REQUEST)

        if PasswordResetTokenGenerator().check_token(user, token):
            user.set_password(new_pass)
            user.save()

            default_email = "support@quizizeai.com"
            mail_sub = "Your Password Has Been Changed"
            confirm_message = f"""
            Hello {user.name},

            This is a confirmation that the password for your account has been successfully changed.

            If you did not perform this action, please contact our support team immediately.

            Best regards,
            quizize Support Team
            """
            try:
                send_email(request, default_email, user.email,
                           confirm_message, mail_sub)
            except Exception as e:
                print(f"Confirmation email failed: {str(e)}")

            return Response({"message": "password reset successfully."})
        else:
            return Response({"message": "Invalid or expired token.."}, status=status.HTTP_400_BAD_REQUEST)
        

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "id": request.user.id,
            "name": request.user.name,
            "email": request.user.email,
            "plan": "Pro"
        })
