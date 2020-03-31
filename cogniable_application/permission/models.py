from django.db import models
from django.contrib.auth.models import Permission
from django.contrib.auth.models import Group, User
from school.models import school


class Custom_Permission(models.Model):
    permission = models.OneToOneField(Permission, on_delete=models.CASCADE)
    name = models.CharField(max_length=250, null=True) 
    is_active = models.BooleanField(default=True)
    default_admin = models.BooleanField(default=False)
    default_back_office = models.BooleanField(default=False)
    default_bcba = models.BooleanField(default=False)
    default_bcaba = models.BooleanField(default=False)
    default_technician = models.BooleanField(default=False)

    def __str__(self):
        return self.permission

    

class School_Group(models.Model):
    group = models.OneToOneField(Group, on_delete=models.CASCADE)
    school = models.ForeignKey(school, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.group
 

class Menu_level_1(models.Model):
    menu_name = models.CharField(max_length=100)
    url = models.CharField(max_length=250, null=True)
    logo = models.CharField(max_length=250, null=True)
    order = models.IntegerField()
   
    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.menu_name

   
class Menu_level_2(models.Model):
    parent_menu = models.ForeignKey(Menu_level_1, on_delete=models.CASCADE)
    menu_name = models.CharField(max_length=100)
    url = models.CharField(max_length=250, null=True)
    permission = models.ManyToManyField(Permission, null=True, blank=True)
    logo = models.CharField(max_length=250, null=True)
    order = models.IntegerField()
   
    def __str__(self):
        return self.menu_name
    class Meta:
        ordering = ['order']

  

class Menu_level_3(models.Model):
    parent_menu = models.ForeignKey(Menu_level_2, on_delete=models.CASCADE)
    menu_name = models.CharField(max_length=100)
    url = models.CharField(max_length=250)
    logo = models.CharField(max_length=250, null=True)
    permission = models.ManyToManyField(Permission, null=True, blank=True)
    order = models.IntegerField()
    
    def __str__(self):
        return self.menu_name
    class Meta:
        ordering = ['order']

 