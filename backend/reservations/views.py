from rest_framework import generics, status
from rest_framework.response import Response
from .models import Reservation, Seat, Showtime
from .serializers import ReservationSerializer


# 좌석 예약 API
class SeatReservationView(generics.CreateAPIView):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer

    def create(self, request, *args, **kwargs):
        user_id = request.data.get('user')  # 요청에서 사용자 ID 받기
        seat_id = request.data.get('seat')
        showtime_id = request.data.get('showtime')

        # 입력값 검증
        if not user_id or not seat_id or not showtime_id:
            return Response({'error': 'User, seat, and showtime are required.'}, status=status.HTTP_400_BAD_REQUEST)

        # 해당 좌석이 이미 예약되었는지 확인
        if Reservation.objects.filter(seat_id=seat_id, showtime_id=showtime_id).exists():
            return Response({'error': 'This seat is already reserved.'}, status=status.HTTP_400_BAD_REQUEST)

        # 예약 생성
        reservation = Reservation.objects.create(
            user_id=user_id,
            showtime_id=showtime_id,
            seat_id=seat_id,
        )
        serializer = self.get_serializer(reservation)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# 예약 확인 API
class ReservationListView(generics.ListAPIView):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer

    def get_queryset(self):
        user_id = self.request.query_params.get('user')  # 사용자 ID를 쿼리 파라미터로 받음
        if user_id:
            return self.queryset.filter(user_id=user_id)  # 해당 사용자 예약만 반환
        return self.queryset.none()  # 사용자 ID가 없으면 빈 결과 반환


# 예약 취소 API
class ReservationCancelView(generics.DestroyAPIView):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer

    def delete(self, request, *args, **kwargs):
        reservation_id = kwargs.get('pk')
        user_id = request.data.get('user')  # 요청에서 사용자 ID 받기

        # 예약 확인
        try:
            reservation = self.queryset.get(id=reservation_id, user_id=user_id)
            reservation.delete()
            return Response({'message': 'Reservation cancelled successfully.'}, status=status.HTTP_200_OK)
        except Reservation.DoesNotExist:
            return Response({'error': 'Reservation not found or unauthorized.'}, status=status.HTTP_404_NOT_FOUND)
