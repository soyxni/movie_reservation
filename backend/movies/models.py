from django.db import models
from django.apps import apps  # 지연 참조를 위한 import

class Movie(models.Model):
    title = models.CharField(max_length=255)
    genre = models.CharField(max_length=50, blank=True, null=True)
    duration = models.IntegerField()
    description = models.TextField(blank=True, null=True)
    age_limit = models.IntegerField()

    class Meta:
        managed = False
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
        managed = False
        db_table = 'screen'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)  # 기존 저장 로직 호출

        # `Seat` 모델을 지연 참조로 가져옴
        Seat = apps.get_model('reservations', 'Seat')

        # 좌석 자동 생성
        rows = "ABCDEFGHIJKL"  # A~L (12행)
        columns = 20  # 1~20 (20열)
        for row in rows:
            for column in range(1, columns + 1):
                seat_number = f"{row}{column}"
                Seat.objects.get_or_create(screen=self, seat_number=seat_number)
