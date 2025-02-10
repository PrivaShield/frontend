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

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: bold;
  color: white;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  color: #94a3b8;
  margin-bottom: 2rem;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const Input = styled.input`
  flex: 1;
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

const Select = styled.select`
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  outline: none;
  transition: all 0.2s;
  min-width: 150px;

  &:focus {
    border-color: #2563eb;
    background: rgba(37, 99, 235, 0.1);
  }

  option {
    background: #1e293b;
    color: white;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(90deg, #2563eb, #1d4ed8);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  white-space: nowrap;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CategoryTitle = styled.h2`
  font-size: 1.25rem;
  color: white;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const WordList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const WordItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const DeleteButton = styled.button`
  color: #ef4444;
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const Badge = styled.span`
  padding: 0.25rem 0.5rem;
  background: rgba(37, 99, 235, 0.2);
  color: #60a5fa;
  border-radius: 4px;
  font-size: 0.75rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #94a3b8;
  font-size: 0.875rem;
`;

const CustomWordsPage = () => {
  const [newWord, setNewWord] = useState("");
  const [category, setCategory] = useState("personal");
  const [wordList, setWordList] = useState({
    personal: ["주민등록번호", "여권번호", "운전면허번호"],
    contact: ["집 주소", "회사 주소", "휴대폰 번호"],
    financial: ["계좌번호", "카드번호", "비밀번호"],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newWord.trim()) {
      setWordList((prev) => ({
        ...prev,
        [category]: [...prev[category], newWord.trim()],
      }));
      setNewWord("");
    }
  };

  const handleDelete = (category, word) => {
    setWordList((prev) => ({
      ...prev,
      [category]: prev[category].filter((w) => w !== word),
    }));
  };

  const categories = {
    personal: "개인 정보",
    contact: "연락처 정보",
    financial: "금융 정보",
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
        <Title>민감 정보 설정</Title>
        <Subtitle>
          보호하고 싶은 민감한 단어나 문구를 추가하여 개인정보를 안전하게
          보호하세요.
        </Subtitle>

        <Card>
          <Form onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="보호하고 싶은 단어나 문구를 입력하세요"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
            />
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="personal">개인 정보</option>
              <option value="contact">연락처 정보</option>
              <option value="financial">금융 정보</option>
            </Select>
            <Button type="submit" disabled={!newWord.trim()}>
              추가하기
            </Button>
          </Form>
        </Card>

        {Object.entries(categories).map(([key, title]) => (
          <Card key={key}>
            <CategoryTitle>
              {title} <Badge>{wordList[key].length}개</Badge>
            </CategoryTitle>
            {wordList[key].length > 0 ? (
              <WordList>
                {wordList[key].map((word, index) => (
                  <WordItem key={index}>
                    <span>{word}</span>
                    <DeleteButton onClick={() => handleDelete(key, word)}>
                      ×
                    </DeleteButton>
                  </WordItem>
                ))}
              </WordList>
            ) : (
              <EmptyState>아직 추가된 단어가 없습니다.</EmptyState>
            )}
          </Card>
        ))}
      </MainContent>
    </PageContainer>
  );
};

export default CustomWordsPage;
