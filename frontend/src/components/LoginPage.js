import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/users/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("JWT Access Token:", data.access);
        console.log("User ID:", data.user_id);

        localStorage.setItem("token", data.access);
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("role", data.role);

        setIsAuthenticated(true);
        alert("로그인 성공");
        navigate("/");
      } else {
        alert("로그인 실패. 이메일과 비밀번호를 확인하세요.");
      }
    } catch (error) {
      console.error("로그인 에러:", error);
    }
  };

  return (
    <div className="login-page">
      {/* 상단바 */}
      <header className="header">
        <span onClick={() => navigate("/")} className="back-text">
          ← back
        </span>
        <h1 className="title">Login</h1>
      </header>

      {/* 로그인 폼 */}
      <div className="login-form">
      <input
        type="email"
        placeholder="이메일"
        value={email} // 상태와 연결
        onChange={(e) => setEmail(e.target.value)} // 상태 업데이트
        className="input-field"
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password} // 상태와 연결
        onChange={(e) => setPassword(e.target.value)} // 상태 업데이트
        className="input-field"
      />

        <button onClick={handleLogin} className="login-button">
          로그인
        </button>
        <p>
          <span className="register-link" onClick={() => navigate("/register")}>
            회원가입 페이지로 이동
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
