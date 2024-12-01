import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminPage.css";

const AdminPage = () => {
  const navigate = useNavigate();

  // 로그아웃 및 홈으로 이동
  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("로그아웃되었습니다.");
    navigate("/login");
  };

  return (
    <div className="admin-page">
      <header className="header">
        <span className="back-text" onClick={() => navigate("/")}>
          ← back
        </span>
        <h1 className="title">관리자 모드</h1>
      </header>
      <div className="admin-options">
        <Link to="/admin/movies/register" className="admin-link">
          영화 등록 및 관리
        </Link>
      </div>
      <button className="logout-button" onClick={handleLogout}>
        로그아웃
      </button>
    </div>
  );
};

export default AdminPage;
