from django.urls import path
from .views import UserRegisterView, UserLoginView

urlpatterns = [
    path('register/', UserRegisterView.as_view(), name='register'),  # 회원가입
    path('login/', UserLoginView.as_view(), name='login'),           # 로그인
]
