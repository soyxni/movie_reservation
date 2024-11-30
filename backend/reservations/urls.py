from django.urls import path
from .views import SeatReservationView, ReservationListView, ReservationCancelView

urlpatterns = [
    path('reserve/', SeatReservationView.as_view(), name='reserve'),  # 좌석 예약
    path('list/', ReservationListView.as_view(), name='list'),        # 예약 확인
    path('<int:pk>/cancel/', ReservationCancelView.as_view(), name='cancel'),  # 예약 취소
]
