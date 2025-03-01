import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/SignupPage.module.css";
import NavBar from "./NavBar";
const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // 에러 메시지 초기화
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // 이메일 검증
    if (!formData.email.includes("@")) {
      newErrors.email = "올바른 이메일 주소를 입력해주세요";
    }

    // 비밀번호 검증
    if (formData.password.length < 8) {
      newErrors.password = "비밀번호는 8자 이상이어야 합니다";
    }

    // 비밀번호 확인
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다";
    }

    // 이름 검증
    if (formData.name.length < 2) {
      newErrors.name = "이름을 입력해주세요";
    }

    // 전화번호 검증
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "올바른 전화번호를 입력해주세요";
    }

    // 약관 동의 검증
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "서비스 이용약관에 동의해주세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("회원가입 시도:", formData);
    }
  };

  const navigate = useNavigate(); 

  const handleStartClick = () => {
    navigate("/login"); 
  };
  const handleStartClick2 = () => {
    navigate("/dashboard"); 
  };
  return (
    <div className={styles.pageContainer}>
      <NavBar />

      <main className={styles.mainContent}>
        <div className={styles.animatedCircuit} />
        <div className={styles.signupCard}>
          <h2 className={styles.title}>회원가입</h2>
          <p className={styles.subtitle}>PrivaShield와 함께 시작하세요</p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="email">이메일</label>
              <input
                className={styles.input}
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="password">비밀번호</label>
              <input
                className={styles.input}
                id="password"
                name="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <p className={styles.requirementText}>
                8자 이상의 비밀번호를 입력해주세요
              </p>
              {errors.password && <span className={styles.errorText}>{errors.password}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="confirmPassword">비밀번호 확인</label>
              <input
                className={styles.input}
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              {errors.confirmPassword && (
                <span className={styles.errorText}>{errors.confirmPassword}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="name">이름</label>
              <input
                className={styles.input}
                id="name"
                name="name"
                type="text"
                placeholder="이름을 입력하세요"
                value={formData.name}
                onChange={handleChange}
                required
              />
              {errors.name && <span className={styles.errorText}>{errors.name}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="phone">전화번호</label>
              <input
                className={styles.input}
                id="phone"
                name="phone"
                type="tel"
                placeholder="'-' 없이 입력해주세요"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
            </div>

            <div className={styles.checkboxGroup}>
              <input
                className={styles.checkbox}
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
              />
              <p className={styles.termsText}>
                <label className={styles.label} htmlFor="agreeToTerms">
                  <a href="#">서비스 이용약관</a>과{" "}
                  <a href="#">개인정보처리방침</a>에 동의합니다
                </label>
                {errors.agreeToTerms && (
                  <span className={styles.errorText}>{errors.agreeToTerms}</span>
                )}
              </p>
            </div>

            <button className={styles.button} type="submit" onClick={handleStartClick2}>회원가입</button>
          </form>

          <div className={styles.divider}>
            <span className={styles.dividerText}>또는</span>
          </div>

          <button className={styles.loginLink} type="button" onClick={handleStartClick}>로그인하기</button>
        </div>
      </main>
    </div>
  );
};

export default SignupPage;