# Generated by Django 3.0.4 on 2020-03-24 07:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('school', '0008_auto_20200324_0748'),
    ]

    operations = [
        migrations.AlterField(
            model_name='school_location',
            name='state',
            field=models.CharField(choices=[('Open', 'Open'), ('In Progress', 'In Progress'), ('Resolved', 'Resolved'), ('Re Opened', 'Re Opened'), ('Closed', 'Closed')], default=('Open', 'Open'), max_length=200),
        ),
    ]
