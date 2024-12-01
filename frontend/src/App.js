import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./components/MainPage";
import ShowtimePage from "./components/ShowtimePage";
import MoviePage from "./components/MoviePage";
import LoginPage from "./components/LoginPage";
import ReservationPage from "./components/ReservationPage";
import ResDetailsPage from "./components/ResDetailsPage";
import ReservationListPage from "./components/ReservationListPage";
import AdminPage from "./components/AdminPage";
import MovieRegisterPage from "./components/MovieRegisterPage";
import RegisterPage from "./components/RegisterPage";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token); // 토큰 여부로 인증 상태 설정
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<MainPage isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/login"
          element={<LoginPage setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route path="/movies" element={<MoviePage />} />
        <Route path="/showtimes" element={<ShowtimePage />} />
        <Route path="/reservations/:id" element={<ResDetailsPage />} />
        <Route path="/reservation/:id" element={<ReservationPage />} />
        <Route path="/reservations" element={<ReservationListPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/movies/register" element={<MovieRegisterPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
};

export default App;
