import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../styles/HeroPage.module.css";
import NavBar from "./NavBar";

// Animated Shield Icon Component
const AnimatedShield = () => {
  return (
    <div className={styles.shieldIconContainer}>
      <div className={styles.shieldPulse}></div>
      <div className={styles.shieldIcon}>
        <svg viewBox="0 0 24 24">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
        </svg>
      </div>
      <div className={styles.dataPoints}>
        {[...Array(8)].map((_, i) => (
          <div 
            key={i} 
            className={styles.dataPoint}
            style={{
              animationDelay: `${i * 0.3}s`,
              transform: `rotate(${i * 45}deg) translateX(80px)`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description, delay }) => {
  return (
    <div 
      className={styles.featureCard}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className={styles.featureIcon}>{icon}</div>
      <h3 className={styles.featureTitle}>{title}</h3>
      <p className={styles.featureDescription}>{description}</p>
    </div>
  );
};

// Main Hero Page Component
const HeroPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [scrolled, setScrolled] = useState(false);
  const [copied, setCopied] = useState(false);
  const [user, setUser] = useState(null);
  const heroContainerRef = useRef(null);
  
  useEffect(() => {
    // Check if user is logged in - replace this with your actual auth check
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }    
  }, []);
  

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // React 방식으로 데이터 버블 생성 - DOM 직접 조작 대신 상태 사용
    const bubbles = [];
    let intervalId;
    
    if (heroContainerRef.current) {
      intervalId = setInterval(() => {
        // 상태 업데이트는 컴포넌트 내부에서 처리
        const posX = Math.random() * 100;
        const id = Date.now();
        
        bubbles.push({ id, posX });
        
        // 8초 후에 버블 제거
        setTimeout(() => {
          const index = bubbles.findIndex(bubble => bubble.id === id);
          if (index !== -1) {
            bubbles.splice(index, 1);
          }
        }, 8000);
      }, 800);
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(intervalId);
    };
  }, []);

  const handleStartClick = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  const handleCopyCode = (code) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => {
          console.error('복사에 실패했습니다:', err);
        });
    } else {
      console.warn('Clipboard API를 지원하지 않는 브라우저입니다.');
    }
  };

  // 북마크릿 코드 - 로그인 시에만 실제 코드를 보여줄 것임
  const bookmarkletCode = `일단 비워둠`;

  return (
    <>
      <div id="topOfPage" className={styles.heroContainer} ref={heroContainerRef}>
        <NavBar scrolled={scrolled} />

        <main className={styles.mainContent}>
          <div className={styles.heroText}>
            <div className={styles.tagline}>
              <span className={styles.tag}>개인정보 보호</span>
              <span className={styles.tag}>AI 기반</span>
              <span className={styles.tag}>실시간 감지</span>
            </div>
            <h1 className={styles.title}>
              AI <span className={styles.highlight}>기반</span> 민감정보 <span className={styles.highlight}>보호</span>
              <br />더 <span className={styles.highlight}>안전한</span> 데이터 관리
            </h1>
            <p className={styles.subtitle}>
              PrivaShield의 강력한 AI 엔진으로 중요한 데이터를 안전하게
              보호하세요. 실시간 모니터링과 자동화된 보안 시스템으로 당신의
              정보를 지켜드립니다.
            </p>
            <div className={styles.securityBadge}>
              <div className={styles.badgeIcon}>
                <svg viewBox="0 0 24 24">
                  <path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z"/>
                </svg>
              </div>
              <p className={styles.badgeText}>
                <strong>100% 안심 :</strong> PrivaShield는 분석한 개인 민감 정보를 절대 저장하지 않습니다.
              </p>
            </div>
            <button className={styles.ctaButton} onClick={handleStartClick}>
              <span>{user ? "대시보드로 이동" : "지금 시작하기"}</span>
              <svg viewBox="0 0 24 24">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
              </svg>
            </button>
          </div>

          <div className={styles.heroImageContainer}>
            <div className={styles.circuitGrid}></div>
            <AnimatedShield />
          </div>
        </main>
        
        <div className={styles.scrollIndicator}>
          <span>자세히 알아보기</span>
          <svg viewBox="0 0 24 24">
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
          </svg>
        </div>
      </div>

      <section id="features" className={styles.featuresSection}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.titleHighlight}>PrivaShield</span>의 주요 기능
            </h2>
            <p className={styles.sectionSubtitle}>
              AI 기반 기술로 당신의 민감한 정보를 실시간으로 보호합니다
            </p>
          </div>

          <div className={styles.featuresGrid}>
            <FeatureCard 
              icon={
                <svg viewBox="0 0 24 24">
                  <path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z"/>
                </svg>
              }
              title="위험 텍스트 실시간 감지"
              description="AI가 민감한 개인정보와 위험 텍스트를 실시간으로 감지하여 대체 텍스트를 제안하고 위험 정보 배너로 알려드립니다."
              delay={0.1}
            />
            <FeatureCard 
              icon={
                <svg viewBox="0 0 24 24">
                  <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM5 10h9v2H5zm0-4h9v2H5zm0 8h5v2H5z"/>
                </svg>
              }
              title="위험 콘텐츠 시각화"
              description="생성형 AI 대화 내용 중 위험 콘텐츠를 자동으로 분석하고 직관적인 그래프로 시각화하여 제공합니다."
              delay={0.3}
            />
            <FeatureCard 
              icon={
                <svg viewBox="0 0 24 24">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
              }
              title="민감 정보 공유 방지"
              description="실수로 중요한 정보를 공유하기 전에 사전 알림과 보안 대책을 제공하여 정보 유출을 방지합니다."
              delay={0.5}
            />
          </div>
          
          <div className={styles.demoContainer}>
            <div className={styles.demoAnimation}>
              <div className={styles.demoScreen}>
                <div className={styles.demoHeader}>
                  <div className={styles.demoCircle}></div>
                  <div className={styles.demoCircle}></div>
                  <div className={styles.demoCircle}></div>
                </div>
                <div className={styles.demoContent}>
                  <div className={styles.chatBubble}>
                    안녕하세요, 제 개인정보는 010-1234-5678이고...
                  </div>
                  <div className={styles.alertBanner}>
                    <svg viewBox="0 0 24 24">
                      <path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z"/>
                    </svg>
                    <span>민감 정보가 감지되었습니다!</span>
                  </div>
                  <div className={styles.chatBubble}>
                    안녕하세요, 제 개인정보는 [전화번호]이고...
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.demoText}>
              <h3>실시간으로 작동하는 보호 시스템</h3>
              <p>PrivaShield는 입력 순간부터 실시간으로 민감 정보를 감지하고 안전한 대체 텍스트를 제안합니다. 당신이 주의를 기울이지 않더라도 PrivaShield는 항상 깨어있습니다.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="howto" className={styles.howtoSection}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.titleHighlight}>간단한</span> 이용 방법
            </h2>
            <p className={styles.sectionSubtitle}>
              PrivaShield를 쉽고, 빠르게 설치하여 지금 바로 이용해보세요
            </p>
          </div>

          {/* 로그인 여부에 따른 컨텐츠 표시 방식 변경 */}
          {user ? (
            <div className={styles.stepsContainer}>
              {[
                {
                  number: 1,
                  title: "북마크바 열기",
                  description: "Chrome 브라우저에서 Ctrl+Shift+B (Windows) 또는 Command+Shift+B (Mac)를 눌러 북마크바를 엽니다.",
                  icon: <svg viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" /></svg>
                },
                {
                  number: 2,
                  title: "북마크 추가하기",
                  description: "북마크바의 빈 공간에서 우클릭 후 '페이지 추가'를 선택합니다. 이름은 'PrivaShield 개인정보 감지'로 설정해주세요.",
                  icon: <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>
                },
                {
                  number: 3,
                  title: "코드 붙여넣기",
                  description: "URL 필드에 아래 코드를 붙여넣습니다:",
                  code: bookmarkletCode,
                  icon: <svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" /></svg>
                },
                {
                  number: 4,
                  title: "사용하기",
                  description: "ChatGPT 페이지에서 북마크를 클릭하면 개인정보 감지 기능이 활성화됩니다. 새로고침 시 재실행이 필요합니다.",
                  icon: <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
                }
              ].map((step, index) => (
                <div key={index} className={styles.stepCard}>
                  <div className={styles.stepIconContainer}>
                    <div className={styles.stepIcon}>{step.icon}</div>
                    <div className={styles.stepNumber}>{step.number}</div>
                  </div>
                  <div className={styles.stepContent}>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                    <p className={styles.stepDescription}>{step.description}</p>
                    {step.code && (
                      <div className={styles.codeBlockContainer}>
                        <div className={styles.codeBlock}>
                          <div className={styles.codeContent}>{step.code}</div>
                          <div
                            className={styles.codeCopy}
                            onClick={() => handleCopyCode(step.code)}
                          >
                            <svg viewBox="0 0 24 24">
                              <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                            </svg>
                            <span>{copied ? "복사됨!" : "복사하기"}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* 로그인 전에는 블러 처리된 영역과 로그인 유도 메시지 표시 */
            <div className={styles.lockedContentContainer}>
              <div className={styles.blurredContent}>
                {[
                  {
                    number: 1,
                    title: "북마크바 열기",
                    description: "Chrome 브라우저에서 Ctrl+Shift+B (Windows) 또는 Command+Shift+B (Mac)를 눌러 북마크바를 엽니다.",
                    icon: <svg viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" /></svg>
                  },
                  {
                    number: 2,
                    title: "북마크 추가하기",
                    description: "북마크바의 빈 공간에서 우클릭 후 '페이지 추가'를 선택합니다. 이름은 'PrivaShield 개인정보 감지'로 설정해주세요.",
                    icon: <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>
                  },
                  {
                    number: 3,
                    title: "코드 붙여넣기",
                    description: "URL 필드에 아래 코드를 붙여넣습니다:",
                    code: "***** 로그인 후 확인 가능 *****",
                    icon: <svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" /></svg>
                  },
                  {
                    number: 4,
                    title: "사용하기",
                    description: "ChatGPT 페이지에서 북마크를 클릭하면 개인정보 감지 기능이 활성화됩니다. 새로고침 시 재실행이 필요합니다.",
                    icon: <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
                  }
                ].map((step, index) => (
                  <div key={index} className={`${styles.stepCard} ${styles.blurred}`}>
                    <div className={styles.stepIconContainer}>
                      <div className={styles.stepIcon}>{step.icon}</div>
                      <div className={styles.stepNumber}>{step.number}</div>
                    </div>
                    <div className={styles.stepContent}>
                      <h3 className={styles.stepTitle}>{step.title}</h3>
                      <p className={styles.stepDescription}>{step.description}</p>
                      {step.code && (
                        <div className={styles.codeBlockContainer}>
                          <div className={styles.codeBlock}>
                            <div className={styles.codeContent}>{step.code}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.loginPrompt}>
                <div className={styles.lockIcon}>
                  <svg viewBox="0 0 24 24">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                  </svg>
                </div>
                <h3>로그인 후 이용 가능합니다</h3>
                <p>PrivaShield의 전체 기능을 이용하시려면 로그인이 필요합니다.</p>
                <button className={styles.loginButton} onClick={() => navigate("/login")}>로그인하기</button>
              </div>
            </div>
          )}

          <div className={styles.ctaSection}>
            <h3 className={styles.ctaTitle}>지금 바로 시작하세요</h3>
            <p className={styles.ctaText}>PrivaShield와 함께 개인정보를 안전하게 보호하세요.</p>
            <button className={styles.ctaButton} onClick={handleStartClick}>
              {user ? "대시보드로 이동" : "로그인하기"}
            </button>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>PrivaShield</h4>
            <p className={styles.footerText}>
              AI 기반 개인정보 보호 솔루션으로 데이터의 안전을 지켜드립니다.
            </p>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>제품</h4>
            <a href="#howto" className={styles.footerLink}>서비스 소개</a>
            <a href="#features" className={styles.footerLink}>기능</a>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.footerTitle}>연락처</h4>
            <p className={styles.footerText}>이메일: support@privashield.com</p>
            <p className={styles.footerText}>전화: 1234-5678</p>
            <p className={styles.footerText}>주소: 서울특별시 강남구</p>
          </div>
        </div>

        <div className={styles.footerBottom}>
          © 2024 PrivaShield. All rights reserved. | 개인정보 처리방침 | 서비스 약관
        </div>
      </footer>
    </>
  );
};

export default HeroPage;