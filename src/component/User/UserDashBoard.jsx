import React from "react";
import { Link, Routes, Route } from "react-router-dom";
import SalarySlip from "./SalarySlip";
import ViewAttendance from "./ViewAttendance";
import {
  FaCalendarWeek,
  FaReceipt,
  FaRegCalendarCheck,
  FaUser,
} from "react-icons/fa";

import { IoReceiptOutline } from "react-icons/io5";
import Profile from "../Auth/Profile";
import { useApp } from "../../context/AppContext";

const UserDashboard = () => {
  const { logoutUser } = useApp();
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="p-4 text-center text-xl font-bold border-b border-blue-700">
          My Dashboard
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/userdashboard"
            className="block p-2 rounded hover:bg-blue-700 hover:text-gray-200"
          >
            Dashboard
          </Link>

          <Link
            to="/userdashboard/viewAtten"
            className="flex items-center gap-2 p-2 rounded hover:bg-blue-700 hover:text-gray-200"
          >
            <FaCalendarWeek />
            View Attendance
          </Link>

          <Link
            to="/userdashboard/salaryslip"
            className="flex items-center gap-2 p-2 rounded hover:bg-blue-700 hover:text-gray-200"
          >
            <FaReceipt />
            Salary Slip
          </Link>

          <Link
            to="/userdashboard/profile"
            className="flex items-center gap-2 p-2 rounded hover:bg-blue-700 hover:text-gray-200"
          >
            <FaReceipt />
            View Profile
          </Link>

          <button
            onClick={() => logoutUser()}
            className="block p-2 rounded hover:bg-blue-700 hover:text-gray-200"
          >
            Logout
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-6 w-full">
        <Routes>
          <Route path="/" element={<div>Welcome to User Dashboard</div>} />

          <Route path="/salaryslip" element={<SalarySlip />} />
          <Route path="/viewAtten" element={<ViewAttendance />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
};

export default UserDashboard;
