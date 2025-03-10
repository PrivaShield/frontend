import React, { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 초기 로드 시 localStorage에서 사용자 정보 가져오기
  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
          // 사용자 정보 설정
          setUser(JSON.parse(storedUser));

          // 선택적: 토큰 유효성 검증 (API가 지원한다면)
          try {
            const response = await fetch(
              "https://privashield-d6fad9e03984.herokuapp.com/api/auth/verify",
              {
                method: "GET",
                credentials: "include",
                headers: {
                  Authorization: `Bearer ${storedToken}`,
                },
              }
            );

            if (!response.ok) {
              // 토큰이 유효하지 않으면 로그아웃
              console.log("토큰이 만료되었습니다. 다시 로그인해 주세요.");
              logout();
            }
          } catch (error) {
            console.error("토큰 검증 중 오류:", error);
            // 오류가 발생해도 사용자 경험을 위해 로그인 상태 유지
          }
        }
      } catch (error) {
        console.error("사용자 정보 로드 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  // 사용자 정보 업데이트 및 localStorage 저장
  const updateUser = (userData) => {
    setUser((prevUser) => {
      const newUser = { ...prevUser, ...userData };
      localStorage.setItem("user", JSON.stringify(newUser));
      return newUser;
    });
  };

  // 로그인 함수 추가
  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
  };

  // 로그아웃 함수
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ user, updateUser, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

// 사용자 컨텍스트 사용을 위한 커스텀 훅
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
