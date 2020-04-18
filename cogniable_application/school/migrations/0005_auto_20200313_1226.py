# Generated by Django 3.0.4 on 2020-03-13 12:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('target_allocate', '0001_initial'),
        ('school', '0004_auto_20200313_0628'),
    ]

    operations = [
        migrations.AlterField(
            model_name='school',
            name='domain',
            field=models.ManyToManyField(to='target_allocate.domain'),
        ),
        migrations.AlterField(
            model_name='school',
            name='school_location',
            field=models.ManyToManyField(blank=True, null=True, to='school.school_location'),
        ),
    ]