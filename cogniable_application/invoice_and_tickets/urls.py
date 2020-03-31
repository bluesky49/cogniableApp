from django.conf.urls import url
from . import views
from django.urls import path
app_name = 'project'

urlpatterns=[
        
        path('create_ticket', views.CreateTicket.as_view()),
        path('create_ticket/<int:pk>/', views.CreateTicket.as_view()),
        ]