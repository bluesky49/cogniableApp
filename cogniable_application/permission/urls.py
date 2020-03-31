from django.conf.urls import url
from . import views
from django.urls import path
app_name = 'menu'
from . import views


urlpatterns=[
 		path('menu', views.Menu.as_view()),
 		path('group', views.App_Group.as_view()),
 		path('group/<int:id>/', views.App_Group.as_view()),
 		
 		path('permissions', views.Permissions.as_view()),
        
        ]