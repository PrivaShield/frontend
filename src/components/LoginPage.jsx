import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/LoginPage.module.css";
import NavBar from "./NavBar";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("로그인 시도:", { email, password });
  };

  const navigate = useNavigate(); // ✅ useNavigate 훅 사용

  const handleStartClick = () => {
    navigate("/signup"); // ✅ "시작하기" 버튼 클릭 시 /login으로 이동
  };
  return (
    <div className={styles.pageContainer}>
     <NavBar />

      <main className={styles.mainContent}>
        <div className={styles.animatedCircuit} />
        <div className={styles.loginCard}>
          <h2 className={styles.title}>로그인</h2>
          <p className={styles.subtitle}>PrivaShield에 오신 것을 환영합니다</p>

          <form className={styles.form} onSubmit={handleSubmit}>
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