from django.db import models
import datetime


GENDER_CHOICES = (
    (0, 'male'),
    (1, 'female'),
    (2, 'not specified'),
)


MONTH_CHOICES = (
    ('select', 'SELECT MONTH'),
    ('JAN', 'JANUARY'),
    ('FEB', 'FEBURARY'),
    ('MAR', 'MARCH'),
    ('APR', 'APRIL'),
    ('MAY', 'MAY'),
    ('JUN', 'JUNE'),
    ('JUL', 'JULY'),
    ('AUG', 'AUGUST'),
    ('SEP', 'SEPTEMBER'),
    ('OCT', 'OCTOBER'),
    ('NOV', 'NOVEMBER'),
    ('DEC', 'DECEMBER'),

)

PAY_FREQ = (
    ('twice', 'SEMI-MONTHLY'),
    ('once', 'MONTHLY'),
)


class Staff(models.Model):

    name = models.CharField(max_length=120)
    gender = models.IntegerField(choices=GENDER_CHOICES, default=2)
    email = models.EmailField(max_length=100)
    phone = models.IntegerField(verbose_name='Mobile Number')
    pan = models.CharField(max_length=15, verbose_name='PAN Number')
    date_joined = models.DateField(default=datetime.date.today, verbose_name="date of joining")
    

    def __str__(self):
        return f"{self.name}"


class Overtime(models.Model):
    employee = models.ForeignKey(Staff, on_delete=models.CASCADE, related_name='Name')
    date = models.DateField(default=datetime.date.today, verbose_name='Date')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    def __str__(self):
        return f"{self.employee} from {self.start_time} to {self.end_time}"


class Advance_paid(models.Model):
    name = models.ForeignKey(Staff, on_delete=models.CASCADE)
    advance_amount = models.IntegerField()
    month = models.CharField(max_length=18, choices=MONTH_CHOICES, default='select')

    def __str__(self):
        return f'{self.name}-{self.advance_amount}'


class Deductions(models.Model):
    desciption = models.TextField()
    amount = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.desciption}({self.amount})"


class Schedule(models.Model):
    from_time = models.TimeField()
    to_time = models.TimeField()

    def __str__(self):
        return f"{self.from_time} to {self.to_time}"


class Currency(models.Model):
    salary_currency = models.CharField(max_length=20, verbose_name='Currency')

    def __str__(self):
        return self.salary_currency


class Payrolls(models.Model):
    staff_name = models.ForeignKey(Staff,on_delete=models.CASCADE)
    month_of_salary = models.CharField(max_length=20,choices=MONTH_CHOICES, default='select', verbose_name="Month")
    pay_freq = models.CharField(max_length=10, choices=PAY_FREQ, default='once', verbose_name='Pay Frequency')
    pay_currency = models.ForeignKey(Currency, on_delete=models.CASCADE, related_name='Currency', null=True)
    basic_salary = models.IntegerField(verbose_name='Salary/month')
    advance_amount = models.ForeignKey(Advance_paid,on_delete=models.CASCADE, null=True)
    deduction = models.ForeignKey(Deductions, on_delete=models.CASCADE, null=True)


    def salary(self):
        a = self.basic_salary
        b = self.advance_amount.advance_amount
        c = self.deduction.amount
        if b>0 and c>0:
            return a - (b + c)
        elif b>0:
            return a - b
        else:
            return a - c
        

    net_salary = property(salary)

    
    def __str__(self):
        return  f"{self.staff_name}"


