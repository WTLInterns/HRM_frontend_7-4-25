import React, { useState } from "react";
import { Link, Routes, Route } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import { MdDashboard, MdSupervisorAccount } from "react-icons/md";
import { HiMenu, HiX } from "react-icons/hi";
import { useApp } from "../../context/AppContext";
import SubAdminManagement from "../DashoBoard/SubAdminManagement";
import "../DashoBoard/animations.css";

const MasterAdmin = () => {
  const { logoutUser } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Navigation links array for DRY code
  const navLinks = [
    { to: "/masteradmin", label: "Dashboard", icon: <MdDashboard /> },
    { to: "/masteradmin/subadmin", label: "Sub Admins", icon: <MdSupervisorAccount /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile menu button - only visible on small screens */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-md bg-gray-700 text-white"
        >
          {mobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Header - only visible on small screens */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-center p-4 bg-gray-800 text-white">
        <h1 className="text-xl font-bold">Master Admin Dashboard</h1>
      </div>

      {/* Sidebar */}
      <aside 
        className={`${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out fixed lg:relative left-0 h-full w-64 bg-gray-800 text-white shadow-xl z-40 overflow-y-auto flex flex-col`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-5">Master Admin Dashboard</h1>
        </div>

        <nav className="px-4 flex-grow">
          <div className="space-y-1">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.to}
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-700 hover:text-gray-200 transition-all duration-300 menu-item ripple animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={closeMobileMenu}
              >
                {link.icon && <span className="text-gray-300">{link.icon}</span>} {link.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="mt-auto px-4 pb-6">
          <button
            onClick={logoutUser}
            className="flex items-center gap-2 p-2 w-full rounded bg-red-600 hover:bg-red-700 text-white transition-all duration-300 hover:translate-y-[-2px] hover:shadow-md"
          >
            <IoIosLogOut className="text-white animate-pulse-slow" /> Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile menu - only visible when menu is open on small screens */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={closeMobileMenu}
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4">
        {/* Add top padding on mobile to account for the fixed header */}
        <div className="pt-16 lg:pt-0 h-full page-transition-container">
          <Routes>
            <Route path="/" element={
              <div className="p-6 bg-white rounded-lg shadow-md animate-fadeIn">
                <h2 className="text-2xl font-semibold mb-4">Welcome to Master Admin Dashboard</h2>
                <p className="text-gray-600">
                  You can manage Sub Admins and access system-wide settings from here.
                </p>
              </div>
            } />
            <Route path="subadmin" element={<SubAdminManagement />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default MasterAdmin; 