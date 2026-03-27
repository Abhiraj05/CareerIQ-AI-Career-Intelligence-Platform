from rest_framework import serializers
from .models import AptitudeTest, AptitudeQuestions

# Aptitude Start Serializer
class StartTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = AptitudeTest
        fields = [
            "test_mode",
            "category",
            "subtopic",
            "difficulty_level",
            "no_of_questions",
        ]
# Aptitude Questions Serializer
class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AptitudeQuestions
        fields = [
            "id",
            "question_text",
            "options",
            "difficulty_level",
            "user_answer",
        ]
        many = True

# Submit Answer Serializer
class SubmitAnswerSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    user_answer = serializers.CharField(allow_blank=True, allow_null=True)

# Aptitude Result Serializer
class TestResultSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = AptitudeTest
        fields = [
            "id",
            "test_mode",
            "category",
            "difficulty_level",
            "no_of_correct_answers",
            "score",
            "created_at",
            "questions",
            "user_id",
        ]