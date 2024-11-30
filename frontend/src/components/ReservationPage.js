import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import "./ReservationPage.css";

const ReservationPage = () => {
  const { id } = useParams(); // 상영시간 ID
  const [showtime, setShowtime] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [seats, setSeats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 상영시간 및 좌석 데이터 가져오기
    fetch(`http://127.0.0.1:8000/api/reservations/showtime/${id}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("API 요청 실패");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched data:", data); // 데이터 구조 확인
        setShowtime(data.showtime); // API 응답에 따라 수정 필요
        setSeats(data.seats); // API 응답에 따라 수정 필요
      })
      .catch((error) => console.error("Error fetching showtime:", error));
  }, [id]);

  const handleReservation = () => {
    if (!selectedSeat) {
      alert("좌석을 선택하세요.");
      return;
    }

    fetch("http://127.0.0.1:8000/api/reservations/reserve/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        showtime: id,
        seat: selectedSeat,
        user: 1, // 사용자 ID는 백엔드에서 JWT로 추출 가능
      }),
    })
      .then((response) => {
        if (response.ok) {
          alert("예매가 완료되었습니다.");
          navigate("/");
        } else {
          alert("예매에 실패했습니다.");
        }
      })
      .catch((error) => console.error("Error reserving seat:", error));
  };

  return (
    <div className="reservation-page">
      {/* 상단 바 */}
      <header className="header">
        <Link to="/showtimes" className="back-button">← 뒤로가기</Link>
        <h1 className="title">예매하기</h1>
      </header>

      {/* 상영시간 정보 */}
      {showtime && (
        <div className="showtime-info">
          <h2>{showtime.movie_title}</h2>
          <p>상영관: {showtime.screen_name}</p>
          <p>시작 시간: {new Date(showtime.start_time).toLocaleString()}</p>
        </div>
      )}

      {/* 좌석 선택 */}
      <div className="seat-selection">
        <h3>좌석 선택</h3>
        <div className="seats">
          {seats.map((seat) => (
            <div
              key={seat.id}
              className={`seat ${selectedSeat === seat.id ? "selected" : ""}`}
              onClick={() => setSelectedSeat(seat.id)}
            >
              {seat.seat_number}
            </div>
          ))}
        </div>
      </div>

      {/* 예매 버튼 */}
      <button className="reserve-button" onClick={handleReservation}>
        예매하기
      </button>
    </div>
  );
};

export default ReservationPage;
