# Generated by Django 5.1.3 on 2024-11-30 22:53

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('movies', '0001_initial'),
        ('reservations', '0004_alter_seat_seat_number_alter_seat_showtime'),
    ]

    operations = [
        migrations.AddField(
            model_name='seat',
            name='screen',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.DO_NOTHING, to='movies.screen'),
        ),
        migrations.AlterField(
            model_name='seat',
            name='seat_number',
            field=models.CharField(max_length=10, unique=True),
        ),
        migrations.AlterField(
            model_name='seat',
            name='showtime',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='reservations.showtime'),
        ),
    ]
