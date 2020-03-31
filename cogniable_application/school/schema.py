import graphene
from graphene import relay
import graphql_jwt
from graphql_jwt.decorators import login_required
from graphene_django.filter import DjangoFilterConnectionField
from django_filters import FilterSet, OrderingFilter
import django_filters
from .graphql_types import *
from .mutations import *
from .models import user_role

class StudentFilter(FilterSet):
    # category__id = django_filters.NumberFilter(lookup_expr='exact')
    created_at__gte = django_filters.DateFilter(field_name='created_at', lookup_expr='date__gte')
    created_at__lte = django_filters.DateFilter(field_name='created_at', lookup_expr='date__lte')
    disable_student__lte = django_filters.DateFilter(field_name='created_at', lookup_expr='date__lte')

    class Meta:
        model = students
        exclude = ['image', 'report']
        fields = {'firstname': ['exact', 'icontains', 'istartswith'], 'is_active':['exact'], 'category':['exact']}

    @property
    def qs(self):
        return super(StudentFilter, self).qs.filter(school=self.request.user.school_details.school).select_related('parent')

class StaffFilter(FilterSet):   
    class Meta:
        model = Staff
        exclude = ['image', 'resume', 'joining_letter']

    @property
    def qs(self):
        return super(StaffFilter, self).qs.filter(school=self.request.user.school_details.school)   



# class StudentMutation(SerializerMutation):
#     class Meta:
#         serializer_class = LearnerSerializer
#         # model_operations = ['create', 'update']
#         # lookup_field = 'id'

class Query(object):
    student = relay.Node.Field(StudentType)
    users = relay.Node.Field(UserType)
    user_role = graphene.List(UserRoleType)    
    
    country = DjangoFilterConnectionField(CountryType)

    students = DjangoFilterConnectionField(StudentType, filterset_class=StudentFilter)

    staff = relay.Node.Field(StaffType)
    staffs = DjangoFilterConnectionField(StaffType, filterset_class=StaffFilter)

    school_location = DjangoFilterConnectionField(LocationType)
    category = graphene.List(CategoryType)
 
    # def resolve_school_location(self, info, **kwargs):
    #     user = info.context.user
    #     return user.school_details.school.school_location.all() 

    def resolve_category(self, info, **kwargs):
        return category.objects.all() 

    def resolve_country(self, info, **kwargs):       
        return Country.objects.all()


    def resolve_user_role(self, info, **kwargs):       
        return user_role.objects.all()

    # def resolve_student(self, info, **kwargs):
    #   return StudentFilter(kwargs).qs

    # def resolve_student(root, info, **kwargs):
    #   return students.objects.all()

    # students = graphene.List(StudentType)
    

    # staff = graphene.List(StaffObject)
    # all_staff = DjangoFilterConnectionField(StaffObject, )
    # all_staff = Node.Field(StaffObject)

    # staff = graphene.List(StaffObject)

    # @login_required
    # def resolve_all_students(self, info, **kwargs):
    #   user = info.context.user
    #   return students.objects.filter(school = user.school_details.school, **kwargs)

    # @login_required
    # def resolve_staff(self, info):
    #   user = info.context.user
    #   return Staff.objects.filter(school = user.school_details.school)



# class MyAwesomeMutation(SerializerMutation):
#   class Meta:
#       serializer_class = StaffDataSerializer

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
    create_student = CreateStudentMutation.Field()
    create_staff = CreateStaffMutation.Field()
    # delete_token_cookie = graphql_jwt.relay.DeleteJSONWebTokenCookie.Field()
 
 
