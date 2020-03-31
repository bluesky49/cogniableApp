# Generated by Django 3.0.4 on 2020-03-12 19:42

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('target_allocate', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('school', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='students',
            name='diagnoses',
            field=models.ManyToManyField(db_table='webapp_students_diagnoses', to='target_allocate.diagnoses'),
        ),
        migrations.AddField(
            model_name='students',
            name='parent',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='students',
            name='school',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='school.school'),
        ),
        migrations.AddField(
            model_name='staff',
            name='school',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='school.school'),
        ),
        migrations.AddField(
            model_name='staff',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='staff',
            name='user_role',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='school.user_role'),
        ),
        migrations.AddField(
            model_name='school_mail',
            name='school',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='school.school'),
        ),
        migrations.AddField(
            model_name='school_details',
            name='school',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='school.school'),
        ),
        migrations.AddField(
            model_name='school_details',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='school',
            name='currency',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='school.Currency'),
        ),
        migrations.AddField(
            model_name='school',
            name='domain',
            field=models.ManyToManyField(db_table='webapp_school_domain', to='target_allocate.domain'),
        ),
        migrations.AddField(
            model_name='school',
            name='school_location',
            field=models.ManyToManyField(blank=True, db_table='webapp_school_school_location', null=True, to='school.school_location'),
        ),
        migrations.AddField(
            model_name='school',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='disable_student',
            name='student_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='school.students'),
        ),
        migrations.AddField(
            model_name='activateschool',
            name='school',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='school.school'),
        ),
    ]
