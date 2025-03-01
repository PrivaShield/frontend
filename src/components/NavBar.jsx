import React from "react";
import { useNavigate, useLocation} from "react-router-dom";
import styles from "../styles/NavBar.module.css";

const NavBar = ({ scrolled }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleStartClick2 = (features) => {
    if (location.pathname === "/") {
      const element = document.getElementById(features);
      if (element) {
        const navBarHeight = document.querySelector(`.${styles.navBar}`)?.offsetHeight || 80;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
  
        window.scrollTo({
          top: elementPosition - navBarHeight - 10, 
          behavior: "smooth",
        });
      }
    } else {
      navigate(`/?scrollTo=${features}`);
    }
  };

  const handleStartClick = () => {
    navigate("/login");
  };

  return (
    <nav className={`${styles.navBar} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.logo} onClick={() => navigate("/")}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 50">
          <path d="M40 10 L50 15 L50 35 L40 40 L30 35 L30 15 Z" fill="#2563eb" />
          <path d="M40 12 L48 16 L48 34 L40 38 L32 34 L32 16 Z" fill="#1d4ed8" />
          <circle cx="40" cy="22" r="2" fill="white" />
          <rect x="38" y="24" width="4" height="8" rx="1" fill="white" />
          <foreignObject x="60" y="9" width="140" height="30">
            <div xmlns="http://www.w3.org/1999/xhtml" style={{ fontFamily: 'Arial', fontWeight: 'bold', fontSize: '24px', color: '#e2e8f0' }}>
              Priva<span style={{ color: '#2563eb' }}>Shield</span>
            </div>
          </foreignObject>
        </svg>
      </div>
      <div className={styles.navLinks}>
        <a href="#features" className={styles.navLink} onClick={handleStartClick2}>기능</a>
        <a href="#howto" className={styles.navLink}>이용방법</a>
        <button className={styles.loginButton} onClick={handleStartClick}>로그인</button>
      </div>
    </nav>
  );
};

export default NavBar;
