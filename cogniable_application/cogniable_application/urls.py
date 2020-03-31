"""cogniable_application URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf.urls import url
from django.conf.urls import include
# import follow.views
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
# from payroll.views import StaffViewset, OvertimeViewset,Advance_paidViewset, DeductionsViewset, ScheduleViewset, PayrollsViewset, CurrencyViewset
from django.conf import settings
from django.conf.urls import url, include
from django.conf.urls.static import static
from rest_framework import permissions
from django.conf.urls import url
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from graphene_django.views import GraphQLView
from graphql_jwt.decorators import jwt_cookie
# router = routers.DefaultRouter()
# router.register(r'staff', StaffViewset, 'staff')
# router.register(r'overtime', OvertimeViewset, 'overtime')
# router.register(r'advance', Advance_paidViewset, 'advance')
# router.register(r'deductions', DeductionsViewset, 'deductions')
# router.register(r'payroll', PayrollsViewset, 'payroll')
# router.register(r'currency', CurrencyViewset, 'currency')

schema_view = get_schema_view(
   openapi.Info(
      title="Cogniable React Application API",
      default_version='v1',
      description="These Api's are for React Application",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="yaghdev.paliwal@cogniable.tech"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
path('apis/', include([
    path('admin/', admin.site.urls),
    path('invoice_and_tickets/', include('invoice_and_tickets.urls')),
    path('school/', include('school.urls')),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('graphql', jwt_cookie(GraphQLView.as_view(graphiql=True))),
    # path('payroll/', include(router.urls)),
    path('target_allocate/', include('target_allocate.urls')),
    path('permission/', include('permission.urls')),
    path('administrative/', include('administrative.urls')),
    path('chat/', include('chat.urls')),
     # path('workflow/', include('myflow.urls')),

    
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=None), name='schema-swagger-ui'),
  
     
]))]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
