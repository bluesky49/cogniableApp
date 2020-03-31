from django.shortcuts import render
from .models import *
from django.contrib import messages
from django.db.models import Count, Avg, Q
from django.http import JsonResponse
from django.http import HttpResponse, HttpResponseRedirect 
 
import subprocess
import json
from tinytag import TinyTag
import vimeo
from django.conf import settings

def demo(request):
	v = vimeo.VimeoClient(
		    token=settings.VIMEO_ACCESS_TOKEN,
		    key=settings.VIMEO_CLIENT_ID,
		    secret=settings.VIMEO_CLIENT_SECRET
		)
	  
	about_me = v.get('/me/projects/828255/videos?sort=date&direction=desc')
	# about_me = v.get('/me/projects', params={ "per_page":100, "page": 1 })
	# 	lst = ""

	# for i in vimeo_videos.objects.all():
	# 	try:
	# 		i.name.split('Slide')[1].strip()
	# 	except:
	# 		lst += str(i.id) + "<br>"
	 
	return JsonResponse(about_me.json(), safe=False)


def course_detail(request ):
	v = vimeo.VimeoClient(
		    token=settings.VIMEO_ACCESS_TOKEN,
		    key=settings.VIMEO_CLIENT_ID,
		    secret=settings.VIMEO_CLIENT_SECRET
		)

	# course_obj = vimeo_project.objects.all()
	course_obj = sorted(vimeo_project.objects.all(), key=lambda n: (n.name.split('Module ')[1]))
	# about_me = v.get('/me/projects?sort=date&direction=desc', params={"fields": "uri, name"})

	# for i in about_me.json()['data']:
	# 	about_me2 = v.get(str(i['uri'])+str('/videos'), params={"fields": "name, link, embed.html, duration, description, pictures.sizes", "per_page":100, "page": 2 })

	# 	try:
	# 		if not vimeo_project.objects.filter(name=i['name']).exists():
	# 			q_2 = vimeo_project(name=i['name'], url=i['uri'])
	# 			q_2.save()
	# 		else:
	# 			q_2 = vimeo_project.objects.get(name=i['name'])


	# 		for x  in about_me2.json()['data']:				 
	# 			if vimeo_videos.objects.filter(project=vimeo_project.objects.get(name=i['name']), url=x['link']).exists():
	# 				q_1 = vimeo_videos.objects.filter(project=vimeo_project.objects.get(name=i['name']), url=x['link']).update(name=x['name'])


	# 				# q_1 = vimeo_videos(project=vimeo_project.objects.get(name=i['name']), url=x['link'], html=x['embed']['html'], duration=x['duration'], thub_url=x['pictures']['sizes'][2])
	# 				# q_1.save()
	# 	except:
	# 		pass
		 
	return render(request, 'course_learning/coursedetails.html', { 'course_obj':course_obj})


def video_sort(obj):
	name = obj.name
	try:		
		name_1 = int(name.split('Slide')[1].strip())
		return name_1
	except:
		try:
			name_1 = name.split('Slide')[1].strip().split("Part")[0]
			name_2 = name.split('Slide')[1].strip().split("Part")[1]
			return int(name_1) + int(name_2) *.1
		except:
			return None




def module_video(request):
	v_uri = request.GET.get('v_uri')

	# course_obj = vimeo_videos.objects.filter(project__id=v_uri)
	course_obj = sorted(vimeo_videos.objects.filter(project__id=v_uri).filter(Q(name__startswith='R') | Q(name__startswith='T') | Q(name__startswith='P')), key=video_sort)

	count_obj = vimeo_project.objects.all().annotate(sum_vid = Count('vimeo_videos__id'))
 


	# v = vimeo.VimeoClient(
	# 	    token=settings.VIMEO_ACCESS_TOKEN,
	# 	    key=settings.VIMEO_CLIENT_ID,
	# 	    secret=settings.VIMEO_CLIENT_SECRET
	# 	)
	  
	# about_me = v.get(v_uri+str('/videos?sort=default&direction=desc'), params={"fields": "name, link, embed.html, duration, pictures.sizes", "per_page":12, "page": 1 })

	return render(request, 'course_learning/modulevideos.html', { 'course_obj':course_obj, 'count_obj':count_obj})

def video_play(request, pk):
	testvideo_obj = TestVideo.objects.get(id=1)
	return render(request, 'course_learning/video_play.html', {'testvideo_obj':testvideo_obj})

def video_url(request, pk):
	course_obj = course_video.objects.get(id=pk)
	return JsonResponse({'status': 1, 'url':course_obj.video.url})

def add_course(request):
	course_status_obj = course_status.objects.all()
	return render(request, 'course_learning/add_course.html', {'course_status_obj':course_status_obj})

def sub_course(request):
	form = CourceForm(request.POST, request.FILES)

	if not form.is_valid():
		course_status_obj = course_status.objects.all()
		return render(request, 'course_learning/add_course.html', {'form':form, 'course_status_obj':course_status_obj})

	else:
		form.save(commit = False)
		form.status = course_status.objects.get(id =1)
		form.added_by = request.user		 
		form.save()

		module_name = request.POST.getlist('module_name')
		module_description = request.POST.getlist('module_description')
		module_duration = request.POST.getlist('module_duration')
		module_video = request.FILES.getlist('module_video')

		for count in range(0, len(module_name)):
			q_1 = course_video(name=module_name[count], Description=module_description[count], Duration=module_duration[count], status= course_status.objects.get(id =1), video=module_video[count])
			q_1.save()

		messages.success(request, "Cource is successfully Creatred")

		return HttpResponseRedirect('/course_learning/add_course')


def video_user_permission(request):
	user_type = request.GET.get('user_type')
	on_off = request.GET.get('on_off')

	q_1 = video_permissions.objects.get(school = request.user.school_details.school)

	if str(user_type) == 'parent':
		q_1.is_parent = True if str(on_off) == 'true' else False
		q_1.save()

	if str(user_type) == 'therapist':
		q_1.is_therapist =  True if str(on_off) == 'true' else False
		q_1.save()

	return JsonResponse({'status':1, 'message':'Status Successfullly updated'})




