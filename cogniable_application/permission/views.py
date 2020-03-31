from django.shortcuts import render
from .models import *
from django.contrib.auth.models import Permission
from django.contrib.auth.models import Group, User
from django.http import HttpResponse, HttpResponseRedirect
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from .serializers import *
from rest_framework import status
from django.db.models import Prefetch
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from guardian.models import UserObjectPermission
from django.contrib.contenttypes.models import ContentType
from django.http import Http404

class Menu(APIView):
    #authentication_classes = (JWTAuthentication,)
    #permission_classes = (IsAuthenticated,)
    serializer_class = MenuSerializer
 

    def get(self, request, format=None):
        menu_obj = Menu_level_1.objects.all().prefetch_related(Prefetch('menu_level_2_set'), Prefetch('menu_level_2_set__menu_level_3_set'))       
        serializer = self.serializer_class(menu_obj,  many=True)

        res_dict = {}
        res_dict['status'] = 1
        res_dict['detail'] = "Menu Api"
        res_dict['data'] = serializer.data

        return Response(res_dict, status=status.HTTP_200_OK)

 
class App_Group(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = GroupSerializer
    
    def get_object(self, id):
        try:
            return Group.objects.get(id=id)
        except Group.DoesNotExist:
            raise Http404

    def get(self, request, format=None):
        group_obj = School_Group.objects.filter(school=request.user.school_details.school).order_by('-id')   
        serializer = self.serializer_class(group_obj,  many=True)

        res_dict = {}
        res_dict['status'] = 1
        res_dict['detail'] = "Group Api"
        res_dict['data'] = serializer.data

        return Response(res_dict, status=status.HTTP_200_OK)


    def post(self, request, format=None):
        serializer = Group1Serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        name =  serializer.validated_data.get('name')
        snippet = Group.objects.create(name=name)
        School_Group.objects.create(group = snippet, school=request.user.school_details.school, created_by=request.user)

        UserObjectPermission.objects.assign_perm('create_own_group', request.user, obj=snippet)
         
        res_dict = {}
        res_dict['status'] = 1
        res_dict['detail'] = "Group is Successfully Created"
        return Response(res_dict, status=status.HTTP_200_OK)


    def delete(self, request, id, format=None):
        snippet = self.get_object(id)

        if request.user.has_perm('create_own_group', snippet):
            snippet.delete()
             
            return Response({'status': 1,'detail': 'Group Deleted Successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'status': 0, 'detail': 'User do not have permission to Delete'}, status=status.HTTP_401_UNAUTHORIZED)

        
    def put(self, request, id):
        snippet = self.get_object(id)
        serializer = Group1Serializer(instance=snippet, data=request.data, partial=True)
 
        if serializer.is_valid(raise_exception=True):
            if request.user.has_perm('create_own_group', snippet):
                article_saved = serializer.save()
                return Response({'status': 1, 'detail':'Group Updated Successfully'}, status=status.HTTP_200_OK)

            else:
                return Response({'status': 0, 'detail': 'User do not have permission to Delete'}, status=status.HTTP_401_UNAUTHORIZED)




class Permissions(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = PermissionsSerializer
 

    def get(self, request, format=None):
        group_id = request.GET.get('group_id')

        permiss_obj = Custom_Permission.objects.filter(is_active=True).order_by('-id')   
        serializer = self.serializer_class(permiss_obj, context={ 'group_id':group_id },  many=True)
 
        data_dict = {}
        for i in serializer.data:
            data_dict[i['model']] = []

        for i in serializer.data:
            data_dict[i['model']].append(i['permission'])


        res_dict = {}
        res_dict['status'] = 1
        res_dict['detail'] = "Permissions Api"
        res_dict['data'] = data_dict

        return Response(res_dict, status=status.HTTP_200_OK)

    def post(self, request, format=None):
        serializer = Permissions2Serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        permisssion = serializer.validated_data.get('permisssion')
        group = serializer.validated_data.get('group')

        if request.user.has_perm('create_own_group', group):
            group.permissions.add(permisssion)
        
            res_dict = {}
            res_dict['status'] = 1
            res_dict['detail'] = "Permissions Successfully Created"
            return Response(res_dict, status=status.HTTP_200_OK)

        else:
            return Response({'status': 0, 'detail': 'User do not have permission'}, status=status.HTTP_401_UNAUTHORIZED)
