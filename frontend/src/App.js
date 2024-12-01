import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./components/MainPage";
import ShowtimePage from "./components/ShowtimePage";
import MoviePage from "./components/MoviePage";
import LoginPage from "./components/LoginPage";
import fetchWithToken from "./utils/fetchWithToken";
import ReservationPage from "./components/ReservationPage";
import ResDetailsPage from "./components/ResDetailsPage";
import ReservationListPage from "./components/ReservationListPage";
import AdminPage from "./components/AdminPage";
import MovieRegisterPage from "./components/MovieRegisterPage";
// import ScreenRegisterPage from "./components/ScreenRegisterPage";
// import ScreenPage from "./components/ScreenPage";


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        return; // 토큰이 없으면 인증 확인을 하지 않음
      }

      try {
        const response = await fetchWithToken("http://127.0.0.1:8000/api/users/me/");
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
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
        {/* <Route path="/admin/screens/register" element={<ScreenRegisterPage />} />
        <Route path="/admin/movies" element={<MoviePage />} />
        <Route path="/admin/screens" element={<ScreenPage />} /> */}
      </Routes>
    </Router>
  );
};

export default App;