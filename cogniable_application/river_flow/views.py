from django.shortcuts import render
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib import messages
from django.http import JsonResponse
from django.contrib.auth.decorators import permission_required

def demo(request):
	return HttpResponse("dvgfdv")
