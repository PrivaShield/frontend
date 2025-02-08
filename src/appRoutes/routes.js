import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainPage from '../components/mainPage';
const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<MainPage />} />
        </Routes>
    );
};

export default AppRoutes;
