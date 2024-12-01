import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MovieRegisterPage.css";

const MovieRegisterPage = () => {
  const [movies, setMovies] = useState([]); // 초기값: 빈 배열
  const [form, setForm] = useState({
    title: "",
    genre: "",
    duration: "",
    description: "",
    age_limit: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/movies/movies/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        console.log("Response status:", response.status);
        if (!response.ok) {
          throw new Error("Failed to fetch movies");
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          // 응답이 배열인지 확인
          setMovies(data);
        } else {
          console.error("Unexpected response format:", data);
          setMovies([]); // 배열이 아닌 경우 빈 배열로 설정
        }
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
        setMovies([]); // 오류 발생 시 빈 배열로 설정
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    console.log("Submitting with token:", token); // 디버깅용

    fetch("http://127.0.0.1:8000/api/admin/screens/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    })
      .then((response) => {
        console.log("Response status:", response.status); // 상태 코드 확인
        if (!response.ok) {
          return response.json().then((errorData) => {
            console.error("Error response:", errorData);
            throw new Error("Failed to register movie");
          });
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
        <span className="back-text" onClick={() => navigate("/admin")}>
          ← back
        </span>
      <h1 className="title">영화 등록 및 관리</h1>
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
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.id} className="movie-item">
              <p>🎬 {movie.title}</p>
              <p>장르: {movie.genre}</p>
              <p>상영 시간: {movie.duration}분</p>
            </div>
          ))
        ) : (
          <p>등록된 영화가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default MovieRegisterPage;
