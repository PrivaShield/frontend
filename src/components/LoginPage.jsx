import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/LoginPage.module.css";
import NavBar from "./NavBar";
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    console.log("로그인 요청 시작");
    
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
    
      console.log("서버 응답:", response.data);
    
      if (!response.data.token) {
        throw new Error("토큰 없음");
      }
    
      // 토큰과 사용자 정보를 로컬 스토리지에 저장
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      console.log("저장된 토큰:", localStorage.getItem("token"));
    
      alert("로그인 성공!");
      navigate("/dashboard"); // Add navigation after successful login
    } catch (error) {
      console.error("로그인 실패:", error.response?.data || error.message);
      alert(error.response?.data?.message || "로그인 실패!");
    }
  };

  // 회원가입 페이지로 이동
  const handleStartClick = () => {
    navigate("/signup"); // "시작하기" 버튼 클릭 시 /signup으로 이동
  };

  return (
    <div className={styles.pageContainer}>
     <NavBar />

      <main className={styles.mainContent}>
        <div className={styles.animatedCircuit} />
        <div className={styles.loginCard}>
          <h2 className={styles.title}>로그인</h2>
          <p className={styles.subtitle}>PrivaShield에 오신 것을 환영합니다</p>

          <form className={styles.form} onSubmit={handleLogin}>
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="email">이메일</label>
              <input
                className={styles.input}
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="password">비밀번호</label>
              <input
                className={styles.input}
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className={styles.button} type="submit">로그인</button>
          </form>

          <div className={styles.divider}>
            <span className={styles.dividerText}>또는</span>
          </div>

          <button className={`${styles.button} ${styles.signUpButton}`} type="button" onClick={handleStartClick}>
            새 계정 만들기
          </button>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;