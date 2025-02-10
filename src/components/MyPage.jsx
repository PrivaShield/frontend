import React, { useState } from "react";
import styled from "styled-components";

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

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 3rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const ProfileAvatar = styled.div`
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: bold;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const ProfileEmail = styled.p`
  color: #94a3b8;
  margin-bottom: 1rem;
`;

const SecurityScore = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(37, 99, 235, 0.1);
  border-radius: 9999px;
  color: #60a5fa;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 12px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #2563eb, #1d4ed8);
  }
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CardIcon = styled.span`
  font-size: 1.5rem;
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }
`;

const SettingLabel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const SettingTitle = styled.span`
  font-weight: 500;
`;

const SettingDescription = styled.span`
  font-size: 0.875rem;
  color: #94a3b8;
`;

const Toggle = styled.button`
  width: 48px;
  height: 24px;
  background: ${(props) =>
    props.$active ? "#2563eb" : "rgba(255, 255, 255, 0.1)"};
  border-radius: 9999px;
  position: relative;
  transition: background-color 0.2s;
  border: none;
  cursor: pointer;

  &::after {
    content: "";
    position: absolute;
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    top: 2px;
    left: ${(props) => (props.$active ? "26px" : "2px")};
    transition: left 0.2s;
  }
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
`;

const ActivityIcon = styled.div`
  width: 40px;
  height: 40px;
  background: rgba(37, 99, 235, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
`;

const ActivityInfo = styled.div`
  flex: 1;
`;

const ActivityTitle = styled.div`
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const ActivityTime = styled.div`
  font-size: 0.875rem;
  color: #94a3b8;
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

  &:hover {
    opacity: 0.9;
    background: ${(props) =>
      props.$variant === "outline"
        ? "rgba(255, 255, 255, 0.05)"
        : "linear-gradient(90deg, #2563eb, #1d4ed8)"};
  }
`;

const MyPage = () => {
  const [settings, setSettings] = useState({
    twoFactor: true,
    emailAlerts: true,
    autoProtect: false,
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const recentActivity = [
    {
      icon: "🔒",
      title: "민감 정보 자동 수정",
      time: "10분 전",
    },
    {
      icon: "⚠️",
      title: "새로운 보안 위험 감지",
      time: "1시간 전",
    },
    {
      icon: "✏️",
      title: "보안 설정 변경",
      time: "어제",
    },
  ];

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
        <ProfileHeader>
          <ProfileAvatar>JD</ProfileAvatar>
          <ProfileInfo>
            <ProfileName>John Doe</ProfileName>
            <ProfileEmail>john.doe@example.com</ProfileEmail>
            <SecurityScore>
              <span>🛡️</span>
              <span>보안 점수: 85/100</span>
            </SecurityScore>
          </ProfileInfo>
          <Button>프로필 편집</Button>
        </ProfileHeader>

        <Grid>
          <Card>
            <CardTitle>
              <CardIcon>🔒</CardIcon>
              보안 설정
            </CardTitle>
            <SettingItem>
              <SettingLabel>
                <SettingTitle>2단계 인증</SettingTitle>
                <SettingDescription>
                  추가 보안을 위한 2단계 인증을 사용합니다
                </SettingDescription>
              </SettingLabel>
              <Toggle
                $active={settings.twoFactor}
                onClick={() => toggleSetting("twoFactor")}
              />
            </SettingItem>
            <SettingItem>
              <SettingLabel>
                <SettingTitle>이메일 알림</SettingTitle>
                <SettingDescription>
                  보안 위험 감지 시 이메일로 알립니다
                </SettingDescription>
              </SettingLabel>
              <Toggle
                $active={settings.emailAlerts}
                onClick={() => toggleSetting("emailAlerts")}
              />
            </SettingItem>
            <SettingItem>
              <SettingLabel>
                <SettingTitle>자동 보호</SettingTitle>
                <SettingDescription>
                  감지된 민감 정보를 자동으로 수정합니다
                </SettingDescription>
              </SettingLabel>
              <Toggle
                $active={settings.autoProtect}
                onClick={() => toggleSetting("autoProtect")}
              />
            </SettingItem>
          </Card>

          <Card>
            <CardTitle>
              <CardIcon>📋</CardIcon>
              최근 활동
            </CardTitle>
            <ActivityList>
              {recentActivity.map((activity, index) => (
                <ActivityItem key={index}>
                  <ActivityIcon>{activity.icon}</ActivityIcon>
                  <ActivityInfo>
                    <ActivityTitle>{activity.title}</ActivityTitle>
                    <ActivityTime>{activity.time}</ActivityTime>
                  </ActivityInfo>
                </ActivityItem>
              ))}
            </ActivityList>
          </Card>

          <Card>
            <CardTitle>
              <CardIcon>📊</CardIcon>
              보안 통계
            </CardTitle>
            <SettingItem>
              <SettingLabel>
                <SettingTitle>감지된 위험 요소</SettingTitle>
                <SettingDescription>지난 30일 동안</SettingDescription>
              </SettingLabel>
              <span>523건</span>
            </SettingItem>
            <SettingItem>
              <SettingLabel>
                <SettingTitle>자동 수정된 텍스트</SettingTitle>
                <SettingDescription>지난 30일 동안</SettingDescription>
              </SettingLabel>
              <span>128건</span>
            </SettingItem>
            <SettingItem>
              <SettingLabel>
                <SettingTitle>보안 점수 향상</SettingTitle>
                <SettingDescription>지난 달 대비</SettingDescription>
              </SettingLabel>
              <span style={{ color: "#10b981" }}>+15%</span>
            </SettingItem>
          </Card>
        </Grid>
      </MainContent>
    </PageContainer>
  );
};

export default MyPage;
