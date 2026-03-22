from rest_framework import serializers
from .models import AptitudeTest, AptitudeQuestions

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

class SubmitAnswerSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    user_answer = serializers.CharField(allow_blank=True, allow_null=True)

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