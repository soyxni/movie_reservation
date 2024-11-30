import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./ReservationPage.css";

const ReservationPage = () => {
  const { id } = useParams(); // 상영시간 ID
  const [seats, setSeats] = useState([]); // 좌석 상태
  const [selectedSeat, setSelectedSeat] = useState(null); // 선택된 좌석
  const navigate = useNavigate();

  // 초기 좌석 생성 (12행 × 20열)
  useEffect(() => {
    const initialSeats = [];
    const rows = "ABCDEFGHIJKL"; // 12행
    const columns = 20; // 20열
    rows.split("").forEach((row) => {
      for (let col = 1; col <= columns; col++) {
        initialSeats.push({
          id: `${row}${col}`, // 좌석 번호
          seat_number: `${row}${col}`,
          row,
          column: col,
          is_reserved: false,
        });
      }
    });
    setSeats(initialSeats);

    // API 요청으로 예약된 좌석 데이터 가져오기
    fetch(`http://127.0.0.1:8000/api/reservations/showtime/${id}/seats/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const reservedSeats = data.seats || [];
        // 초기 좌석에 예약 상태 반영
        const updatedSeats = initialSeats.map((seat) => {
          const isReserved = reservedSeats.some(
            (reserved) => reserved.seat_number === seat.seat_number
          );
          return { ...seat, is_reserved: isReserved };
        });
        setSeats(updatedSeats);
      })
      .catch((error) => console.error("Error fetching seats:", error));
  }, [id]);

  // 예매 요청 처리
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
        user: localStorage.getItem("user_id"),
        showtime: id,
        seat_number: selectedSeat.seat_number, // 선택된 좌석 번호
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

  // 좌석 렌더링 함수
  const renderSeats = () => {
    const rows = {};
    seats.forEach((seat) => {
      if (!rows[seat.row]) {
        rows[seat.row] = [];
      }
      rows[seat.row].push(seat);
    });

    const sortedRows = Object.keys(rows).sort();

    return sortedRows.map((row) => (
      <div key={row} className="seat-row">
        <div className="row-label">{row}</div>
        {rows[row]
          .sort((a, b) => a.column - b.column)
          .map((seat) => (
            <div
              key={seat.id}
              className={`seat ${
                seat.is_reserved
                  ? "reserved"
                  : selectedSeat && selectedSeat.id === seat.id
                  ? "selected"
                  : "available"
              }`}
              onClick={() => {
                if (!seat.is_reserved) {
                  setSelectedSeat(
                    selectedSeat && selectedSeat.id === seat.id ? null : seat
                  );
                }
              }}
            >
              {seat.column}
            </div>
          ))}
      </div>
    ));
  };

  return (
    <div className="reservation-page">
      <header className="header">
        <Link to="/showtimes" className="back-button">
          ← 뒤로가기
        </Link>
        <h1 className="title">예매하기</h1>
      </header>
      <div className="seat-selection">
        <h3>좌석 선택</h3>
        <div className="screen">SCREEN</div>
        <div className="seats">{renderSeats()}</div>
        <div className="legend">
          <div className="legend-item">
            <div className="seat available"></div>
            <span>예약 가능</span>
          </div>
          <div className="legend-item">
            <div className="seat selected"></div>
            <span>선택한 좌석</span>
          </div>
          <div className="legend-item">
            <div className="seat reserved"></div>
            <span>예약됨</span>
          </div>
        </div>
      </div>
      <button className="reserve-button" onClick={handleReservation}>
        예매하기
      </button>
    </div>
  );
};

export default ReservationPage;
