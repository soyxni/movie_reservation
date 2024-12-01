from rest_framework import serializers
from .models import Reservation
from movies.serializers import MovieSerializer, ScreenSerializer

class ReservationSerializer(serializers.ModelSerializer):
    movie_title = serializers.CharField(source='showtime.movie.title', read_only=True)
    start_time = serializers.DateTimeField(source='showtime.start_time', read_only=True)
    screen_name = serializers.CharField(source='showtime.screen.name', read_only=True)
    screen_type = serializers.CharField(source='showtime.screen.screen_type', read_only=True)
    duration = serializers.IntegerField(source='showtime.movie.duration', read_only=True)
    age_limit = serializers.CharField(source='showtime.movie.age_limit', read_only=True)
    genre = serializers.CharField(source='showtime.movie.genre', read_only=True)

    class Meta:
        model = Reservation
        fields = [
            'id',
            'user',
            'seat_number',
            'movie_title',
            'start_time',
            'screen_name',
            'screen_type',
            'duration',
            'age_limit',
            'genre',
        ]