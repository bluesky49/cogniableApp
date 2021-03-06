# Generated by Django 3.0.4 on 2020-03-19 07:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('school', '0006_auto_20200319_0720'),
    ]

    operations = [
        migrations.CreateModel(
            name='Allergies',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('allergy_type', models.CharField(blank=True, max_length=100, null=True)),
                ('allergy_observed', models.CharField(blank=True, max_length=100, null=True)),
                ('allergy_reactions', models.CharField(blank=True, max_length=100, null=True)),
                ('allergy_since_date', models.DateField(blank=True, null=True)),
                ('note', models.CharField(blank=True, max_length=200, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='BloodPressure',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(blank=True, null=True)),
                ('systolic', models.CharField(blank=True, max_length=100, null=True)),
                ('diastolic', models.CharField(blank=True, max_length=100, null=True)),
                ('pulse', models.CharField(blank=True, max_length=100, null=True)),
                ('note', models.CharField(blank=True, max_length=200, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Cholesterol',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(blank=True, null=True)),
                ('ldl', models.CharField(blank=True, max_length=100, null=True)),
                ('hdl', models.CharField(blank=True, max_length=100, null=True)),
                ('triglycerides', models.CharField(blank=True, max_length=100, null=True)),
                ('total', models.CharField(blank=True, max_length=100, null=True)),
                ('note', models.CharField(blank=True, max_length=200, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Exercises',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(blank=True, null=True)),
                ('name', models.CharField(blank=True, max_length=100, null=True)),
                ('details', models.CharField(blank=True, max_length=200, null=True)),
                ('duration', models.CharField(blank=True, max_length=100, null=True)),
                ('distance', models.CharField(blank=True, max_length=100, null=True)),
                ('steps', models.IntegerField(blank=True, null=True)),
                ('calories', models.IntegerField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='FoodDrink',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(blank=True, null=True)),
                ('meal_name', models.CharField(blank=True, max_length=200, null=True)),
                ('meal_time', models.DateTimeField(blank=True, null=True)),
                ('meal_type', models.CharField(blank=True, max_length=100, null=True)),
                ('serving_size', models.CharField(blank=True, max_length=100, null=True)),
                ('calories', models.IntegerField(blank=True, null=True)),
                ('note', models.CharField(blank=True, max_length=200, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Immunization',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(blank=True, null=True)),
                ('status', models.CharField(blank=True, max_length=100, null=True)),
                ('vaccine', models.CharField(blank=True, max_length=100, null=True)),
                ('body_part', models.CharField(blank=True, max_length=100, null=True)),
                ('dosage', models.CharField(blank=True, max_length=100, null=True)),
                ('adverse_effect', models.CharField(blank=True, max_length=100, null=True)),
                ('note', models.CharField(blank=True, max_length=200, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Medication',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(blank=True, null=True)),
                ('last_observed_date', models.DateField(blank=True, null=True)),
                ('condition', models.CharField(blank=True, max_length=100, null=True)),
                ('medicine_details', models.CharField(blank=True, max_length=100, null=True)),
                ('strength', models.CharField(blank=True, max_length=100, null=True)),
                ('dosage', models.CharField(blank=True, max_length=100, null=True)),
                ('how_taken', models.CharField(blank=True, max_length=100, null=True)),
                ('how_often_taken', models.CharField(blank=True, max_length=100, null=True)),
                ('start_date', models.DateTimeField(blank=True, null=True)),
                ('end_date', models.DateTimeField(blank=True, null=True)),
                ('note', models.CharField(blank=True, max_length=200, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Menstruation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(blank=True, null=True)),
                ('is_first_day', models.BooleanField(default=False)),
                ('flow_amount', models.IntegerField(blank=True, null=True)),
                ('note', models.CharField(blank=True, max_length=200, null=True)),
            ],
        ),
        migrations.AddField(
            model_name='students',
            name='amount',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='students',
            name='amount_covered',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='students',
            name='amount_frequency',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='students',
            name='client_id',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='students',
            name='clinic_location',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='school.school_location'),
        ),
        migrations.AddField(
            model_name='students',
            name='date_of_diagnosis',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='students',
            name='effective_from',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='students',
            name='effective_to',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='students',
            name='height',
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AddField(
            model_name='students',
            name='ins_address',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='students',
            name='ins_city',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='students',
            name='ins_contact_name',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='students',
            name='ins_contact_phone',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='students',
            name='ins_dob',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='students',
            name='ins_firstname',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='students',
            name='ins_gender',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='students',
            name='ins_group_name',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='students',
            name='ins_insured_id',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='students',
            name='ins_lastname',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='students',
            name='ins_policy_no',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='students',
            name='ins_ssn_aadhar',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='students',
            name='ins_state',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='students',
            name='ins_zip_code',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='students',
            name='insurance_name',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='students',
            name='insurance_provider',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='students',
            name='insurance_provider2',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='students',
            name='payor_responsibility',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='students',
            name='ssn_aadhar',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='students',
            name='weight',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AddField(
            model_name='students',
            name='Immunization',
            field=models.ManyToManyField(blank=True, to='school.Immunization'),
        ),
        migrations.AddField(
            model_name='students',
            name='allergies',
            field=models.ManyToManyField(blank=True, to='school.Allergies'),
        ),
        migrations.AddField(
            model_name='students',
            name='bp',
            field=models.ManyToManyField(blank=True, to='school.BloodPressure'),
        ),
        migrations.AddField(
            model_name='students',
            name='cholesterol',
            field=models.ManyToManyField(blank=True, to='school.Cholesterol'),
        ),
        migrations.AddField(
            model_name='students',
            name='exercises',
            field=models.ManyToManyField(blank=True, to='school.Exercises'),
        ),
        migrations.AddField(
            model_name='students',
            name='food_drink',
            field=models.ManyToManyField(blank=True, to='school.FoodDrink'),
        ),
        migrations.AddField(
            model_name='students',
            name='medication',
            field=models.ManyToManyField(blank=True, to='school.Medication'),
        ),
        migrations.AddField(
            model_name='students',
            name='menstruation',
            field=models.ManyToManyField(blank=True, to='school.Menstruation'),
        ),
    ]
