# Generated by Django 3.0.4 on 2020-03-13 06:28

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('school', '0003_country_db_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='school',
            name='country',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='school.Country'),
        ),
    ]
