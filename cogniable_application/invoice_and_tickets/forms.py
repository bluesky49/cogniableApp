from .models import *
from school.models import school, students, school_services
from django import forms


class InvoiceForm(forms.ModelForm):
	student = forms.ModelChoiceField(queryset=students.objects.all(), required=False)
	status = forms.ModelChoiceField(queryset=invoice_status.objects.all())
	school = forms.ModelChoiceField(queryset=school.objects.all(), required=False)
	due_date = forms.DateField(input_formats=("%m/%d/%Y", ))
	  
	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		for field in self.Meta.required:			
			self.fields[field].required = True

	class Meta:
		model = invoice
		fields = ('school', 'student', 'status', 'amount', 'due_date')
		required = ('student', 'status', 'amount', 'due_date')

class TicketForm(forms.ModelForm):
	priority = forms.ModelChoiceField(queryset=TicketPriority.objects.all())
	service = forms.ModelChoiceField(queryset=TicketService.objects.all())
	assign_to = forms.ModelChoiceField(queryset=TicketAssign.objects.all())

	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		for field in self.Meta.required:			
			self.fields[field].required = True

	class Meta:
		model = Tickets
		fields = ('subject', 'description', 'priority', 'service','assign_to')
		required = ('subject', 'description', 'priority', 'service')


 
