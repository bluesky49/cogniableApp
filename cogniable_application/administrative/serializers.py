from rest_framework import serializers
from target_allocate.models import Challanges, target_allocate
from django.contrib.auth.models import User, Group
from school.models import *
import pytz
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.utils.translation import ugettext_lazy as _

from rest_framework import serializers


class EmailSerializer(serializers.Serializer):
    email = serializers.CharField()

class PasswordTokenSerializer(serializers.Serializer):
    password = serializers.CharField(label=_("Password"), style={'input_type': 'password'})
    token = serializers.CharField()


class ResponseSerializer(serializers.Serializer):
    status = serializers.CharField() 
    detail = serializers.CharField() 
    data = serializers.CharField()
    

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField() 
    password = serializers.CharField() 
    # country = serializers.CharField()
    timezone = serializers.ChoiceField(choices=pytz.all_timezones)

class SchoolSerializer(serializers.Serializer):
    school_name = serializers.CharField()
    email = serializers.EmailField()    
    country = serializers.PrimaryKeyRelatedField(queryset=Country.objects.all(), many=False)  
    no_learner = serializers.IntegerField()
    password = serializers.CharField()

class ClinicDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = school_details
        fields =  ('__all__')

class ClinicsSerializer(serializers.ModelSerializer):
    user_date =  serializers.DateTimeField(source='user.date_joined', format = '%d %B, %Y')  
    class Meta:
        model = school
        fields =  ('id', 'school_name', 'user_date')

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('id','name',)

class UserSerializer(serializers.ModelSerializer):
    clinic_details = ClinicDetailsSerializer(source="school_details")
    groups = GroupSerializer(many=True)

    class Meta:        
        model = User
        fields =  ('id', 'username', 'email', 'is_active', 'clinic_details', 'groups')
 

    

    