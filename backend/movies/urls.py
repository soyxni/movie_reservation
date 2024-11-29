from rest_framework.routers import DefaultRouter
from .views import MovieViewSet, ScreenViewSet

router = DefaultRouter()
router.register('movies', MovieViewSet, basename='movie')  # 영화 관리
router.register('screens', ScreenViewSet, basename='screen')  # 상영관 관리

urlpatterns = router.urls
