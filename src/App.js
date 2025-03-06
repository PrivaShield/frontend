import React from 'react';
import AppRoutes from './appRoutes/routes'
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from "./contexts/UserContext"; // UserProvider 추가

function App() {
  return (
    <UserProvider>
      {" "}
      {/* ✅ 전역 상태 제공 */}
      <BrowserRouter>
        <AppRoutes /> {/* AppRoutes를 렌더링 */}
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
