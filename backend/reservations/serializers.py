from rest_framework import serializers
from .models import Reservation


class ReservationSerializer(serializers.ModelSerializer):
    seat_number = serializers.CharField(source='seat.seat_number', read_only=True)

    class Meta:
        model = Reservation
        fields = ['id', 'user', 'showtime', 'seat_number', 'reservation_time']