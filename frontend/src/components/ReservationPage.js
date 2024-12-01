import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./ReservationPage.css";

const ReservationPage = () => {
  const { id } = useParams(); // 상영시간 ID
  const [seats, setSeats] = useState([]); // 좌석 상태
  const [selectedSeat, setSelectedSeat] = useState(null); // 선택된 좌석
  const navigate = useNavigate();

  useEffect(() => {
    // 예약된 좌석 데이터 가져오기
    fetch(`http://127.0.0.1:8000/api/reservations/showtime/${id}/seats/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const fetchedSeats = data.seats || [];
        console.log("Fetched seats:", fetchedSeats);

        // fetchedSeats는 이미 is_reserved 값을 포함하므로 바로 사용 가능
        setSeats(fetchedSeats);
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
        if (!response.ok) {
          throw new Error("Failed to reserve seat.");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Reservation successful:", data);
        alert("예매가 완료되었습니다.");
        navigate(`/reservations/${data.id}`); // 예약 ID를 사용해 이동
      })
      .catch((error) => {
        console.error("Error during reservation:", error);
        alert("예매에 실패했습니다. 좌석 중복 여부를 확인하세요.");
      });
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
              key={seat.seat_number}
              className={`seat ${
                seat.is_reserved
                  ? "reserved" // 예약된 좌석
                  : selectedSeat && selectedSeat.seat_number === seat.seat_number
                  ? "selected" // 선택된 좌석
                  : "available" // 예약 가능 좌석
              }`}
              onClick={() => {
                if (!seat.is_reserved) {
                  // 예약된 좌석은 클릭 불가
                  setSelectedSeat(
                    selectedSeat && selectedSeat.seat_number === seat.seat_number
                      ? null
                      : seat
                  );
                }
              }}
            >
              {seat.column} {/* 좌석 번호 표시 */}
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