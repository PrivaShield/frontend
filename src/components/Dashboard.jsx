import React from "react";
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

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #e2e8f0;
`;

const MainContent = styled.main`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: bold;
  color: white;
  margin-bottom: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
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

const StatTitle = styled.h3`
  font-size: 0.875rem;
  color: #94a3b8;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.5rem;
`;

const StatSubtext = styled.p`
  font-size: 0.875rem;
  color: #64748b;
`;

const DataGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const DataCard = styled(StatCard)`
  padding: 1.5rem;
`;

const DataTitle = styled.h3`
  font-size: 1.125rem;
  color: white;
  margin-bottom: 1.5rem;
`;

const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem;
  color: #94a3b8;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Td = styled.td`
  padding: 1rem;
  color: #e2e8f0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
`;

const Progress = styled.div`
  width: ${(props) => props.$width}%;
  height: 100%;
  background: #2563eb;
  border-radius: 4px;
`;

const Dashboard = () => {
  const securityData = [
    { type: "주소", count: 150 },
    { type: "전화번호", count: 120 },
    { type: "이메일", count: 100 },
    { type: "주민번호", count: 80 },
    { type: "신용카드", count: 50 },
  ];

  const maxCount = Math.max(...securityData.map((item) => item.count));

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
        <UserInfo>
          <span>안녕하세요, 관리자님</span>
        </UserInfo>
      </NavBar>

      <MainContent>
        <Title>개인 안전 대시보드</Title>

        <StatsGrid>
          <StatCard>
            <StatTitle>감지된 위험 텍스트</StatTitle>
            <StatValue>523</StatValue>
            <StatSubtext>지난 30일 동안</StatSubtext>
          </StatCard>

          <StatCard>
            <StatTitle>안전 점수</StatTitle>
            <StatValue>85/100</StatValue>
            <StatSubtext>전월 대비 3% 상승</StatSubtext>
          </StatCard>

          <StatCard>
            <StatTitle>전세계 평균 대비</StatTitle>
            <StatValue>상위 15%</StatValue>
            <StatSubtext>안전한 수준입니다</StatSubtext>
          </StatCard>
        </StatsGrid>

        <DataGrid>
          <DataCard>
            <DataTitle>민감 정보 유형별 감지 횟수</DataTitle>
            <DataTable>
              <thead>
                <tr>
                  <Th>유형</Th>
                  <Th>횟수</Th>
                  <Th width="50%">분포</Th>
                </tr>
              </thead>
              <tbody>
                {securityData.map((item) => (
                  <tr key={item.type}>
                    <Td>{item.type}</Td>
                    <Td>{item.count}</Td>
                    <Td>
                      <ProgressBar>
                        <Progress $width={(item.count / maxCount) * 100} />
                      </ProgressBar>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </DataCard>
        </DataGrid>
      </MainContent>
    </PageContainer>
  );
};

export default Dashboard;
