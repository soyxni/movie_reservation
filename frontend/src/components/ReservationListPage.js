import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ReservationListPage.css";

const ReservationListPage = () => {
  const [reservations, setReservations] = useState([]); // 예매 내역
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");

    if (!token || !userId) {
      // 인증되지 않은 경우 로그인 페이지로 리다이렉트
      alert("로그인 후 이용해주세요.");
      navigate("/login");
      return;
    }

    // 예매 내역 가져오기
    fetch(`http://127.0.0.1:8000/api/reservations/list/?user=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setReservations(data);
      })
      .catch((error) => console.error("Error fetching reservations:", error))
      .finally(() => {
        setIsLoading(false); // 로딩 상태 종료
      });
  }, [navigate]);

  if (isLoading) {
    return <p className="loading-message">로딩 중...</p>; // 로딩 중 표시
  }

  if (reservations.length === 0) {
    return <p className="no-reservations">예매 내역이 없습니다.</p>;
  }

  const formatDateTime = (dateTimeString) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return new Date(dateTimeString).toLocaleString("ko-KR", options);
  };

  return (
    <div className="reservations-page">
      <header className="header">
        <button className="back-button" onClick={() => navigate("/")}>
          ← 뒤로가기
        </button>
        <h1 className="title">내 예매 내역</h1>
      </header>
      <div className="reservations-list">
        {reservations.map((reservation) => (
          <div key={reservation.id} className="reservation-block">
            <p><strong>🎬 영화 제목:</strong> {reservation.movie_title}</p>
            <p><strong>⏰ 상영 시간:</strong> {formatDateTime(reservation.start_time)}</p>
            <p><strong>🏢 상영관:</strong> {reservation.screen_name} ({reservation.screen_type})</p>
            <p><strong>🕒 러닝타임:</strong> {reservation.duration}분</p>
            <p><strong>🔞 관람가 :</strong> {reservation.age_limit} | <strong> 🎭 장르:</strong> {reservation.genre}</p>
            <p><strong>💺 좌석:</strong> {reservation.seat_number}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReservationListPage;
