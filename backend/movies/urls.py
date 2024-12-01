from rest_framework.routers import DefaultRouter
from .views import MovieViewSet, ScreenViewSet, MovieManageViewSet, ScreenManageViewSet, admin_mode
from django.urls import path

router = DefaultRouter()
# 일반 조회
router.register('movies', MovieViewSet, basename='movie')
router.register('screens', ScreenViewSet, basename='screen')

# 관리자 전용
router.register('admin/movies', MovieManageViewSet, basename='admin-movie')
router.register('admin/screens', ScreenManageViewSet, basename='admin-screen')
# DefaultRouter에서 생성한 URL과 추가로 정의한 URL을 결합
urlpatterns = router.urls + [
    path('admin-mode/', admin_mode, name='admin-mode'),  # 관리자 모드 엔드포인트 추가
]
