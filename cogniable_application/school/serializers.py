from school.models import *
from rest_framework import serializers
from django.contrib.auth.models import User

class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ('__all__')


class AllergiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Allergies
        fields = ('__all__')

class BloodPressureSerializer(serializers.ModelSerializer):
    class Meta:
        model = BloodPressure
        fields = ('__all__')

class CholesterolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cholesterol
        fields = ('__all__')

class ExercisesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercises
        fields = ('__all__')

class ImmunizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Immunization
        fields = ('__all__')

class MedicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medication
        fields = ('__all__')

class MenstruationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Menstruation
        fields = ('__all__')

class FoodDrinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodDrink
        fields = ('__all__')

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = category
        fields = ('__all__')

class SchoolLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = school_location
        fields = ('__all__')

from target_allocate.models import diagnoses

class DiagnosesSerializer(serializers.ModelSerializer):
    class Meta:
        model = diagnoses
        fields = ('id', 'name')

class LearnerGetSerializer(serializers.ModelSerializer):
    diagnoses = DiagnosesSerializer(many=True)
    category = serializers.StringRelatedField(source='category.category')

    class Meta:
        model = students
        fields = ('id', 'firstname', 'email', 'dob', 'category', 'diagnoses')

 

class LearnerSerializer(serializers.ModelSerializer):
    allergies = AllergiesSerializer(many=True, required=False)
    bp = BloodPressureSerializer(many=True, required=False)
    cholesterol = CholesterolSerializer(many=True, required=False)
    exercises = ExercisesSerializer(many=True, required=False)
    Immunization = ImmunizationSerializer(many=True, required=False)
    medication = MedicationSerializer(many=True, required=False)
    menstruation = MenstruationSerializer(many=True, required=False)
    food_drink = FoodDrinkSerializer(many=True, required=False)
      
    class Meta:
        model = students
        fields = '__all__'

    def validate(self, data):
        if User.objects.filter(email = data.get('email'), is_active=True):
            raise serializers.ValidationError({'email': 'Email Already Exist'})
        return data
 

    def create(self, validated_data):
        auth_staff = validated_data.pop("auth_staff", [])
        diag = validated_data.pop("diagnoses", [])

        al_list = validated_data.pop("allergies", [])
        bp_list = validated_data.pop("bp", [])
        ch_list = validated_data.pop("cholesterol", [])
        ex_list = validated_data.pop("exercises", [])
        imm_list = validated_data.pop("Immunization", [])
        med_list = validated_data.pop("medication", [])
        mes_list = validated_data.pop("menstruation", [])
        fd_list = validated_data.pop("food_drink", [])
  
        q_1 = students.objects.create(**validated_data)
          
        for i in auth_staff:
            q_1.auth_staff.add(i)
        
        for i in diag:
            q_1.diagnoses.add(i)

        for i in al_list:
            q2 = Allergies.objects.create(**i)
            q_1.allergies.add(q2)

        for i in bp_list:
            q2 = BloodPressure.objects.create(**i)
            q_1.bp.add(q2)

        for i in ch_list:
            q2 = Cholesterol.objects.create(**i)
            q_1.cholesterol.add(q2)

        for i in ex_list:
            q2 = Exercises.objects.create(**i)
            q_1.exercises.add(q2)

        for i in imm_list:
            q2 = Immunization.objects.create(**i)
            q_1.Immunization.add(q2)

        for i in med_list:
            q2 = Medication.objects.create(**i)
            q_1.medication.add(q2)

        for i in mes_list:
            q2 = Menstruation.objects.create(**i)
            q_1.menstruation.add(q2)

        for i in fd_list:
            q2 = FoodDrink.objects.create(**i)
            q_1.food_drink.add(q2)
        return  q_1
    
    def update(self, instance, validated_data ):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance  

class StaffDataSerializer(serializers.ModelSerializer):
    user_role = serializers.PrimaryKeyRelatedField(queryset=user_role.objects.all(), many=False, required=False)
    school = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    clinic_location = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    image = serializers.FileField(required=False)
    resume = serializers.FileField(required=False)
    joining_letter = serializers.FileField(required=False) 
    hr_docs_status = serializers.CharField(default='Pending') 
    hr_background_status = serializers.CharField(default='Pending')  
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    contact_no = serializers.CharField(required=False)
    class Meta:
        model = Staff
        fields = '__all__'



class createLearnerSerializer(serializers.Serializer):
    clientId = serializers.CharField(required=False)
    email = serializers.EmailField()
    firstName = serializers.CharField()
    middleName = serializers.CharField(required=False) 
    lastName = serializers.CharField(required=False)
    authStaff = serializers.PrimaryKeyRelatedField(queryset=Staff.objects.all(), many=True)
    address = serializers.CharField(required=False)
    dob = serializers.DateField()
    gender = serializers.CharField(required=False) 
    diagnosis = serializers.PrimaryKeyRelatedField(queryset=diagnoses.objects.all(), many=True)
    clinicLocation = serializers.PrimaryKeyRelatedField(queryset=school_location.objects.all(), many=False)
    parentFirstName = serializers.CharField()
    parentLastName = serializers.CharField(required=False) 
    ssnCard = serializers.CharField(required=False) 
    locationCategory = serializers.PrimaryKeyRelatedField(queryset=category.objects.all(), many=False)
















