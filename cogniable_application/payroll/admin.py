from django.contrib import admin
from .models import  Staff, Overtime, Advance_paid, Deductions, Schedule, Payrolls, Currency
from django.db import models



class PayrollsAdmin(admin.ModelAdmin):
    readonly_fields = ('net_salary',)
    
    fieldsets = [
        ('Basic Details', {'fields':['staff_name', 'month_of_salary']}),
        ('Advance Paid', {'fields': ['advance_amount']}),
        ('Deductions', {'fields': ['deduction']}),
        ('Salary', {'fields':[ 'pay_freq', 'pay_currency','basic_salary', 'net_salary']}),
    ]
    


admin.site.register(Staff)
admin.site.register(Overtime)
admin.site.register(Advance_paid)
admin.site.register(Deductions)
admin.site.register(Schedule)
admin.site.register(Payrolls, PayrollsAdmin)
admin.site.register(Currency)