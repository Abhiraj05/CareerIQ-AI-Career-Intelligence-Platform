from django.db import models
from user.models import UserProfile

# Test Mode Choices
class Select_Test_Mode(models.TextChoices):
    Practice_Mode = 'Practice Mode'
    Exam_Mode = 'Exam Mode'
    Full_Mock_Test = 'Full Developer Mock'

# Category Choices
class Select_Category(models.TextChoices):
    Quantitative_Aptitude = 'Quantitative Aptitude'
    Logical_Reasoning = 'Logical Reasoning'
    Verbal_Ability = 'Verbal Ability'
    Data_Interpretation = 'Data Interpretation'
    Technical_Aptitude = 'Technical Aptitude'
    All_Categories = 'All Categories'

# Subtopic Choices 
class Select_Subtopic(models.TextChoices):
    Arithmetic = 'Arithmetic'
    Time_Work = 'Time & Work'
    Profit_Loss = 'Profit & Loss'
    Percentages = 'Percentages'
    Ratio_Proportion = 'Ratio & Proportion'
    Speed_Time_Distance = 'Speed, Time & Distance'
    Permutation_Combination = 'Permutation & Combination'
    Probability = 'Probability'
    Patterns = 'Patterns'
    Syllogisms = 'Syllogisms'
    Sequences = 'Sequences'
    Synonyms = 'Synonyms'
    Antonyms = 'Antonyms'
    Comprehension = 'Comprehension'
    Bar_Graphs = 'Bar Graphs'
    Pie_Charts = 'Pie Charts'
    Tables = 'Tables'
    Data_Structures = 'Data Structures'
    Algorithms = 'Algorithms'
    DBMS = 'DBMS'
    None_Sub = 'None'

# Difficulty Level Choices
class Difficulty_Level(models.TextChoices):
    Easy = 'Easy'
    Medium = 'Medium'
    Hard = 'Hard'

# Aptitude Questions Model
class AptitudeQuestions(models.Model):
    test = models.ForeignKey('AptitudeTest', on_delete=models.CASCADE, related_name='questions')
    category = models.CharField(max_length=50 , choices=Select_Category.choices)
    subtopic = models.CharField(max_length=50 , choices=Select_Subtopic.choices, default='None')
    question_text = models.TextField()
    options = models.JSONField(null=True, blank=True)
    user_answer = models.TextField(blank=True, null=True)
    is_correct = models.BooleanField(default=False)
    correct_answer = models.TextField(null=True, blank=True)
    difficulty_level = models.CharField(max_length=20 , choices=Difficulty_Level.choices)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

# Aptitude Tests Model
class AptitudeTest(models.Model):
    user_id = models.ForeignKey(UserProfile , on_delete=models.CASCADE)
    test_mode = models.CharField(max_length=50 , choices=Select_Test_Mode.choices)
    category = models.CharField(max_length=50 , choices=Select_Category.choices)
    subtopic = models.CharField(max_length=50 , choices=Select_Subtopic.choices, default='None')
    difficulty_level = models.CharField(max_length=20 , choices=Difficulty_Level.choices)
    no_of_questions = models.IntegerField(default=0)    
    no_of_attempts = models.IntegerField(default=0,)
    no_of_correct_answers = models.IntegerField(default=0)
    score = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)



    
