from rest_framework import serializers
from .models import Staff, Overtime, Advance_paid, Deductions, Schedule, Payrolls, Currency

class StaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = Staff
        fields = '__all__'

class OvertimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Overtime
        fields = '__all__'

class Advance_paidSerializer(serializers.ModelSerializer):
    class Meta:
        model = Advance_paid
        fields = '__all__'


class DeductionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deductions
        fields = '__all__'


class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = '__all__'


class PayrollsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payrolls
        fields = '__all__'


class CurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Currency
        fields = '__all__'
