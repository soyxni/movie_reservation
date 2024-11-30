import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./components/MainPage";
import ShowtimePage from "./components/ShowtimePage";
import MoviePage from "./components/MoviePage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<div>로그인 페이지</div>} />
        <Route path="/movies" element={<MoviePage />} />
        <Route path="/showtimes" element={<ShowtimePage />} />
        <Route path="/reservations" element={<div>예매 내역 확인 페이지</div>} />
        <Route path="/admin" element={<div>관리자 모드 페이지</div>} />
      </Routes>
    </Router>
  );
};

export default App;
