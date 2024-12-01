from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import User
from .serializers import UserSerializer


# 회원가입 View
class UserRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]  # 누구나 접근 가능


# 로그인 View (JWT 토큰 발급)
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'  # username 대신 email 사용

    def validate(self, attrs):
        email = attrs.get('email')  # `username` 대신 `email` 사용
        password = attrs.get('password')

        try:
            user = User.objects.get(email=email)  # 이메일로 사용자 검색
        except User.DoesNotExist:
            raise AuthenticationFailed('Invalid email or password')

        # 비밀번호 비교 (평문 비교)
        if user.password != password:
            raise AuthenticationFailed('Invalid email or password')

        # 인증 성공 시 토큰 반환
        refresh = self.get_token(user)
        data = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user_id': user.id,  # user_id 추가
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'role': user.role,
            },
        }
        return data


class UserLoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


# 사용자 정보 조회 View
class UserDetailView(APIView):
    authentication_classes = [JWTAuthentication]  # JWT 인증 사용
    permission_classes = [permissions.IsAuthenticated]  # 로그인된 사용자만 접근 가능

    def get(self, request):
        # 현재 로그인된 사용자 정보 반환
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)
