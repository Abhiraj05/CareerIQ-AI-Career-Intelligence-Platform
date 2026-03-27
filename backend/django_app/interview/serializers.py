from rest_framework import serializers
from interview.models import InterviewPrep, InterviewQuestion

# Interview Serializer
class InterviewPrepSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewPrep
        fields = ['target_role', 'company', 'experience_level', 'tech_stack']
