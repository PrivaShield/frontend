import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext"; // 전역 상태 사용
import styles from "../styles/MyPage.module.css";
import NavBar from "./NavBar";
import ForgotPasswordModal from "./ForgotPasswordModal";

const ProfileEditPage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useUser();
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

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    setProfileData({
      name: user.user_name || "",
      email: user.email || "",
      password: "",
      profileImage: user.profile_image || "",
    });
    setLoading(false);
  }, [user, navigate]);

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

      const response = await fetch(
        "https://privashield-d6fad9e03984.herokuapp.com/api/users/update-profile-image",
        {
          method: "POST",
          credentials: "include", // 이 부분 추가
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
        const response = await fetch(
          "https://privashield-d6fad9e03984.herokuapp.com/api/users/delete",
          {
            method: "POST",
            credentials: "include", // 이 부분 추가
            headers: {
              "Content-Type": "application/json",
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
      const response = await fetch(
        "https://privashield-d6fad9e03984.herokuapp.com/api/users/change-password",
        {
          method: "POST",
          credentials: "include", // 이 부분 추가
          headers: { "Content-Type": "application/json" },
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
      const response = await fetch(
        "https://privashield-d6fad9e03984.herokuapp.com/api/users/update-profile",
        {
          method: "POST",
          credentials: "include", // 이 부분 추가
          headers: { "Content-Type": "application/json" },
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

  if (loading) {
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
                    backgroundImage: `url(https://privashield-d6fad9e03984.herokuapp.com${profileData.profileImage})`,
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
