import React, { useEffect, useState } from "react";  // useEffect를 import
import { useNavigate } from "react-router-dom";    // useNavigate를 import
import axios from "axios";
import styles from '../styles/Dashboard.module.css';
import NavBar from "./NavBar";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const securityData = [
    { type: "주소", count: 150 },
    { type: "전화번호", count: 120 },
    { type: "이메일", count: 100 },
    { type: "주민번호", count: 80 },
    { type: "신용카드", count: 50 },
  ];

  useEffect(() => {
    // 로그인 상태 확인
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (!token || !storedUser) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    
    setUser(JSON.parse(storedUser));
    setIsLoading(false);
    
    // 토큰 유효성 검증 (선택적)
    // 서버에 토큰 검증 요청을 보내고 유효하지 않으면 로그아웃 처리
  }, [navigate]);

  if (isLoading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  const maxCount = Math.max(...securityData.map((item) => item.count));

  return (
    <div className={styles.pageContainer}>
      <NavBar/>
      
      <main className={styles.mainContent}>
        <h1 className={styles.title}>개인 안전 대시보드</h1>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3 className={styles.statTitle}>감지된 위험 텍스트</h3>
            <div className={styles.statValue}>523</div>
            <p className={styles.statSubtext}>지난 30일 동안</p>
          </div>

          <div className={styles.statCard}>
            <h3 className={styles.statTitle}>안전 점수</h3>
            <div className={styles.statValue}>85/100</div>
            <p className={styles.statSubtext}>전월 대비 3% 상승</p>
          </div>

          <div className={styles.statCard}>
            <h3 className={styles.statTitle}>전세계 평균 대비</h3>
            <div className={styles.statValue}>상위 15%</div>
            <p className={styles.statSubtext}>안전한 수준입니다</p>
          </div>
        </div>

        <div className={styles.dataGrid}>
          <div className={styles.dataCard}>
            <h3 className={styles.dataTitle}>민감 정보 유형별 감지 횟수</h3>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th className={styles.th}>유형</th>
                  <th className={styles.th}>횟수</th>
                  <th className={styles.th} style={{ width: '50%' }}>분포</th>
                </tr>
              </thead>
              <tbody>
                {securityData.map((item) => (
                  <tr key={item.type}>
                    <td className={styles.td}>{item.type}</td>
                    <td className={styles.td}>{item.count}</td>
                    <td className={styles.td}>
                      <div className={styles.progressBar}>
                        <div 
                          className={styles.progress} 
                          style={{ width: `${(item.count / maxCount) * 100}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;