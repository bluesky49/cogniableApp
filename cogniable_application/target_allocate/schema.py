import graphene
from graphene import relay
from graphene_django.types import DjangoObjectType
from .models import diagnoses
from school.models import school
from graphql_jwt.decorators import login_required
import graphql_jwt
from graphene import Node
from rest_framework.decorators import authentication_classes 
from rest_framework_simplejwt.authentication import JWTAuthentication
from graphene_django.rest_framework.mutation import SerializerMutation
from graphene_django.filter import DjangoFilterConnectionField
from django_filters import FilterSet, OrderingFilter
import django_filters
from graphql_relay import from_global_id
from .models import *
from target_allocate.models import target_allocate
from .graphql_types import *

from .mutations import *

from school.graphql_types import UserType

class DiagnosesType(DjangoObjectType):
    class Meta:
        model = diagnoses
        interfaces = (Node,)
         
class TargetAllocateFilter(FilterSet):
    # student__id = django_filters.NumberFilter(lookup_expr='exact')

    class Meta:
        model = target_allocate
        exclude = ['sd', 'prerequisit', 'steps', 'user', 'mastery_criteria'] 
        fields = {"student_id":['exact'], 'target_id__domain':['exact'], 'target_id__target_area':['exact'], 'target_status':['exact'], 'target_allcated_details__target_name':['icontains']} 

    @property
    def qs(self):
        return super(TargetAllocateFilter, self).qs.filter(user=self.request.user)  

class Query(object):
    target = DjangoFilterConnectionField(TargetsType) 
    target_get = relay.Node.Field(TargetsType) 
    target_detail = DjangoFilterConnectionField(TargetAllcatedDetailType) 
    targetAllocates = DjangoFilterConnectionField(TargetAllocateType, filterset_class=TargetAllocateFilter)
    targetAllocate = relay.Node.Field(TargetAllocateType)

    target_status = graphene.List(StatusType)
    domain = graphene.List(DomainType)
    types = graphene.List(TargetDetailType)
    prompt_codes = graphene.List(PromptCodeType)
    mastery_criteria = graphene.List(MasteryCriteriaType)
    domain_get = relay.Node.Field(DomainType)
    diagnoses = graphene.List(DiagnosesType) 
    target_area = DjangoFilterConnectionField(TargetAreaType)   

    def resolve_diagnoses(self, info, **kwargs):        
        return diagnoses.objects.all()

    def resolve_target_status(self, info, **kwargs):
        return target_status.objects.all() 

    def resolve_domain(self, info, **kwargs):
        return domain.objects.all() 

    def resolve_types(self, info, **kwargs):
        return target_type.objects.all() 

    def resolve_prompt_codes(self, info, **kwargs):
        return prompt_codes.objects.all() 

    def resolve_mastery_criteria(self, info, **kwargs):
        user = info.context.user
        return MasteryCriteria.objects.filter(school=user.school_details.school) 

    def resolve_target_area(self, info, **kwargs):
        domain_id = kwargs.get('id')
        if domain_id is not None:
            return domain.objects.get(id=from_global_id(domain_id)[1]).target_area.all()  
        else:
            return target_area.objects.all()


import graphene
import graphql_jwt


class ObtainJSONWebToken(graphql_jwt.relay.JSONWebTokenMutation):
    user = graphene.Field(UserType)

    @classmethod
    def resolve(cls, root, info, **kwargs):
        return cls(user=info.context.user) 


class Mutation(object):
    token_auth = ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.relay.Verify.Field()
    refresh_token = graphql_jwt.relay.Refresh.Field()
    create_target_allocate = CreateTargetAllocateMutation.Field()