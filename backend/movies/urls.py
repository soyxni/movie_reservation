from rest_framework.routers import DefaultRouter
from .views import MovieViewSet, ScreenViewSet, admin_mode
from django.urls import path

router = DefaultRouter()
router.register('movies', MovieViewSet, basename='movie')  # 영화 관리
router.register('screens', ScreenViewSet, basename='screen')  # 상영관 관리

# DefaultRouter에서 생성한 URL과 추가로 정의한 URL을 결합
urlpatterns = router.urls + [
    path('admin-mode/', admin_mode, name='admin-mode'),  # 관리자 모드 엔드포인트 추가
]
