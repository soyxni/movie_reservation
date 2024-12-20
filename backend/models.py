# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
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
    screen = models.ForeignKey(Screen, models.DO_NOTHING)
    seat_number = models.CharField(max_length=10)

    class Meta:
        managed = False
        db_table = 'seat'
        unique_together = (('screen', 'seat_number'),)


class Showtime(models.Model):
    movie = models.ForeignKey(Movie, models.DO_NOTHING)
    screen = models.ForeignKey(Screen, models.DO_NOTHING)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'showtime'
