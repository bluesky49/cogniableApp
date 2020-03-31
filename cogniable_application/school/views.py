from django.shortcuts import render
# from instant.producers import publish
from django.http import HttpResponse, HttpResponseRedirect
from cent import Client
from django.conf import settings 
import jwt
from rest_framework.views import APIView
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from django.http import JsonResponse
from .models import *
from .serializers import *
from target_allocate.models import target_allocate
from permission.models import Custom_Permission
import csv
from rest_framework import status
from rest_framework.response import Response
from invoice_and_tickets.models import Tickets
from django.http import HttpResponse
from django.contrib.auth.models import User
import openpyxl
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import authentication_classes, permission_classes, api_view
#def export_users_csv(request):
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from target_allocate.models import targets

from django.contrib.auth.models import User
from django.contrib.sessions.models import Session
from django.utils import timezone
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authentication import TokenAuthentication
from datetime import timedelta
from online_users.models import OnlineUserActivity
import requests
from django.db import transaction

def get_all_logged_in_users():   
    sessions = Session.objects.filter(expire_date__gte=timezone.now())
    uid_list = []
    for session in sessions:
        data = session.get_decoded()
        uid_list.append(data.get('_auth_user_id', None))

    return User.objects.filter(id__in=uid_list).count()

from jira import JIRA

jira = JIRA('https://jira.atlassian.com')


def demo2(request):
	# category.objects.create(category='gfdgfd')
	# category.create()

	pass
	# r = requests.get('https://api.printful.com/countries')
	# for i in r.json()['result']:
	# 	if not Country.objects.filter(name=i['name']):
	# 		Country.objects.create(name=i['name'])

	# for i in school.objects.all():
	# 	for x in Country.objects.all():
	# 		if str(i.country) == str(x.name):
	# 			i.country = x.id
	# 			i.save()




	return HttpResponse("Done")

def country_list(request):
	con_obj = Country.objects.all()
	serializer = CountrySerializer(con_obj, many=True)

	return JsonResponse(serializer.data,  safe=False)

   

from rest_framework.decorators import api_view, renderer_classes

@api_view(('GET',))
@authentication_classes([JWTAuthentication,])
def category_list(request):
	objs = category.objects.all()
	serializer = CategorySerializer(objs, many=True)
	
	res_dict = {}
	res_dict['status'] = 1
	res_dict['detail'] = "Category list"
	res_dict['data'] =  serializer.data

	return Response(res_dict, status=status.HTTP_200_OK)

@api_view(('GET',))
@authentication_classes([JWTAuthentication,])
def school_locations_list(request):
	sch_obj = request.user.school_details.school.school_location.all()
	serializer = SchoolLocationSerializer(sch_obj, many=True)
	
	res_dict = {}
	res_dict['status'] = 1
	res_dict['detail'] = "School location list"
	res_dict['data'] =  serializer.data

	return Response(res_dict, status=status.HTTP_200_OK)




@api_view(('GET',))
@authentication_classes([TokenAuthentication,])
@permission_classes([IsAdminUser])
def dash_data(request):
	active_school = school.objects.filter(is_active = True).count()
	current_mrr = '$1209'
	master_target = targets.objects.filter(status = "1").count()
	logged_in_users = get_all_logged_in_users()
	open_tickets = Tickets.objects.filter(status = 1).count()

	res_dict = {}
	res_dict['status'] = 1
	res_dict['detail'] = "diagnoses Api"
	res_dict['data'] =  {'active_school':active_school, 'current_mrr':current_mrr, 'master_target':master_target, 'logged_in_users':logged_in_users, 'open_tickets':open_tickets}

	return Response(res_dict, status=status.HTTP_200_OK)



def token_genrate(request):
	user_id = request.GET.get('user_id')

	token = jwt.encode({"sub": str(user_id)},  settings.CENTRIFUGO_SECRET_KEY).decode()

	return JsonResponse({'status':1, 'token': token}, safe=False)



from rest_framework.decorators import api_view, renderer_classes

@api_view(('GET',))
# @authentication_classes([TokenAuthentication,])
# @permission_classes([IsAdminUser])
def dash_data(request):
	active_school = school.objects.filter(is_active = True).count()
	current_mrr = '$1209'
	master_target = targets.objects.filter(status = "1").count()
	logged_in_users = get_all_logged_in_users()
	open_tickets = Tickets.objects.filter(status = 1).count()

	res_dict = {}
	res_dict['status'] = 1
	res_dict['detail'] = "Diagnoses Api"

	a_school_data = [3, 3, 3, 2, 5, 4, 8]
	curr_mrr_data = [1, 2, 3, 3, 3, 4, 4]
	m_target_data = [2, 3, 3, 3, 4, 3, 3]
	log_user_data = [1, 7, 1, 3, 1, 4, 8]
	o_ticket_data = [2, 3, 4, 2, 1, 5, 7]

	res_dict['data'] =  {
		'active_school':active_school, 
		'a_school_data':a_school_data, 
		'current_mrr':current_mrr,
		'curr_mrr_data':curr_mrr_data, 
		'master_target':master_target,
		'm_target_data':m_target_data, 
		'logged_in_users':logged_in_users, 
		'log_user_data':log_user_data,
		'open_tickets':open_tickets,
		'o_ticket_data':o_ticket_data
	}

	return Response(res_dict, status=status.HTTP_200_OK) 



class learners_api(APIView):
	serializer_class = LearnerSerializer
	authentication_classes = (JWTAuthentication,)
	permission_classes = (IsAuthenticated,)

	def get_object(self, id):
		try:
			return students.objects.get(id=id)
		except students.DoesNotExist:
			raise Http404

	def get(self, request, id=0):
		school_obj = request.user.school_details.school
		if id:
			learner_obj = students.objects.get(id=id) 
			serializer = (LearnerSerializer(learner_obj, many=False)).data
		else:
			learner_obj = students.objects.filter(school= school_obj, is_active=True).order_by('-id')
			# learner_obj = students.objects.filter(school= school_obj, is_active=True).order_by('-id')[:3]
			serializer = (LearnerGetSerializer(learner_obj, many=True)).data
		return JsonResponse({'status':1, 'message':'Get Student Details', 'data':serializer}, safe=False)

	def post(self, request, format=None):
		serializer = self.serializer_class(data=request.data)
		serializer.is_valid(raise_exception=True)

		if serializer.is_valid(raise_exception=True):
			email = serializer.validated_data["email"]

			sch_obj = request.user.school_details.school
			present_std = students.objects.filter(school = sch_obj).count()
			no_learner = int(sch_obj.no_learner)
			
			if present_std > no_learner:             
			  return Response({'status': 0, 'message':'Your limit for number of student is used, Please Upgrade your Account'} )

			try:
			  school_obj = request.user.school_details.school
			  std_obj  = User.objects.filter(school_details__school__id = school_obj.id, username__startswith='P'+str(school_obj.school_key)).order_by('-id')[0]
			  student_id = int(std_obj.username[5:])
			  student_id += 1
			  while True:
			      if User.objects.filter(username = "P"+str(request.user.school_details.school.school_key)+str(student_id)):
			          student_id += 1
			      else:
			          break
			except:
			  student_id = 4000

			password = User.objects.make_random_password()
			user =  User.objects.create_user("P"+str(request.user.school_details.school.school_key)+str(student_id), email, password)
			user.save()
			my_group = Group.objects.get(name='parents')
			my_group.user_set.add(user)
			q_2 = school_details.objects.create(user=user, school=request.user.school_details.school, is_parent=True)
			#useraccountdetails('Cogniable Account Details', [email], str(firstname), user.username, password)
			serializer.save(parent = user, school=school_obj)

			return Response({'status': 1,'message':'Student Successfully Created'} )
			 
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
		
	def put(self, request, id):
		snippet = self.get_object(id)
		serializer = self.serializer_class(instance=snippet, data=request.data, partial=True)
		if serializer.is_valid(raise_exception=True):
			serializer.save()
			return Response({'status': 1,'message':'Student Details Updated Successfully'},  status=status.HTTP_201_CREATED)
		else:
			return Response({'status': 0,'message':'Error Occured'},  status=status.HTTP_204_NO_CONTENT) 

class get_learner_data(APIView):
	authentication_classes = (TokenAuthentication,)
	permission_classes = (IsAuthenticated,)

	def get_serializer_name(self, model_name):
		if model_name == 'Allergies':
			name = Allergies
			srlz = AllergiesSerializer
		elif model_name == 'BloodPressure':
			name = BloodPressure
			srlz = BloodPressureSerializer
		elif model_name == 'Cholesterol':
			name = Cholesterol
			srlz = CholesterolSerializer
		elif model_name == 'Exercises':
			name = Exercises
			srlz = ExercisesSerializer
		elif model_name == 'Immunization':
			name = Immunization
			srlz = ImmunizationSerializer
		elif model_name == 'Medication':
			name = Medication
			srlz = MedicationSerializer
		elif model_name == 'Menstruation':
			name = Menstruation
			srlz = MenstruationSerializer
		elif model_name == 'FoodDrink':
			name = FoodDrink
			srlz = FoodDrinkSerializer
		return name, srlz

	def get(self, request, pk, model_name):
		student = students.objects.get(id=pk)
		model = self.get_serializer_name(model_name)

		obj = model[0].objects.filter(students__id=student.id)
		serializer = model[1](obj, many=True).data
		return JsonResponse({"status":1, 'message':'Get Student Data', 'name':student.firstname,'data':serializer}, safe=False)

class change_learner_data(APIView):
	authentication_classes = (TokenAuthentication,)
	permission_classes = (IsAuthenticated,)

	def get_serializer_name(self, model_name):
		if model_name == 'Allergies':
			name = Allergies
			srlz = AllergiesSerializer
		elif model_name == 'BloodPressure':
			name = BloodPressure
			srlz = BloodPressureSerializer
		elif model_name == 'Cholesterol':
			name = Cholesterol
			srlz = CholesterolSerializer
		elif model_name == 'Exercises':
			name = Exercises
			srlz = ExercisesSerializer
		elif model_name == 'Immunization':
			name = Immunization
			srlz = ImmunizationSerializer
		elif model_name == 'Medication':
			name = Medication
			srlz = MedicationSerializer
		elif model_name == 'Menstruation':
			name = Menstruation
			srlz = MenstruationSerializer
		elif model_name == 'FoodDrink':
			name = FoodDrink
			srlz = FoodDrinkSerializer
		return name, srlz

	def get(self, request, pk, model_name, id=None):
		student = students.objects.get(id=pk)
		model = self.get_serializer_name(model_name)

		obj = model[0].objects.filter(students__id=student.id)
		serializer = model[1](obj, many=True).data
		return JsonResponse({"status":1, 'message':'Get Student Data', 'name':student.firstname,'data':serializer}, safe=False)
		
	def put(self, request, pk, model_name, id):
		student = students.objects.get(id=pk)
		model = self.get_serializer_name(model_name)

		snippet = model[0].objects.get(id=id)
		serializer = model[1](instance=snippet, data=request.data, partial=True)
		if serializer.is_valid(raise_exception=True):
			serializer.save()
			return Response({'status': 1, 'message':'Learner Details Updated Successfully'},  status=status.HTTP_201_CREATED)
		else:
			return Response({'status': 0, 'message':'Error Occured'},  status=status.HTTP_204_NO_CONTENT)
		
	def delete(self, request, pk, model_name, id):
		student = students.objects.get(id=pk)
		model = self.get_serializer_name(model_name)

		if model[0].objects.filter(id=id).exists():
			snippet = model[0].objects.get(id=id)
			snippet.delete()
			return Response({'status': 1, 'message':'Learner Details Deleted!'},  status=status.HTTP_201_CREATED)
		else:
			return Response({'status': 0, 'message':'No Matching Record Fould'},  status=status.HTTP_204_NO_CONTENT)


class staff_api(APIView):
	authentication_classes = (JWTAuthentication,)
	permission_classes = (IsAuthenticated,)
	serializer_class = StaffDataSerializer

	def get_object(self, id):
		try:
			return Staff.objects.get(id=id)
		except Staff.DoesNotExist:
			raise Http404

	def get(self, request, id=None):
		school_obj = request.user.school_details.school
		print(school_obj.id)
		if id:
			staff_obj = Staff.objects.get(id=id)
			serializer = (self.serializer_class(staff_obj, many=False)).data
		else:
			staff_obj = Staff.objects.filter(school= school_obj, is_active=True)
			serializer = (self.serializer_class(staff_obj, many=True)).data
		return JsonResponse({'status':1,'message':'Get Staff','data':serializer}, safe=False)

	def post(self, request, format=None):
		serializer = self.serializer_class(data=request.data)
		if serializer.is_valid(raise_exception=True):
			email = serializer.validated_data.get("email")

			if User.objects.filter(email=email, is_active=True):
				return Response({'status': 0,'message':'Email already Exists!'}, status=status.HTTP_204_NO_CONTENT)

			user_role_int = serializer.validated_data.get("user_role")
			try:
				last_user_name = int(User.objects.filter(Q(groups__name='therapist') | Q(groups__name='Technician')).filter(username__startswith="T"+str(request.user.school_details.school.school_key)).order_by('-id')[0].username[5:])
				last_user_name += 1
				while True:
					if User.objects.filter(username = "T"+str(request.user.school_details.school.school_key)+str(last_user_name)):
						last_user_name += 1
					else:
						break
			except:
				last_user_name = 3000 
			serializer.save()
			password = User.objects.make_random_password()
			user =  User.objects.create_user("T"+str(request.user.school_details.school.school_key)+str(last_user_name), email, password)
			user.save()
			q_2 = school_details(user=user, school=request.user.school_details.school, is_therapist=True)
			q_2.save()
			my_group = user_role_int.user_group
			my_group.user_set.add(user)
			return Response({'status': 1,'message':'Staff Successfully Created'}, status=status.HTTP_201_CREATED)
		else:
			return Response({'status': 0,'message':'Error Occured!'}, status=status.HTTP_204_NO_CONTENT)
		
	def put(self, request, id):
		snippet = self.get_object(id)
		serializer = StaffDataSerializer(instance=snippet, data=request.data, partial=True)
		if serializer.is_valid(raise_exception=True):
			serializer.save()
			return Response({'status': 1, 'message':'Staff Details Updated Successfully'},  status=status.HTTP_201_CREATED)
		else:
			return Response({'status': 0, 'message':'Error Occured'},  status=status.HTTP_204_NO_CONTENT) 


class create_learner_api(APIView):
	"""docstring for long_term_goals_apis"""
	authentication_classes = (JWTAuthentication,)
	permission_classes = (IsAuthenticated,)
	serializer_class = createLearnerSerializer

	def post(self, request, format=None):
		serializer = self.serializer_class(data=request.data)
		serializer.is_valid(raise_exception=True)

		if serializer.is_valid(raise_exception=True):

			clientId = serializer.validated_data["clientId"]
			email = serializer.validated_data["email"]
			firstName = serializer.validated_data["firstName"]
			middleName = serializer.validated_data["middleName"]
			lastName = serializer.validated_data["lastName"]
			authStaff = serializer.validated_data["authStaff"]
			address = serializer.validated_data["address"]
			dob = serializer.validated_data["dob"]
			gender = serializer.validated_data["gender"]
			diagnosis = serializer.validated_data["diagnosis"]
			clinicLocation = serializer.validated_data["clinicLocation"]
			parentFirstName = serializer.validated_data["parentFirstName"]
			parentLastName = serializer.validated_data["parentLastName"]
			ssnCard = serializer.validated_data["ssnCard"]
			locationCategory = serializer.validated_data["locationCategory"]

			if User.objects.filter(email=email): return Response({'status': 0,'message':'Email Already Exists'} )

			school_obj = request.user.school_details.school
			present_std = students.objects.filter(school = school_obj).count()
			no_learner = int(school_obj.no_learner)
			
			if present_std > no_learner: return Response({'status': 0,'message':'Your limit for number of student is used, Please Upgrade your Account'} )

			try:		  
				std_obj  = User.objects.filter(school_details__school__id = school_obj.id, username__startswith='P'+str(school_obj.school_key)).order_by('-id')[0]
				student_id = int(std_obj.username[5:])
				student_id += 1
				while True:			  		
					if User.objects.filter(username = "P"+str(request.user.school_details.school.school_key)+str(student_id)):
						student_id += 1
					else:
						break
			except:
				student_id = 4000

			password = User.objects.make_random_password()
			user =  User.objects.create_user("P"+str(request.user.school_details.school.school_key)+str(student_id), email, password)
			user.save()
			my_group = Group.objects.get(name='parents')
			my_group.user_set.add(user)
			q_2 = school_details.objects.create(user=user, school=request.user.school_details.school, is_parent=True)
			
			learner_object = students.objects.create(client_id=clientId, email=email, firstname=firstName, lastname=lastName, current_address=address, dob=dob, gender=gender,
				clinic_location=clinicLocation, parent_name=parentFirstName, ins_ssn_aadhar=ssnCard, category=locationCategory, parent=user, school=school_obj, student_id=student_id)

			for obj in authStaff:
				learner_object.auth_staff.add(obj)

			for obj in diagnosis:
				learner_object.diagnoses.add(obj)

			return Response({'status': 1,'message':'Student Successfully Created'} )
			 
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)










