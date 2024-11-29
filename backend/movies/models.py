from django.db import models

class Movie(models.Model):
    title = models.CharField(max_length=255)
    genre = models.CharField(max_length=50, blank=True, null=True)
    duration = models.IntegerField()
    description = models.TextField(blank=True, null=True)
    age_limit = models.IntegerField()

    class Meta:
        db_table = 'movie'

    def __str__(self):
        return self.title

class Screen(models.Model):
    name = models.CharField(max_length=50, unique=True)  # 상영관 이름
    capacity = models.PositiveIntegerField()  # 좌석 수
    screen_type = models.CharField(
        max_length=20,
        choices=[
            ('Standard', 'Standard'),
            ('IMAX', 'IMAX'),
            ('3D', '3D'),
            ('4D', '4D'),
            ('RECLINER', 'Recliner'),
        ],
        default='Standard',
    )  # 상영관 유형

    class Meta:
        db_table = 'screen'  # MySQL 테이블 이름

    def __str__(self):
        return self.name