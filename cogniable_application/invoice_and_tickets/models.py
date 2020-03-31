from django.db import models
from django.contrib.auth.models import User
from school.models import school_services, school, students

class invoice_status(models.Model):
    status_name = models.CharField(max_length=100)
    logo = models.CharField(max_length=100)
    color_code = models.CharField(max_length=100)

    def __str__(self):
        return self.status_name
 
class payment_methods(models.Model):
    method = models.CharField(max_length=100)
    def __str__(self):
        return self.method
 

class invoice_fee(models.Model):
    school_services = models.ForeignKey(school_services, on_delete=models.CASCADE)
    rate = models.FloatField()
    is_hourly_charge = models.BooleanField()
    hours = models.FloatField()
    total = models.FloatField()

    def __str__(self):
        return self.fee_name
 

class invoice(models.Model):
    invoice_no = models.CharField(max_length=20)
    school = models.ForeignKey(school, on_delete=models.CASCADE)
    student = models.ForeignKey(students, on_delete=models.CASCADE)
    status = models.ForeignKey(invoice_status, on_delete=models.CASCADE)
    issue_date = models.DateTimeField()
    due_date = models.DateTimeField()
    invoice_fee = models.ManyToManyField(invoice_fee)
    amount = models.FloatField()
    #current_payment_method=models.ForeignKey(payment_methods, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.invoice_no
 

class invoice_payment(models.Model):
    invoice = models.ForeignKey(invoice, on_delete=models.CASCADE)
    payment_method = models.ForeignKey(payment_methods, on_delete=models.CASCADE)
    amount = models.FloatField()

    def __str__(self):
        return self.payment_methods
 

class TicketPriority(models.Model):
    priority = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.priority
 

class TicketService(models.Model):
    service = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.service
 

class TicketStatus(models.Model):
    status = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.status
 


class TicketAssign(models.Model):
    team = models.CharField(max_length=200)

    def __str__(self):
        return self.team

class TicketsAttachments(models.Model):
    file = models.FileField(upload_to='ticket_attachments/')

    def __str__(self):
        return self.file

class Tickets(models.Model):
    subject = models.CharField(max_length=200 )
    description = models.TextField()
    priority = models.ForeignKey(TicketPriority, on_delete=models.CASCADE)
    service = models.ForeignKey(TicketService, on_delete=models.CASCADE)
    assign_to = models.ForeignKey(TicketAssign, related_name="ticket_team", on_delete=models.CASCADE)
    status = models.ForeignKey(TicketStatus, null=True, blank=True, on_delete=models.CASCADE)
    created_by = models.ForeignKey(User, related_name="ticket_created_by",null=True, blank=True, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now=True)
    mode = models.CharField(max_length=30, null=True, blank=True)
    user_assigned = models.CharField(max_length=30, null=True, blank=True)
    attachments = models.ManyToManyField(TicketsAttachments, null=True, blank=True)
    jira_key = models.CharField(max_length=30, null=True, blank=True)
    jira_id = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.subject} - by: {self.name}"
 


class TicketChat(models.Model):
    send_user = models.ForeignKey(User, on_delete=models.CASCADE)
    tickets = models.ForeignKey(Tickets, on_delete=models.CASCADE)
    time = models.DateTimeField()
    message = models.CharField(max_length=600)
    status = models.BooleanField(default=False)

    def __str__(self):
        return self.message
 

class TicketChatAttachments(models.Model):
    ticketchat = models.ForeignKey(TicketChat, on_delete=models.CASCADE)
    time = models.DateTimeField()
    type = models.CharField(max_length=35)
    attachment = models.FileField(upload_to='ticket_attachment/')

    def __str__(self):
        return self.time

 

 