import React from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 임포트

const MainPage = () => {
  const navigate = useNavigate(); // navigate 사용하기
  
  const openGPT = () => {
    // '/gpt-detection'으로 페이지 이동
    navigate('/gpt-detection');
  };
  
  return (
    <button onClick={openGPT}>
      GPT 텍스트 감지 시작
    </button>
  );
};

export default MainPage;
