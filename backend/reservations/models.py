from django.db import models

class Seat(models.Model):
    showtime = models.ForeignKey(
        "Showtime",
        models.DO_NOTHING,
        db_column="showtime_id"  # MySQL에서 정확한 컬럼 명시
    )
    seat_number = models.CharField(max_length=10)

    class Meta:
        managed = True  # Django에서 관리
        db_table = 'seat'
        unique_together = (('showtime', 'seat_number'),)  # showtime별 seat_number 유일성 보장


class Showtime(models.Model):
    movie = models.ForeignKey("movies.Movie", models.DO_NOTHING)
    screen = models.ForeignKey("movies.Screen", models.DO_NOTHING)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    class Meta:
        managed = False  # 외부에서 테이블 관리
        db_table = 'showtime'


class Reservation(models.Model):
    user = models.ForeignKey("users.User", models.DO_NOTHING)
    showtime = models.ForeignKey("Showtime", models.DO_NOTHING)
    seat = models.ForeignKey("Seat", models.DO_NOTHING)
    reservation_time = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'reservation'
