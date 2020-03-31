from django.conf.urls import url
from . import views
from django.urls import path
app_name = 'course_learning'

urlpatterns=[

		path('course_detail', views.course_detail, name='course_detail'),      
		path('demo', views.demo, name='demo'),      

        
 		path('module_video/', views.module_video, name='module_video'),      
        
        path('add_course', views.add_course, name='add_course'),
        path('sub_course/', views.sub_course, name='sub_course'),
        path('video_user_permission', views.video_user_permission, name='video_user_permission'),

        url(r'video_play/(?P<pk>[0-9]+)/$', views.video_play, name='video_play'),      
        
        url(r'video_url/(?P<pk>[0-9]+)/$', views.video_url, name='video_url'),
 
        ]