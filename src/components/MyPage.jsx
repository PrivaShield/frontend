import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/MyPage.module.css";
import NavBar from "./NavBar";

const ProfileEditPage = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    password: "",
    profileImage: "", // 프로필 이미지 URL 저장용
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef(null); // 파일 입력을 위한 ref

  // 페이지 로드 시 사용자 정보 조회
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        // 로컬 스토리지에서 저장된 이메일 가져오기 또는 테스트 이메일 사용
        const userEmail =
          localStorage.getItem("userEmail") || "test@example.com";

        // 백엔드 서버의 전체 URL 사용
        const response = await fetch(
          `http://localhost:5000/api/users?email=${userEmail}`
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("API 응답 내용:", errorText);
          throw new Error("사용자 정보를 불러올 수 없습니다.");
        }

        const data = await response.json();

        if (data.success) {
          setProfileData({
            name: data.data.name || "",
            email: data.data.email,
            phoneNumber: data.data.phoneNumber || "",
            password: "",
            profileImage: data.data.profileImage || "",
          });
        } else {
          throw new Error(data.message || "사용자 정보를 불러올 수 없습니다.");
        }
      } catch (error) {
        console.error("회원 정보 조회 오류:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 프로필 이미지 클릭 핸들러
  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  // 파일 선택 핸들러
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // 파일 크기 검증 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("파일 크기는 5MB 이하여야 합니다.");
      }

      // 파일 형식 검증
      if (!file.type.startsWith("image/")) {
        throw new Error("이미지 파일만 업로드할 수 있습니다.");
      }

      // FormData 생성
      const formData = new FormData();
      formData.append("email", profileData.email);
      formData.append("profileImage", file);

      // 프로필 이미지 업로드 API 호출
      const response = await fetch(
        "http://localhost:5000/api/users/profile_image",
        {
          method: "PATCH",
          body: formData,
          // FormData를 사용할 때는 Content-Type 헤더를 설정하지 않음
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("프로필 이미지 업로드 응답:", errorText);
        throw new Error("프로필 이미지 업로드 중 오류가 발생했습니다.");
      }

      const data = await response.json();

      if (data.success) {
        // 프로필 이미지 URL 업데이트
        setProfileData((prev) => ({
          ...prev,
          profileImage: data.data.profileImage,
        }));
        setSuccessMessage("프로필 이미지가 업데이트되었습니다.");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        throw new Error(
          data.message || "프로필 이미지 업로드 중 오류가 발생했습니다."
        );
      }
    } catch (error) {
      console.error("프로필 이미지 업로드 오류:", error);
      setError(error.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 비밀번호 변경 요청 (비밀번호가 입력된 경우)
      if (profileData.password) {
        // 비밀번호 변경 API 호출 (change-password 엔드포인트 사용)
        const resetResponse = await fetch(
          "http://localhost:5000/api/users/change-password",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: profileData.email,
              newPassword: profileData.password,
            }),
          }
        );

        if (!resetResponse.ok) {
          const errorText = await resetResponse.text();
          console.error("비밀번호 변경 응답:", errorText);
          throw new Error("비밀번호 변경 중 오류가 발생했습니다.");
        }

        const resetData = await resetResponse.json();

        if (resetData.success) {
          setSuccessMessage("비밀번호가 성공적으로 변경되었습니다.");
          // 비밀번호 필드 초기화
          setProfileData((prev) => ({
            ...prev,
            password: "",
          }));
        } else {
          throw new Error(
            resetData.message || "비밀번호 변경 중 오류가 발생했습니다."
          );
        }
      }

      // 이름 및 전화번호 업데이트 로직은 여기에 추가할 수 있습니다
      // 현재는 비밀번호 변경만 구현

      if (!profileData.password) {
        setSuccessMessage("프로필이 성공적으로 업데이트되었습니다.");
      }

      setTimeout(() => setSuccessMessage(""), 3000); // 3초 후 메시지 사라짐
    } catch (error) {
      console.error("프로필 업데이트 오류:", error);
      setError(error.message);
      setTimeout(() => setError(null), 3000); // 3초 후 오류 메시지 사라짐
    }
  };

  const navigateToDashboard = () => {
    navigate("/dashboard");
  };

  // 회원 탈퇴 처리
  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
      )
    ) {
      try {
        const response = await fetch(
          "http://localhost:5000/api/users/delete-user",
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: profileData.email }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("API 응답 내용:", errorText);
          throw new Error("회원 탈퇴 처리 중 오류가 발생했습니다.");
        }

        const data = await response.json();

        if (data.success) {
          alert("회원 탈퇴가 완료되었습니다.");
          // 로컬 스토리지 정리 및 로그인 페이지로 이동
          localStorage.removeItem("userEmail");
          navigate("/login");
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

  if (loading) {
    return <div className={styles.loading}>사용자 정보를 불러오는 중...</div>;
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
          {/* 프로필 이미지 업로드를 위한 숨겨진 파일 입력 */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: "none" }}
          />

          {/* 프로필 아바타 - 클릭 시 파일 선택 창 열림 */}
          <div
            className={styles.profileAvatar}
            onClick={handleAvatarClick}
            style={
              profileData.profileImage
                ? {
                    backgroundImage: `url(http://localhost:5000${profileData.profileImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    cursor: "pointer",
                  }
                : { cursor: "pointer" }
            }
          >
            {!profileData.profileImage &&
              (profileData.name
                ? profileData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                : "U")}
            <div className={styles.avatarOverlay}>
              <span className={styles.avatarHint}>클릭하여 변경</span>
            </div>
          </div>

          <div className={styles.profileInfo}>
            <h1 className={styles.profileName}>
              {profileData.name || "사용자"}
            </h1>
            <p className={styles.profileEmail}>{profileData.email}</p>
            <div className={styles.securityScore}>
              <span>🛡️</span>
              <span>보안 점수: 85/100</span>
            </div>
          </div>
        </div>

        <div className={styles.editCard}>
          <h2 className={styles.cardTitle}>
            <span className={styles.cardIcon}>👤</span>
            프로필 정보 편집
          </h2>
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
                disabled // 이메일은 변경 불가
              />
              <p className={styles.formHelp}>이메일은 변경할 수 없습니다</p>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>비밀번호</label>
              <input
                type="password"
                name="password"
                value={profileData.password}
                onChange={handleInputChange}
                className={styles.formInput}
                placeholder="새 비밀번호 입력"
              />
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
                className={`${styles.button} ${styles.buttonOutline}`}
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
    </div>
  );
};

export default ProfileEditPage;
