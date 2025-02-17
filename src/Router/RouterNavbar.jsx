import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";

import Login from "../component/Auth/Login";
import SignUp from "../component/Auth/SignUp";
import Profile from "../component/Auth/Profile";
import ResetPassword from "../component/Auth/ResetPassword";
import Salary from "../component/Auth/Salaray";
import EmployeeSearch from "../component/Auth/EmployeeSearch";
import Dashboard from "../component/DashoBoard/DashBoard";
import UserDashBoard from "../component/User/UserDashBoard";
import { useApp } from "../context/AppContext";
import ProtectRoute from "../component/Auth/ProtectRoute";

const RouterNavbar = () => {
  const { user, logoutUser, fetchUserProfile } = useApp();

  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/profile"
          element={
            <ProtectRoute>
              <Profile />
            </ProtectRoute>
          }
        />
        <Route path="/reset" element={<ResetPassword />} />
        <Route
          path="/salary"
          element={
            <ProtectRoute>
              <Salary />
            </ProtectRoute>
          }
        />
        <Route
          path="/empsearch"
          element={
            <ProtectRoute>
              <EmployeeSearch />
            </ProtectRoute>
          }
        />
        <Route
          path="/dashboard/*"
          element={
            <ProtectRoute>
              <Dashboard />
            </ProtectRoute>
          }
        />
        <Route
          path="/userdashboard/*"
          element={
            <ProtectRoute>
              <UserDashBoard />
            </ProtectRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default RouterNavbar;
