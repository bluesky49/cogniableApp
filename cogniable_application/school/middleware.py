import pytz
from django.http import JsonResponse
from django.http import HttpResponse, HttpResponseRedirect
from django.utils import timezone
from school.models import Country
from django.utils.deprecation import MiddlewareMixin
from rest_framework import status
from django.conf import settings 
from django.db import router
import threading
from school.models import UserDb
from django.http import Http404
from django.contrib.sessions.models import Session

request_cfg = threading.local()

class TimezoneMiddleware(MiddlewareMixin):
    def process_request(self, request):
        #tzname = request.session.get('django_timezone', None)
        tzname = None
         
        if tzname:
            timezone.activate(pytz.timezone(tzname))
        else:
            timezone.deactivate()



class MultiDbRouterMiddleware(MiddlewareMixin):
    def process_view(self, request, view_func, args, kwargs):
       
        if True:           
            database = request.headers.get('database', None) 
            
            if database is None:
                return JsonResponse({'error':[ {'message':'Provide correct parameter "database" in header'}]} , status=200)

            if Country.objects.using('india').filter(db_name=database).exists():
                request_cfg.db = database            
                request.SELECTED_DATABASE = request_cfg.db

            else:
                return JsonResponse({'error':[ {'message':'Provide correct parameter "database" in header'}]} , status=200)
                # request_cfg.db = settings.DEFAULT_COUNTRY_DATABASE            
                # request.SELECTED_DATABASE = request_cfg.db
 
        # else:             
        #     country = request.headers.get('country', None)     
        #     database = UserDb(country)
 
        #     if database:
        #         request_cfg.db = database            
        #         request.SELECTED_DATABASE = request_cfg.db

        #     else:               
        #         return JsonResponse({'error':[ {'message':'Provide correct parameter "country" in header'}]} , status=200)




    def process_response(self, request, response):
        if hasattr(request_cfg, 'db'):
            del request_cfg.db
        return response
 

class MultiDbRouter(object):
    def _multi_db(self):
        from django.conf import settings
        if hasattr(request_cfg, 'db'):            
            if request_cfg.db in settings.DATABASES:
                return request_cfg.db
            else:
                raise Http404
        else:
            return JsonResponse({'error':[ {'message':'User database is not provided in header, please login again'}]}, status=403)

    def db_for_read(self, model, **hints):
        return self._multi_db()

    db_for_write = db_for_read 
#           