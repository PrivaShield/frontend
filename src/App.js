import React from 'react';
import AppRoutes from './appRoutes/routes'
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <AppRoutes /> {/* AppRoutes를 렌더링 */}
    </BrowserRouter>
  );
}

export default App;
