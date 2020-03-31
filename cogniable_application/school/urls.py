from django.conf.urls import url
from . import views
from django.urls import path
from graphene_django.views import GraphQLView
from graphql_jwt.decorators import jwt_cookie
 
urlpatterns=[
        path('demo', views.demo2, name='demo'),
        path('country_list', views.country_list, name='country_list'),
        path('dash_data', views.dash_data, name='dash_data'),
        path('token_genrate', views.token_genrate, name='token_genrate'),
        # path('graphql', GraphQLView.as_view(graphiql=True, schema=schema)),
        path('graphql', jwt_cookie(GraphQLView.as_view(graphiql=True))),
        
        # Learner and Staff API
		path('learners/', views.learners_api.as_view()),
        path('learners/<int:id>/', views.learners_api.as_view()),

        path('learners/<int:pk>/<str:model_name>/', views.get_learner_data.as_view()),
        path('learners/<int:pk>/<str:model_name>/<int:id>/', views.change_learner_data.as_view()),
        
        path('staff/', views.staff_api.as_view()),
        path('staff/<int:id>/', views.staff_api.as_view()), 

        path('category_list', views.category_list, name='category_list'),
        path('school_locations_list', views.school_locations_list, name='school_locations_list'),

        path('create_learner/', views.create_learner_api.as_view()),

    ]