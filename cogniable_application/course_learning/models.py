from django.db import models
from django.contrib.auth.models import User
from school.models import students
from target_allocate.models import target_allocate

class vimeo_project(models.Model):
	name = models.CharField(max_length=1000)
	url = models.CharField(max_length=1000)

	def __str__(self):
		return self.name



   

class vimeo_videos(models.Model):
	project = models.ForeignKey(vimeo_project, on_delete=models.CASCADE)
	name = models.CharField(max_length=1000)
	url = models.CharField(max_length=1000)
	html = models.CharField(max_length=1000)
	duration = models.CharField(max_length=1000)
	thub_url = models.CharField(max_length=1000)
	description =  models.CharField(max_length=1000)

	def __str__(self):
		return self.name