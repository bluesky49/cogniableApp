from graphene import relay
import graphene
from graphene_django.types import DjangoObjectType
from .models import students, Staff, school_location, category, Country, user_role
from graphene import Node
from django.contrib.auth.models import User, Group 

class GroupType(DjangoObjectType):
	class Meta:
		model = Group 
		filter_fields ='__all__'
		interfaces = (relay.Node,)

class UserType(DjangoObjectType):
	class Meta:
		model = User
		filter_fields ='__all__'
		interfaces = (relay.Node,)


class StudentType(DjangoObjectType):
	class Meta:
		model = students
		exclude = ['image', 'report']
		interfaces = (relay.Node,)

class UserRoleType(DjangoObjectType):
    class Meta:
        model = user_role
        interfaces = (relay.Node,)
		 
class StaffType(DjangoObjectType):
    class Meta:
        model = Staff
        exclude = ['image', 'resume', 'joining_letter']
        interfaces = (relay.Node,)

class LocationType(DjangoObjectType):
    class Meta:
        model = school_location
        filter_fields ='__all__'
        interfaces = (relay.Node,)
       
class CategoryType(DjangoObjectType):
    class Meta:
        model = category
        filter_fields ='__all__'
        interfaces = (relay.Node,)


class CountryType(DjangoObjectType):
    class Meta:
        model = Country
        filter_fields ='__all__'
        interfaces = (relay.Node,)