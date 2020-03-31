from django.shortcuts import render
from rest_framework import viewsets
from .models import Staff, Overtime, Advance_paid, Deductions, Schedule, Payrolls, Currency
from .serializers import OvertimeSerializer, Advance_paidSerializer, StaffSerializer, DeductionsSerializer, ScheduleSerializer, PayrollsSerializer, CurrencySerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAdminUser


class StaffViewset(viewsets.ModelViewSet):
    serializer_class = StaffSerializer
    queryset = Staff.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['name', 'email', 'date_joined']
    permission_classes = [IsAdminUser,]


class OvertimeViewset(viewsets.ModelViewSet):
    serializer_class = OvertimeSerializer
    queryset = Overtime.objects.all()
    permission_classes = [IsAdminUser,]


class Advance_paidViewset(viewsets.ModelViewSet):
    serializer_class = Advance_paidSerializer
    queryset = Advance_paid.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['name', 'advance_amount', 'month']
    permission_classes = [IsAdminUser,]


class DeductionsViewset(viewsets.ModelViewSet):
    serializer_class = DeductionsSerializer
    queryset = Deductions.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['name', 'amount']
    permission_classes = [IsAdminUser,]

class ScheduleViewset(viewsets.ModelViewSet):
    serializer_class = ScheduleSerializer
    queryset = Schedule.objects.all()
    permission_classes = [IsAdminUser,]


class PayrollsViewset(viewsets.ModelViewSet):
    serializer_class = PayrollsSerializer
    queryset = Payrolls.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['staff_name', 'month_of_salary', 'pay_freq']
    permission_classes = [IsAdminUser,]

class CurrencyViewset(viewsets.ModelViewSet):
    serializer_class = CurrencySerializer
    queryset = Currency.objects.all()
    permission_classes = [IsAdminUser,]