import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ShowtimePage.css";

const ShowtimePage = () => {
  const [movies, setMovies] = useState([]);
  const currentTime = new Date();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/movies/movies/") // Django API URL
      .then((response) => response.json())
      .then((data) => {
        const filteredMovies = data.filter((movie) =>
          movie.showtimes.some((showtime) => new Date(showtime.start_time) > currentTime)
        );
        setMovies(filteredMovies);
      })
      .catch((error) => console.error("Error fetching movies:", error));
  }, []);

  const checkLogin = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login"); // 로그인 페이지로 이동
      return false;
    }
    return true;
  };

  return (
    <div className="movie-page">
      {/* 상단 바 */}
      <header className="header">
        <span onClick={() => navigate("/")} className="back-text">
          ← back
        </span>
        <h1 className="title">상영 시간 조회하기</h1>
      </header>

      {/* 영화 목록 */}
      <div className="movie-list">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <div className="movie-title">
              <h2>{movie.title}</h2>
              <p>
                <strong>관람가:</strong> {movie.age_limit}세 이상
              </p>
              <p>
                <strong>러닝타임:</strong> {movie.duration}분
              </p>
            </div>

            <div className="showtimes">
              {movie.showtimes
                .filter((showtime) => new Date(showtime.start_time) > currentTime)
                .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
                .map((showtime, index) => {
                  const utcDate = new Date(showtime.start_time);
                  const formattedDate = `${String(utcDate.getUTCMonth() + 1).padStart(2, "0")}/${String(
                    utcDate.getUTCDate()
                  ).padStart(2, "0")}`;
                  const hours = utcDate.getUTCHours();
                  const period = hours >= 12 ? "오후" : "오전";
                  const formattedTime = `${period} ${String(hours % 12 || 12).padStart(2, "0")}:${String(
                    utcDate.getUTCMinutes()
                  ).padStart(2, "0")}`;

                  return (
                    <div
                      key={index}
                      className="showtime"
                      onClick={() => {
                        if (checkLogin()) navigate(`/reservation/${showtime.id}`); // 예매 페이지로 이동
                      }}
                    >
                      {formattedDate}
                      <br />
                      {formattedTime}
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowtimePage;
