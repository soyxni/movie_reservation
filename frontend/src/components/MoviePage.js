import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MoviePage.css";

const MoviePage = () => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/movies/movies/")
      .then((response) => response.json())
      .then((data) => setMovies(data))
      .catch((error) => console.error("Error fetching movies:", error));
  }, []);

  return (
    <div className="movie-page">
      {/* 상단바 */}
      <header className="header">
        <span className="back-text" onClick={() => navigate("/")}>
          ← back
        </span>
        <h1 className="title">영화 조회</h1>
      </header>

      {/* 영화 리스트 */}
      <div className="movie-list">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <div className="movie-title">
              <h2>{movie.title}</h2>
              <p>
                <strong>장르:</strong> {movie.genre}
              </p>
              <p>
                <strong>러닝타임:</strong> {movie.duration}분
              </p>
              <p>
                <strong>설명:</strong> {movie.description}
              </p>
              <p>
                <strong>관람가:</strong> {movie.age_limit}세 이상
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoviePage;
