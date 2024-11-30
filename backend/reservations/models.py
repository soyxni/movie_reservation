from django.db import models

class Reservation(models.Model):
    user = models.ForeignKey('User', models.DO_NOTHING)
    showtime = models.ForeignKey('Showtime', models.DO_NOTHING)
    seat = models.ForeignKey('Seat', models.DO_NOTHING)
    reservation_time = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'reservation'


class Seat(models.Model):
    screen = models.ForeignKey('Screen', models.DO_NOTHING)
    seat_number = models.CharField(max_length=10)

    class Meta:
        managed = False
        db_table = 'seat'
        unique_together = (('screen', 'seat_number'),)


class Showtime(models.Model):
    movie = models.ForeignKey('Movie', models.DO_NOTHING)
    screen = models.ForeignKey('Screen', models.DO_NOTHING)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'showtime'
