import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./MoviePage.css";

const MoviePage = () => {
  const [movies, setMovies] = useState([]);

  // 영화 데이터 가져오기
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/movies/movies/") // Django API URL
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched data for MoviePage:", data);
        setMovies(data); // 데이터를 상태로 설정
      })
      .catch((error) => console.error("Error fetching movies for MoviePage:", error));
  }, []);

  return (
    <div className="movie-page">
      {/* 상단 바 */}
      <header className="header">
        <Link to="/" className="back-button">← 뒤로가기</Link>
        <h1 className="title">영화 조회</h1>
      </header>

      {/* 영화 목록 */}
      <div className="movie-list">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <div className="movie-title">
              <h2>{movie.title}</h2>
              <p>장르: {movie.genre}</p>
              <p>러닝타임: {movie.duration}분</p>
              <p>설명: {movie.description}</p>
              <p>관람가: {movie.age_limit}세 이상</p>
            </div>
            <button className="reserve-button">예매하러 가기</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoviePage;
