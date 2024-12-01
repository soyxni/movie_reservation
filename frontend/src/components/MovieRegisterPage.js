import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MovieRegisterPage.css";

const MovieRegisterPage = () => {
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState({
    title: "",
    genre: "",
    duration: "",
    description: "",
    age_limit: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    // 영화 목록 가져오기
    fetch("http://127.0.0.1:8000/api/movies/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch movies");
        }
        return response.json();
      })
      .then((data) => setMovies(data))
      .catch((error) => console.error("Error fetching movies:", error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // 영화 등록 요청
    fetch("http://127.0.0.1:8000/api/movies/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(form),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to register movie");
        }
        return response.json();
      })
      .then((data) => {
        alert("영화가 등록되었습니다.");
        setMovies((prevMovies) => [...prevMovies, data]);
        setForm({
          title: "",
          genre: "",
          duration: "",
          description: "",
          age_limit: "",
        });
      })
      .catch((error) => {
        console.error("Error registering movie:", error);
        alert("영화 등록에 실패했습니다.");
      });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="movie-register-page">
      <header className="header">
        <button className="back-button" onClick={() => navigate("/admin")}>
          ← 관리자 모드
        </button>
        <h1>영화 등록 및 관리</h1>
      </header>
      <form className="movie-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="영화 제목"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="genre"
          placeholder="장르"
          value={form.genre}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="duration"
          placeholder="상영 시간 (분)"
          value={form.duration}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="설명"
          value={form.description}
          onChange={handleChange}
        />
        <input
          type="number"
          name="age_limit"
          placeholder="관람 등급"
          value={form.age_limit}
          onChange={handleChange}
          required
        />
        <button type="submit">영화 등록</button>
      </form>
      <div className="movie-list">
        <h2>등록된 영화</h2>
        {movies.map((movie) => (
          <div key={movie.id} className="movie-item">
            <p>🎬 {movie.title}</p>
            <p>장르: {movie.genre}</p>
            <p>상영 시간: {movie.duration}분</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieRegisterPage;
