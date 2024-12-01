from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from rest_framework.permissions import BasePermission, IsAuthenticated
from .models import Movie, Screen
from .serializers import MovieSerializer, ScreenSerializer
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response




# 영화 관리 ViewSet
class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer


# 상영관 관리 ViewSet
class ScreenViewSet(viewsets.ModelViewSet):
    queryset = Screen.objects.all()
    serializer_class = ScreenSerializer

# 권한 클래스 정의
class IsManager(BasePermission):
    def has_permission(self, request, view):
        # 로그인된 사용자만 접근 가능 & staff_role이 'Manager'인 경우
        return request.user.is_authenticated and request.user.role == 'Staff' and request.user.staff_role == 'Manager'

@api_view(['GET'])
@permission_classes([IsManager])
def admin_mode(request):
    return Response({"message": "Welcome to admin mode!"})

# 영화 관리 ViewSet
class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [IsManager]  # 인증된 사용자 + 관리자만 접근 가능
    # permission_classes = [AllowAny]


# 상영관 관리 ViewSet
class ScreenViewSet(viewsets.ModelViewSet):
    queryset = Screen.objects.all()
    serializer_class = ScreenSerializer
    permission_classes = [IsManager]  # 인증된 사용자 + 관리자만 접근 가능
    # permission_classes = [AllowAny]