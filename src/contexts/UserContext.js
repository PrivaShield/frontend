// src/contexts/UserContext.js
import { createContext, useContext, useState, useEffect } from "react";

// Context 생성
const UserContext = createContext();

// Context Provider 생성
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  // 컴포넌트가 마운트될 때 로컬 스토리지에서 사용자 정보 로드
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 사용자 정보 업데이트 함수
  const updateUser = (newUser) => {
    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("user");
    }
    setUser(newUser);
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

// Hook을 사용하여 쉽게 Context 접근 가능하도록 설정
export function useUser() {
  return useContext(UserContext);
}
