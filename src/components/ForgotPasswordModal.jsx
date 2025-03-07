import React, { useState } from "react";
import axios from "axios";
import styles from "../styles/ForgotPasswordModal.module.css";

const ForgotPasswordModal = ({
  isOpen,
  onClose,
  loginEmail,
  skipVerification = false,
}) => {
  // 상태 변수들
  const [email, setEmail] = useState(loginEmail || "");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(skipVerification ? "reset" : "email"); // 로그인 상태면 바로 reset 단계로
  const [verificationCode, setVerificationCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [timer, setTimer] = useState(300); // 5분 타이머 (300초)
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckEmail = async () => {
    if (!email.trim()) {
      setMessage("이메일을 입력해주세요.");
      return;
    }

    // 로딩 표시 시작
    setIsLoading(true);
    setMessage("인증 코드를 전송 중입니다...");

    // 즉시 verify 단계로 전환 (UI 측면에서의 속도 향상)
    setStep("verify");

    try {
      const response = await axios.post(
        "https://your-heroku-app.herokuapp.com/api/auth/verify-and-send",
        { email },
        {
          withCredentials: true, // 이 부분 추가
        }
      );

      if (response.data.success) {
        setVerificationCode(response.data.verificationCode);
        setMessage("인증 코드가 이메일로 전송되었습니다.");
        startTimer();
      } else {
        // 실패 시 다시 이메일 입력 단계로
        setStep("email");
        setMessage(response.data.message);
      }
    } catch (error) {
      setStep("email"); // 오류 시 이메일 입력 단계로 돌아감
      handleErrorResponse(error);
    } finally {
      setIsLoading(false);
    }
  };

  // 타이머 시작 함수
  const startTimer = () => {
    setIsTimerActive(true);
    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(countdown);
          setIsTimerActive(false);
          setMessage("인증 시간이 만료되었습니다. 다시 시도해주세요.");
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  // 타이머 포맷 함수 (mm:ss 형식)
  const formatTimer = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // 인증 코드 재전송
  const handleResendCode = async () => {
    try {
      const verifyResponse = await axios.post(
        "https://your-heroku-app.herokuapp.com/api/auth/send-verification-code",
        { email },
        {
          withCredentials: true, // 이 부분 추가
        }
      );

      setVerificationCode(verifyResponse.data.verificationCode);
      setMessage("새로운 인증 코드가 전송되었습니다.");
      setTimer(300);
      startTimer();
    } catch (error) {
      handleErrorResponse(error);
    }
  };

  // 에러 처리 공통 함수
  const handleErrorResponse = (error) => {
    if (error.response) {
      if (error.response.status === 404) {
        setMessage("등록되지 않은 이메일입니다.");
        alert("등록되지 않은 이메일입니다.");
      } else {
        setMessage(error.response.data.message || "오류가 발생했습니다.");
        alert(error.response.data.message || "오류가 발생했습니다.");
      }
    } else if (error.request) {
      setMessage("서버로부터 응답을 받지 못했습니다.");
      alert("서버로부터 응답을 받지 못했습니다.");
    } else {
      setMessage("오류가 발생했습니다.");
      alert("오류가 발생했습니다.");
    }
  };

  // 인증 코드 검증
  const handleVerifyCode = () => {
    if (inputCode.trim() === verificationCode.toString().trim()) {
      setMessage("인증에 성공했습니다. 새 비밀번호를 설정해주세요.");
      setStep("reset");
    } else {
      setMessage("인증 코드가 일치하지 않습니다. 다시 확인해주세요.");
    }
  };

  // 비밀번호 재설정
  const handleResetPassword = async () => {
    // 비밀번호 유효성 검사
    if (newPassword !== confirmPassword) {
      setMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (newPassword.length < 8) {
      setMessage("비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }

    try {
      // API 호출 경로를 skipVerification 여부에 따라 다르게 설정
      const endpoint =
        "https://your-heroku-app.herokuapp.com/api/auth/reset-password";

      await axios.post(
        endpoint,
        {
          email,
          newPassword,
        },
        {
          withCredentials: true, // 이 부분 추가
        }
      );

      setMessage("비밀번호가 성공적으로 재설정되었습니다.");

      // 2초 후 모달 닫기
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "비밀번호 재설정 중 오류가 발생했습니다."
      );
    }
  };

  // 모달 닫기 및 상태 초기화
  const handleClose = () => {
    onClose();
    setStep(skipVerification ? "reset" : "email");
    setEmail(loginEmail || "");
    setMessage("");
    setInputCode("");
    setNewPassword("");
    setConfirmPassword("");
    setTimer(300);
    setIsTimerActive(false);
  };

  // 모달이 열려있지 않으면 null 반환
  if (!isOpen) return null;

  // 모달 제목 설정
  const modalTitle = skipVerification ? "비밀번호 변경" : "비밀번호 재설정";

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>{modalTitle}</h2>

        {/* 이메일 입력 단계 - 로그인 상태에서는 표시되지 않음 */}
        {step === "email" && !skipVerification && (
          <>
            <p className={styles.description}>가입한 이메일을 입력해주세요.</p>
            <input
              type="email"
              placeholder="이메일 입력"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.modalInput}
              required
            />
            <button className={styles.button} onClick={handleCheckEmail}>
              이메일 확인
            </button>
          </>
        )}

        {isLoading && (
          <div className={styles.loadingIndicator}>
            <span>처리 중...</span>
          </div>
        )}

        {/* 인증 코드 입력 단계 - 로그인 상태에서는 표시되지 않음 */}
        {step === "verify" && !skipVerification && (
          <>
            <p className={styles.description}>
              {email}로 전송된 6자리 인증 코드를 입력해주세요.
            </p>
            <div className={styles.verificationContainer}>
              <input
                type="text"
                placeholder="인증 코드 입력"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                className={styles.modalInput}
                maxLength="6"
                required
              />
              {isTimerActive && (
                <span className={styles.timer}>{formatTimer()}</span>
              )}
            </div>
            <div className={styles.buttonGroup}>
              <button className={styles.button} onClick={handleVerifyCode}>
                인증 확인
              </button>
              <button
                className={styles.resendButton}
                onClick={handleResendCode}
                disabled={isTimerActive}
              >
                인증 코드 재전송
              </button>
            </div>
          </>
        )}

        {/* 비밀번호 재설정 단계 */}
        {step === "reset" && (
          <>
            <p className={styles.description}>새 비밀번호를 입력해주세요.</p>
            <input
              type="password"
              placeholder="새 비밀번호"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={styles.modalInput}
              required
            />
            <input
              type="password"
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={styles.modalInput}
              required
            />
            <button className={styles.button} onClick={handleResetPassword}>
              비밀번호 {skipVerification ? "변경" : "재설정"}
            </button>
          </>
        )}

        {message && <p className={styles.message}>{message}</p>}

        <button className={styles.closeButton} onClick={handleClose}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
