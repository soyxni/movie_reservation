import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./ReservationPage.css";

const ReservationPage = () => {
  const { id } = useParams(); // 상영시간 ID
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 좌석 데이터 가져오기
    fetch(`http://127.0.0.1:8000/api/reservations/showtime/${id}/seats/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const existingSeats = data.seats || [];
        const rows = "ABCDEFGHIJKL"; // A~L (12행)
        const columns = 20; // 1~20 (20열)

        // 모든 좌석 생성
        const allSeats = [];
        for (let row of rows) {
          for (let col = 1; col <= columns; col++) {
            const seatNumber = `${row}${col}`;
            const existingSeat = existingSeats.find(
              (seat) => seat.seat_number === seatNumber
            );
            allSeats.push(
              existingSeat || {
                seat_number: seatNumber,
                is_reserved: false, // 기본값
              }
            );
          }
        }
        setSeats(allSeats);
      })
      .catch((error) => console.error("Error fetching seats:", error));
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
        seat_number: selectedSeat.seat_number,
        user: 1, // 실제 사용자 ID는 JWT에서 추출
      }),
    })
      .then((response) => {
        if (response.ok) {
          alert("예매가 완료되었습니다.");
          navigate("/reservations"); // 예매 내역 페이지로 이동
        } else {
          alert("예매에 실패했습니다. 좌석 중복 여부를 확인하세요.");
        }
      })
      .catch((error) => console.error("Error during reservation:", error));
  };

  const renderSeats = () => {
    const rows = {};
    seats.forEach((seat) => {
      const row = seat.seat_number[0]; // A, B, C, ...
      if (!rows[row]) {
        rows[row] = [];
      }
      rows[row].push(seat);
    });

    return Object.keys(rows).map((row) => (
      <div key={row} className="seat-row">
        <div className="row-label">{row}</div>
        {rows[row].map((seat) => (
          <div
            key={seat.seat_number}
            className={`seat ${
              seat.is_reserved
                ? "reserved"
                : selectedSeat?.seat_number === seat.seat_number
                ? "selected"
                : "available"
            }`}
            onClick={() => {
              if (!seat.is_reserved) {
                setSelectedSeat(seat);
              }
            }}
          >
            {seat.seat_number.slice(1)} {/* 번호만 표시 */}
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div className="reservation-page">
      {/* 상단바 */}
      <header className="header">
        <Link to="/showtimes" className="back-button">
          ← 뒤로가기
        </Link>
        <h1 className="title">예매하기</h1>
      </header>

      {/* 좌석 선택 */}
      <div className="seat-selection">
        <h3>좌석 선택</h3>
        <div className="screen">SCREEN</div>
        <div className="seats">{renderSeats()}</div>
      </div>

      {/* 예매 버튼 */}
      <button className="reserve-button" onClick={handleReservation}>
        예매하기
      </button>
    </div>
  );
};

export default ReservationPage;
