from django.contrib.auth.models import User
from rest_framework import serializers
from .models import *
from school.models import *
from target_allocate.models import *
from target_recording.models import *
# from assessment.models import *
import datetime


class domainModelSerializer(serializers.ModelSerializer):
	"""docstring for domainModelSerializer"""
	class Meta:
		model = domain
		fields = ('id', 'domain')

class schoolModelSerializer(serializers.ModelSerializer):
	"""docstring for schoolModelSerializer"""
	last_login = serializers.StringRelatedField(source='user.last_login')
	class Meta:
		model = school
		fields = ('id', 'school_name', 'country', 'email', 'contact_no', 'school_id', 'is_active', 'last_login')


class activeInactiveSerializer(serializers.Serializer):
    Id = serializers.IntegerField() 
    action = serializers.BooleanField() 

class studentsModelSerializer(serializers.ModelSerializer):
	"""docstring for studentsModelSerializer"""
	last_login = serializers.StringRelatedField(source='parent.last_login')

	class Meta:
		model = students
		fields = ('id', 'name', 'email', 'dob', 'is_active', 'last_login')

	def to_representation(self, instance):
		ret = super().to_representation(instance)
		try:
			obj = skills.objects.filter(student_id__id=instance.id)[0]
			ret['last_record'] = obj.time_of_entry.date()
		except:
			ret['last_record'] = None
		
		return ret


class staffModelSerializer(serializers.ModelSerializer):
	"""docstring for staffModelSerializer"""
	last_login = serializers.StringRelatedField(source='user.last_login')
	class Meta:
		model = Staff
		fields = ('id', 'full_name', 'email', 'designation', 'is_active', 'last_login')