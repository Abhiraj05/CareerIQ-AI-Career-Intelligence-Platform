from .models import userresume
from rest_framework import serializers
from .models import InterviewPrep , InterviewQuestion

class InterviewPrepSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewPrep
        fields = ['id', 'user', 'resume_file', 'extracted_text', 'created_at', 'updated_at']
        