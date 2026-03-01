from rest_framework import serializers
from .models import *

class RoadmapSerializer(serializers.ModelSerializer):
    class Meta:
        model = Roadmap
        fields = '__all__'

class RoadMapLevelsSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoadMapLevels
        fields = '__all__'

class RoadMapSkillsSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoadMapSkills
        fields = '__all__'

        