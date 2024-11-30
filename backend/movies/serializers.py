from rest_framework import serializers
from .models import Movie, Screen
from reservations.models import Showtime

# Showtime 시리얼라이저
class ShowtimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Showtime
        fields = ['id', 'start_time', 'end_time', 'screen']

# 영화 시리얼라이저
class MovieSerializer(serializers.ModelSerializer):
    showtimes = serializers.SerializerMethodField()  # Showtime 데이터를 커스텀 필드로 추가

    class Meta:
        model = Movie
        fields = ['id', 'title', 'genre', 'duration', 'description', 'age_limit', 'showtimes']

    def get_showtimes(self, obj):
        # Showtime에서 해당 영화와 연결된 상영 시간 필터링
        showtimes = Showtime.objects.filter(movie=obj)  # 특정 영화의 Showtime만 가져옴
        return ShowtimeSerializer(showtimes, many=True).data

# 상영관 시리얼라이저
class ScreenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Screen
        fields = '__all__'
