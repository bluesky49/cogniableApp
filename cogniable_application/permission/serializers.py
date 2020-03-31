from rest_framework import serializers
from .models import *
from django.contrib.auth.models import Permission
from django.contrib.auth.models import User, Group
from school.models import school

class Menu3Serializer(serializers.ModelSerializer):
    class Meta:
        model = Menu_level_3
        fields = ('__all__')


class Menu2Serializer(serializers.ModelSerializer):
    menu_3 = Menu3Serializer(many=True, source='menu_level_3_set')
    class Meta:
        model = Menu_level_2
        fields = ('__all__')

 
class MenuSerializer(serializers.ModelSerializer):
    menu_2 = Menu2Serializer(many=True, source='menu_level_2_set')

    class Meta:
        model = Menu_level_1
        fields = ('__all__')

class Permission1Serializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ('id', 'name',)

    def to_representation(self, instance):
        ret = super().to_representation(instance)

        group_id = self.context.get("group_id", None)

        if group_id:
            ret['checked'] =  True if Group.objects.get(id=group_id).permissions.filter(id = instance.id).exists() else False

        return ret

class PermissionsSerializer(serializers.ModelSerializer):
    model = serializers.StringRelatedField(source='permission.content_type.model')
    permission = Permission1Serializer(many=False)

    class Meta:
        model = Custom_Permission
        fields = ('id', 'name', 'is_active', 'permission', 'model')

    
class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = School_Group
        fields = ('__all__')

class Group1Serializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('__all__') 

class Permissions2Serializer(serializers.Serializer):
    permisssion = serializers.PrimaryKeyRelatedField(queryset=Permission.objects.all(), many=False)
    group = serializers.PrimaryKeyRelatedField(queryset=Group.objects.all(), many=False)
     