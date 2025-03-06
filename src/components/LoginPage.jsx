import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../styles/LoginPage.module.css"; // 기존 스타일 경로 유지
import NavBar from "./NavBar";
import ForgotPasswordModal from "./ForgotPasswordModal"; // 분리된 모달 컴포넌트 import

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", { email, password });

      if (!response.data.token) {
        throw new Error("토큰 없음");
      }

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      alert("로그인 성공!");
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "로그인 실패!");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <NavBar />

      <main className={styles.mainContent}>
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

          {/* 비밀번호 찾기 버튼 추가 */}
          <button className={styles.forgotPassword} onClick={() => setIsModalOpen(true)}>
            비밀번호를 잊으셨나요?
          </button>

          <div className={styles.divider}>
            <span className={styles.dividerText}>또는</span>
          </div>

          <button className={`${styles.button} ${styles.signUpButton}`} type="button" onClick={() => navigate("/signup")}>
            새 계정 만들기
          </button>
        </div>
      </main>

      {/* 분리된 비밀번호 찾기 모달 컴포넌트 사용 */}
      <ForgotPasswordModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        loginEmail={email}
      />
    </div>
  );
};

export default LoginPage;