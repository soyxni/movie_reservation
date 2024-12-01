# Generated by Django 5.1.3 on 2024-11-30 21:59

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Movie',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('genre', models.CharField(blank=True, max_length=50, null=True)),
                ('duration', models.IntegerField()),
                ('description', models.TextField(blank=True, null=True)),
                ('age_limit', models.IntegerField()),
            ],
            options={
                'db_table': 'movie',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Screen',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, unique=True)),
                ('capacity', models.PositiveIntegerField()),
                ('screen_type', models.CharField(choices=[('Standard', 'Standard'), ('IMAX', 'IMAX'), ('3D', '3D'), ('4D', '4D'), ('RECLINER', 'Recliner')], default='Standard', max_length=20)),
            ],
            options={
                'db_table': 'screen',
                'managed': False,
            },
        ),
    ]