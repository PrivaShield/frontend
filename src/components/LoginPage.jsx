import React, { useState } from "react";
import styled from "styled-components";

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  color: white;
  display: flex;
  flex-direction: column;
`;

const NavBar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const Logo = styled.div`
  height: 50px;
  svg {
    height: 100%;
    width: auto;
  }
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const LoginCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2.5rem;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
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

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const Subtitle = styled.p`
  color: #94a3b8;
  text-align: center;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #e2e8f0;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: #2563eb;
    background: rgba(37, 99, 235, 0.1);
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
  }

  &::placeholder {
    color: #64748b;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(90deg, #2563eb, #1d4ed8);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const DividerText = styled.span`
  color: #94a3b8;
  font-size: 0.875rem;
`;

const SignUpButton = styled(Button)`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const AnimatedCircuit = styled.div`
  position: absolute;
  width: 600px;
  height: 600px;
  border: 1px solid rgba(37, 99, 235, 0.1);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;

  &::before {
    content: "";
    position: absolute;
    width: 400px;
    height: 400px;
    border: 1px solid rgba(37, 99, 235, 0.15);
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
    border: 1px solid rgba(37, 99, 235, 0.2);
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("로그인 시도:", { email, password });
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
        <AnimatedCircuit />
        <LoginCard>
          <Title>로그인</Title>
          <Subtitle>PrivaShield에 오신 것을 환영합니다</Subtitle>

          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </InputGroup>

            <InputGroup>
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </InputGroup>

            <Button type="submit">로그인</Button>
          </Form>

          <Divider>
            <DividerText>또는</DividerText>
          </Divider>

          <SignUpButton type="button">새 계정 만들기</SignUpButton>
        </LoginCard>
      </MainContent>
    </PageContainer>
  );
};

export default LoginPage;
