from django.db import models
from django_fsm import FSMField, transition

class BlogPost(models.Model):
    state = FSMField(default='new')
