from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import AptitudeTest, AptitudeQuestions
from .serializers import StartTestSerializer, QuestionSerializer, SubmitAnswerSerializer, TestResultSerializer
import requests
from django.http import JsonResponse
import json

class StartTestView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = StartTestSerializer(data=request.data)
        
        if serializer.is_valid():
            test_mode = serializer.validated_data.get('test_mode')
            category = serializer.validated_data.get('category')
            subtopic = serializer.validated_data.get('subtopic')
            difficulty_level = serializer.validated_data.get('difficulty_level')
            no_of_questions = serializer.validated_data.get('no_of_questions') 
            user_profile = request.user

            aptitude_test = AptitudeTest.objects.create(user_id=user_profile, test_mode=test_mode, category=category, subtopic=subtopic, difficulty_level=difficulty_level, no_of_questions=no_of_questions)
            aptitude_test.save()
            
            if aptitude_test.category == "All Categories" or aptitude_test.test_mode == "Full Developer Mock":
                all_category = "Quantitative Aptitude, Logical Reasoning, Verbal Ability, Data Interpretation, Technical Aptitude"
                response = requests.post("http://127.0.0.1:8001/generate_aptitude_test", json={
                "test_mode": test_mode, "category": all_category, "subtopic": "None", "difficulty_level": difficulty_level , "no_of_questions": no_of_questions})
            else:
                response = requests.post("http://127.0.0.1:8001/generate_aptitude_test", json={
                "test_mode": test_mode, "category": category, "subtopic": subtopic, "difficulty_level": difficulty_level, "no_of_questions": no_of_questions})
            
            if response.status_code != 200:
                aptitude_test.delete()
                return JsonResponse({"error": "Failed to generate aptitude test from AI.", "details": response.text}, status=response.status_code)
                
            try:
                response_data = response.json()
            except ValueError:
                aptitude_test.delete()
                return JsonResponse({"error": "Invalid JSON received from AI service.", "details": response.text}, status=500)

            created_questions = []
            for q in response_data.get("questions", []):
                options = q.get("options", [])
                ans_idx = q.get("answer_index", 0)
                
                correct_ans_text = ""
                if options and ans_idx < len(options):
                    correct_ans_text = str(options[ans_idx])

                question_obj = AptitudeQuestions.objects.create(
                    test=aptitude_test, 
                    category=category, 
                    subtopic=subtopic, 
                    question_text=q.get("text", ""), 
                    options=options,
                    correct_answer=correct_ans_text, 
                    difficulty_level=difficulty_level
                )
                
                created_questions.append({
                    "id": question_obj.id,
                    "text": question_obj.question_text,
                    "options": question_obj.options,
                    "answer_index": ans_idx
                })

            return JsonResponse({
                "id": aptitude_test.id,
                "test_mode": test_mode,
                "category": category,
                "subtopic": subtopic,
                "difficulty_level": difficulty_level,
                "question": created_questions
            }, safe=False)
        return Response(serializer.errors, status=400)
        
class SubmitAnswerView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = SubmitAnswerSerializer(data=request.data)
        if serializer.is_valid():
            question_id = serializer.validated_data.get('id')
            user_answer = serializer.validated_data.get('user_answer')
            try:
                question = AptitudeQuestions.objects.get(id=question_id)
            except AptitudeQuestions.DoesNotExist:
                return JsonResponse({"error": "Question not found."}, status=404)
            
            question.user_answer = user_answer
            question.is_correct = (str(user_answer).strip().lower() == str(question.correct_answer).strip().lower())
            question.save()
            
            test = question.test
            correct_count = AptitudeQuestions.objects.filter(test=test, is_correct=True).count()
            test.no_of_correct_answers = correct_count
            if test.no_of_questions > 0:
                test.score = (correct_count / test.no_of_questions) * 100
            test.save()
            
            return JsonResponse({
                "id": question.id,
                "user_answer": user_answer,
                "is_correct": question.is_correct
            }, safe=False)
        return Response(serializer.errors, status=400)
        
class Test_History_View(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        tests = AptitudeTest.objects.filter(user_id=request.user).order_by('-created_at')
        serializer = TestResultSerializer(tests, many=True)
        return Response(serializer.data)

class display_data(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        serializer = QuestionSerializer(data=request.data)
        if serializer.is_valid():
            test_id = serializer.validated_data.get('test_id')
            llm_data = AptitudeQuestions.objects.filter(test_id=test_id).order_by('id').values()
            return Response({"llm_data": llm_data})