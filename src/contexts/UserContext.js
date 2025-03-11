import React, { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 초기 로드시 로컬 스토리지에서 사용자 정보 및 토큰 확인
  useEffect(() => {
    const verifyUser = async () => {
      try {
        // 토큰은 있지만 사용자 정보가 없는 경우
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (token && !storedUser) {
          // 토큰으로 사용자 정보 가져오기 시도
          // 사용자 이메일을 jwt 디코딩으로 추출
          try {
            // JWT 디코딩 (간단한 방식)
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(
              atob(base64)
                .split("")
                .map(function (c) {
                  return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join("")
            );

            const decodedToken = JSON.parse(jsonPayload);

            if (decodedToken.email) {
              // 토큰에서 이메일을 가져왔으므로 사용자 정보 요청
              const response = await fetch(
                `https://privashield-d6fad9e03984.herokuapp.com/api/users/info?email=${encodeURIComponent(
                  decodedToken.email
                )}`,
                {
                  method: "GET",
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                  credentials: "include",
                }
              );

              if (response.ok) {
                const data = await response.json();
                if (data.success && data.data) {
                  // 사용자 정보를 로컬 스토리지와 컨텍스트에 저장
                  const userData = {
                    user_name: data.data.name || data.data.user_name,
                    email: data.data.email,
                    profile_image:
                      data.data.profileImage || data.data.profile_image,
                  };

                  localStorage.setItem("user", JSON.stringify(userData));
                  setUser(userData);
                }
              }
            }
          } catch (error) {
            console.error("토큰 디코딩 실패:", error);
          }
        } else if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to verify user:", error);
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
