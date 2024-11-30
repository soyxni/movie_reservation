from django.urls import path
from .views import SeatReservationView, ReservationListView, ReservationCancelView

urlpatterns = [
    path('reserve/', SeatReservationView.as_view(), name='reserve-seat'),  # 좌석 예약
    path('list/', ReservationListView.as_view(), name='reservation-list'),  # 예약 확인
    path('cancel/<int:pk>/', ReservationCancelView.as_view(), name='reservation-cancel'),  # 예약 취소
]
