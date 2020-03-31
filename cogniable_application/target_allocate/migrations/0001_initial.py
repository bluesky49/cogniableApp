# Generated by Django 3.0.4 on 2020-03-12 19:42

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django_fsm


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('school', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Additional_field',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('field_type', models.CharField(max_length=100)),
                ('field_label', models.CharField(max_length=100)),
                ('school', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='school.school')),
            ],
        ),
        migrations.CreateModel(
            name='Challanges',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=150)),
            ],
            options={
                'permissions': (('clinic_assign', 'Assign Clinic'),),
            },
        ),
        migrations.CreateModel(
            name='chat',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('time', models.DateTimeField()),
                ('message', models.CharField(max_length=600)),
                ('status', models.BooleanField(default=False)),
                ('send_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='domain',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('domain', models.CharField(max_length=150)),
            ],
            options={
                'ordering': ['id'],
                'permissions': (('clinic_assign', 'Assign Clinic'),),
            },
        ),
        migrations.CreateModel(
            name='Group_Target_Type',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('group_name', models.CharField(max_length=100)),
                ('school', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='school.school')),
            ],
        ),
        migrations.CreateModel(
            name='MasteryCriteria',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('response_percentage', models.IntegerField()),
                ('consecutive_days', models.IntegerField()),
                ('min_trial', models.IntegerField(blank=True, null=True)),
                ('is_default', models.BooleanField(default=False)),
                ('school', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='school.school')),
            ],
        ),
        migrations.CreateModel(
            name='MultipleSD',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sd', models.TextField(max_length=500)),
            ],
        ),
        migrations.CreateModel(
            name='Prerequisits',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('prerequisit', models.TextField(max_length=500)),
            ],
        ),
        migrations.CreateModel(
            name='prompt_codes',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('prompt_name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Steps',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('step', models.CharField(max_length=250)),
            ],
        ),
        migrations.CreateModel(
            name='target_allocate',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('goal_name', models.CharField(max_length=300)),
                ('time', models.DateTimeField(auto_now=True)),
                ('date', models.DateField(auto_now=True)),
                ('target_instr', models.TextField(max_length=200000)),
                ('good_practices', models.TextField(max_length=200000)),
                ('precaution', models.TextField(max_length=200000)),
                ('gernalization_criteria', models.TextField(max_length=200000)),
                ('is_cloned', models.BooleanField(default=False)),
                ('is_manual', models.BooleanField(default=False)),
                ('manual_domain', models.IntegerField(default=0, max_length=20)),
                ('mastery_criteria', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='target_allocate.MasteryCriteria')),
                ('prerequisit', models.ManyToManyField(to='target_allocate.Prerequisits')),
                ('sd', models.ManyToManyField(to='target_allocate.MultipleSD')),
                ('steps', models.ManyToManyField(to='target_allocate.Steps')),
                ('student_id', models.ForeignKey(db_column='student_id', on_delete=django.db.models.deletion.CASCADE, to='school.students')),
            ],
        ),
        migrations.CreateModel(
            name='target_area',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Area', models.CharField(max_length=150)),
            ],
            options={
                'permissions': (('clinic_assign', 'Assign Clinic'),),
            },
        ),
        migrations.CreateModel(
            name='target_main',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('target_name', models.CharField(max_length=300)),
            ],
            options={
                'permissions': (('clinic_assign', 'Assign Clinic'),),
            },
        ),
        migrations.CreateModel(
            name='target_status',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status_name', models.CharField(max_length=70)),
                ('color_code', models.CharField(max_length=70)),
            ],
        ),
        migrations.CreateModel(
            name='targets',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('peakvar_id', models.CharField(blank=True, max_length=100, null=True)),
                ('vbmappvar_id', models.CharField(blank=True, max_length=100, null=True)),
                ('abllsvar_id', models.CharField(blank=True, max_length=100, null=True)),
                ('target_instr', models.TextField(max_length=200000)),
                ('good_practices', models.TextField(max_length=200000)),
                ('precaution', models.TextField(max_length=200000)),
                ('status', models.CharField(max_length=10)),
                ('mastery_criteria', models.CharField(blank=True, max_length=10, null=True)),
                ('gernalization_criteria', models.TextField(max_length=200000)),
                ('peak_direct', models.CharField(blank=True, max_length=100, null=True)),
                ('peak_generalization', models.CharField(blank=True, max_length=100, null=True)),
                ('peak_transformation', models.CharField(blank=True, max_length=100, null=True)),
                ('peak_equivalence', models.CharField(blank=True, max_length=100, null=True)),
                ('domain', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='target_allocate.domain')),
                ('prerequisit', models.ManyToManyField(to='target_allocate.Prerequisits')),
                ('sd', models.ManyToManyField(to='target_allocate.MultipleSD')),
                ('target_area', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='target_allocate.target_area')),
                ('target_main', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='target_allocate.target_main')),
            ],
        ),
        migrations.CreateModel(
            name='target_type',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type_tar', models.CharField(max_length=100)),
                ('additional_field', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='target_allocate.Additional_field')),
                ('group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='target_allocate.Group_Target_Type')),
                ('school', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='school.school')),
            ],
        ),
        migrations.CreateModel(
            name='target_Status_date',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('time', models.DateTimeField(auto_now=True)),
                ('date', models.DateField(auto_now=True)),
                ('target_allocate_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='target_allocate.target_allocate')),
                ('target_status_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='target_allocate.target_status')),
                ('user_id', models.ForeignKey(db_column='user_id', on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='target_area',
            name='target_main',
            field=models.ManyToManyField(to='target_allocate.target_main'),
        ),
        migrations.AddField(
            model_name='target_allocate',
            name='target_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='target_allocate.targets'),
        ),
        migrations.AddField(
            model_name='target_allocate',
            name='target_status',
            field=django_fsm.FSMKeyField(on_delete=django.db.models.deletion.CASCADE, to='target_allocate.target_status'),
        ),
        migrations.AddField(
            model_name='target_allocate',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='program_videos',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('video_size', models.CharField(max_length=50)),
                ('videofile', models.FileField(upload_to='videos/')),
                ('targets_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='target_allocate.targets')),
            ],
        ),
        migrations.CreateModel(
            name='program_links',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('link', models.URLField(max_length=250)),
                ('targets_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='target_allocate.targets')),
            ],
        ),
        migrations.CreateModel(
            name='program_documents',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('doc_size', models.CharField(max_length=50)),
                ('docfile', models.FileField(upload_to='documents/')),
                ('upload_time', models.DateTimeField()),
                ('targets_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='target_allocate.targets')),
            ],
        ),
        migrations.CreateModel(
            name='MasterSD',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(auto_now=True)),
                ('time', models.DateTimeField(auto_now=True)),
                ('sdSelected', models.ManyToManyField(to='target_allocate.MultipleSD')),
                ('target_id', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='target_allocate.target_allocate')),
            ],
        ),
        migrations.CreateModel(
            name='LearnerMasteryCriteria',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_default', models.BooleanField(default=False)),
                ('mastery_criteria', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='target_allocate.MasteryCriteria')),
                ('students', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='school.students')),
            ],
        ),
        migrations.AddField(
            model_name='domain',
            name='target_area',
            field=models.ManyToManyField(to='target_allocate.target_area'),
        ),
        migrations.CreateModel(
            name='diagnoses',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=150)),
                ('challanges', models.ManyToManyField(to='target_allocate.Challanges')),
                ('school', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='school.school')),
            ],
            options={
                'permissions': (('clinic_assign', 'Assign Clinic'),),
            },
        ),
        migrations.CreateModel(
            name='cross_operate',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('time', models.DateTimeField(auto_now=True)),
                ('target', models.ManyToManyField(to='target_allocate.target_allocate')),
                ('target_main', models.OneToOneField(db_column='main_target', on_delete=django.db.models.deletion.CASCADE, related_name='target_main', to='target_allocate.target_allocate')),
            ],
        ),
        migrations.CreateModel(
            name='chat_attachments',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('time', models.DateTimeField()),
                ('type', models.CharField(max_length=35)),
                ('attachment', models.FileField(upload_to='chat_attachment/')),
                ('chat', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='target_allocate.chat')),
            ],
        ),
        migrations.AddField(
            model_name='chat',
            name='target',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='target_allocate.target_allocate'),
        ),
        migrations.AddField(
            model_name='challanges',
            name='domain',
            field=models.ManyToManyField(to='target_allocate.domain'),
        ),
        migrations.CreateModel(
            name='AllocatedTargetEditDate',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('time', models.DateTimeField(auto_now=True)),
                ('targets', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='target_allocate.target_allocate')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='allocated_target_videos',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('video_size', models.CharField(max_length=50)),
                ('videofile', models.FileField(upload_to='allocated_target/')),
                ('target_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='target_allocate.target_allocate')),
            ],
        ),
        migrations.CreateModel(
            name='allocated_target_link',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('link', models.URLField(max_length=250)),
                ('target_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='target_allocate.target_allocate')),
            ],
        ),
        migrations.CreateModel(
            name='allocated_target_documents',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('document_size', models.CharField(max_length=50)),
                ('docfile', models.FileField(upload_to='allocated_target/')),
                ('target_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='target_allocate.target_allocate')),
            ],
        ),
        migrations.CreateModel(
            name='target_allcated_details',
            fields=[
                ('target_allocate_id', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='target_allocate.target_allocate')),
                ('mastery_type', models.CharField(max_length=30)),
                ('target_name', models.CharField(max_length=300)),
                ('Prompt_Sch', models.CharField(max_length=50)),
                ('date_baseline', models.DateTimeField(blank=True, null=True)),
                ('Daily_Trials', models.IntegerField()),
                ('consecutive_days', models.IntegerField()),
                ('trial_independence', models.CharField(max_length=10)),
                ('time', models.DateTimeField(auto_now=True)),
                ('prompt_codes', models.ManyToManyField(to='target_allocate.prompt_codes')),
                ('target_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='target_allocate.target_type')),
            ],
        ),
    ]
