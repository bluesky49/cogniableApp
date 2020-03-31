from django.contrib import admin
from .models import *
from django.contrib.auth.models import Permission
from django.contrib.admin.models import LogEntry

admin.site.register(Menu_level_1)
admin.site.register(Menu_level_2)
admin.site.register(Menu_level_3)
admin.site.register(Custom_Permission)


 