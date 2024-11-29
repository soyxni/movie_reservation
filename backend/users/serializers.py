from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'name', 'phone', 'birth_date', 'role', 'points', 'staff_role']
        extra_kwargs = {
            'password': {'write_only': True}  # 비밀번호는 응답에 포함하지 않음
        }

    def create(self, validated_data):
        # 비밀번호 암호화 없이 그대로 저장
        return super().create(validated_data)
