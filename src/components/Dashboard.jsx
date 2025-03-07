import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext"; // UserContext 추가
import styles from "../styles/Dashboard.module.css";
import NavBar from "./NavBar";
import { Chart } from "chart.js/auto";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser(); // UserContext에서 user 가져오기
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const checklistChartRef = useRef(null);
  const checklistChartInstance = useRef(null);
  const monthlyChartRef = useRef(null);
  const monthlyChartInstance = useRef(null);
  const [monthlyRiskData, setMonthlyRiskData] = useState([]);
  const monthlyRiskChartRef = useRef(null);
  const monthlyRiskChartInstance = useRef(null);
  const [sensitiveInfoData, setSensitiveInfoData] = useState([]);
  const sensitiveInfoChartRef = useRef(null);
  const sensitiveInfoChartInstance = useRef(null);

  // API 호출 상태 관리
  const [dataFetched, setDataFetched] = useState(false);

  // 월간 데이터 상태
  const [monthlyData, setMonthlyData] = useState({
    totalCount: 0,
    dateData: [],
  });

  // 체크리스트 상태
  const [checklistData, setChecklistData] = useState([]);
  const [checklistInput, setChecklistInput] = useState("");

  // 서버에서 가져온 데이터를 저장할 상태
  const [dashboardData, setDashboardData] = useState({
    today: {
      detectedCount: 0,
      sensitiveTypes: [],
      lastExecutionDate: null,
      lastExecutionCount: 0,
      changeRate: 0,
    },
    monthly: {
      thisMonth: 0,
      lastMonth: 0,
      changePercent: 0,
    },
    safetyScore: 85,
    globalPercentile: 15,
  });

  // 안전 점수 데이터
  const [safetyData, setSafetyData] = useState({
    currentScore: 0,
    previousScore: 0,
    scoreDifference: 0,
    percentile: 0,
  });

  // 안전 점수 계산 함수
  const calculateSafetyScore = useCallback((leakData) => {
    const sensitivityWeights = { 낮음: 0.1, 중간: 0.3, 높음: 0.7 };

    // 카테고리별 유출 개수 집계
    let categoryCounts = {};
    let categoryWeights = {};

    leakData.forEach(({ content_type, sensitivity_level, count }) => {
      categoryCounts[content_type] =
        (categoryCounts[content_type] || 0) + count;
      categoryWeights[content_type] =
        sensitivityWeights[sensitivity_level] || 0.3; // 기본값 중간
    });

    const categories = Object.keys(categoryCounts);
    const counts = Object.values(categoryCounts);
    const weights = categories.map((cat) => categoryWeights[cat]);

    const N = counts.reduce((acc, val) => acc + val, 0);
    const w_total = 0.05 + Math.min(0.02 * N, 2);

    let weightedSum = 0;
    for (let i = 0; i < categories.length; i++) {
      weightedSum += weights[i] * counts[i];
    }

    const logTerm = Math.log(1 + w_total * N);
    const S = 100 - weightedSum * logTerm;

    return Math.min(100, Math.max(0, Math.floor(S)));
  }, []);

  // 안전 점수 데이터 가져오기
  const fetchSafetyData = useCallback(
    async (email) => {
      try {
        // 이전 유출 기록 (어제까지의 데이터)
        const previousLeaksResponse = await fetch(
          `https://your-heroku-app.herokuapp.com/api/dashboard/previous-leaks?email=${encodeURIComponent(
            email
          )}`,
          {
            credentials: "include", // 이 부분 추가
          }
        );

        if (!previousLeaksResponse.ok) {
          throw new Error("이전 유출 기록을 가져오는데 실패했습니다.");
        }

        const previousLeaksData = await previousLeaksResponse.json();
        const previousScore = calculateSafetyScore(
          previousLeaksData.data || []
        );

        // 현재 유출 기록 (오늘 데이터)
        const currentLeaksResponse = await fetch(
          `https://your-heroku-app.herokuapp.com/api/dashboard/current-leaks?email=${encodeURIComponent(
            email
          )}`,
          {
            credentials: "include", // 이 부분 추가
          }
        );

        if (!currentLeaksResponse.ok) {
          throw new Error("현재 유출 기록을 가져오는데 실패했습니다.");
        }

        const currentLeaksData = await currentLeaksResponse.json();
        const currentScore = calculateSafetyScore(currentLeaksData.data || []);

        // 전체 사용자 데이터
        const allUsersResponse = await fetch(
          `https://your-heroku-app.herokuapp.com/api/dashboard/all-users-leaks`
        );

        if (!allUsersResponse.ok) {
          throw new Error("전체 사용자 데이터를 가져오는데 실패했습니다.");
        }

        const allUsersData = await allUsersResponse.json();

        // 각 사용자별 안전 점수 계산
        const allScores = allUsersData.data.map((user) => {
          return {
            email: user.email,
            score: calculateSafetyScore(user.leaks || []),
          };
        });

        // 현재 사용자보다 점수가 높은 사용자 수
        const higherScores = allScores.filter(
          (item) => item.score > currentScore
        ).length;

        // 백분위 계산
        const percentile =
          allScores.length > 0
            ? Math.round((higherScores / allScores.length) * 100)
            : 50; // 데이터가 없을 경우 기본값

        setSafetyData({
          currentScore,
          previousScore,
          scoreDifference: currentScore - previousScore,
          percentile,
        });
      } catch (error) {
        console.error("안전 점수 데이터 로드 오류:", error);
        // 오류 발생 시 기본 데이터
        setSafetyData((prev) => {
          // 이미 값이 설정되어 있다면 변경하지 않음
          if (prev.currentScore > 0) return prev;

          return {
            currentScore: dashboardData.safetyScore,
            previousScore:
              dashboardData.safetyScore -
              parseInt(dashboardData.monthly.changePercent),
            scoreDifference: parseInt(dashboardData.monthly.changePercent),
            percentile: dashboardData.globalPercentile,
          };
        });
      }
    },
    [calculateSafetyScore, dashboardData]
  );

  // 대시보드 데이터 가져오기
  const fetchDashboardData = useCallback(async (email) => {
    try {
      const response = await fetch(
        `https://your-heroku-app.herokuapp.com/api/dashboard/summary?email=${encodeURIComponent(
          email
        )}`,
        {
          credentials: "include", // 이 부분 추가
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API 응답:", errorText);
        throw new Error("대시보드 데이터를 불러오는데 실패했습니다.");
      }

      const data = await response.json();
      console.log("받은 대시보드 데이터:", data);

      if (data.success) {
        setDashboardData(data.data);
      } else {
        throw new Error(data.message || "데이터 로드 실패");
      }
    } catch (error) {
      console.error("데이터 로드 오류:", error);
      setError(error.message);

      // 오류 발생 시 기본 데이터 설정
      setDashboardData({
        today: {
          detectedCount: 0,
          sensitiveTypes: [],
          lastExecutionDate: null,
          lastExecutionCount: 0,
          changeRate: 0,
        },
        monthly: {
          thisMonth: 0,
          lastMonth: 0,
          changePercent: 0,
        },
        safetyScore: 100,
        globalPercentile: 15,
      });
    }
  }, []);

  // 월간 데이터 가져오기
  const fetchMonthlyData = useCallback(async (email) => {
    try {
      const response = await fetch(
        `https://your-heroku-app.herokuapp.com/api/dashboard/monthly-data?email=${encodeURIComponent(
          email
        )}`,
        {
          credentials: "include", // 이 부분 추가
        }
      );

      if (!response.ok) {
        throw new Error("월간 데이터를 가져오는데 실패했습니다.");
      }

      const data = await response.json();
      console.log("월간 데이터 API 응답:", data);

      if (data.success) {
        setMonthlyData({
          totalCount: data.data.totalCount || 0,
          dateData: data.data.dailyData || [],
        });
      } else {
        throw new Error(data.message || "월간 데이터 로드 실패");
      }
    } catch (error) {
      console.error("월간 데이터 로드 오류:", error);
      setMonthlyData({
        totalCount: 0,
        dateData: [],
      });
    }
  }, []);

  // 월간 위험 감지 데이터 가져오기 함수
  const fetchMonthlyRiskData = useCallback(async (email) => {
    try {
      const response = await fetch(
        `https://your-heroku-app.herokuapp.com/api/dashboard/monthly-risk?email=${encodeURIComponent(
          email
        )}`,
        {
          credentials: "include", // 이 부분 추가
        }
      );

      if (!response.ok) {
        throw new Error("월간 위험 감지 데이터를 가져오는데 실패했습니다.");
      }

      const data = await response.json();
      console.log("월간 위험 감지 API 응답:", data);

      if (data.success) {
        setMonthlyRiskData(data.data || []);
      } else {
        throw new Error(data.message || "월간 위험 감지 데이터 로드 실패");
      }
    } catch (error) {
      console.error("월간 위험 감지 데이터 로드 오류:", error);
      setMonthlyRiskData([]);
    }
  }, []);

  // 유형별 민감 정보 데이터 가져오기 함수
  const fetchSensitiveInfoData = useCallback(async (email) => {
    try {
      const response = await fetch(
        `https://your-heroku-app.herokuapp.com/api/dashboard/sensitive-info?email=${encodeURIComponent(
          email
        )}`,
        {
          credentials: "include", // 이 부분 추가
        }
      );

      if (!response.ok) {
        throw new Error("유형별 민감 정보를 가져오는데 실패했습니다.");
      }

      const data = await response.json();
      console.log("유형별 민감 정보 API 응답:", data);

      if (data.success) {
        setSensitiveInfoData(data.data || []);
      } else {
        throw new Error(data.message || "유형별 민감 정보 로드 실패");
      }
    } catch (error) {
      console.error("유형별 민감 정보 로드 오류:", error);
      setSensitiveInfoData([]);
    }
  }, []);

  // 체크리스트 데이터 로드
  const loadChecklistData = useCallback(() => {
    try {
      const savedData = localStorage.getItem("securityChecklist");
      if (savedData) {
        setChecklistData(JSON.parse(savedData));
      }
    } catch (error) {
      console.error("체크리스트 데이터 로드 오류:", error);
    }
  }, []);

  // 주요 데이터 로딩
  useEffect(() => {
    // 로그인 상태 확인
    if (!user) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    // 이미 데이터를 가져왔다면 중복 요청하지 않음
    if (dataFetched) return;

    const userEmail = user.email;
    setIsLoading(true);

    const loadAllData = async () => {
      try {
        // 대시보드 데이터 먼저 로드
        await fetchDashboardData(userEmail);

        // 병렬로 나머지 데이터 로드
        await Promise.all([
          fetchSafetyData(userEmail),
          fetchMonthlyData(userEmail),
          fetchMonthlyRiskData(userEmail),
          fetchSensitiveInfoData(userEmail),
        ]);

        // 로컬에서 체크리스트 데이터 로드
        loadChecklistData();

        // 데이터 로딩 완료
        setDataFetched(true);
      } catch (error) {
        console.error("데이터 로딩 오류:", error);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadAllData();

    return () => {
      // 컴포넌트 언마운트 시 차트 정리
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      if (checklistChartInstance.current) {
        checklistChartInstance.current.destroy();
      }
      if (monthlyChartInstance.current) {
        monthlyChartInstance.current.destroy();
      }
      if (monthlyRiskChartInstance.current) {
        monthlyRiskChartInstance.current.destroy();
      }
      if (sensitiveInfoChartInstance.current) {
        sensitiveInfoChartInstance.current.destroy();
      }
    };
  }, [
    user,
    navigate,
    dataFetched,
    fetchDashboardData,
    fetchSafetyData,
    fetchMonthlyData,
    fetchMonthlyRiskData,
    fetchSensitiveInfoData,
    loadChecklistData,
  ]);

  // 월간 차트 생성 및 업데이트
  useEffect(() => {
    // 로드 중이거나 오류가 있다면 차트를 그리지 않음
    if (
      isLoading ||
      error ||
      !monthlyChartRef.current ||
      !monthlyData.dateData.length
    )
      return;

    // 차트 새로 생성
    const updateChart = () => {
      // 기존 차트가 있으면 파괴
      if (monthlyChartInstance.current) {
        monthlyChartInstance.current.destroy();
      }

      // 데이터 준비
      const labels = monthlyData.dateData.map((item) => item.date);
      const values = monthlyData.dateData.map((item) => item.detection_count);

      // 차트 생성
      const ctx = monthlyChartRef.current.getContext("2d");
      monthlyChartInstance.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              data: values,
              backgroundColor: "rgba(104, 132, 245, 0.7)",
              borderColor: "rgba(104, 132, 245, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
              ticks: {
                color: "#94a3b8",
              },
            },
            y: {
              grid: {
                display: false,
              },
              beginAtZero: true,
              ticks: {
                color: "#94a3b8",
              },
            },
          },
        },
      });
    };

    // 100ms 지연 후 차트 생성
    const timer = setTimeout(updateChart, 100);
    return () => clearTimeout(timer);
  }, [monthlyData, isLoading, error]);

  // 월간 위험 감지 차트 생성 및 업데이트
  useEffect(() => {
    if (
      isLoading ||
      error ||
      !monthlyRiskChartRef.current ||
      !monthlyRiskData.length
    )
      return;

    // 차트 생성 함수
    const updateChart = () => {
      // 기존 차트가 있으면 파괴
      if (monthlyRiskChartInstance.current) {
        monthlyRiskChartInstance.current.destroy();
      }

      // 데이터 준비 - 월 표시를 더 읽기 쉽게 변환 (YYYY-MM -> YYYY년 MM월)
      const labels = monthlyRiskData.map((item) => {
        const [year, month] = item.month.split("-");
        return `${year}년 ${month}월`;
      });
      const values = monthlyRiskData.map((item) => item.count);

      // 차트 생성
      const ctx = monthlyRiskChartRef.current.getContext("2d");
      monthlyRiskChartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "감지 건수",
              data: values,
              borderColor: "#818cf8",
              backgroundColor: "rgba(129, 140, 248, 0.2)",
              borderWidth: 2,
              pointRadius: 4,
              fill: true,
              tension: 0.4, // 곡선 형태로 표시
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                title: function (tooltipItems) {
                  return tooltipItems[0].label;
                },
                label: function (context) {
                  return `감지 건수: ${context.parsed.y}건`;
                },
              },
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
              ticks: {
                color: "#94a3b8",
              },
            },
            y: {
              grid: {
                display: false,
              },
              beginAtZero: true,
              ticks: {
                color: "#94a3b8",
              },
            },
          },
        },
      });
    };

    // 100ms 지연 후 차트 생성
    const timer = setTimeout(updateChart, 100);
    return () => clearTimeout(timer);
  }, [monthlyRiskData, isLoading, error]);

  // 유형별 민감 정보 차트 생성 및 업데이트
  useEffect(() => {
    if (
      isLoading ||
      error ||
      !sensitiveInfoChartRef.current ||
      !sensitiveInfoData.length
    )
      return;

    // 차트 생성 함수
    const updateChart = () => {
      // 기존 차트가 있으면 파괴
      if (sensitiveInfoChartInstance.current) {
        sensitiveInfoChartInstance.current.destroy();
      }

      // 데이터 준비
      const labels = sensitiveInfoData.map((item) => item.content_type);
      const values = sensitiveInfoData.map((item) => item.count);

      // 배경색 배열
      const backgroundColors = [
        "rgba(104, 132, 245, 0.8)",
        "rgba(235, 87, 87, 0.8)",
        "rgba(240, 180, 41, 0.8)",
        "rgba(46, 213, 115, 0.8)",
        "rgba(156, 136, 255, 0.8)",
      ];

      // 차트 생성
      const ctx = sensitiveInfoChartRef.current.getContext("2d");
      sensitiveInfoChartInstance.current = new Chart(ctx, {
        type: "pie",
        data: {
          labels: labels,
          datasets: [
            {
              data: values,
              backgroundColor: backgroundColors.slice(0, labels.length),
              borderWidth: 1,
              borderColor: "rgba(255, 255, 255, 0.2)",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                color: "#94a3b8",
                font: { size: 12 },
                padding: 15,
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.label || "";
                  const value = context.parsed || 0;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = ((value / total) * 100).toFixed(1);
                  return `${label}: ${value}건 (${percentage}%)`;
                },
              },
            },
          },
        },
      });
    };

    // 100ms 지연 후 차트 생성
    const timer = setTimeout(updateChart, 100);
    return () => clearTimeout(timer);
  }, [sensitiveInfoData, isLoading, error]);

  // 안전 점수 차트 생성 및 업데이트
  useEffect(() => {
    if (!chartRef.current || safetyData.currentScore === 0) return;

    // 기존 차트가 있으면 파괴
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // 중앙 텍스트 플러그인 등록
    const centerTextPlugin = {
      id: "centerText",
      beforeDraw(chart) {
        const { width, height } = chart;
        const { ctx } = chart;
        const text = chart.options.plugins.centerText.text || "0";

        ctx.save();
        ctx.font = "bold 40px Arial";
        ctx.fillStyle = "#ffffff"; // 흰색 텍스트 (다크 테마)
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, width / 2, height / 2);
        ctx.restore();
      },
    };

    // 차트 생성
    const ctx = chartRef.current.getContext("2d");
    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: [safetyData.currentScore, 100 - safetyData.currentScore],
            backgroundColor: ["#3B82F6", "rgba(255, 255, 255, 0.1)"], // 파란색, 투명 흰색 (다크 테마)
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                return context.label + ": " + context.parsed + "%";
              },
            },
          },
          centerText: {
            text: safetyData.currentScore.toString(),
          },
          legend: {
            display: false, // 범례 숨김
          },
        },
        cutout: "80%",
      },
      plugins: [centerTextPlugin],
    });
  }, [safetyData.currentScore]);

  // 체크리스트 차트 생성 및 업데이트
  useEffect(() => {
    if (!checklistChartRef.current || !checklistData) return;

    // 기존 차트가 있으면 파괴
    if (checklistChartInstance.current) {
      checklistChartInstance.current.destroy();
    }

    // 차트 중앙에 완료/전체 항목 수를 표시하는 커스텀 플러그인
    const centerTextPlugin = {
      id: "centerTextChecklist",
      afterDraw: (chart) => {
        const { ctx, width, height } = chart;
        ctx.save();
        const completedCount = checklistData.filter(
          (item) => item.completed
        ).length;
        const totalCount = checklistData.length;
        const text = totalCount ? `${completedCount}/${totalCount}` : `0/0`;
        ctx.font = "bold 20px Arial";
        ctx.fillStyle = "#ffffff"; // 흰색 텍스트 (다크 테마)
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillText(text, width / 2, height / 2);
        ctx.restore();
      },
    };

    const completedCount = checklistData.filter(
      (item) => item.completed
    ).length;
    const totalCount = checklistData.length;
    const uncompletedCount = totalCount - completedCount;

    // 체크리스트 차트 생성
    const ctx = checklistChartRef.current.getContext("2d");
    checklistChartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["완료", "미완료"],
        datasets: [
          {
            data: [completedCount, uncompletedCount],
            backgroundColor: ["#3B82F6", "rgba(255, 255, 255, 0.1)"], // 파란색, 투명 흰색 (다크 테마)
            borderWidth: 0,
          },
        ],
      },
      options: {
        cutout: "70%",
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
      },
      plugins: [centerTextPlugin],
    });
  }, [checklistData]);

  // 체크리스트 데이터 저장
  const saveChecklistData = (data) => {
    try {
      localStorage.setItem("securityChecklist", JSON.stringify(data));
    } catch (error) {
      console.error("체크리스트 데이터 저장 오류:", error);
    }
  };

  // 체크리스트 항목 추가 핸들러
  const handleAddChecklistItem = (e) => {
    e.preventDefault();
    const trimmedInput = checklistInput.trim();

    if (trimmedInput) {
      // 한 줄씩 입력 (공백 제거)
      const lines = trimmedInput.split("\n");
      const newItems = lines
        .map((line) => line.trim())
        .filter((line) => line !== "")
        .map((line) => ({
          text: line,
          completed: false,
        }));

      const updatedList = [...checklistData, ...newItems];
      setChecklistData(updatedList);
      saveChecklistData(updatedList);
      setChecklistInput("");
    }
  };

  // 체크리스트 항목 상태 변경 핸들러
  const handleToggleChecklistItem = (index) => {
    const updatedList = [...checklistData];
    updatedList[index].completed = !updatedList[index].completed;
    setChecklistData(updatedList);
    saveChecklistData(updatedList);
  };

  // 체크리스트 항목 삭제 핸들러
  const handleDeleteChecklistItem = (index) => {
    const updatedList = checklistData.filter((_, i) => i !== index);
    setChecklistData(updatedList);
    saveChecklistData(updatedList);
  };

  // 증가/감소에 따른 색상 및 기호 반환
  const getChangeStyle = (value) => {
    const numValue = parseFloat(value);
    if (numValue > 0) {
      return { color: "#FF4D4F", symbol: "↑", text: "증가" };
    } else if (numValue < 0) {
      return { color: "#52C41A", symbol: "↓", text: "감소" };
    } else {
      return { color: "#8C8C8C", symbol: "-", text: "변동 없음" };
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  // 최근 실행일 변화 스타일
  const dailyChangeStyle = getChangeStyle(dashboardData.today.changeRate);

  // 안전 점수 변화 스타일
  const safetyScoreChangeStyle = getChangeStyle(safetyData.scoreDifference);

  return (
    <div className={styles.pageContainer}>
      <NavBar />

      <main className={styles.mainContent}>
        <h1 className={styles.title}>개인 안전 대시보드</h1>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.statsGrid}>
          {/* 민감 텍스트 카드 (HTML 내용을 React 컴포넌트로 변환) */}
          <div className={styles.statCard}>
            <h3 className={styles.statTitle}>오늘 감지된 위험 텍스트</h3>
            <div className={styles.statValue}>
              {dashboardData.today.detectedCount}
            </div>
            {dashboardData.today.lastExecutionDate ? (
              <p className={styles.statSubtext}>
                최근 실행일({dashboardData.today.lastExecutionDate}) 대비{" "}
                <span style={{ color: dailyChangeStyle.color }}>
                  {dailyChangeStyle.symbol}{" "}
                  {Math.abs(dashboardData.today.changeRate)}%
                </span>
              </p>
            ) : (
              <p className={styles.statSubtext}>오늘 하루 동안</p>
            )}

            {/* 유형별 목록 */}
            {dashboardData.today.sensitiveTypes.length > 0 && (
              <div className={styles.typeList}>
                {dashboardData.today.sensitiveTypes.map((type, index) => (
                  <p key={index} className={styles.typeItem}>
                    {type.type} ({type.count}건)
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* 안전 점수 카드 (차트로 표시) */}
          <div className={styles.statCard}>
            <h3 className={styles.statTitle}>안전 점수</h3>
            <div className={styles.chartContainer}>
              <canvas ref={chartRef}></canvas>
            </div>
            <p className={styles.statSubtext}>
              이전 대비{" "}
              <span style={{ color: safetyScoreChangeStyle.color }}>
                {safetyScoreChangeStyle.symbol}{" "}
                {Math.abs(safetyData.scoreDifference)}점
              </span>
            </p>
          </div>

          {/* 체크리스트 카드 */}
          <div className={styles.statCard}>
            <h3 className={styles.statTitle}>보안 점검 체크리스트</h3>
            <div className={styles.chartContainer}>
              <canvas ref={checklistChartRef}></canvas>
            </div>

            {/* 체크리스트 추가 폼 */}
            <form
              className={styles.checklistForm}
              onSubmit={handleAddChecklistItem}
            >
              <input
                type="text"
                className={styles.checklistInput}
                placeholder="체크리스트 항목을 입력하세요."
                value={checklistInput}
                onChange={(e) => setChecklistInput(e.target.value)}
              />
              <button type="submit" className={styles.checklistAddButton}>
                추가
              </button>
            </form>

            {/* 체크리스트 목록 */}
            <ul className={styles.checklist}>
              {checklistData.map((item, index) => (
                <li key={index} className={styles.checklistItem}>
                  <label className={styles.checklistLabel}>
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => handleToggleChecklistItem(index)}
                      className={styles.checklistCheckbox}
                    />
                    <span
                      className={
                        item.completed
                          ? styles.checklistTextCompleted
                          : styles.checklistText
                      }
                    >
                      {item.text}
                    </span>
                  </label>
                  <button
                    className={styles.checklistDeleteButton}
                    onClick={() => handleDeleteChecklistItem(index)}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 한 달간 감지된 민감 텍스트 (새로 추가된 부분) */}
        <div className={`${styles.dataGrid} ${styles.fullWidthGrid}`}>
          <div className={styles.dataCard}>
            <h3 className={styles.dataTitle}>한 달간 감지된 민감 텍스트</h3>
            <div className={styles.monthlyDataContainer}>
              <div className={styles.monthlyHeader}>
                <div className={styles.monthlyTotalCount}>
                  {monthlyData.totalCount}건
                </div>
                <p className={styles.monthlySubtext}>이번 달 총 감지 건수</p>
              </div>
              <div
                className={styles.monthlyChartContainer}
                style={{ height: "250px", width: "100%" }}
              >
                <canvas ref={monthlyChartRef}></canvas>
              </div>
            </div>
          </div>
        </div>

        {/* 두 번째 행: 월간 위험 감지와 유형별 민감 정보 차트 */}
        <div className={styles.dataGrid}>
          {/* 월간 위험 감지 차트 */}
          <div className={styles.dataCard}>
            <h3 className={styles.dataTitle}>월간 위험 감지 추이</h3>
            <div className={styles.chartContainer}>
              <canvas
                ref={monthlyRiskChartRef}
                style={{ height: "250px", width: "100%" }}
              ></canvas>
            </div>
          </div>

          {/* 유형별 민감 정보 차트 */}
          <div className={styles.dataCard}>
            <h3 className={styles.dataTitle}>유형별 민감 정보</h3>
            <div className={styles.chartContainer}>
              <canvas
                ref={sensitiveInfoChartRef}
                style={{ height: "250px", width: "100%" }}
              ></canvas>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
