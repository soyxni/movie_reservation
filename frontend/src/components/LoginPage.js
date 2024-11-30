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
        localStorage.setItem("token", data.access);
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
        <span onClick={() => navigate("/")} className="back-button">
          ← 뒤로가기
        </span>
        <h1 className="title">로그인</h1>
      </header>

      {/* 로그인 폼 */}
      <div className="login-form">
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
