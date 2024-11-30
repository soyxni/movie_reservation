from django.db import models
from users.models import User  # User 모델이 있는 경로를 정확히 명시
from movies.models import Movie, Screen  # Movie와 Screen 모델 경로 명시


class Reservation(models.Model):
    user = models.ForeignKey(User, models.DO_NOTHING)  # User 모델을 정확히 참조
    showtime = models.ForeignKey('Showtime', models.DO_NOTHING)
    seat = models.ForeignKey('Seat', models.DO_NOTHING)
    reservation_time = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'reservation'


class Seat(models.Model):
    screen = models.ForeignKey(Screen, models.DO_NOTHING)  # Screen 모델 정확히 참조
    seat_number = models.CharField(max_length=10)

    class Meta:
        managed = False
        db_table = 'seat'
        unique_together = (('screen', 'seat_number'),)


class Showtime(models.Model):
    movie = models.ForeignKey(Movie, models.DO_NOTHING)  # Movie 모델 정확히 참조
    screen = models.ForeignKey(Screen, models.DO_NOTHING)  # Screen 모델 정확히 참조
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'showtime'
