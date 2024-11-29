from rest_framework import serializers
from .models import Movie, Screen


# 영화 시리얼라이저
class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = '__all__'  # 모든 필드 포함


# 상영관 시리얼라이저
class ScreenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Screen
        fields = '__all__'
