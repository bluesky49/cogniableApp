from .models import * 
from django.http import HttpResponse
from .serializers import *
import datetime
from django.http import JsonResponse
from django.core.mail import BadHeaderError, send_mail
from datetime import date,timedelta
import json
from django.conf import settings 
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.core import serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics
from jira import JIRA
auth_jira = JIRA('https://cogniable.atlassian.net', basic_auth=('kohlimanu@gmail.com', 'QbvAH5jVtFrMykcKfgq8A81E'))

class CreateTicket(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = TicketsSerializer

    def get(self, request, format=None):
    	ticket_obj =  Tickets.objects.all()
    	serializer = self.serializer_class(ticket_obj,  many=True)

    	res_dict = {}
    	res_dict['status'] = 1
    	res_dict['detail'] = "tickets Api"
    	res_dict['data'] = serializer.data
    	return Response(res_dict, status=status.HTTP_200_OK)

    def post(self, request, format=None):
    	serializer = TicketsSerializer(data=request.data)
    	if serializer.is_valid():
    		serializer.save(status=TicketStatus.objects.get(id=1))
    		assign_to = serializer.validated_data.get('assign_to')
    		subject = serializer.validated_data.get('subject')
    		description = serializer.validated_data.get('description')
    		assign_to = serializer.validated_data.get('assign_to')
    		attachments = serializer.validated_data.get('attachments')
    		 


    		 
    		res_dict = {}
    		res_dict['status'] = 1
    		res_dict['detail'] = "Ticket ceated Successfully"
    		 
    		return Response(res_dict, status=status.HTTP_200_OK)

    	return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)