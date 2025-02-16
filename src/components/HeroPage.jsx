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

const GuidelineSection = styled.section`
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
  padding: 6rem 2rem;
  color: white;
`;

const GuidelineContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const GuidelineTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 3rem;
  text-align: center;
  color: #e2e8f0;
`;

const StepGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const StepCard = styled.div`
  background: rgba(37, 99, 235, 0.1);
  border: 1px solid rgba(37, 99, 235, 0.2);
  border-radius: 12px;
  padding: 2rem;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const StepNumber = styled.div`
  background: #2563eb;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const StepTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #e2e8f0;
`;

const StepDescription = styled.p`
  color: #94a3b8;
  line-height: 1.6;
`;

const CodeBlock = styled.div`
  background: rgba(15, 23, 42, 0.5);
  border-radius: 6px;
  padding: 0.75rem 1rem;
  margin: 0.5rem 0;
  font-family: monospace;
  color: #e2e8f0;
  font-size: 0.9rem;
  word-break: break-all;
  white-space: pre-wrap;
  cursor: pointer;
  position: relative;
  transition: background-color 0.2s;

  &:hover {
    background: rgba(15, 23, 42, 0.7);
  }

  &::after {
    content: "클릭하여 복사";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(37, 99, 235, 0.9);
    padding: 0.5rem 1rem;
    border-radius: 4px;
    opacity: 0;
    transition: opacity 0.2s;
    pointer-events: none;
  }

  &:hover::after {
    opacity: 1;
  }
`;

const SmallText = styled.small`
  color: #94a3b8;
  display: block;
  margin-top: 0.5rem;
  font-size: 0.875rem;
`;

const Footer = styled.footer`
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
  color: white;
  padding: 4rem 2rem;
`;

const FooterContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterTitle = styled.h4`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #e2e8f0;
`;

const FooterLink = styled.a`
  color: #94a3b8;
  text-decoration: none;
  margin-bottom: 0.75rem;
  transition: color 0.2s;

  &:hover {
    color: #2563eb;
  }
`;

const FooterText = styled.p`
  color: #94a3b8;
  line-height: 1.6;
`;

const FooterBottom = styled.div`
  background: rgba(37, 99, 235, 0.1);
  color: #94a3b8;
  text-align: center;
  padding: 1.5rem 2rem;
  border-top: 1px solid rgba(37, 99, 235, 0.2);
`;

const CodeBlockWithCopy = ({ children }) => {
  const handleClick = () => {
    navigator.clipboard
      .writeText(children)
      .then(() => alert("코드가 클립보드에 복사되었습니다!"))
      .catch(() => alert("복사에 실패했습니다. 직접 선택하여 복사해주세요."));
  };

  return <CodeBlock onClick={handleClick}>{children}</CodeBlock>;
};

const HeroPage = () => {
  return (
    <>
      <HeroContainer>
        <NavBar>
          <Logo>
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
        </NavBar>

        <MainContent>
          <HeroText>
            <Title>
              AI 기반 민감정보 보호
              <br />더 안전한 데이터 관리
            </Title>
            <Subtitle>
              PrivaShield의 강력한 AI 엔진으로 중요한 데이터를 안전하게
              보호하세요. 실시간 모니터링과 자동화된 보안 시스템으로 당신의
              정보를 지켜드립니다.
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

      <GuidelineSection>
        <GuidelineContainer>
          <GuidelineTitle>간편한 설치 가이드</GuidelineTitle>
          <StepGrid>
            {[
              {
                number: 1,
                title: "북마크바 열기",
                description:
                  "Chrome 브라우저에서 Ctrl+Shift+B (Windows) 또는 Command+Shift+B (Mac)를 눌러 북마크바를 엽니다.",
              },
              {
                number: 2,
                title: "북마크 추가하기",
                description:
                  "북마크바의 빈 공간에서 우클릭 후 '페이지 추가'를 선택합니다. 이름은 'GPT 개인정보 감지'로 설정해주세요.",
              },
              {
                number: 3,
                title: "코드 붙여넣기",
                description: "URL 필드에 아래 코드를 붙여넣습니다:",
                code: `javascript:(function(){let inputBox=document.querySelector("div[contenteditable='true']");if(!inputBox){alert("❌ 입력창을 찾을 수 없습니다. GPT 페이지에서 실행해주세요!");return;}function checkSensitiveInfo(text){let patterns=[/\\b\\d{2,3}-\\d{3,4}-\\d{4}\\b/,/\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b/,/\\b\\d{6}-\\d{7}\\b/];for(let pattern of patterns){if(pattern.test(text)){alert("⚠️ 개인정보가 포함된 것 같아요! 전송 전에 다시 확인해주세요.");return;}}}inputBox.addEventListener("input",function(event){checkSensitiveInfo(event.target.innerText);});alert("✅ 개인정보 감지 기능이 활성화되었습니다!")})();`,
              },
              {
                number: 4,
                title: "사용하기",
                description:
                  "ChatGPT 페이지에서 북마크를 클릭하면 개인정보 감지 기능이 활성화됩니다. 새로고침 시 재실행이 필요합니다.",
              },
            ].map((step) => (
              <StepCard key={step.number}>
                <StepNumber>{step.number}</StepNumber>
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
                {step.code && (
                  <>
                    <CodeBlockWithCopy>{step.code}</CodeBlockWithCopy>
                    <SmallText>
                      * 코드를 클릭하여 복사하거나 전체 선택하여 복사해주세요.
                    </SmallText>
                  </>
                )}
              </StepCard>
            ))}
          </StepGrid>
        </GuidelineContainer>
      </GuidelineSection>

      <Footer>
        <FooterContainer>
          <FooterSection>
            <FooterTitle>PrivaShield</FooterTitle>
            <FooterText>
              AI 기반 개인정보 보호 솔루션으로 데이터의 안전을 지켜드립니다.
            </FooterText>
          </FooterSection>

          <FooterSection>
            <FooterTitle>제품</FooterTitle>
            <FooterLink href="#">서비스 소개</FooterLink>
            <FooterLink href="#">기능</FooterLink>
            <FooterLink href="#">가격</FooterLink>
            <FooterLink href="#">고객 사례</FooterLink>
          </FooterSection>

          <FooterSection>
            <FooterTitle>고객 지원</FooterTitle>
            <FooterLink href="#">도움말 센터</FooterLink>
            <FooterLink href="#">문의하기</FooterLink>
            <FooterLink href="#">FAQ</FooterLink>
            <FooterLink href="#">튜토리얼</FooterLink>
          </FooterSection>

          <FooterSection>
            <FooterTitle>연락처</FooterTitle>
            <FooterText>이메일: support@privashield.com</FooterText>
            <FooterText>전화: 1234-5678</FooterText>
            <FooterText>주소: 서울특별시 강남구</FooterText>
          </FooterSection>
        </FooterContainer>

        <FooterBottom>
          © 2024 PrivaShield. All rights reserved. | 개인정보 처리방침 | 서비스
          약관
        </FooterBottom>
      </Footer>
    </>
  );
};

export default HeroPage;
