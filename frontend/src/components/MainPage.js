import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./MainPage.css";

const MainPage = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    alert("로그아웃되었습니다.");
    navigate("/login");
  };

  return (
    <div className="main-container">
      {/* 로그인/로그아웃 링크 */}
      <div className="login-link">
        {isAuthenticated ? (
          <span onClick={handleLogout} className="link-text">
            로그아웃
          </span>
        ) : (
          <Link to="/login" className="link-text">
            로그인
          </Link>
        )}
      </div>

      {/* 메인 버튼 영역 */}
      <div className="button-container">
        <button className="main-button">
          <Link to="/movies" className="button-link">
            영화 조회
          </Link>
        </button>
        <button className="main-button">
          <Link to="/showtimes" className="button-link">
            상영 시간 조회
          </Link>
        </button>
        <button className="main-button">
          <Link to="/reservations" className="button-link">
            예매 내역 확인
          </Link>
        </button>
      </div>

      {/* 관리자 모드 링크 */}
      <div className="admin-mode">
        <Link to="/admin" className="admin-link">
          관리자 모드
        </Link>
      </div>
    </div>
  );
};

export default MainPage;
