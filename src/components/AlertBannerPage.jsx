import React, { useState } from "react";
import styled, { keyframes } from "styled-components";

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  color: white;
`;

const NavBar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Logo = styled.div`
  height: 40px;
  svg {
    height: 100%;
    width: auto;
  }
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const AlertBanner = styled.div`
  background: ${(props) => {
    switch (props.$severity) {
      case "high":
        return "rgba(239, 68, 68, 0.1)";
      case "medium":
        return "rgba(234, 179, 8, 0.1)";
      default:
        return "rgba(59, 130, 246, 0.1)";
    }
  }};
  border-left: 4px solid
    ${(props) => {
      switch (props.$severity) {
        case "high":
          return "#ef4444";
        case "medium":
          return "#eab308";
        default:
          return "#3b82f6";
      }
    }};
  padding: 1rem 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  animation: ${fadeIn} 0.3s ease-out;
`;

const AlertContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AlertIcon = styled.span`
  font-size: 1.5rem;
`;

const AlertMessage = styled.div`
  display: flex;
  flex-direction: column;
`;

const AlertTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.25rem;
`;

const AlertDescription = styled.p`
  font-size: 0.875rem;
  color: #94a3b8;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  outline: none;
  transition: all 0.2s;
  resize: vertical;
  margin-bottom: 1rem;

  &:focus {
    border-color: #2563eb;
    background: rgba(37, 99, 235, 0.1);
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${(props) =>
    props.$variant === "outline"
      ? "transparent"
      : "linear-gradient(90deg, #2563eb, #1d4ed8)"};
  color: white;
  border: ${(props) =>
    props.$variant === "outline"
      ? "1px solid rgba(255, 255, 255, 0.1)"
      : "none"};
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    opacity: 0.9;
    background: ${(props) =>
      props.$variant === "outline"
        ? "rgba(255, 255, 255, 0.05)"
        : "linear-gradient(90deg, #2563eb, #1d4ed8)"};
  }
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: bold;
  color: white;
  margin-bottom: 2rem;
`;

const HistoryCard = styled(Card)``;

const HistoryTitle = styled.h3`
  font-size: 1.25rem;
  color: white;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const HistoryItem = styled.div`
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
`;

const HistoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const HistoryDate = styled.span`
  font-size: 0.875rem;
  color: #94a3b8;
`;

const Tags = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
`;

const Tag = styled.span`
  padding: 0.25rem 0.75rem;
  background: rgba(37, 99, 235, 0.2);
  color: #60a5fa;
  border-radius: 9999px;
  font-size: 0.75rem;
`;

const AlertBannerPage = () => {
  const [text, setText] = useState("");
  const [currentAlert, setCurrentAlert] = useState({
    severity: "high",
    message: "⚠️ 민감한 정보가 감지되었습니다. 공유 전에 수정하세요.",
    description: "주민등록번호와 전화번호가 포함되어 있습니다.",
  });

  const alertHistory = [
    {
      date: "2024-02-10 14:30",
      severity: "high",
      message: "민감한 개인정보 감지",
      categories: ["주민등록번호", "전화번호"],
      action: "자동 수정",
    },
    {
      date: "2024-02-10 11:15",
      severity: "medium",
      message: "잠재적 개인정보 감지",
      categories: ["이메일", "주소"],
      action: "수동 수정",
    },
  ];

  const handleAutoFix = () => {
    // 자동 수정 로직
    const newText = text
      .replace(/\d{6}-\d{7}/g, "******-*******") // 주민등록번호
      .replace(/010-\d{4}-\d{4}/g, "010-****-****"); // 전화번호
    setText(newText);
  };

  return (
    <PageContainer>
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
        <Title>위험 정보 알림</Title>

        <AlertBanner $severity={currentAlert.severity}>
          <AlertContent>
            <AlertIcon>⚠️</AlertIcon>
            <AlertMessage>
              <AlertTitle>{currentAlert.message}</AlertTitle>
              <AlertDescription>{currentAlert.description}</AlertDescription>
            </AlertMessage>
          </AlertContent>
        </AlertBanner>

        <Card>
          <TextArea
            placeholder="텍스트를 입력하세요..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <ButtonGroup>
            <Button onClick={handleAutoFix}>🔒 자동 수정</Button>
            <Button $variant="outline">✏️ 수동 수정</Button>
          </ButtonGroup>
        </Card>

        <HistoryCard>
          <HistoryTitle>
            <span>알림 이력</span>
            <Tag>{alertHistory.length}건</Tag>
          </HistoryTitle>
          <HistoryList>
            {alertHistory.map((history, index) => (
              <HistoryItem key={index}>
                <HistoryHeader>
                  <AlertTitle>{history.message}</AlertTitle>
                  <HistoryDate>{history.date}</HistoryDate>
                </HistoryHeader>
                <Tags>
                  {history.categories.map((category, i) => (
                    <Tag key={i}>#{category}</Tag>
                  ))}
                  <Tag>#{history.action}</Tag>
                </Tags>
              </HistoryItem>
            ))}
          </HistoryList>
        </HistoryCard>
      </MainContent>
    </PageContainer>
  );
};

export default AlertBannerPage;
