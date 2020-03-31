from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth.decorators import permission_required
import datetime
# from school.backends.MyBackend import authenticate
from django.contrib.auth import authenticate, login as dj_login
from django.contrib.auth.models import User, Group, Permission
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import authentication_classes, permission_classes, api_view
from .serializers import *
from drf_yasg.app_settings import swagger_settings
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings 
from .serializers import EmailSerializer, PasswordTokenSerializer
from django.contrib.sessions.models import Session
from django.contrib import auth
from django.db.models import Q
from rest_framework.exceptions import ValidationError
from rest_framework.generics import GenericAPIView
from school.models import Currency
from importlib import import_module
from datetime import datetime, timedelta
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_swagger import renderers
from rest_framework_swagger.renderers import OpenAPIRenderer, SwaggerUIRenderer
from rest_framework.response import Response
from rest_framework.views import APIView
from django.conf import settings
SessionStore = import_module(settings.SESSION_ENGINE).SessionStore
from rest_framework import generics, status
from rest_framework.schemas import SchemaGenerator
from rest_framework.permissions import AllowAny
from .models import *
from .signals import reset_password_token_created, pre_password_reset, post_password_reset
from .tokens import get_token_generator
from django.contrib.auth import get_user_model
TOKEN_GENERATOR_CLASS = get_token_generator()
User = get_user_model()
import datetime
from school.models import UserDb
import random
import string
from django.utils.decorators import method_decorator
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.filters import OrderingFilter
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.parsers import FileUploadParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.decorators import action
from drf_yasg import openapi
from drf_yasg.app_settings import swagger_settings
from drf_yasg.inspectors import CoreAPICompatInspector, FieldInspector, NotHandled, SwaggerAutoSchema
from drf_yasg.utils import no_body, swagger_auto_schema
 

class CountryHeaderSchema(SwaggerAutoSchema):
    def add_manual_parameters(self, parameters):
        return parameters + [openapi.Parameter('country', openapi.IN_HEADER, required=True, description="country of the user", type=openapi.TYPE_STRING), openapi.Parameter('lang', openapi.IN_HEADER, required=True, description="Language for the User", type=openapi.TYPE_STRING), openapi.Parameter('timezone', openapi.IN_HEADER, required=True, description="Timezone for the User (eg - Asia/Kolkata)", type=openapi.TYPE_STRING)]

    def get_responses(self):
        response_serializers = self.get_response_serializers()
        response_serializers.pop('201')     
        response_serializers['200'] = ResponseSerializer()       

        return openapi.Responses(
            responses=self.get_response_schemas(response_serializers)
        )
    

class DbHeaderSchema(SwaggerAutoSchema):
    def add_manual_parameters(self, parameters):
        return [openapi.Parameter('country', openapi.IN_HEADER, required=True, description="country of the user", type=openapi.TYPE_STRING), openapi.Parameter('lang', openapi.IN_HEADER, required=True, description="Language for the User", type=openapi.TYPE_STRING)]



def GetSchoolKeyByName(school_name, last_random=False):
    sch_ary = school_name.split(" ")
    if len(sch_ary) == 1:
        key = school_name[0:4]
    elif len(sch_ary) == 2:
        key = sch_ary[0][0:2] + sch_ary[1][0:2]
    elif len(sch_ary) == 3:
        key = sch_ary[0][0:2] + sch_ary[1][0] + sch_ary[2][0]
    else:
        key = sch_ary[0][0] + sch_ary[1][0] + sch_ary[2][0] + sch_ary[3][0]

    if last_random:
        rand_let = random.choice(string.ascii_letters)
        key  = str(key[0:3]) + rand_let

        if school.objects.filter(school_key=key.upper()).exists() or User.objects.filter(username=key.upper()).exists():
            key = GetSchoolKeyByName(school_name, last_random=True)
        else:
            return key.upper()

    if school.objects.filter(school_key=key.upper()).exists() or User.objects.filter(username=key.upper()).exists():
        return GetSchoolKeyByName(school_name, last_random=True)

    else:
        return key.upper()
    
class Login_Api(generics.GenericAPIView):
    serializer_class = LoginSerializer
    swagger_schema = CountryHeaderSchema

    
    def post(self, request, format=None):   
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        country = request.headers.get('country', None)    
        username = serializer.validated_data.get('username')
        password = serializer.validated_data.get('password')
        django_timezone = serializer.validated_data.get('timezone')

        snippets = authenticate(request, username=username, password=password)

        serializer_data = UserSerializer(snippets, many=False).data
        

     
        if snippets is not None:
            # Super Admin Try to login
            try:
                serializer_data['groups'] = serializer_data['groups'][0] 
            except:
                res_dict = {}
                res_dict['status'] = 0
                res_dict['detail'] = "You Are unautherized to login"
                return Response(res_dict, status=status.HTTP_403_FORBIDDEN)

            refresh = RefreshToken.for_user(snippets)
            session = SessionStore()
            session[auth.SESSION_KEY] = snippets._meta.pk.value_to_string(snippets)
            session[auth.BACKEND_SESSION_KEY] = 'school.backends.CaseInsensitiveModelBackend'
            session[auth.HASH_SESSION_KEY] = snippets.get_session_auth_hash()
            session['django_timezone'] = django_timezone
            session.save()

            res_dict = {}
            res_dict['status'] = 1
            res_dict['detail'] = "Scessfully logged in"
            res_dict['data'] = {'token':{'refresh': str(refresh), 'access': str(refresh.access_token)}, 'user':serializer_data, 'cookie':{'db':request.SELECTED_DATABASE}}

            return Response(res_dict)    
        else:
            res_dict = {}
            res_dict['status'] = 0
            res_dict['detail'] = "Wrong username or password"

            return Response(res_dict, status=status.HTTP_403_FORBIDDEN)



def confirm_email(request, confirmation_key):
    User = get_user_model()

    try:
        email_confirmation = EmailConfirmation.objects.get(confirmation_key=confirmation_key)
    except EmailConfirmation.DoesNotExist:
        return render(request, 'email/email_confirmation_fail.html')

    context = dict(configs.EMAIL_CONFIRM_LA_TEMPLATE_CONTEXT)
    context['email_confirmation'] = email_confirmation
    try:
        email_confirmation.confirm()
        email_confirmation.clean()
    except EmailConfirmation.ExpiredError:
        return render(request, 'email/email_confirmation_expiration.html', context)

    if isinstance(email_confirmation.content_object, User):
        try:
            schools = school.objects.get(email=email_confirmation.content_object.email)

        except EmailConfirmation.ExpiredError:
            return render(request, 'email/email_confirmation_expiration.html', context)

        # return HttpResponseRedirect('/webapp/makepayment?school_id='+str(schools.id))
 
        school.objects.filter(id=schools.id).update(is_active = True)

        User.objects.filter(email = schools.email).update(is_active=True)
        user = User.objects.get(email = schools.email)

        plan_obj = pi_models.Plan.objects.get(stripe_id = settings.PINAX_STRIPE_DEFAULT_PLAN)
        customer_obj  = customers.create(user, plan = plan_obj, quantity=schools.no_learner)

        #subscriptions.create(customer = customer_obj, plan=plan_obj, quantity=schools.no_learner, trial_days=settings.PINAX_STRIPE_TRAIL_DAYS)

        response = school_verified_mail('Account Activated Successfully.', [user.email], user.username, user.username, user.password)
        dj_login(request, user)
        return HttpResponseRedirect('/index')

class ResetPasswordConfirm(GenericAPIView):
    throttle_classes = ()
    permission_classes = ()
    serializer_class = PasswordTokenSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        password = serializer.validated_data['password']
        token = serializer.validated_data['token']
      
        password_reset_token_validation_time = get_password_reset_token_expiry_time()
        reset_password_token = ResetPasswordToken.objects.filter(key=token).first()

        if reset_password_token is None:
            messages.error(request, 'Invalid Link')
            return HttpResponseRedirect('/administrative/forgotpass')
            
        expiry_date = reset_password_token.created_at + timedelta(hours=password_reset_token_validation_time)

        if timezone.now() > expiry_date:          
            reset_password_token.delete()
            messages.error(request, 'Link has been expired.')
            return HttpResponseRedirect('/administrative/forgotpass')
            
        if reset_password_token.user.has_usable_password():
            pre_password_reset.send(sender=self.__class__, user=reset_password_token.user)
            reset_password_token.user.set_password(password)
            reset_password_token.user.save()
            post_password_reset.send(sender=self.__class__, user=reset_password_token.user)

        ResetPasswordToken.objects.filter(user=reset_password_token.user).delete()
        messages.success(request, 'Your Password has been changed successfully.')
        return HttpResponseRedirect('/')

    def get(self, request, *args, **kwargs):
        try:
            token = request.GET.get('token')
            return render(request,'email/pass_reset_confirm.html',{'token':token})
        except:
            return render(request,'email/pass_reset_confirm.html')


def forgotpass(request):
    pass




class ResetPasswordRequestToken(GenericAPIView):
    throttle_classes = ()
    permission_classes = ()
    serializer_class = EmailSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        password_reset_token_validation_time = get_password_reset_token_expiry_time()
        now_minus_expiry_time = timezone.now() - timedelta(hours=password_reset_token_validation_time)
        clear_expired(now_minus_expiry_time)
        try:
            users = User.objects.get(Q(username__iexact=email) | Q(email=email))
            if not users:
                try:
                    users = Staff.objects.get(contact_no=email)
                except:
                    pass
                if not users:
                    try:
                        users = students.objects.get(mobileno=email)
                    except:
                        pass
        except:
            return Response({'status':0, 'detail':'There is no active user associated'})
             

        active_user_found = False
         
        if users.is_active and users.has_usable_password():
            active_user_found = True

        if not active_user_found:
            EmailConfirmation.objects.verify_email_for_object(email=email, content_object=users, email_field_name='customer_support_email')
            
            return Response({'status':1, 'detail':'Your email is not verifed, An activation link send to your email'})
           
        if True:
            if users.is_active and users.has_usable_password():
                token = None
                if ResetPasswordToken.objects.filter(user=users).count() > 0:  
                    q_1 = ResetPasswordToken.objects.get(user=users)
                    reset_password_token_created.send(sender=self.__class__, instance=self, reset_password_token=q_1)                 
                    return Response({'status':1, 'detail':'Activation link again send to your email'})

                else:                   
                    try:
                        auto_id = ResetPasswordToken.objects.all().order_by('-id')[0].id + 1
                    except:
                        auto_id = 1
                     
                    token = ResetPasswordToken(
                        id=auto_id,
                        user=users,
                        user_agent=request.META['HTTP_USER_AGENT'],
                        ip_address=request.META['REMOTE_ADDR'],
                        key = TOKEN_GENERATOR_CLASS.generate_token()
                    )
                    token.save()              
                reset_password_token_created.send(sender=self.__class__, instance=self, reset_password_token=token)

        return Response({'status':1, 'detail':'An Activation link is send to your Email'})

    def get(self, request, *args, **kwargs):
        return render(request,'email/password_reset_email.html')


reset_password_confirm = ResetPasswordConfirm.as_view()
reset_password_request_token = ResetPasswordRequestToken.as_view()

@csrf_exempt
@api_view(['POST'])
def sign_up(request):
    serializer = SchoolSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    school_name = serializer.validated_data["school_name"]
    email =  serializer.validated_data["email"].lower()
    
    country =  serializer.validated_data["country"]
    no_learner =  serializer.validated_data["no_learner"]
    password =  serializer.validated_data["password"]
    
    if User.objects.filter(email=email.lower()).exists():
        return Response({'status': 0,'detail':'Email already Exists'})
    
    if len(school_name) < 5:
        return Response({'status': 0,'detail':'School Name minimum 5 characters'})
    
    if len(password) < 5:
        return Response({'status': 0,'detail':'password minimum 5 characters'})
    
    try:
        school_id = int(school.objects.all().order_by('-id')[0].school_id)
        school_id += 1
    except:
        school_id = 1
    
    school_key = GetSchoolKeyByName(str(school_name), last_random=False)


    user = User.objects.create_user(username=school_key, password=password, email=email, is_active=False)
    user.save()
    
    admin_group = Group.objects.get(name='school_admin')
    user.groups.add(admin_group)

    q_1 = school.objects.create(school_id=school_id, user=user, school_name=school_name, email = email,  country=country, no_learner=no_learner, school_key= school_key)
    for dom in domain.objects.all():
        q_1.domain.add(dom)

    q_2 = school_details(user=user, school = q_1, is_admin=True)
    q_2.save()

    try:
        q_3 = MultiLocation.objects.get(country = country)
        q_3.school.add(q_1)
    except:
        pass

    # EmailConfirmation.objects.verify_email_for_object(email=email, content_object=user, email_field_name='customer_support_email')

    return Response({'status': 1,'detail':'An activation link has been sent to your Email. Please verify to proceed.'})


# @csrf_exempt
# @api_view(['POST'])
# @renderer_classes([SwaggerUIRenderer, OpenAPIRenderer])
# def login(request):
#     serializer = LoginSerializer(data=request.data)
    

from .tasks import adding_task

def celery_test(request):
    result = adding_task.delay(3, 5)

    return HttpResponse(result)


from .serializers import ClinicsSerializer

 
@authentication_classes([JWTAuthentication,])
def new_clinics(request):
    obj = school.objects.all() 
    serializer = ClinicsSerializer(obj, many=True).data
    
    return JsonResponse({'status':1, 'data':serializer}, safe=False)

@api_view(['GET'])
def userlogs(request):
    return JsonResponse({'status':1, 'data':[]}, safe=False)





