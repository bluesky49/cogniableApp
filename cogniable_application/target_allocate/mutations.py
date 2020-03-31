import graphene
from django.core.exceptions import ObjectDoesNotExist
from .models import *
from .graphql_types import *
from django.db import transaction
from django.db import transaction
from django.db.models import Q
from graphql_relay import from_global_id
from graphene import relay
from rest_framework_simplejwt.tokens import RefreshToken

from school.graphql_types import UserType, StudentType
from school.models import students

class TargetAllocateInput(graphene.InputObjectType):
	target_id = graphene.ID()
	student_id = graphene.ID()
	target_status = graphene.ID()
	goal_name = graphene.String()    
	sd = graphene.List(graphene.ID)
	prerequisit = graphene.List(graphene.ID)
	steps = graphene.List(graphene.ID)
	date = graphene.types.datetime.Date()
	target_instr = graphene.String()
	good_practices = graphene.String()
	precaution = graphene.String()
	mastery_criteria =  graphene.ID()
	gernalization_criteria = graphene.String()

 

class CreateTargetAllocateMutation(relay.ClientIDMutation):
	student_id = graphene.Field(StudentType, required=False)
	target_status = graphene.Field(StatusType, required=False)
	
	class Input:
		target_data = TargetAllocateInput(required=True)

	@classmethod 
	def mutate_and_get_payload(cls, root, info, target_data=None):
		login_user = info.context.user
		sch_obj = login_user.school_details.school

		q_1 = target_allocate(target_id=targets.objects.get(id=from_global_id(target_data.target_id)[1]),student_id=students.objects.get(id=from_global_id(target_data.student_id)[1]), target_status=target_status.objects.get(id=from_global_id(target_data.target_status)[1]), 
			goal_name=target_data.goal_name, date=target_data.date,	target_instr=target_data.target_instr, good_practices=target_data.good_practices, precaution=target_data.precaution, 
			user=login_user,  mastery_criteria=MasteryCriteria.objects.get(id=from_global_id(target_data.mastery_criteria)[1]), gernalization_criteria=target_data.gernalization_criteria)
		q_1.save()
		#useraccountdetails('Cogniable Account Details', [email], str(firstname), user.username, password)
		for sd_id in target_data.sd:
			# raise Exception(from_global_id(dia_id)[1])
			sd_obj = MultipleSD.objects.get(id=from_global_id(sd_id)[1])
			q_1.sd.add(sd_obj)
 
		for step_id in target_data.steps:
			step_obj = Steps.objects.get(id=from_global_id(step_id)[1])
			q_1.steps.add(step_obj)
 
		for pre_id in target_data.prerequisit:
			pre_obj = Prerequisits.objects.get(id=from_global_id(pre_id)[1])
			q_1.prerequisit.add(pre_obj)
 
		return CreateTargetAllocateMutation(student_id=q_1) 


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




 
		
