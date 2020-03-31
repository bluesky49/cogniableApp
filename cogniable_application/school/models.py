from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_delete
from django.dispatch import receiver
import os
from django.http import JsonResponse
from target_allocate.models import diagnoses, domain
from django.conf import settings
from django.db import models
from django.contrib.auth.models import Group
from django.urls import reverse
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.db.models.signals import post_save, pre_save
# from notifications.signals import notify
from target_allocate.models import MasteryCriteria
from django_fsm import FSMField, transition, FSMKeyField

STATES = ('Open', 'In Progress', 'Resolved', 'Re Opened', 'Closed')
STATES = list(zip(STATES, STATES))
DOC_STATUS = (
    ('Pending', 'PENDING'),
    ('Complete', 'COMPLETE')
)
BACK_STATUS = (
    ('Pending', 'PENDING'),
    ('Done', 'DONE')
)

class school_location(models.Model):
    location = models.CharField(max_length=150)
    time = models.DateField()
    state = models.CharField(max_length=200)
    
    # @transition(field=state, source=['Open', 'Re Opened'], target='In Progress')
    def start(self):
        print("fdgdfg")
        

    def __str__(self):
        return self.location
 
class Currency(models.Model):
    currency = models.CharField(max_length=200,null=True,blank=True)
    symbol = models.CharField(max_length=200,null=True,blank=True) 
    def __str__(self):
        return self.currency

class Country(models.Model):
    name = models.CharField(max_length=200,null=True,blank=True)
    is_active = models.BooleanField(default=True)
    db_name = models.CharField(max_length=200, null=True, blank=True)

    def __str__(self):
        return self.name

def UserDb(country_id):
    try: 
        if Country.objects.using('india').get(id=country_id).db_name is None:
            return 'india'
        else:
            return str(Country.objects.using('india').get(id=country_id).db_name) 
    except:
        return None



class school(models.Model):
    school_id = models.CharField(max_length = 15)
    school_name = models.CharField(max_length = 200)
    contact_no = models.CharField(max_length=20)
    contact_no_2 = models.CharField(max_length=20)
    email = models.CharField(max_length=100)
    address = models.CharField(max_length=300)
    no_learner = models.IntegerField()
    country =  models.ForeignKey(Country, on_delete=models.CASCADE)
    note = models.CharField(max_length = 300, blank=True, null=True)
    account_title = models.CharField(max_length=150, blank=True, null=True)
    bank_account_no = models.CharField(max_length=100,blank=True, null=True)
    bank_name = models.CharField(max_length=200, blank=True, null=True)
    ifsc_code = models.CharField(max_length=80, blank=True, null=True)
    bank_brach = models.CharField(max_length=120, blank=True, null=True)
    facebook_url = models.CharField(max_length=200, blank=True, null=True)
    twitter_url = models.CharField(max_length=200, blank=True, null=True)
    linkdin_url = models.CharField(max_length=200, blank=True, null=True)
    instagram_url = models.CharField(max_length=200, blank=True, null=True)
    logo = models.FileField(upload_to='school_docs/', blank=True, null=True)
    document = models.FileField(upload_to='school_docs/', blank=True, null=True)
    other_document = models.FileField(upload_to='school_docs/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    domain = models.ManyToManyField(domain )
    school_key = models.CharField(max_length=20)
    school_location = models.ManyToManyField(school_location,  blank=True, null=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    currency = models.ForeignKey(Currency, on_delete=models.CASCADE)

    def __str__(self):
        return self.school_name

  
class school_details(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    school = models.ForeignKey(school, on_delete=models.CASCADE)
    is_admin = models.BooleanField(default=False)
    is_therapist = models.BooleanField(default=False)
    is_parent = models.BooleanField(default=False)

    def __str__(self):
        return self.user.email

   
	

class user_role(models.Model):
    name = models.CharField(max_length=100)
    user_group = models.ForeignKey(Group, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

 

class Staff(models.Model):
    employee_id = models.CharField(max_length=20, null=True,blank=True)
    designation = models.CharField(max_length=100)
    staff_id = models.IntegerField()
    user_role = models.ForeignKey(user_role,null=True,blank=True, on_delete=models.CASCADE)     
    name = models.CharField(max_length=200)
    surname = models.CharField(max_length=200,null=True,blank=True) 
    father_name = models.CharField(max_length=200,null=True,blank=True)
    mother_name = models.CharField(max_length=200,null=True,blank=True)
    contact_no = models.CharField(max_length=200)     
    email = models.CharField(max_length=200)
    gender = models.CharField(max_length=100, blank=True, null=True)
    dob = models.DateField()    
    date_of_joining = models.DateField()
    local_address = models.CharField(max_length=300)    
    qualification = models.CharField(max_length=300,null=True,blank=True)     
    emergency_name = models.CharField(max_length=300,null=True,blank=True)     
    emergency_contact = models.CharField(max_length=300,null=True,blank=True)     
    emergency_relation = models.CharField(max_length=300,null=True,blank=True)     
    marital_status = models.CharField(max_length=300,null=True,blank=True)     
    work_exp = models.CharField(max_length=300,null=True,blank=True)     
    image = models.FileField(upload_to='staff_docs/image/', null=True,blank=True)
    resume = models.FileField(upload_to='staff_docs/resume/', null=True,blank=True)
    joining_letter = models.FileField(upload_to='staff_docs/joining_letter/', null=True,blank=True)
    is_active = models.BooleanField(default=True)
    school = models.ForeignKey(school, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE) 

    #Extended
    emp_type = models.CharField(max_length=300,null=True,blank=True)
    salutation = models.CharField(max_length=300,null=True,blank=True) 
    clinic_location = models.ForeignKey(school_location, on_delete=models.CASCADE, null=True, blank=True)
    shift_start = models.CharField(max_length=300,null=True,blank=True)
    shift_end = models.CharField(max_length=300,null=True,blank=True)
    ssn_aadhar = models.CharField(max_length=300,null=True,blank=True)
    tax_id = models.CharField(max_length=300,null=True,blank=True)
    npi = models.CharField(max_length=300,null=True,blank=True)
    duration = models.CharField(max_length=300,null=True,blank=True)
    # HR Details
    hr_offer_date = models.DateField(null=True,blank=True)
    hr_joining_date = models.DateField(null=True,blank=True)
    hr_relieving_date = models.DateField(null=True,blank=True)
    hr_total_experience = models.CharField(max_length=200, blank=True, null=True)
    hr_docs_status = models.CharField(choices=DOC_STATUS, default='Pending', max_length=200)
    hr_background_status = models.CharField(choices=BACK_STATUS, default='Pending', max_length=200)
    hr_training_from = models.DateField(null=True,blank=True)
    hr_training_to = models.DateField(null=True,blank=True)
    hr_service_start_date = models.DateField(null=True,blank=True)
    hr_leaves_last_year = models.CharField(max_length=200, blank=True, null=True)
    hr_leaves_this_year = models.CharField(max_length=200, blank=True, null=True)
    hr_leaves_taken = models.CharField(max_length=200, blank=True, null=True)
    hr_leaves_remaining = models.CharField(max_length=200, blank=True, null=True)
    hr_last_appraisal_date = models.DateField(null=True,blank=True)
    hr_next_appraisal_date = models.DateField(null=True,blank=True)
    hr_remarks = models.CharField(max_length=200, blank=True, null=True)
    hr_gross_salary = models.CharField(max_length=200, blank=True, null=True)
    # Certification
    cf_name = models.CharField(max_length=100, null=True, blank=True)
    cf_area = models.CharField(max_length=100, null=True, blank=True)
    cf_status = models.CharField(max_length=100, null=True, blank=True)
    cf_app_submit_date = models.DateField(null=True, blank=True)
    cf_app_approve_date = models.DateField(null=True, blank=True)
    cf_validity_start = models.DateField(null=True, blank=True)
    cf_validity_end = models.DateField(null=True, blank=True)
    cf_remarks = models.CharField(max_length=100, null=True, blank=True)
    #Credentailing
    cd_agency = models.CharField(max_length=100, null=True, blank=True)
    cd_status = models.CharField(max_length=100, null=True, blank=True)
    cd_app_submit_date = models.DateField(null=True, blank=True)
    cd_app_approve_date = models.DateField(null=True, blank=True)
    cd_refrence = models.CharField(max_length=100, null=True, blank=True)
    cd_validity_start = models.DateField(null=True, blank=True)
    cd_validity_end = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.name

    @property
    def full_name(self):
        return '%s %s' % (self.name, self.surname)
 


class category(models.Model):
    category = models.CharField(max_length=150)
    created_at = models.CharField(max_length=150)

    def __str__(self):
        return self.category

   

def get_cog_id():
    last_booking = students.objects.all().order_by('id').last()
    if not last_booking:
        return 'COG4000' 

    last_cog_id = last_booking.internal_no
    new_cog_id = int(last_cog_id[3:]) + 1
 
    return 'COG'+str(new_cog_id)
	
class Allergies(models.Model):
    allergy_type = models.CharField(max_length=100, null=True, blank=True)
    allergy_observed = models.CharField(max_length=100, null=True, blank=True)
    allergy_reactions = models.CharField(max_length=100, null=True, blank=True)
    allergy_since_date = models.DateField(null=True, blank=True)
    note = models.CharField(max_length=200, null=True, blank=True)
    def __str__(self):
        return self.allergy_type
    
class BloodPressure(models.Model):
    date = models.DateField(null=True, blank=True)
    systolic = models.CharField(max_length=100, null=True, blank=True)
    diastolic = models.CharField(max_length=100, null=True, blank=True)
    pulse = models.CharField(max_length=100, null=True, blank=True)
    note = models.CharField(max_length=200, null=True, blank=True)
    def __str__(self):
        return self.systolic
    
class Cholesterol(models.Model):
    date = models.DateField(null=True, blank=True)
    ldl = models.CharField(max_length=100, null=True, blank=True)
    hdl = models.CharField(max_length=100, null=True, blank=True)
    triglycerides = models.CharField(max_length=100, null=True, blank=True)
    total = models.CharField(max_length=100, null=True, blank=True)
    note = models.CharField(max_length=200, null=True, blank=True)
    def __str__(self):
        return self.total
    
class Exercises(models.Model):
    date = models.DateField(null=True, blank=True)
    name = models.CharField(max_length=100, null=True, blank=True)
    details = models.CharField(max_length=200, null=True, blank=True)
    duration = models.CharField(max_length=100, null=True, blank=True)
    distance = models.CharField(max_length=100, null=True, blank=True)
    steps = models.IntegerField(null=True, blank=True)
    calories = models.IntegerField(null=True, blank=True)
    def __str__(self):
        return self.name
    
class Immunization(models.Model):
    date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=100,null=True, blank=True)
    vaccine = models.CharField(max_length=100, null=True, blank=True)
    body_part = models.CharField(max_length=100, null=True, blank=True)
    dosage = models.CharField(max_length=100, null=True, blank=True)
    adverse_effect = models.CharField(max_length=100, null=True, blank=True)
    note = models.CharField(max_length=200, null=True, blank=True)
    def __str__(self):
        return self.body_part

class Medication(models.Model):
    date = models.DateField(null=True, blank=True)
    last_observed_date = models.DateField(null=True, blank=True)
    condition = models.CharField(max_length=100,null=True, blank=True)
    medicine_details = models.CharField(max_length=100, null=True, blank=True)
    strength = models.CharField(max_length=100, null=True, blank=True)
    dosage = models.CharField(max_length=100, null=True, blank=True)
    how_taken = models.CharField(max_length=100, null=True, blank=True)
    how_often_taken = models.CharField(max_length=100, null=True, blank=True)
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    note = models.CharField(max_length=200, null=True, blank=True)

    def __str__(self):
        return self.condition

class Menstruation(models.Model):
    date = models.DateField(null=True, blank=True)
    is_first_day = models.BooleanField(default=False)
    flow_amount = models.IntegerField(null=True, blank=True)
    note = models.CharField(max_length=200, null=True, blank=True)

    def __str__(self):
        return self.flow_amount

class FoodDrink(models.Model):
    date = models.DateField(null=True, blank=True)
    meal_name = models.CharField(max_length=200, null=True, blank=True)
    meal_time = models.DateTimeField(null=True, blank=True)
    meal_type = models.CharField(max_length=100, null=True, blank=True)
    serving_size = models.CharField(max_length=100, null=True, blank=True)
    calories = models.IntegerField(null=True, blank=True)
    note = models.CharField(max_length=200, null=True, blank=True)

    def __str__(self):
        return self.meal_name

from target_allocate.models import diagnoses

class students(models.Model):
    admission_no = models.CharField(max_length=100)
    internal_no = models.CharField(max_length=100, default = get_cog_id, editable=False)
    auth_staff = models.ManyToManyField(Staff)
    school = models.ForeignKey(school, on_delete=models.CASCADE)
    diagnoses =  models.ManyToManyField(diagnoses)
    parent = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    admission_date = models.DateField(blank=True, null=True)
    firstname = models.CharField(max_length=100, blank=True, null=True)
    lastname = models.CharField(max_length=100, blank=True, null=True)
    image = models.FileField(upload_to='student_photo/', default='images/user.jpeg', blank=True, null=True)
    report = models.FileField(upload_to='student_report/', blank=True, null=True)
    mobileno = models.CharField(max_length=100, blank=True, null=True)
    email = models.CharField(max_length=100, blank=True, null=True)
    dob = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=100, blank=True, null=True)
    current_address = models.TextField(blank=True, null=True)
    category = models.ForeignKey(category, on_delete=models.CASCADE)  
    created_at = models.DateTimeField(auto_now=True)
    is_testuser = models.BooleanField(default=False)
    student_id = models.IntegerField(blank=True, null=True)
    parent_name = models.CharField(max_length=100, blank=True, null=True)   
    parent_mobile = models.CharField(max_length=100, blank=True, null=True)   
    relation = models.CharField(max_length=100, blank=True, null=True) 
    father_name = models.CharField(max_length=100, blank=True, null=True)
    father_phone = models.CharField(max_length=100, blank=True, null=True)    
    mother_name = models.CharField(max_length=100, blank=True, null=True)
    mother_phone = models.CharField(max_length=100, blank=True, null=True)
    reference = models.CharField(max_length=200, blank=True, null=True)    
    is_active = models.BooleanField(default=True)

    # Extended Fields
    # Insurance
    client_id = models.CharField(max_length=100, blank=True, null=True)
    date_of_diagnosis = models.DateField(null=True, blank=True)
    clinic_location = models.ForeignKey(school_location, on_delete=models.CASCADE, null=True, blank=True)
    ssn_aadhar = models.CharField(max_length=100, blank=True, null=True)
    insurance_name = models.CharField(max_length=200, blank=True, null=True)
    insurance_provider = models.CharField(max_length=100, blank=True, null=True)
    insurance_provider2 = models.CharField(max_length=100, blank=True, null=True)
    payor_responsibility = models.CharField(max_length=100, blank=True, null=True)
    amount = models.IntegerField(blank=True, null=True)
    amount_frequency = models.CharField(max_length=100, blank=True, null=True)
    effective_from = models.DateField(blank=True, null=True)
    effective_to = models.DateField(blank=True, null=True)
    amount_covered = models.IntegerField(blank=True, null=True)
    ins_contact_name = models.CharField(max_length=100, blank=True, null=True)
    ins_contact_phone = models.CharField(max_length=100, blank=True, null=True)
    #Insurance Holder
    ins_firstname = models.CharField(max_length=100, blank=True, null=True)
    ins_lastname = models.CharField(max_length=100, blank=True, null=True)
    ins_dob = models.DateField(blank=True, null=True)
    ins_gender = models.CharField(max_length=100, blank=True, null=True)
    ins_ssn_aadhar = models.CharField(max_length=100, blank=True, null=True)
    ins_policy_no = models.CharField(max_length=100, blank=True, null=True)
    ins_group_name = models.CharField(max_length=100, blank=True, null=True)
    ins_insured_id = models.CharField(max_length=100, blank=True, null=True)
    ins_address = models.CharField(max_length=100, blank=True, null=True)
    ins_city = models.CharField(max_length=100, blank=True, null=True)
    ins_state = models.CharField(max_length=100, blank=True, null=True)
    ins_zip_code = models.IntegerField(blank=True, null=True)

    # Health 
    height = models.CharField(max_length=200, blank=True)
    weight = models.CharField(max_length=100, blank=True)
    allergies = models.ManyToManyField(Allergies, blank=True)
    bp = models.ManyToManyField(BloodPressure, blank=True)
    cholesterol = models.ManyToManyField(Cholesterol, blank=True)
    exercises = models.ManyToManyField(Exercises, blank=True)
    Immunization = models.ManyToManyField(Immunization, blank=True)
    medication = models.ManyToManyField(Medication, blank=True)
    menstruation = models.ManyToManyField(Menstruation, blank=True)
    food_drink = models.ManyToManyField(FoodDrink, blank=True)
   
    @property
    def name(self):
        return '%s %s' % (self.firstname, self.lastname)

    @property
    def fname(self):
        return '%s' % (self.father_name)

    def __str__(self):
        return self.firstname

    # def get_queryset(self, request):  
    #         qs = super(StudentAdmin, self).get_queryset(request)
    #         if request.user.is_superuser:
    #             return qs
    #         return qs.filter(dept=request.user.department)

   

class disable_student(models.Model):
    student_id = models.ForeignKey(students, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=20)

    def __str__(self):
        return self.status

   


class school_services(models.Model):
    service_name = models.CharField(max_length=200)
    status = models.BooleanField(default=True)

    def __str__(self):
        return self.service_name
 

class ActivateSchool(models.Model):
    school = models.ForeignKey(school,on_delete=models.CASCADE,null=True)
    is_verified = models.BooleanField(default=False)
    verified_on = models.DateField(null=True)

   

class school_mail(models.Model):
    school = models.OneToOneField(school, on_delete=models.CASCADE)
    parent_mail =  models.BooleanField()
    staff_mail =  models.BooleanField()

    def __str__(self):
        return "fgh"



@receiver(post_save, sender=school)
def activate_school_mail(sender, instance, **kwargs):
    try:
        q_1 = school_mail(school = instance, parent_mail=False, staff_mail=True)
        q_1.save()

        q_2 = video_permissions(school = instance, is_parent=True, is_therapist=True)
        q_2.save()

        q_3 = MasteryCriteria(response_percentage=80, school=instance, consecutive_days=2, min_trial=0, is_default=True)
        q_3.save()
        
    except:
        pass