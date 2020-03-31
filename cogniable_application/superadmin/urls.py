from django.conf.urls import url
from . import views
from django.urls import path
 
 
urlpatterns=[
	path('clinic_list', views.clinic_list, name='clinic_list'),
	path('clinic_counts', views.clinic_counts, name='clinic_counts'),
	path('clinic_active_inactive', views.clinic_active_inactive, name='clinic_active_inactive'),
	path('learner_active_inactive', views.learner_active_inactive, name='learner_active_inactive'),
	path('staff_active_inactive', views.staff_active_inactive, name='staff_active_inactive'),

	url(r'clinic_obj/(?P<pk>[0-9]+)/$', views.clinic_obj, name='clinic_obj'),
]