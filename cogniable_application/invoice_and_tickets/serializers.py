from django.contrib.auth.models import User
from rest_framework import serializers
from .models import *
from jira import JIRA
from django.conf import settings 


jira = JIRA('https://cogniable.atlassian.net', basic_auth=('kohlimanu@gmail.com', 'QbvAH5jVtFrMykcKfgq8A81E'))

# class TicketAttachments(serializers.Serializer):
#   attachment = serializers.FileField()

class TicketsSerializer(serializers.ModelSerializer):
    attachments = serializers.ListField(child=serializers.FileField())
    class Meta:
        model = Tickets
        fields = ('__all__')

    def create(self, validated_data):
        attachments = validated_data.pop('attachments')
        q_1 = Tickets.objects.create(**validated_data)

        for i in attachments:
            q_2 = TicketsAttachments.objects.create(file = i)
            q_1.attachments.add(q_2)

        if validated_data['assign_to'].id == 2:
            issue = jira.create_issue(project='COG', summary=validated_data.get('subject'), description=validated_data.get('description'), issuetype={'name': 'Bug'})
            for i in q_1.attachments.all():
                jira.add_attachment(issue=issue, attachment=str(settings.BASE_DIR)+str(i.file.url))

             
            q_1.jira_key = issue.key
            q_1.jira_id = issue.id
            q_1.save()

                 
        return q_1


class TicketsChatSerializer(serializers.ModelSerializer):
   
    class Meta:
        model = TicketChat
        fields = ('__all__')