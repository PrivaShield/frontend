import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "../components/LoginPage";
import SignupPage from "../components/SignupPage";
import HeroPage from "../components/HeroPage";
import Dashboard from "../components/Dashboard";
import MyPage from "../components/MyPage";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HeroPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/mypage" element={<MyPage />} />
    </Routes>
  );
};

export default AppRoutes;
