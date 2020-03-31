from school.models import *
from target_allocate.models import *
from rest_framework import serializers
from target_allocate.models import Challanges, target_allocate

class DiagnosesSerializer(serializers.ModelSerializer):
    class Meta:
        model = diagnoses
        fields = ('id', 'name',)

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['editable'] = True if instance.school else False
        return ret       


class ChallangesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Challanges
        fields = ('id', 'name',)

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['editable'] = self.context['user'].has_perm('clinic_assign', instance)
        return ret


class DomainSerializer(serializers.ModelSerializer):
    class Meta:
        model = domain
        fields = ('id', 'domain',)

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['editable'] = self.context['user'].has_perm('clinic_assign', instance)
        return ret

class TargetAreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = target_area
        fields = ('id', 'Area',)

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['editable'] = self.context['user'].has_perm('clinic_assign', instance)
        return ret


class TargetMainSerializer(serializers.ModelSerializer):
    class Meta:
        model = target_main
        fields = ('id', 'target_name',)

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['editable'] = self.context['user'].has_perm('clinic_assign', instance)
        return ret



class MasterTargetSerializer(serializers.ModelSerializer):
    class Meta:
        model = targets
        fields = ('domain', 'target_area', 'target_main', 'peakvar_id', 'vbmappvar_id', 'target_instr', 'good_practices', 'precaution', 'mastery_criteria', 'gernalization_criteria')

    



  