from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.conf import settings 
from django.http import JsonResponse
from django.contrib.auth.models import User, Group
from guardian.models import UserObjectPermission
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse, Http404
from rest_framework.decorators import authentication_classes, permission_classes, api_view
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from school.models import *
from target_allocate.models import *
from .serializers import *
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from dynamic_db_router import in_database
from django.views import generic


class diagnoses_api(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = DiagnosesSerializer

    def get_object(self, id):
        try:
            return diagnoses.objects.get(id=id)
        except diagnoses.DoesNotExist:
            raise Http404

    def get(self, request, format=None): 
        if request.user.is_superuser:
            dia_obj = diagnoses.objects.filter(school__isnull = True)    

        else:
            dia_obj = diagnoses.objects.filter(school__isnull = True) | diagnoses.objects.filter(school=request.user.school_details.school)
            dia_obj = dia_obj.select_related('school')  
            
        serializer = self.serializer_class(dia_obj, context={'user':request.user}, many=True)

        res_dict = {}
        res_dict['status'] = 1
        res_dict['detail'] = "diagnoses Api"
        res_dict['data'] = serializer.data

        return Response(res_dict, status=status.HTTP_200_OK)

    def post(self, request ):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        name = serializer.validated_data.get('name')

        snippet = diagnoses.objects.create(name = name)

        UserObjectPermission.objects.assign_perm('clinic_assign', request.user, obj=snippet)
        
        res_dict = {}
        res_dict['status'] = 1
        res_dict['detail'] = "Diagnoses Successfully created"
        res_dict['data'] = self.serializer_class(snippet, context={'user':request.user}, many=False).data

        return Response(res_dict, status=status.HTTP_201_CREATED)

    def delete(self, request, id, format=None):
        snippet = self.get_object(id)
        if request.user.has_perm('clinic_assign', snippet):
            snippet.delete()
             
            return Response({'status': 1,'detail': 'diagnoses Deleted Successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'status': 0, 'detail': 'User do not have permission to Delete'}, status=status.HTTP_401_UNAUTHORIZED)

    def put(self, request, id):
        snippet = self.get_object(id)
        serializer = self.serializer_class(instance=snippet, data=request.data, partial=True)
 
        if serializer.is_valid(raise_exception=True):
            if request.user.has_perm('clinic_assign', snippet):
                article_saved = serializer.save()
                return Response({'status': 1, 'detail':'Diagnoses Updated Successfully', 'data':self.serializer_class(snippet, context={'user':request.user}, many=False).data }, status=status.HTTP_401_UNAUTHORIZED)

            else:
                return Response({'status': 0, 'detail': 'User do not have permission to Delete'}, status=status.HTTP_401_UNAUTHORIZED)



class challanges_api(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = ChallangesSerializer

    def get_object(self, id):
        try:
            return Challanges.objects.get(id=id)
        except Challanges.DoesNotExist:
            raise Http404

    def get(self, request, format=None):
        dia_obj = Challanges.objects.all()
        serializer = self.serializer_class(dia_obj, context={'user':request.user}, many=True)

        res_dict = {}
        res_dict['status'] = 1
        res_dict['detail'] = "Challanges Api"
        res_dict['data'] = serializer.data
        return JsonResponse(res_dict, safe=False)

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        name = serializer.validated_data.get('name')

        snippet = Challanges.objects.create(name = name)

        UserObjectPermission.objects.assign_perm('clinic_assign', request.user, obj=snippet)
        
        res_dict = {}
        res_dict['status'] = 1
        res_dict['detail'] = "Challanges Successfully created"
        res_dict['data'] = self.serializer_class(snippet, context={'user':request.user}, many=False).data

        return JsonResponse(res_dict, safe=False)

 
    def delete(self, request, id, format=None):
        snippet = self.get_object(id)
        if request.user.has_perm('clinic_assign', snippet):
            snippet.delete()
            return Response({'status': 1,'detail': 'Challanges Deleted Successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'status': 0, 'detail': 'User do not have permission to Delete'}, status=status.HTTP_401_UNAUTHORIZED)

    def put(self, request, id):
        snippet = self.get_object(id)
        serializer = self.serializer_class(instance=snippet, data=request.data, partial=True)
 
        if serializer.is_valid(raise_exception=True):
            if request.user.has_perm('clinic_assign', snippet):
                article_saved = serializer.save()
                return Response({'status': 1, 'detail':'Challanges Updated Successfully', 'data': self.serializer_class(snippet, context={'user':request.user}, many=False).data}, status=status.HTTP_401_UNAUTHORIZED)

            else:
                return Response({'status': 0, 'detail': 'User do not have permission to Delete'}, status=status.HTTP_401_UNAUTHORIZED)


class domain_api(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = DomainSerializer

    def get_object(self, id):
        try:
            return domain.objects.get(id=id)
        except domain.DoesNotExist:
            raise Http404

    def get(self, request, format=None):
        dia_obj = domain.objects.all()
        serializer = self.serializer_class(dia_obj, context={'user':request.user}, many=True)

        res_dict = {}
        res_dict['status'] = 1
        res_dict['detail'] = "domain Api"
        res_dict['data'] = serializer.data
        return JsonResponse(res_dict, safe=False)

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        domain = serializer.validated_data.get('domain')

        snippet = domain.objects.create(domain = domain)

        UserObjectPermission.objects.assign_perm('clinic_assign', request.user, obj=snippet)
        
        res_dict = {}
        res_dict['status'] = 1
        res_dict['detail'] = "domain Successfully created"
        res_dict['data'] = self.serializer_class(snippet, context={'user':request.user}, many=False).data

        return JsonResponse(res_dict, safe=False)

 
    def delete(self, request, id, format=None):
        snippet = self.get_object(id)
        if request.user.has_perm('clinic_assign', snippet):
            snippet.delete()
            return Response({'status': 1,'detail': 'domain Deleted Successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'status': 0, 'detail': 'User do not have permission to Delete'}, status=status.HTTP_401_UNAUTHORIZED)

    def put(self, request, id):
        snippet = self.get_object(id)
        serializer = self.serializer_class(instance=snippet, data=request.data, partial=True)
 
        if serializer.is_valid(raise_exception=True):
            if request.user.has_perm('clinic_assign', snippet):
                article_saved = serializer.save()
                return Response({'status': 1, 'detail':'domain Updated Successfully', 'data':self.serializer_class(snippet, context={'user':request.user}, many=False).data}, status=status.HTTP_200_OK)

            else:
                return Response({'status': 0, 'detail': 'User do not have permission to Delete'}, status=status.HTTP_401_UNAUTHORIZED)


class target_area_api(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = TargetAreaSerializer

    def get_object(self, id):
        try:
            return target_area.objects.get(id=id)
        except target_area.DoesNotExist:
            raise Http404

    def get(self, request, format=None):
        dia_obj = target_area.objects.all()

        if request.GET.get('domain_id'):
            dia_obj = dia_obj.filter(domain__id = request.GET.get('domain_id'))

        serializer = self.serializer_class(dia_obj, context={'user':request.user}, many=True)

        res_dict = {}
        res_dict['status'] = 1
        res_dict['detail'] = "target area Api"
        res_dict['data'] = serializer.data
        return JsonResponse(res_dict, safe=False)

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        Area = serializer.validated_data.get('Area')

        snippet = target_area.objects.create(Area = Area)

        UserObjectPermission.objects.assign_perm('clinic_assign', request.user, obj=snippet)
        
        res_dict = {}
        res_dict['status'] = 1
        res_dict['detail'] = "target area Successfully created"
        res_dict['data'] = self.serializer_class(snippet, context={'user':request.user}, many=False).data

        return JsonResponse(res_dict, safe=False)

 
    def delete(self, request, id, format=None):
        snippet = self.get_object(id)
        if request.user.has_perm('clinic_assign', snippet):
            snippet.delete()
            return Response({'status': 1,'detail': 'target area Deleted Successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'status': 0, 'detail': 'User do not have permission to Delete'}, status=status.HTTP_401_UNAUTHORIZED)

    def put(self, request, id):
        snippet = self.get_object(id)
        serializer = self.serializer_class(instance=snippet, data=request.data, partial=True)
 
        if serializer.is_valid(raise_exception=True):
            if request.user.has_perm('clinic_assign', snippet):
                article_saved = serializer.save()
                return Response({'status': 1, 'detail':'target area Updated Successfully', 'data': self.serializer_class(snippet, context={'user':request.user}, many=False).data }, status=status.HTTP_200_OK)

            else:
                return Response({'status': 0, 'detail': 'User do not have permission to Delete'}, status=status.HTTP_401_UNAUTHORIZED)


class target_main_api(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = TargetMainSerializer

    def get_object(self, id):
        try:
            return target_main.objects.get(id=id)
        except target_main.DoesNotExist:
            raise Http404

    def get(self, request, format=None):
        dia_obj = target_main.objects.all()

        if request.GET.get('area_id'):
            dia_obj = dia_obj.filter(target_area__id = request.GET.get('area_id'))

        serializer = self.serializer_class(dia_obj, context={'user':request.user}, many=True)

        res_dict = {}
        res_dict['status'] = 1
        res_dict['detail'] = "master target Api"
        res_dict['data'] = serializer.data
        return JsonResponse(res_dict, safe=False)

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        target_name = serializer.validated_data.get('target_name')

        snippet = target_main.objects.create(target_name = target_name)

        UserObjectPermission.objects.assign_perm('clinic_assign', request.user, obj=snippet)
        
        res_dict = {}
        res_dict['status'] = 1
        res_dict['detail'] = "target Successfully created"
        res_dict['data'] = self.serializer_class(snippet, context={'user':request.user}, many=False).data

        return JsonResponse(res_dict, safe=False)

 
    def delete(self, request, id, format=None):
        snippet = self.get_object(id)
        if request.user.has_perm('clinic_assign', snippet):
            snippet.delete()
            return Response({'status': 1,'detail': 'target Deleted Successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'status': 0, 'detail': 'User do not have permission to Delete'}, status=status.HTTP_401_UNAUTHORIZED)

    def put(self, request, id):
        snippet = self.get_object(id)
        serializer = self.serializer_class(instance=snippet, data=request.data, partial=True)
 
        if serializer.is_valid(raise_exception=True):
            if request.user.has_perm('clinic_assign', snippet):
                article_saved = serializer.save()
                return Response({'status': 1, 'detail':'target Updated Successfully', 'data': self.serializer_class(snippet, context={'user':request.user}, many=False).data }, status=status.HTTP_200_OK)

            else:
                return Response({'status': 0, 'detail': 'User do not have permission to Delete'}, status=status.HTTP_401_UNAUTHORIZED)


class master_target_api(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = MasterTargetSerializer

    def get_object(self, id):
        try:
            return targets.objects.get(id=id)
        except targets.DoesNotExist:
            raise Http404

    def get(self, request, format=None):
        dia_obj = targets.objects.all()
        serializer = self.serializer_class(dia_obj, context={'user':request.user}, many=True)

        res_dict = {}
        res_dict['status'] = 1
        res_dict['detail'] = "master target Api"
        res_dict['data'] = serializer.data
        return Response(res_dict, status=status.HTTP_200_OK)

    def post(self, request, format=None):
        serializer = MasterTargetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        snippet = targets.objects.create(**serializer.validated_data)

        #UserObjectPermission.objects.assign_perm('clinic_assign', request.user, obj=snippet)
        
        res_dict = {}
        res_dict['status'] = 1
        res_dict['detail'] = "target Successfully created"
        res_dict['data'] = self.serializer_class(snippet, context={'user':request.user}, many=False).data

        return Response(res_dict, status=status.HTTP_200_OK)

 
    def delete(self, request, id, format=None):
        snippet = self.get_object(id)
        if request.user.has_perm('clinic_assign', snippet):
            snippet.delete()
            return Response({'status': 1,'detail': 'target Deleted Successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'status': 0, 'detail': 'User do not have permission to Delete'}, status=status.HTTP_401_UNAUTHORIZED)

    def put(self, request, id):
        snippet = self.get_object(id)
        serializer = self.serializer_class(instance=snippet, data=request.data, partial=True)
 
        if serializer.is_valid(raise_exception=True):
            if request.user.has_perm('clinic_assign', snippet):
                article_saved = serializer.save()
                return Response({'status': 1, 'detail':'target Updated Successfully', 'data': self.serializer_class(snippet, context={'user':request.user}, many=False).data }, status=status.HTTP_200_OK)

            else:
                return Response({'status': 0, 'detail': 'User do not have permission to Delete'}, status=status.HTTP_401_UNAUTHORIZED)