from rest_framework import generics  # generics를 올바르게 임포트
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed
from .models import User
from .serializers import UserSerializer


# 회원가입 View
class UserRegisterView(generics.CreateAPIView):  # generics.CreateAPIView 사용
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]  # 누구나 접근 가능


# 로그인 View (JWT 토큰 발급)
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'  # username 대신 email 사용

    @classmethod
    def validate(cls, attrs):
        email = attrs.get('email')  # `username` 대신 `email` 사용
        password = attrs.get('password')

        try:
            user = User.objects.get(email=email)  # 이메일로 사용자 검색
        except User.DoesNotExist:
            raise AuthenticationFailed('Invalid email or password')

        # 비밀번호 비교
        if user.password != password:  # 평문 비밀번호 비교
            raise AuthenticationFailed('Invalid email or password')

        # 인증 성공 시 토큰 반환
        refresh = cls.get_token(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'role': user.role,
            },
        }


class UserLoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
