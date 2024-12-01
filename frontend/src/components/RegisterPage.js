import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";

const RegisterPage = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    birth_date: "",
    role: "Customer",
    staff_role: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // role이 Customer라면 staff_role을 null로 설정
      const formData = { ...form, staff_role: form.role === "Staff" ? form.staff_role : null };
  
      const response = await fetch("http://127.0.0.1:8000/api/users/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        alert("회원가입이 성공적으로 완료되었습니다.");
        navigate("/login");
      } else {
        const errorData = await response.json();
        console.error("회원가입 오류:", errorData);
        alert("회원가입에 실패했습니다. 입력값을 확인하세요.");
      }
    } catch (error) {
      console.error("회원가입 요청 오류:", error);
      alert("서버와 연결에 실패했습니다.");
    }
  };
  

  return (
    <div className="register-page">
      <header className="header">
        <button className="back-button" onClick={() => navigate("/")}>
          ← 메인으로
        </button>
        <h1>회원가입</h1>
      </header>
      <form className="register-form" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="이메일"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="name"
          placeholder="이름"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="전화번호"
          value={form.phone}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="birth_date"
          placeholder="생년월일"
          value={form.birth_date}
          onChange={handleChange}
          required
        />
        <select name="role" value={form.role} onChange={handleChange} required>
          <option value="Customer">Customer</option>
          <option value="Staff">Staff</option>
        </select>
        {form.role === "Staff" && (
          <select
            name="staff_role"
            value={form.staff_role}
            onChange={handleChange}
            required
          >
            <option value="">직책 선택</option>
            <option value="Manager">Manager</option>
            <option value="Staff">Staff</option>
          </select>
        )}
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
};

export default RegisterPage;
