import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./MoviePage.css";

const MoviePage = () => {
  const [movies, setMovies] = useState([]);
  const currentTime = new Date();

  // 영화 데이터 가져오기
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/movies/movies/") // Django API URL
      .then((response) => response.json())
      .then((data) => {
        // 상영 시작 시간이 현재 시간 이후인 영화만 필터링
        const filteredMovies = data.filter((movie) =>
          movie.showtimes.some((showtime) => new Date(showtime.start_time) > currentTime)
        );
        setMovies(filteredMovies);
      })
      .catch((error) => console.error("Error fetching movies:", error));
  }, []);

  return (
    <div className="movie-page">
      {/* 상단 바 */}
      <header className="header">
        <Link to="/" className="back-button">← 뒤로가기</Link>
        <h1 className="title">영화 조회하기</h1>
      </header>

      {/* 영화 목록 */}
      <div className="movie-list">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            {/* 블록 제목 */}
            <div className="movie-title">
              <h2>{movie.title}</h2>
              <p>관람가: {movie.age_limit}세 이상</p>
              <p>Running Time: {movie.duration}분</p>
            </div>

            <div className="showtimes">
              {movie.showtimes
                .filter((showtime) => new Date(showtime.start_time) > currentTime) // 현재 시간 이후 상영 시간만
                .sort((a, b) => new Date(a.start_time) - new Date(b.start_time)) // 시간순 정렬
                // .slice(0, 4) // 최대 4개만 표시 -> 왜? 다 가져올거야
                .map((showtime, index) => {
                  const utcDate = new Date(showtime.start_time);
                  const hours = String(utcDate.getUTCHours()).padStart(2, "0"); // UTC 기준 시간
                  const minutes = String(utcDate.getUTCMinutes()).padStart(2, "0"); // UTC 기준 분
                  const period = hours >= 12 ? "오후" : "오전"; // 오전/오후 결정
                  const hours12 = hours % 12 || 12; // 12시간 형식으로 변환 (0은 12로 표시)
                  const formattedTime = `${period} ${String(hours12).padStart(2, "0")}:${minutes}`; // 오전/오후 HH:mm 형식으로 출력
                  return <div key={index} className="showtime">{formattedTime}</div>;
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoviePage;