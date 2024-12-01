import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ResDetailsPage.css";

const ResDetailsPage = () => {
  const { id } = useParams(); // 예약 ID
  const [ticketDetails, setTicketDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Reservation ID:", id);
    fetch(`http://127.0.0.1:8000/api/reservations/${id}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch ticket details. Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Ticket details:", data);
        setTicketDetails(data);
      })
      .catch((error) => console.error("Error fetching ticket details:", error));
  }, [id]);
  

  if (!ticketDetails) {
    return <p>Loading ticket details...</p>;
  }

  const {
    movie_title,
    start_time,
    screen_name,
    screen_type,
    duration,
    age_limit,
    genre,
  } = ticketDetails;

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
    <div className="reservation-details-page">
      <header className="header">
        <h1 className="title">Ticket</h1>
      </header>
      <div className="ticket-details">
        <p><strong>🎬 영화 제목 :</strong> {movie_title}</p>
        <p><strong>⏰ 상영 시간 :</strong> {formatDateTime(start_time)}</p>
        <p><strong>🏢 상영관 :</strong> {screen_name} ({screen_type})</p>
        <p><strong>🕒 러닝타임 :</strong> {duration}분</p>
        <p><strong>🔞 관람가 :</strong> {age_limit} | <strong> 🎭 장르:</strong> {genre}</p>
      </div>
      <button className="home-button" onClick={() => navigate("/")}>
        Home
      </button>
    </div>
  );
};

export default ResDetailsPage;
