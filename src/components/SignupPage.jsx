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

const SignupCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2.5rem;
  border-radius: 16px;
  width: 100%;
  max-width: 480px;
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

const ErrorText = styled.span`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
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

const LoginLink = styled.button`
  width: 100%;
  padding: 0.875rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const AnimatedCircuit = styled.div`
  position: absolute;
  width: 800px;
  height: 800px;
  border: 1px solid rgba(37, 99, 235, 0.1);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;

  &::before {
    content: "";
    position: absolute;
    width: 600px;
    height: 600px;
    border: 1px solid rgba(37, 99, 235, 0.15);
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &::after {
    content: "";
    position: absolute;
    width: 400px;
    height: 400px;
    border: 1px solid rgba(37, 99, 235, 0.2);
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const RequirementText = styled.p`
  color: #94a3b8;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: start;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const Checkbox = styled.input`
  margin-top: 0.25rem;
`;

const TermsText = styled.p`
  color: #94a3b8;
  font-size: 0.875rem;
  line-height: 1.5;

  a {
    color: #2563eb;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // 에러 메시지 초기화
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // 이메일 검증
    if (!formData.email.includes("@")) {
      newErrors.email = "올바른 이메일 주소를 입력해주세요";
    }

    // 비밀번호 검증
    if (formData.password.length < 8) {
      newErrors.password = "비밀번호는 8자 이상이어야 합니다";
    }

    // 비밀번호 확인
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다";
    }

    // 이름 검증
    if (formData.name.length < 2) {
      newErrors.name = "이름을 입력해주세요";
    }

    // 전화번호 검증
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "올바른 전화번호를 입력해주세요";
    }

    // 약관 동의 검증
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "서비스 이용약관에 동의해주세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("회원가입 시도:", formData);
    }
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
        <SignupCard>
          <Title>회원가입</Title>
          <Subtitle>PrivaShield와 함께 시작하세요</Subtitle>

          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && <ErrorText>{errors.email}</ErrorText>}
            </InputGroup>

            <InputGroup>
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <RequirementText>
                8자 이상의 비밀번호를 입력해주세요
              </RequirementText>
              {errors.password && <ErrorText>{errors.password}</ErrorText>}
            </InputGroup>

            <InputGroup>
              <Label htmlFor="confirmPassword">비밀번호 확인</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              {errors.confirmPassword && (
                <ErrorText>{errors.confirmPassword}</ErrorText>
              )}
            </InputGroup>

            <InputGroup>
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="이름을 입력하세요"
                value={formData.name}
                onChange={handleChange}
                required
              />
              {errors.name && <ErrorText>{errors.name}</ErrorText>}
            </InputGroup>

            <InputGroup>
              <Label htmlFor="phone">전화번호</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="'-' 없이 입력해주세요"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              {errors.phone && <ErrorText>{errors.phone}</ErrorText>}
            </InputGroup>

            <CheckboxGroup>
              <Checkbox
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
              />
              <TermsText>
                <Label htmlFor="agreeToTerms">
                  <a href="#">서비스 이용약관</a>과{" "}
                  <a href="#">개인정보처리방침</a>에 동의합니다
                </Label>
                {errors.agreeToTerms && (
                  <ErrorText>{errors.agreeToTerms}</ErrorText>
                )}
              </TermsText>
            </CheckboxGroup>

            <Button type="submit">회원가입</Button>
          </Form>

          <Divider>
            <DividerText>또는</DividerText>
          </Divider>

          <LoginLink type="button">로그인하기</LoginLink>
        </SignupCard>
      </MainContent>
    </PageContainer>
  );
};

export default SignupPage;
