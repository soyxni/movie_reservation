from django.urls import path
from .views import UserRegisterView, UserLoginView, UserDetailView

urlpatterns = [
    path('register/', UserRegisterView.as_view(), name='register'),  # 회원가입
    path('login/', UserLoginView.as_view(), name='login'),           # 로그인
    path('me/', UserDetailView.as_view(), name='user-detail'),       # 사용자 정보 조회
]
