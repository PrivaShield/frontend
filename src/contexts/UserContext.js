import React, { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  // Load user from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("로컬 스토리지 사용자 정보 파싱 오류:", error);
        localStorage.removeItem("user"); // 손상된 데이터 제거
      }
    }
    setLoading(false); // 로드 완료 후 로딩 상태 false로 변경
  }, []);

  // 로그인 함수 추가 - 사용자 정보와 토큰을 함께 저장
  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
  };

  // Update user and store in localStorage
  const updateUser = (userData) => {
    setUser((prevUser) => {
      if (!prevUser) {
        // prevUser가 null이면 로컬 스토리지에서 가져오기 시도
        const storedUser = localStorage.getItem("user");
        prevUser = storedUser ? JSON.parse(storedUser) : {};
      }

      const newUser = { ...prevUser, ...userData };
      localStorage.setItem("user", JSON.stringify(newUser));
      return newUser;
    });
  };

  // Logout method
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ user, updateUser, logout, login, loading }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
