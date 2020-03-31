import graphene
from django.core.exceptions import ObjectDoesNotExist
from .models import *
from .graphql_types import *
from target_allocate.schema import DiagnosesType
from django.db import transaction
from django.db import transaction
from django.db.models import Q
from graphql_relay import from_global_id
from graphene import relay
from rest_framework_simplejwt.tokens import RefreshToken

class StudentInput(graphene.InputObjectType):
    client_id = graphene.String()    
    email = graphene.String()
    gender = graphene.String()
    date_of_diagnosis = graphene.types.datetime.Date()
    dob = graphene.types.datetime.Date()
    clinic_location = graphene.ID()
    parent_name = graphene.String()
    parent_mobile = graphene.String()
    ssn_aadhar = graphene.String()
    category =  graphene.ID()
    firstname = graphene.String()
    lastname = graphene.String()
    diagnoses = graphene.List(graphene.ID)
    auth_staff = graphene.List(graphene.ID)



class CreateStudentMutation(relay.ClientIDMutation):
    student = graphene.Field(StudentType, required=False)
    message = graphene.String()
    
    class Input:
        student_data = StudentInput(required=True)

    @classmethod 
    def mutate_and_get_payload(cls, root, info, student_data=None):
        login_user = info.context.user
        sch_obj = login_user.school_details.school
        present_std = students.objects.filter(school = sch_obj).count()
        no_learner = int(sch_obj.no_learner)

        if present_std > no_learner:
            raise Exception('Your limit for number of student is used, Please Upgrade your Account')
 

        password = User.objects.make_random_password()
        user =  User.objects.create_user(student_data.email, student_data.email, password)
        user.save()

        my_group = Group.objects.get(name='parents')
        my_group.user_set.add(user)
        q_2 = school_details.objects.create(user=user, school=login_user.school_details.school, is_parent=True) 


        q_1 = students(client_id=student_data.client_id,parent=user, school= login_user.school_details.school, email=student_data.email, gender=student_data.gender,category=category.objects.get(id=from_global_id(student_data.category)[1]), ssn_aadhar=student_data.ssn_aadhar, parent_mobile=student_data.parent_mobile, parent_name=student_data.parent_name, dob=student_data.dob, date_of_diagnosis=student_data.date_of_diagnosis,  clinic_location=school_location.objects.get(id=from_global_id(student_data.clinic_location)[1]), firstname=student_data.firstname, lastname=student_data.lastname)


        q_1.save()
        #useraccountdetails('Cogniable Account Details', [email], str(firstname), user.username, password)
        for dia_id in student_data.diagnoses:
            # raise Exception(from_global_id(dia_id)[1])
            dia_obj = diagnoses.objects.get(id=from_global_id(dia_id)[1])
            # q_1.diagnoses.add(dia_obj)

        for tech_id in student_data.auth_staff:
            staff_obj = Staff.objects.get(id=from_global_id(tech_id)[1])
            # q_1.auth_staff.add(staff_obj)
 
        return CreateStudentMutation(student=q_1)

class StaffInput(graphene.InputObjectType):
    emp_id = graphene.String()    
    designation = graphene.String()
    role = graphene.ID()
    email = graphene.String()
    firstname = graphene.String()
    surname = graphene.String()
    gender = graphene.String()
    mobile = graphene.String()
    address  = graphene.String()
    dob =  graphene.types.datetime.Date()
    auth_learner =  graphene.List(graphene.ID)
    ssn_aadhar = graphene.String()
    qualification = graphene.String()
    salutation = graphene.String()
    emergency_name = graphene.String()
    emergency_contact = graphene.String()
    shift_start = graphene.String()
    shift_end = graphene.String()
    tax_id = graphene.String()
    npi = graphene.String()
    duration = graphene.String()
    date_of_joining = graphene.types.datetime.Date()
    clinic_location = graphene.ID()


class CreateStaffMutation(relay.ClientIDMutation):
    staff = graphene.Field(StaffType, required=False)
    message = graphene.String()
    
    class Input:
        staff_data = StaffInput(required=True)

    @classmethod 
    def mutate_and_get_payload(cls, root, info, staff_data=None):
        login_user = info.context.user
        sch_obj = login_user.school_details.school

        password = User.objects.make_random_password()
        user =  User.objects.create_user(staff_data.email, staff_data.email, password)
        user.save()

        q_2 = school_details(user=user, school=sch_obj, is_therapist=True)
        q_2.save()
        my_group = Group.objects.get(name='therapist')
        my_group.user_set.add(user)

        q_1 = Staff(employee_id=staff_data.emp_id, user_role=user_role.objects.get(id=from_global_id(staff_data.role)[1]), date_of_joining=staff_data.date_of_joining,emergency_name=staff_data.emergency_name, 
            designation=staff_data.designation, name=staff_data.firstname, surname=staff_data.surname, email=staff_data.email, gender=staff_data.gender, contact_no=staff_data.mobile,
             local_address=staff_data.address, ssn_aadhar=staff_data.ssn_aadhar, dob=staff_data.dob, emergency_contact=staff_data.emergency_contact, qualification=staff_data.qualification, 
             school=sch_obj, npi=staff_data.npi,duration=staff_data.duration, tax_id=staff_data.tax_id, shift_end=staff_data.shift_end, shift_start=staff_data.shift_start, salutation=staff_data.salutation, user= user, is_active=True)

        q_1.save()

        for student in staff_data.auth_learner:
            std_obj = students.objects.get(id=from_global_id(student)[1])
            student.auth_staff.add(std_obj)

 
        return CreateStaffMutation(staff=q_1)


class AuthMutation(relay.ClientIDMutation):
    user = graphene.Field(UserType)

    class Input:
        email = graphene.String()    
        password = graphene.String()
        country = graphene.String()
        timezone = graphene.String()

    @classmethod 
    def mutate_and_get_payload(cls, root, info, email, password, country, timezone):
        snippets = authenticate(request, username=username, password=password)
        refresh = RefreshToken.for_user(snippets)

        return AuthMutation(user=snippets)




 
        
