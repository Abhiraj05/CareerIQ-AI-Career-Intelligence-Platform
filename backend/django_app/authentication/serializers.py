from rest_framework import serializers

class UserSignup(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    user_email=serializers.EmailField(max_length=30)
    password=serializers.CharField(write_only=True)

class UserLogin(serializers.Serializer):
    user_email=serializers.EmailField()
    password=serializers.CharField(write_only=True)

    
