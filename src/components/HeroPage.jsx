import React from "react";
import styled from "styled-components";

const HeroContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  color: white;
  position: relative;
  overflow: hidden;
`;

const NavBar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled.div`
  height: 50px;
  svg {
    height: 100%;
    width: auto;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const NavLink = styled.a`
  color: #e2e8f0;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;

  &:hover {
    color: #2563eb;
  }
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding: 2rem 1rem;
  }
`;

const HeroText = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: #94a3b8;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const CTAButton = styled.button`
  background-color: #2563eb;
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.125rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1d4ed8;
  }
`;

const HeroImage = styled.div`
  flex: 1;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 500px;
    height: 500px;
    background: radial-gradient(
      circle,
      rgba(37, 99, 235, 0.1) 0%,
      rgba(37, 99, 235, 0) 70%
    );
    transform: translate(-50%, -50%);
    z-index: 0;
  }
`;

const AnimatedCircuit = styled.div`
  position: absolute;
  width: 400px;
  height: 400px;
  border: 2px solid rgba(37, 99, 235, 0.2);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  &::before {
    content: "";
    position: absolute;
    width: 300px;
    height: 300px;
    border: 2px solid rgba(37, 99, 235, 0.3);
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &::after {
    content: "";
    position: absolute;
    width: 200px;
    height: 200px;
    border: 2px solid rgba(37, 99, 235, 0.4);
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const ShieldIcon = styled.div`
  position: relative;
  z-index: 1;
  width: 120px;
  height: 120px;
  background-color: rgba(37, 99, 235, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;

  svg {
    width: 60px;
    height: 60px;
    fill: #2563eb;
  }
`;

const HeroPage = () => {
  return (
    <HeroContainer>
      <NavBar>
        <Logo>
          {/* PrivaShield 로고 SVG 컴포넌트 */}
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
            <text
              x="60"
              y="35"
              fontFamily="Arial"
              fontWeight="bold"
              fontSize="24"
              fill="#e2e8f0"
            >
              Priva<tspan fill="#2563eb">Shield</tspan>
            </text>
          </svg>
        </Logo>
        <NavLinks>
          <NavLink href="#">기능</NavLink>
          <NavLink href="#">가격</NavLink>
          <NavLink href="#">문의하기</NavLink>
          <NavLink href="#" style={{ color: "#2563eb" }}>
            로그인
          </NavLink>
        </NavLinks>
      </NavBar>

      <MainContent>
        <HeroText>
          <Title>
            AI 기반 민감정보 보호
            <br />더 안전한 데이터 관리
          </Title>
          <Subtitle>
            PrivaShield의 강력한 AI 엔진으로 중요한 데이터를 안전하게
            보호하세요. 실시간 모니터링과 자동화된 보안 시스템으로 당신의 정보를
            지켜드립니다.
          </Subtitle>
          <CTAButton>시작하기</CTAButton>
        </HeroText>

        <HeroImage>
          <AnimatedCircuit />
          <ShieldIcon>
            <svg viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
            </svg>
          </ShieldIcon>
        </HeroImage>
      </MainContent>
    </HeroContainer>
  );
};

export default HeroPage;
