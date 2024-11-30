from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Reservation, Seat, Showtime
from .serializers import ReservationSerializer


class ShowtimeSeatsView(APIView):
    """
    특정 상영시간의 좌석 상태를 반환
    """
    def get(self, request, pk, *args, **kwargs):
        try:
            # 상영시간 가져오기
            showtime = Showtime.objects.get(id=pk)
            seats = Seat.objects.filter(showtime=showtime)

            # 해당 상영시간의 예약된 좌석 가져오기
            reserved_seats = Reservation.objects.filter(showtime=showtime).values_list('seat_id', flat=True)

            # 좌석 상태 데이터 생성
            seat_data = []
            rows = "ABCDEFGHIJKL"
            columns = 20

            # 모든 좌석 데이터 생성 (동적 생성)
            for row in rows:
                for column in range(1, columns + 1):
                    seat_number = f"{row}{column}"
                    seat, created = Seat.objects.get_or_create(
                        showtime=showtime,
                        seat_number=seat_number,
                        defaults={"screen": showtime.screen}
                    )
                    seat_data.append({
                        "id": seat.id,
                        "seat_number": seat.seat_number,
                        "row": row,
                        "column": column,
                        "is_reserved": seat.id in reserved_seats,
                    })

            return Response({
                "showtime_id": showtime.id,
                "screen_name": showtime.screen.name,
                "seats": seat_data,
            }, status=status.HTTP_200_OK)

        except Showtime.DoesNotExist:
            return Response({"error": "Showtime not found"}, status=status.HTTP_404_NOT_FOUND)


# 좌석 예약 API
class SeatReservationView(generics.CreateAPIView):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer

    def create(self, request, *args, **kwargs):
        user_id = request.data.get('user')
        seat_number = request.data.get('seat_number')
        showtime_id = request.data.get('showtime')

        # 입력값 검증
        if not all([user_id, seat_number, showtime_id]):
            return Response({'error': 'Invalid input data'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # 상영시간 가져오기
            showtime = Showtime.objects.get(id=showtime_id)

            # 좌석 가져오거나 생성
            seat, created = Seat.objects.get_or_create(
                showtime=showtime,
                seat_number=seat_number,
                defaults={"screen": showtime.screen},
            )

            # 좌석 중복 확인
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

        except Showtime.DoesNotExist:
            return Response({'error': 'Showtime not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# 예약 확인 API
class ReservationListView(generics.ListAPIView):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer

    def get_queryset(self):
        user_id = self.request.query_params.get('user')
        if user_id:
            return self.queryset.filter(user_id=user_id).select_related('seat')
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
