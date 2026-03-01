from django.db import models
from user.models import userprofile
# Create your models here.

class roles(models.TextChoices):
    FRONTEND = 'Frontend Developer'
    BACKEND = 'Backend Developer'
    FULLSTACK = 'Full Stack Developer'
    MOBILEDEVELOPER = 'Mobile Developer'
    DATASCIENTIST = 'Data Scientist'
    DEVOPS = 'DevOps Engineer'

class ExperienceLevel(models.TextChoices):
    BEGINNER = 'Beginner'
    INTERMEDIATE = 'Intermediate'
    ADVANCED = 'Advanced'


class CareerRole(models.Model):
    user_id = models.ForeignKey(userprofile, on_delete=models.CASCADE)
    role_name = models.CharField(max_length=100, choices=roles.choices)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Roadmap(models.Model):
    user_id = models.ForeignKey(userprofile, on_delete=models.CASCADE)
    role = models.ForeignKey(CareerRole, on_delete=models.CASCADE)
    experience_level = models.CharField(max_length=50)
    current_skills = models.JSONField()

class RoadMapLevels(models.Model):
    user_id = models.ForeignKey(userprofile, on_delete=models.CASCADE)
    roadmap = models.ForeignKey(Roadmap, on_delete=models.CASCADE)
    level_no = models.IntegerField()
    level_name = models.CharField(max_length=100)

class RoadMapSkills(models.Model):
    user_id = models.ForeignKey(userprofile, on_delete=models.CASCADE)
    roadmap_level = models.ForeignKey(RoadMapLevels, on_delete=models.CASCADE)
    skill_name = models.CharField(max_length=100)
    skill_description = models.TextField()
    esimated_time = models.CharField(max_length=50)