from django.contrib import admin
from .models import *

admin.site.register(TicketPriority)
admin.site.register(TicketStatus)
admin.site.register(TicketService)
admin.site.register(Tickets)
admin.site.register(payment_methods)
admin.site.register(TicketAssign)
admin.site.register(invoice)
admin.site.register(TicketChat)