from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django_fsm import FSMField, transition, FSMKeyField
# from school.models import school
# from viewflow.models import Process

# class HelloWorldProcess(Process):
#     text = models.CharField(max_length=150)
#     approved = models.BooleanField(default=False)


class target_main(models.Model):
    target_name = models.CharField(max_length=300)
    def __str__(self):
        return self.target_name

    class Meta:
        permissions = (
            ('clinic_assign', 'Assign Clinic'),
        ) 

class target_area(models.Model):
    Area = models.CharField(max_length=150)
    target_main = models.ManyToManyField(target_main )
    def __str__(self):
        return self.Area


    class Meta:  

       permissions = (
            ('clinic_assign', 'Assign Clinic'),
        )

class domain(models.Model):
    domain = models.CharField(max_length=150)
    target_area = models.ManyToManyField(target_area )
    
    def __str__(self):
        return self.domain
    @property
    def short_domain(self):
        return '%s' % (self.domain)
 
    class Meta:
       ordering = ['id']
       
       permissions = (
            ('clinic_assign', 'Assign Clinic'),
        )


class Challanges(models.Model):
    name = models.CharField(max_length=150)
    domain = models.ManyToManyField(domain )
    def __str__(self):
        return self.name

    class Meta:
       permissions = (
            ('clinic_assign', 'Assign Clinic'),
        )


class diagnoses(models.Model):
    name = models.CharField(max_length=150)
    challanges = models.ManyToManyField(Challanges )
    school = models.ForeignKey('school.school', related_name='diagnoses',blank=True, null=True, on_delete=models.CASCADE)

    def __str__(self):
        return self.name 
    class Meta:       
       permissions = (
            ('clinic_assign', 'Assign Clinic'),
        )


class MultipleSD(models.Model):
    sd = models.TextField(max_length=500)
    def __str__(self):
        return self.sd
   
class Prerequisits(models.Model):
    prerequisit = models.TextField(max_length=500)
    def __str__(self):
        return self.prerequisit
   

class targets(models.Model):
    domain = models.ForeignKey(domain, on_delete=models.CASCADE)
    target_area = models.ForeignKey(target_area, on_delete=models.CASCADE)
    target_main = models.ForeignKey(target_main, on_delete=models.CASCADE)
    peakvar_id = models.CharField(max_length=100, blank=True, null=True)
    vbmappvar_id = models.CharField(max_length=100, blank=True, null=True)
    abllsvar_id = models.CharField(max_length=100, blank=True, null=True)
    sd = models.ManyToManyField(MultipleSD )
    prerequisit = models.ManyToManyField(Prerequisits )
    target_instr = models.TextField(max_length=200000)
    good_practices = models.TextField(max_length=200000)
    precaution = models.TextField(max_length=200000)
    status = models.CharField(max_length=10)
    mastery_criteria = models.CharField(max_length=10,blank=True,null=True)
    gernalization_criteria = models.TextField(max_length=200000)
    peak_direct = models.CharField(max_length=100,blank=True,null=True)
    peak_generalization = models.CharField(max_length=100,blank=True,null=True)
    peak_transformation = models.CharField(max_length=100,blank=True,null=True)
    peak_equivalence = models.CharField(max_length=100,blank=True,null=True)
    
    def __str__(self):
        return '{}'.format(self.target_main.target_name)
        # return str(self.id)
  

class program_videos(models.Model):
    targets_id =  models.ForeignKey(targets, on_delete=models.CASCADE)
    video_size = models.CharField(max_length=50)
    videofile = models.FileField(upload_to='videos/')
    def __str__(self):
        return self.targets_id
 

class program_documents(models.Model):
    targets_id =  models.ForeignKey(targets, on_delete=models.CASCADE)
    doc_size = models.CharField(max_length=50)
    docfile = models.FileField(upload_to='documents/')
    upload_time = models.DateTimeField()

    def __str__(self):
        return self.targets_id
 

class program_links(models.Model):
    targets_id =  models.ForeignKey(targets, on_delete=models.CASCADE)
    link = models.URLField(max_length=250)

    def __str__(self):
        return self.link

class Group_Target_Type(models.Model):
    group_name = models.CharField(max_length=100)
    school = models.ForeignKey('school.school', on_delete=models.CASCADE)

    def __str__(self):
        return self.group_name

class Additional_field(models.Model):
    field_type = models.CharField(max_length=100)
    field_label = models.CharField(max_length=100)
    school = models.ForeignKey('school.school', on_delete=models.CASCADE)

    def __str__(self):
        return self.group_name
       
class target_type(models.Model):
    type_tar = models.CharField(max_length=100)
    additional_field = models.ForeignKey(Additional_field, on_delete=models.CASCADE)
    group = models.ForeignKey(Group_Target_Type, on_delete=models.CASCADE)
    school = models.ForeignKey('school.school', on_delete=models.CASCADE)

    def __str__(self):
        return self.type_tar

    class Meta:
        db_table = 'target_allocate_target_type1'



  

class target_status(models.Model):
    status_name = models.CharField(max_length=70)
    color_code = models.CharField(max_length=70)

    def __str__(self):
        return self.status_name
   
       
class Steps(models.Model):
    step = models.CharField(max_length=250)

    def __str__(self):
        return str(self.step)
   
class prompt_codes(models.Model):
    prompt_name = models.CharField(max_length=100)
    def __str__(self):
        return self.prompt_name
   


class target_filter(models.Manager):
  def get_queryset(self):
    return super().get_queryset().exclude(target_status__id=6)
 


class MasteryCriteria(models.Model):
  response_percentage = models.IntegerField()
  consecutive_days = models.IntegerField()
  min_trial =  models.IntegerField(null=True, blank=True)
  school = models.ForeignKey('school.school', on_delete=models.CASCADE)
  is_default = models.BooleanField(default=False)

  def __str__(self):
    return str(self.response_percentage)
 

class LearnerMasteryCriteria(models.Model):
  mastery_criteria = models.ForeignKey(MasteryCriteria, on_delete=models.CASCADE)
  students = models.ForeignKey('school.students', on_delete=models.CASCADE)
  is_default = models.BooleanField(default=False)

  def __str__(self):
    return str(self.is_default)



class target_allocate(models.Model):
    target_id = models.ForeignKey(targets, on_delete=models.CASCADE)
    student_id = models.ForeignKey('school.students',  db_column='student_id',  on_delete=models.CASCADE)
    target_status = models.ForeignKey(target_status, on_delete=models.CASCADE)
    goal_name = models.CharField(max_length=300)
    sd = models.ManyToManyField(MultipleSD)
    prerequisit = models.ManyToManyField(Prerequisits)
    steps = models.ManyToManyField(Steps)
    time = models.DateTimeField(auto_now=True)
    date = models.DateField(auto_now=True)
    target_instr = models.TextField(max_length=200000, null=True)
    good_practices = models.TextField(max_length=200000, null=True)
    precaution = models.TextField(max_length=200000, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    mastery_criteria = models.ForeignKey(MasteryCriteria, on_delete=models.CASCADE) 
    gernalization_criteria = models.TextField(max_length=200000)
    is_cloned = models.BooleanField(default=False)
    is_manual =  models.BooleanField(default=False)
    manual_domain = models.IntegerField(max_length=20, default=0)

    objects = target_filter()

    def __str__(self):
        return str(self.goal_name)

    @transition(field=target_status, source=1, target=2)
    def publish(self):
      print("fvbdfb")
         

    @property
    def date_allocate(self):
        return '%s-%s-%s' % (self.time.day, self.time.month, self.time.year)

    @property
    def target_name(self):
        return self.target_allcated_details.target_name
 
 
 
class MasterSD(models.Model): 
    target_id=models.OneToOneField(target_allocate, on_delete=models.CASCADE)
    sdSelected=models.ManyToManyField(MultipleSD)
    date = models.DateField(auto_now=True)
    time = models.DateTimeField(auto_now=True)


class target_allcated_details(models.Model):
    target_allocate_id = models.OneToOneField(target_allocate, on_delete=models.CASCADE, primary_key=True)
    mastery_type= models.CharField(max_length=30)
    target_name= models.CharField(max_length=300)
    Prompt_Sch = models.CharField(max_length=50)
    date_baseline= models.DateTimeField(blank=True, null=True)
    Daily_Trials = models.IntegerField()
    consecutive_days= models.IntegerField()
    target_type = models.ForeignKey(target_type, on_delete=models.CASCADE)
    prompt_codes = models.ManyToManyField(prompt_codes)
    trial_independence= models.CharField(max_length=10)
    time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.target_name
  



class allocated_target_videos(models.Model):
    target_id = models.ForeignKey(target_allocate, on_delete=models.CASCADE)
    video_size = models.CharField(max_length=50)
    videofile = models.FileField(upload_to='allocated_target/')
    def __str__(self):
        return self.target_id.target_allcated_details.target_name
 

class allocated_target_documents(models.Model):
    target_id = models.ForeignKey(target_allocate, on_delete=models.CASCADE)
    document_size = models.CharField(max_length=50)
    docfile = models.FileField(upload_to='allocated_target/')
    def __str__(self):
        return self.target_id.target_allcated_details.target_name
 

class allocated_target_link(models.Model):
    target_id = models.ForeignKey(target_allocate, on_delete=models.CASCADE)
    link = models.URLField(max_length=250)
    def __str__(self):
        return self.link
 

class cross_operate(models.Model):
    target_main = models.OneToOneField(target_allocate, db_column='main_target', related_name='target_main', on_delete=models.CASCADE)
    target = models.ManyToManyField(target_allocate)
    time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return 'gfchdf'
 

class chat(models.Model):
    send_user = models.ForeignKey(User, on_delete=models.CASCADE)
    target = models.ForeignKey(target_allocate, on_delete=models.CASCADE)
    time = models.DateTimeField()
    message = models.CharField(max_length=600)
    status = models.BooleanField(default=False)

    def __str__(self):
        return self.message
 

class chat_attachments(models.Model):
    chat = models.ForeignKey(chat, on_delete=models.CASCADE)
    time = models.DateTimeField()
    type = models.CharField(max_length=35)
    attachment = models.FileField(upload_to='chat_attachment/')

    def __str__(self):
        return self.time
 

class target_Status_date(models.Model):
    target_allocate_id = models.ForeignKey(target_allocate, on_delete=models.CASCADE)
    target_status_id = models.ForeignKey(target_status, on_delete=models.CASCADE)
    time= models.DateTimeField(auto_now=True)
    date = models.DateField(auto_now=True)
    user_id = models.ForeignKey(User,  db_column='user_id',  on_delete=models.CASCADE)


    def __str__(self):
        return '%s'%(self.target_allocate_id)


class AllocatedTargetEditDate(models.Model):
    targets =  models.ForeignKey(target_allocate,  on_delete=models.CASCADE)
    user = models.ForeignKey(User,  on_delete=models.CASCADE)
    time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.targets
