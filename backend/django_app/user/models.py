from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class UserProfile(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100)
    
    current_role = models.CharField(max_length=100, blank=True, null=True)
    company = models.CharField(max_length=100, blank=True, null=True)
    
    # Preferences
    email_notifications = models.BooleanField(default=True)
    weekly_report = models.BooleanField(default=True)
    dark_mode = models.BooleanField(default=True)
    ai_suggestions = models.BooleanField(default=True)
    
    scheduled_deletion_on = models.DateTimeField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    