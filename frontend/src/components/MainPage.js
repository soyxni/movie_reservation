import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./MainPage.css";

const MainPage = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  // role을 localStorage에서 불러옴
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role"); // role 정보 제거
    setIsAuthenticated(false);
    alert("로그아웃되었습니다.");
    navigate("/login");
  };

  const handleAdminMode = () => {
    if (!isAuthenticated) {
      alert("로그인 후 이용해주세요.");
      navigate("/login");
    } else if (role === "Staff") {
      navigate("/admin");
    } else {
      alert("관리자 권한이 없습니다.");
    }
  };

  return (
    <>
      {/* 상단바 */}
      <div className="navbar">
        <div className="logo">CineTicket</div>
        <div className="login-link">
          {isAuthenticated ? (
            <span onClick={handleLogout} className="link-text">
              Logout
            </span>
          ) : (
            <Link to="/login" className="link-text">
              Login
            </Link>
          )}
        </div>
      </div>

      {/* 메인 컨테이너 */}
      <div className="main-container">
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
          <button className="admin-button" onClick={handleAdminMode}>
            관리자 모드
          </button>
        </div>
      </div>
    </>
  );
};

export default MainPage;
