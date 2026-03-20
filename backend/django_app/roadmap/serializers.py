from rest_framework import serializers
from roadmap.models import CareerRole,RoadMap

class CareerRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareerRole
        fields = ['role_name','experience_level','current_skills']

class RoadMapSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoadMap
        fields = '__all__'



        