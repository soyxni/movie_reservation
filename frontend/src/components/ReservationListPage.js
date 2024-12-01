import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ReservationListPage.css";

const ReservationListPage = () => {
  const [reservations, setReservations] = useState([]); // 예매 내역
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      alert("로그인 후 이용해주세요.");
      navigate("/login");
      return;
    }

    // 예매 내역 가져오기
    fetch(`http://127.0.0.1:8000/api/reservations/list/?user=${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setReservations(data);
      })
      .catch((error) => console.error("Error fetching reservations:", error));
  }, [navigate]);

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
