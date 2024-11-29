from django.db import models

class User(models.Model):
    ROLE_CHOICES = [
        ('Customer', 'Customer'),
        ('Staff', 'Staff'),
    ]

    STAFF_ROLE_CHOICES = [
        ('Manager', 'Manager'),
        ('Staff', 'Staff'),
    ]

    email = models.CharField(unique=True, max_length=255)
    password = models.CharField(max_length=255)
    name = models.CharField(max_length=100)
    phone = models.CharField(unique=True, max_length=15)
    birth_date = models.DateField()
    role = models.CharField(max_length=8, choices=ROLE_CHOICES)  # 역할 선택
    points = models.IntegerField(blank=True, null=True, default=0)
    staff_role = models.CharField(max_length=7, choices=STAFF_ROLE_CHOICES, blank=True, null=True)  # 직책 선택

    class Meta:
        db_table = 'user'

