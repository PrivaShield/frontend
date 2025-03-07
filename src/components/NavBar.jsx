import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../contexts/UserContext"; // UserContext 가져오기
import styles from "../styles/NavBar.module.css";

const NavBar = ({ scrolled }) => {
  const navigate = useNavigate();
  const { user, logout } = useUser(); // 전역 사용자 컨텍스트 사용

  const handleStartClick2 = (features) => {
    navigate(`/?scrollTo=${features}`);
  };

  const handleStartClick = () => {
    navigate("/login");
  };

  const handleMyPageClick = () => {
    navigate("/mypage");
  };

  const handleDashboardClick = () => {
    navigate("/dashboard");
  };

  const handleLogout = () => {
    logout(); // 컨텍스트의 로그아웃 메서드 사용
    alert("로그아웃 되었습니다.");
    window.location.href = "/"; // 홈페이지로 새로고침
  };

  return (
    <nav className={`${styles.navBar} ${scrolled ? styles.scrolled : ""}`}>
      <div
        className={styles.logo}
        onClick={() => (window.location.href = "#topOfPage")}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 50">
          <path
            d="M40 10 L50 15 L50 35 L40 40 L30 35 L30 15 Z"
            fill="#2563eb"
          />
          <path
            d="M40 12 L48 16 L48 34 L40 38 L32 34 L32 16 Z"
            fill="#1d4ed8"
          />
          <circle cx="40" cy="22" r="2" fill="white" />
          <rect x="38" y="24" width="4" height="8" rx="1" fill="white" />
          <foreignObject x="60" y="9" width="140" height="30">
            <div
              xmlns="http://www.w3.org/1999/xhtml"
              style={{
                fontFamily: "Arial",
                fontWeight: "bold",
                fontSize: "24px",
                color: "#e2e8f0",
              }}
            >
              Priva<span style={{ color: "#2563eb" }}>Shield</span>
            </div>
          </foreignObject>
        </svg>
      </div>
      <div className={styles.navLinks}>
        <a
          href="#features"
          className={styles.navLink}
          onClick={() => handleStartClick2("features")}
        >
          기능
        </a>
        <a
          href="#howto"
          className={styles.navLink}
          onClick={() => handleStartClick2("howto")}
        >
          이용방법
        </a>
        {user ? (
          <>
            <a className={styles.navLink} onClick={handleDashboardClick}>
              대시보드
            </a>
            <div className={styles.userInfo}>
              안녕하세요,
              <span className={styles.welcomeText} onClick={handleMyPageClick}>
                {user.user_name}
              </span>
              님
              <button className={styles.logoutButton} onClick={handleLogout}>
                로그아웃
              </button>
            </div>
          </>
        ) : (
          <button className={styles.loginButton} onClick={handleStartClick}>
            로그인
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
