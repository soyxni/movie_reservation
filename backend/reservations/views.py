from rest_framework import generics, status
from .serializers import ReservationSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Seat, Showtime, Reservation


class ShowtimeSeatsView(APIView):
    def get(self, request, pk, *args, **kwargs):
        try:
            # Showtime 가져오기
            showtime = Showtime.objects.get(id=pk)
            rows = "ABCDEFGHIJKL"  # A~L (12행)
            columns = 20  # 1~20 (20열)

            # 예약된 좌석 조회
            reserved_seats = Reservation.objects.filter(showtime=showtime).values_list('seat__seat_number', flat=True)

            # 동적으로 좌석 생성
            seats = []
            for row in rows:
                for column in range(1, columns + 1):
                    seat_number = f"{row}{column}"
                    seats.append({
                        "seat_number": seat_number,
                        "is_reserved": seat_number in reserved_seats,
                    })

            return Response({
                "showtime_id": showtime.id,
                "screen_name": showtime.screen.name,
                "seats": seats,
            }, status=200)
        except Showtime.DoesNotExist:
            return Response({"error": "Showtime not found"}, status=404)

# 좌석 예약 API
class SeatReservationView(generics.CreateAPIView):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer

    def create(self, request, *args, **kwargs):
        user_id = request.data.get('user')
        seat_number = request.data.get('seat_number')  # 좌석 번호를 직접 전달
        showtime_id = request.data.get('showtime')

        if not all([user_id, seat_number, showtime_id]):
            return Response({'error': 'User, seat_number, and showtime are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            showtime = Showtime.objects.get(id=showtime_id)
        except Showtime.DoesNotExist:
            return Response({'error': 'Showtime not found'}, status=status.HTTP_404_NOT_FOUND)

        # 좌석 동적 생성
        seat, created = Seat.objects.get_or_create(
            showtime=showtime,
            seat_number=seat_number
        )

        # 좌석 중복 예약 확인
        if Reservation.objects.filter(seat=seat, showtime=showtime).exists():
            return Response({'error': 'This seat is already reserved.'}, status=status.HTTP_400_BAD_REQUEST)

        # 예약 생성
        reservation = Reservation.objects.create(
            user_id=user_id,
            showtime=showtime,
            seat=seat,
        )
        serializer = self.get_serializer(reservation)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# 예약 확인 API
class ReservationListView(generics.ListAPIView):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer

    def get_queryset(self):
        user_id = self.request.query_params.get('user')
        if user_id:
            return self.queryset.filter(user_id=user_id)
        return self.queryset.none()

# 예약 취소 API
class ReservationCancelView(generics.DestroyAPIView):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer

    def delete(self, request, *args, **kwargs):
        reservation_id = kwargs.get('pk')
        user_id = request.data.get('user')

        # 예약 확인 및 취소
        try:
            reservation = self.queryset.get(id=reservation_id, user_id=user_id)
            reservation.delete()
            return Response({'message': 'Reservation cancelled successfully.'}, status=status.HTTP_200_OK)
        except Reservation.DoesNotExist:
            return Response({'error': 'Reservation not found or unauthorized.'}, status=status.HTTP_404_NOT_FOUND)
