import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import styles from "../styles/MyPage.module.css";
import NavBar from "./NavBar";
import ForgotPasswordModal from "./ForgotPasswordModal";

const ProfileEditPage = () => {
  const navigate = useNavigate();
  const { user, updateUser, loading: userLoading } = useUser();
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    password: "",
    profileImage: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 디버깅을 위한 로깅
  useEffect(() => {
    console.log("User context state:", user);
    console.log("Local storage user:", localStorage.getItem("user"));
    console.log("Local storage token:", localStorage.getItem("token"));

    // API 엔드포인트 테스트 로깅
    const testEndpoints = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const storedUser = localStorage.getItem("user");
        if (!storedUser) return;

        const parsedUser = JSON.parse(storedUser);
        const email = parsedUser.email;

        if (!email) return;

        // 다양한 엔드포인트 테스트
        const endpoints = [
          `/users/info?email=${encodeURIComponent(email)}`,
          `/api/users/info?email=${encodeURIComponent(email)}`,
          `/api/users/profile?email=${encodeURIComponent(email)}`,
        ];

        for (const endpoint of endpoints) {
          try {
            console.log(`테스트 중인 엔드포인트: ${endpoint}`);
            const response = await fetch(
              `https://privashield-d6fad9e03984.herokuapp.com${endpoint}`,
              {
                method: "GET",
                credentials: "include",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            console.log(`엔드포인트 ${endpoint} 응답 상태:`, response.status);
            if (response.ok) {
              const data = await response.json();
              console.log(`엔드포인트 ${endpoint} 응답 데이터:`, data);
              break;
            }
          } catch (e) {
            console.error(`엔드포인트 ${endpoint} 요청 실패:`, e);
          }
        }
      } catch (error) {
        console.error("엔드포인트 테스트 오류:", error);
      }
    };

    if (user) {
      testEndpoints();
    }
  }, [user]);

  // 사용자 정보 로드
  useEffect(() => {
    // userLoading이 false가 되었고(로드 완료) 그리고 user가 없을 때만 로그인으로 리디렉션
    if (!userLoading && !user) {
      // 로컬 스토리지에서 직접 확인 (추가 안전장치)
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        navigate("/login");
        return;
      } else {
        // 로컬 스토리지에 사용자 정보가 있지만 컨텍스트에 없는 경우
        try {
          const parsedUser = JSON.parse(storedUser);
          updateUser(parsedUser); // 컨텍스트 업데이트

          setProfileData({
            name: parsedUser.user_name || "",
            email: parsedUser.email || "",
            password: "",
            profileImage: parsedUser.profile_image || "",
          });
          setLoading(false);
          return;
        } catch (error) {
          console.error("Failed to parse stored user:", error);
          navigate("/login");
          return;
        }
      }
    }

    // 컨텍스트에서 사용자 정보가 로드되었을 때
    if (!userLoading && user) {
      setProfileData({
        name: user.user_name || "",
        email: user.email || "",
        password: "",
        profileImage: user.profile_image || "",
      });
      setLoading(false);
    }
  }, [user, navigate, updateUser, userLoading]);

  // 프로필 정보 서버에서 다시 가져오기 (선택적)
  const fetchProfileData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // 로컬 스토리지에서 이메일 가져오기
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;

      const parsedUser = JSON.parse(storedUser);
      const email = parsedUser.email;

      if (!email) return;

      // 백엔드 코드 분석 결과 쿼리 파라미터로 이메일을 전송해야 함
      // 여러 경로를 시도
      let response;

      // 첫 번째 시도: /users/info
      try {
        response = await fetch(
          `https://privashield-d6fad9e03984.herokuapp.com/users/info?email=${encodeURIComponent(
            email
          )}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (e) {
        console.error("첫 번째 엔드포인트 시도 실패:", e);
      }

      // 두 번째 시도: /api/users/info
      if (!response || !response.ok) {
        try {
          response = await fetch(
            `https://privashield-d6fad9e03984.herokuapp.com/api/users/info?email=${encodeURIComponent(
              email
            )}`,
            {
              method: "GET",
              credentials: "include",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } catch (e) {
          console.error("두 번째 엔드포인트 시도 실패:", e);
        }
      }

      // 세 번째 시도: /api/users/profile
      if (!response || !response.ok) {
        try {
          response = await fetch(
            `https://privashield-d6fad9e03984.herokuapp.com/api/users/profile?email=${encodeURIComponent(
              email
            )}`,
            {
              method: "GET",
              credentials: "include",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } catch (e) {
          console.error("세 번째 엔드포인트 시도 실패:", e);
        }
      }

      if (response && response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          // 데이터 구조에 따라 필드명 매핑 처리
          updateUser({
            user_name: data.data.name || data.data.user_name || "",
            email: data.data.email || "",
            profile_image:
              data.data.profileImage || data.data.profile_image || "",
          });

          setProfileData({
            name: data.data.name || data.data.user_name || "",
            email: data.data.email || "",
            password: "",
            profileImage:
              data.data.profileImage || data.data.profile_image || "",
          });
        }
      } else {
        console.log("서버 요청 실패, 로컬 스토리지 데이터 사용");
        // 서버 요청 실패시 로컬 스토리지 데이터 사용
        setProfileData({
          name: parsedUser.user_name || "",
          email: parsedUser.email || "",
          password: "",
          profileImage: parsedUser.profile_image || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
    }
  }, [updateUser]);

  // 컴포넌트 마운트 시 프로필 정보 다시 가져오기
  useEffect(() => {
    if (!userLoading) {
      // 로컬 스토리지의 데이터를 먼저 사용하여 UI를 빠르게 보여줌
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setProfileData({
            name: parsedUser.user_name || "",
            email: parsedUser.email || "",
            password: "",
            profileImage: parsedUser.profile_image || "",
          });
          setLoading(false);
        } catch (e) {
          console.error("Failed to parse stored user:", e);
        }
      }

      // 그 후 서버에서 최신 데이터 가져오기 시도
      fetchProfileData();
    }
  }, [userLoading, fetchProfileData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setError(null);
      const formData = new FormData();
      formData.append("email", profileData.email);
      formData.append("profileImage", file);

      // 토큰 가져오기
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://privashield-d6fad9e03984.herokuapp.com/api/users/update-profile-image",
        {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "프로필 이미지 업로드 중 오류가 발생했습니다."
        );
      }

      const data = await response.json();

      if (data.success) {
        updateUser({
          profile_image: data.data.profileImage,
        });

        setProfileData((prev) => ({
          ...prev,
          profileImage: data.data.profileImage,
        }));

        setSuccessMessage("프로필 이미지가 업데이트되었습니다.");
      }
    } catch (error) {
      console.error("이미지 업로드 오류:", error);
      setError(error.message);
    }
  };

  const navigateToDashboard = () => {
    navigate("/dashboard");
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
      )
    ) {
      try {
        setError(null);
        // 토큰 가져오기
        const token = localStorage.getItem("token");

        const response = await fetch(
          "https://privashield-d6fad9e03984.herokuapp.com/api/users/delete",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
            body: JSON.stringify({ email: profileData.email }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "회원 탈퇴 처리 중 오류가 발생했습니다."
          );
        }

        const data = await response.json();

        if (data.success) {
          alert("회원 탈퇴가 완료되었습니다.");
          localStorage.removeItem("userEmail");
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          window.location.href = "/";
        } else {
          throw new Error(
            data.message || "회원 탈퇴 처리 중 오류가 발생했습니다."
          );
        }
      } catch (error) {
        console.error("회원 탈퇴 오류:", error);
        setError(error.message);
      }
    }
  };

  const handlePasswordChange = async () => {
    if (!profileData.password) {
      setError("새 비밀번호를 입력해주세요.");
      return;
    }

    try {
      setError(null);
      // 토큰 가져오기
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://privashield-d6fad9e03984.herokuapp.com/api/users/change-password",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({
            email: profileData.email,
            newPassword: profileData.password,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "비밀번호 변경 중 오류가 발생했습니다."
        );
      }

      const data = await response.json();

      if (data.success) {
        setSuccessMessage("비밀번호가 성공적으로 변경되었습니다.");
        setProfileData((prev) => ({ ...prev, password: "" }));
      }
    } catch (error) {
      console.error("비밀번호 변경 오류:", error);
      setError(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      // 토큰 가져오기
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://privashield-d6fad9e03984.herokuapp.com/api/users/update-profile",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({
            email: profileData.email,
            name: profileData.name,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "이름 변경 중 오류가 발생했습니다."
        );
      }

      const data = await response.json();

      if (data.success) {
        updateUser({ user_name: profileData.name });
        setSuccessMessage("프로필 정보가 업데이트되었습니다.");

        if (profileData.password) {
          await handlePasswordChange();
        }
      }
    } catch (error) {
      console.error("프로필 업데이트 오류:", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccessMessage("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, successMessage]);

  // userLoading과 loading 둘 다 고려하여 로딩 상태 표시
  if (userLoading || loading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <NavBar />
      <main className={styles.mainContent}>
        {error && <div className={styles.errorMessage}>{error}</div>}
        {successMessage && (
          <div className={styles.successMessage}>{successMessage}</div>
        )}

        <div className={styles.profileHeader}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: "none" }}
          />
          <div
            className={styles.profileAvatar}
            onClick={handleAvatarClick}
            style={
              profileData.profileImage
                ? {
                    backgroundImage: profileData.profileImage.startsWith("http")
                      ? `url(${profileData.profileImage})`
                      : `url(https://privashield-d6fad9e03984.herokuapp.com${profileData.profileImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    cursor: "pointer",
                  }
                : { cursor: "pointer" }
            }
          >
            {!profileData.profileImage &&
              (profileData.name ? profileData.name[0] : "U")}
          </div>
          <h1 className={styles.profileName}>{profileData.name || "사용자"}</h1>
          <p className={styles.profileEmail}>{profileData.email}</p>
        </div>

        <div className={styles.editCard}>
          <h2 className={styles.cardTitle}>프로필 정보 편집</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>이름</label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
                className={styles.formInput}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>이메일</label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
                className={styles.formInput}
                required
                disabled
              />
              <p className={styles.formHelp}>이메일은 변경할 수 없습니다</p>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>비밀번호</label>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className={`${styles.button} ${styles.secondaryButton}`}
              >
                비밀번호 변경
              </button>
              <p className={styles.formHelp}>
                변경하려면 새 비밀번호를 입력하세요
              </p>
            </div>

            <div className={styles.buttonGroup}>
              <button type="submit" className={styles.button}>
                변경사항 저장
              </button>
              <button
                type="button"
                onClick={navigateToDashboard}
                className={`${styles.button} ${styles.secondaryButton}`}
              >
                취소
              </button>
            </div>
          </form>

          <div className={styles.dangerZone}>
            <button
              onClick={handleDeleteAccount}
              className={`${styles.button} ${styles.dangerButton}`}
            >
              회원 탈퇴
            </button>
          </div>
        </div>
      </main>

      <ForgotPasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        loginEmail={profileData.email}
        skipVerification={true}
      />
    </div>
  );
};

export default ProfileEditPage;
