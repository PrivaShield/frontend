import React, { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 초기 로드시 로컬 스토리지에서 사용자 정보 및 토큰 확인
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (storedUser && token) {
          // 토큰 유효성 검증 (선택적)
          try {
            const response = await fetch(
              "https://privashield-d6fad9e03984.herokuapp.com/api/users/profile",
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                credentials: "include",
              }
            );

            if (response.ok) {
              // 서버 응답이 정상이면 저장된 사용자 정보 사용
              setUser(JSON.parse(storedUser));
            } else {
              // 토큰이 유효하지 않으면 로그아웃 처리
              localStorage.removeItem("user");
              localStorage.removeItem("token");
              setUser(null);
            }
          } catch (error) {
            console.error("Failed to verify token:", error);
            // 네트워크 오류 등이 발생해도 일단 저장된 사용자 정보 사용
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error("Failed to load user from localStorage:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  // 로그인 함수 - 사용자 정보와 토큰 저장
  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
  };

  // 사용자 정보 업데이트 및 로컬 스토리지 저장
  const updateUser = (userData) => {
    setUser((prevUser) => {
      if (!prevUser) return userData;

      const newUser = { ...prevUser, ...userData };
      localStorage.setItem("user", JSON.stringify(newUser));
      return newUser;
    });
  };

  // 로그아웃 함수
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail"); // userEmail도 함께 제거
  };

  return (
    <UserContext.Provider value={{ user, updateUser, logout, login, loading }}>
      {children}
    </UserContext.Provider>
  );
};

// 커스텀 훅
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
