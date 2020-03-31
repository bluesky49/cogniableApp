from graphene import relay
import graphene
from graphene_django.types import DjangoObjectType
from .models import *
from graphene import Node
from django.contrib.auth.models import User, Group 

		 
class TargetAllocateType(DjangoObjectType):
    class Meta:
        model = target_allocate
        exclude = ['sd', 'prerequisit', 'steps', 'user', 'mastery_criteria']       
        interfaces = (relay.Node,) 
		 
class StatusType(DjangoObjectType):
    class Meta:
        model = target_status
        filter_fields = '__all__'
        interfaces = (relay.Node,) 

class TargetMainType(DjangoObjectType):
    class Meta:
        model = target_main
        filter_fields = '__all__'
        interfaces = (relay.Node,) 

class DomainType(DjangoObjectType):
    class Meta:
        model = domain
        filter_fields = '__all__'
        interfaces = (relay.Node,) 

class TargetDetailType(DjangoObjectType):
    class Meta:
        model = target_type
        fields = ['id', 'type_tar']
        interfaces = (relay.Node,) 
		 
class TargetsType(DjangoObjectType):
    class Meta:
        model = targets
        filter_fields = {'id':['exact'], 'domain':['exact'], 'target_area':['exact'], 'target_main__target_name':['icontains']}
        interfaces = (relay.Node,) 

class TargetAreaType(DjangoObjectType):
    class Meta:
        model = target_area
        filter_fields = '__all__'
        interfaces = (relay.Node,) 

class TargetAllcatedDetailType(DjangoObjectType):
    class Meta:
        model = target_allcated_details
        filter_fields = {'target_name':['exact'], } 
        interfaces = (relay.Node,) 



class PromptCodeType(DjangoObjectType):
    class Meta:
        model = prompt_codes
        filter_fields = '__all__'
        interfaces = (relay.Node,) 

class MasteryCriteriaType(DjangoObjectType):
    class Meta:
        model = MasteryCriteria
        filter_fields = '__all__'
        interfaces = (relay.Node,) 