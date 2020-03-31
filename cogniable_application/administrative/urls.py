from django.conf.urls import url
from . import views
from django.urls import path
from .views import reset_password_request_token, reset_password_confirm
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
app_name = "administrative"
 
urlpatterns=[
        path('login/', views.Login_Api.as_view() ),
        path('forgotpass/', reset_password_request_token, name="reset-password-request"),
        path('sign_up/', views.sign_up, name='sign_up' ),
        url(r'^key/(?P<confirmation_key>\w+)/$', views.confirm_email, name='confirm_email'),
         path('confirm/', reset_password_confirm, name="reset-password-confirm"), 
        
        path('celery_test/', views.celery_test, name='celery_test'),
    	path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    	path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    	 
    	path('new_clinics', views.new_clinics, name='new_clinics'),
    	path('userlogs', views.userlogs, name='userlogs'),
        ]