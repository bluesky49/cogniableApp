from django.conf import settings
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.views.generic import View
from django.views.decorators.csrf import csrf_exempt, csrf_protect

from django.contrib.auth.models import Permission, User
from django.contrib.contenttypes.models import ContentType
from school.models import *
from permission.models import Custom_Permission
from target_allocate.models import target_allocate

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from rest_framework.decorators import authentication_classes, permission_classes, api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework_simplejwt.authentication import JWTAuthentication

from .serializers import *

import csv
import jwt
import openpyxl
import datetime


class FrontendRenderView(View):
	"""docstring for FrontendRenderView"""
	def get(self, request, *args, **kwargs):
		return HttpResponse('Typo in URL')


@api_view(['GET'])
@authentication_classes((JWTAuthentication,))
@permission_classes((IsAuthenticated,))
def domains_list(request):
	"""
	return list of all the domains along with their id
	"""
	dom_obj = domain.objects.all()
	serializer = domainModelSerializer(dom_obj, many=True)
	
	res_dict = {}
	res_dict['status'] = 1
	res_dict['message'] = "domain list"
	res_dict['data'] = serializer.data
	return JsonResponse(res_dict, safe=False) 


@api_view(['GET'])
@authentication_classes((JWTAuthentication,))
@permission_classes((IsAuthenticated,))
def clinic_list(request):
	if request.user:
		sch_objs = school.objects.all()
		serializer = schoolModelSerializer(sch_objs, many=True)
		res_dict = {}
		res_dict['status'] = 1
		res_dict['message'] = "School list"
		res_dict['data'] = serializer.data
		res_dict['count'] = len(serializer.data)
		return JsonResponse(res_dict, safe=False)
	else:
		res_dict = {}
		res_dict['status'] = 0
		res_dict['message'] = "You are not Authorized"
		return JsonResponse(res_dict, safe=False)


@api_view(['POST'])
@authentication_classes((JWTAuthentication,))
@permission_classes((IsAuthenticated,))
def clinic_active_inactive(request):
	serializer = activeInactiveSerializer(data=request.data)
	serializer.is_valid(raise_exception=True)
	_id = serializer.validated_data.get('Id')
	action = serializer.validated_data.get('action')
	obj = school.objects.get(id=_id)
	obj.is_active = action
	obj.save()
	serializer = schoolModelSerializer(obj, many=False)
	res_dict = {}
	res_dict['status'] = 1
	res_dict['message'] = "Clinic object Updated"
	res_dict['data'] = serializer.data
	res_dict['count'] = len(serializer.data)
	return JsonResponse(res_dict, safe=False)

@api_view(['POST'])
@authentication_classes((JWTAuthentication,))
@permission_classes((IsAuthenticated,))
def learner_active_inactive(request):
	serializer = activeInactiveSerializer(data=request.data)
	serializer.is_valid(raise_exception=True)
	_id = serializer.validated_data.get('Id')
	action = serializer.validated_data.get('action')
	obj = students.objects.get(id=_id)
	obj.is_active = action
	obj.save()
	serializer = studentsModelSerializer(obj, many=False)
	res_dict = {}
	res_dict['status'] = 1
	res_dict['message'] = "students object Updated"
	res_dict['data'] = serializer.data
	res_dict['count'] = len(serializer.data)
	return JsonResponse(res_dict, safe=False)

@api_view(['POST'])
@authentication_classes((JWTAuthentication,))
@permission_classes((IsAuthenticated,))
def staff_active_inactive(request):
	serializer = activeInactiveSerializer(data=request.data)
	serializer.is_valid(raise_exception=True)
	_id = serializer.validated_data.get('Id')
	action = serializer.validated_data.get('action')
	obj = Staff.objects.get(id=_id)
	obj.is_active = action
	obj.save()
	serializer = staffModelSerializer(obj, many=False)
	res_dict = {}
	res_dict['status'] = 1
	res_dict['message'] = "Staff object Updated"
	res_dict['data'] = serializer.data
	res_dict['count'] = len(serializer.data)
	return JsonResponse(res_dict, safe=False)

	
@api_view(['POST'])
@authentication_classes((JWTAuthentication,))
@permission_classes((IsAuthenticated,))
def clinic_obj(request, pk):
	obj = school.objects.get(id=pk)
	serializer = schoolModelSerializer(obj, many=False)
	std_objs = students.objects.filter(school__id=pk)
	serializer2 = studentsModelSerializer(std_objs, many=True)
	staff_objs = Staff.objects.filter(school__id=pk)
	serializer3 = staffModelSerializer(staff_objs, many=True)
	
	res_dict = {}
	res_dict['status'] = 1
	res_dict['message'] = "Clinic object"
	res_dict['data'] = {'clinic':serializer.data, 'learners':serializer2.data, 'staffs':serializer3.data}
	res_dict['count'] = {'learners':len(serializer2.data), 'staffs':len(serializer3.data)}
	return JsonResponse(res_dict, safe=False)




@api_view(['GET'])
@authentication_classes((JWTAuthentication,))
@permission_classes((IsAuthenticated,))
def clinic_counts(request):
	if request.user:
		sch_active_count = len(school.objects.filter(is_active=True))
		sch_inactive_count = len(school.objects.filter(is_active=False))
		res_dict = {}
		context = [{'title': 'Active Clinic', 'count':sch_active_count, 'percentage': 5 },
					{'title': 'In-Active Clinic', 'count':sch_inactive_count, 'percentage': 10 },
					{'title': 'In-Active Clinic', 'count':sch_inactive_count, 'percentage': 10 },
					{'title': 'In-Active Clinic', 'count':sch_inactive_count, 'percentage': 10 },
					{'title': 'In-Active Clinic', 'count':sch_inactive_count, 'percentage': 10 },
					]
		res_dict['status'] = 1
		res_dict['message'] = "active/inactive school count"
		res_dict['data'] = context
		return JsonResponse(res_dict, safe=False)
	else:
		res_dict = {}
		res_dict['status'] = 0
		res_dict['message'] = "You are not Authorized"
		return JsonResponse(res_dict, safe=False)







