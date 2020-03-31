from django.conf.urls import url
from . import views
from django.urls import path
from graphene_django.views import GraphQLView
from graphql_jwt.decorators import jwt_cookie
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

urlpatterns=[
        path('diagnoses', views.diagnoses_api.as_view()),
        path('diagnoses/<int:id>/', views.diagnoses_api.as_view()),
        path('challanges', views.challanges_api.as_view()),
        path('challanges/<int:id>/', views.challanges_api.as_view()),
        path('graphql', jwt_cookie(GraphQLView.as_view(graphiql=True))),

        path('domain', views.domain_api.as_view()),
        path('domain/<int:id>/', views.domain_api.as_view()),

        path('target_area', views.target_area_api.as_view()),
        path('target_area/<int:id>/', views.target_area_api.as_view()),

        path('target', views.target_main_api.as_view()),
        path('target/<int:id>/', views.target_main_api.as_view()),

        path('master_target', views.master_target_api.as_view()),
        path('master_target/<int:id>/', views.master_target_api.as_view()),
       
       

        ]  