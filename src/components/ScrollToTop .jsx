import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    console.log(`[ScrollToTop] 실행됨, 현재 경로: ${pathname}`);

    // ✅ 전체 문서의 스크롤을 맨 위로 이동
    window.scrollTo(0, 0);
    document.documentElement.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
