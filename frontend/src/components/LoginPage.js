import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = () => {
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
        localStorage.setItem("token", data.access); // JWT 토큰 저장
        alert("로그인 성공");
        navigate("/"); // 메인 페이지로 이동
      } else {
        alert("로그인 실패. 이메일과 비밀번호를 확인하세요.");
      }
    } catch (error) {
      console.error("로그인 에러:", error);
    }
  };

  return (
    <div className="login-page">
      <h1>로그인</h1>
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
        <span
          className="register-link"
          onClick={() => navigate("/register")}
        >
          회원가입 페이지로 이동
        </span>
      </p>
    </div>
  );
};

export default LoginPage;
