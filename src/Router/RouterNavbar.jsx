import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import Login from "../component/Auth/Login";
import SignUp from "../component/Auth/SignUp";
import Profile from "../component/Auth/Profile";
import ResetPassword from "../component/Auth/ResetPassword";
import Salary from "../component/Auth/Salaray";
import EmployeeSearch from "../component/Auth/EmployeeSearch";
import Dashboard from "../component/DashoBoard/DashBoard";
import UserDashBoard from "../component/User/UserDashBoard";
import MasterAdmin from "../component/MasterAdmin/MasterAdmin";
import Logout from "../component/Auth/Logout";
import { useApp } from "../context/AppContext";
import ProtectRoute from "../component/Auth/ProtectRoute";

// Simple fallback component if routes fail to load
const FallbackComponent = () => (
  <div style={{ padding: '20px', color: 'white', background: '#333', borderRadius: '8px', margin: '20px' }}>
    <h2>Loading Failed</h2>
    <p>There was an error loading the application. Please check the console for details.</p>
    <button 
      onClick={() => window.location.href = '/'}
      style={{ padding: '8px 16px', background: '#3b82f6', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer' }}
    >
      Go to Login
    </button>
  </div>
);

const RouterNavbar = () => {
  console.log("RouterNavbar component rendering");
  const { user, logoutUser, fetchUserProfile } = useApp();

  useEffect(() => {
    console.log("RouterNavbar mounted, current user:", user);
  }, [user]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/logout" element={<Logout />} />
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
        <Route path="/masteradmin/*" element={<MasterAdmin />} />
        <Route
          path="/userdashboard/*"
          element={
            <ProtectRoute>
              <UserDashBoard />
            </ProtectRoute>
          }
        />
        {/* Fallback route if none match */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default RouterNavbar;
