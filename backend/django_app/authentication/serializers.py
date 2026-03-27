from rest_framework import serializers
# User signup serializer
class UserSignup(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    email=serializers.EmailField(max_length=30)
    password=serializers.CharField(write_only=True)
    confirm_password=serializers.CharField(write_only=True)

# User Login serializer
class UserLogin(serializers.Serializer):
    email=serializers.EmailField(max_length=30)
    password=serializers.CharField(write_only=True)

    
