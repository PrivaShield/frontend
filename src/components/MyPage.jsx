import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/MyPage.module.css";
import NavBar from "./NavBar";

const ProfileEditPage = () => {
  const navigate = useNavigate(); // ✅ useNavigate 훅 사용
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "010-1234-5678",
    password: "••••••••",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 여기에 저장 로직 추가
    alert("프로필이 업데이트되었습니다.");
  };

  const navigateToDashboard = () => {
    navigate("/dashboard"); 
    console.log("대시보드로 이동");
    // 예: router.push('/dashboard');
  };

  return (
    <div className={styles.pageContainer}>
      <NavBar />

      <main className={styles.mainContent}>
        <div className={styles.profileHeader}>
          <div className={styles.profileAvatar}>
            {profileData.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className={styles.profileInfo}>
            <h1 className={styles.profileName}>{profileData.name}</h1>
            <p className={styles.profileEmail}>{profileData.email}</p>
            <div className={styles.securityScore}>
              <span>🛡️</span>
              <span>보안 점수: 85/100</span>
            </div>
          </div>
          <button 
            onClick={navigateToDashboard} 
            className={`${styles.button} ${styles.dashboardButton}`}
          >
            <span className={styles.buttonIcon}>📊</span>
            대시보드
          </button>
        </div>

        <div className={styles.editCard}>
          <h2 className={styles.cardTitle}>
            <span className={styles.cardIcon}>👤</span>
            프로필 정보 편집
          </h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>이름</label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
                className={styles.formInput}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>이메일</label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
                className={styles.formInput}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>전화번호</label>
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleInputChange}
                className={styles.formInput}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>비밀번호</label>
              <input
                type="password"
                name="password"
                value={profileData.password}
                onChange={handleInputChange}
                className={styles.formInput}
                placeholder="새 비밀번호 입력"
              />
              <p className={styles.formHelp}>변경하려면 새 비밀번호를 입력하세요</p>
            </div>
            
            <div className={styles.buttonGroup}>
              <button type="submit" className={styles.button}>
                변경사항 저장
              </button>
              <button 
                type="button" 
                onClick={navigateToDashboard} 
                className={`${styles.button} ${styles.buttonOutline}`}
              >
                취소
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ProfileEditPage;