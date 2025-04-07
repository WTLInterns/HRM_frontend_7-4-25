import React, { useEffect, useState } from "react";
import { Link, Routes, Route } from "react-router-dom";
import Attendance from "./Attendance";
import SalarySheet from "./SalarySheet";
import SalarySlip from "./SalarySlip";
import AddEmp from "./AddEmp";
import ViewAttendance from "./ViewAttendance";
import { IoIosLogOut, IoIosPersonAdd } from "react-icons/io";
import { LuNotebookPen } from "react-icons/lu";
import { MdOutlinePageview, MdKeyboardArrowDown, MdKeyboardArrowRight, MdDashboard } from "react-icons/md";
import { FaReceipt, FaCalendarAlt, FaRegIdCard } from "react-icons/fa";
import { BiSolidSpreadsheet } from "react-icons/bi";
import { HiMenu, HiX } from "react-icons/hi";
import { useApp } from "../../context/AppContext";
import Home from "./Home";
import ProfileForm from "./ProfileForm";
import "./animations.css";

const Dashboard = () => {
  const { fetchAllEmp, emp, logoutUser } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [attendanceDropdownOpen, setAttendanceDropdownOpen] = useState(false);

  useEffect(() => {
    // Only fetch if the emp array is empty
    if (!emp || emp.length === 0) {
      fetchAllEmp();
    }
    // Add fetchAllEmp as a dependency but don't worry about exhausive deps warning here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Count active and inactive employees
  const activeEmp = emp.filter((employee) => employee.status === "active");
  const inactiveEmp = emp.filter((employee) => employee.status === "inactive");
  const activeEmpCount = activeEmp.length;
  const inactiveEmpCount = inactiveEmp.length;

  // Group employees by job role and count active/inactive for each role
  const jobRoleSummary = emp.reduce((acc, employee) => {
    const role = employee.jobRole;
    if (!acc[role]) {
      acc[role] = { active: 0, inactive: 0 };
    }
    if (employee.status === "active") {
      acc[role].active += 1;
    } else {
      acc[role].inactive += 1;
    }
    return acc;
  }, {});

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const toggleAttendanceDropdown = () => {
    setAttendanceDropdownOpen(!attendanceDropdownOpen);
  };

  // Navigation links array for DRY code
  const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: <MdDashboard /> },
    { to: "/dashboard/addEmp", label: "Add Employee", icon: <IoIosPersonAdd /> },
    { 
      label: "Attendance",
      icon: <LuNotebookPen />,
      dropdown: true,
      children: [
        { to: "/dashboard/attendance", label: "Mark Attendance", icon: <FaCalendarAlt /> },
        { to: "/dashboard/viewAtt", label: "View Attendance", icon: <MdOutlinePageview /> },
      ]
    },
    { to: "/dashboard/salarysheet", label: "Salary Sheet", icon: <BiSolidSpreadsheet /> },
    { to: "/dashboard/salaryslip", label: "Salary Slip", icon: <FaReceipt /> },
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
        <h1 className="text-xl font-bold">WTL HRM Dashboard</h1>
      </div>

      {/* Sidebar */}
      <aside 
        className={`${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out fixed lg:relative left-0 h-full w-64 bg-gray-800 text-white shadow-xl z-40 overflow-y-auto flex flex-col`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-5">WTL HRM Dashboard</h1>
        </div>

        <nav className="px-4 flex-grow">
          <div className="space-y-1">
            {navLinks.map((link, index) => (
              link.dropdown ? (
                <div key={index} className="space-y-1 animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
                  <button
                    onClick={toggleAttendanceDropdown}
                    className="flex items-center justify-between w-full gap-2 p-2 rounded hover:bg-gray-700 hover:text-gray-200 transition-all duration-300 menu-item ripple"
                  >
                    <div className="flex items-center gap-2">
                      {link.icon && <span className="text-gray-300 animate-pulse-slow">{link.icon}</span>} {link.label}
                    </div>
                    {attendanceDropdownOpen ? <MdKeyboardArrowDown className="transition-transform duration-300" /> : <MdKeyboardArrowRight className="transition-transform duration-300" />}
                  </button>
                  {attendanceDropdownOpen && (
                    <div className="pl-4 mt-1 space-y-1 border-l-2 border-gray-600 animate-slideIn">
                      {link.children.map((child, childIndex) => (
                        <Link
                          key={childIndex}
                          to={child.to}
                          className="flex items-center gap-2 p-2 rounded hover:bg-gray-700 hover:text-gray-200 transition-all duration-300 menu-item hover:translate-x-2"
                          onClick={closeMobileMenu}
                        >
                          {child.icon && <span className="text-gray-300">{child.icon}</span>} {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={index}
                  to={link.to}
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-700 hover:text-gray-200 transition-all duration-300 menu-item ripple animate-fadeIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={closeMobileMenu}
                >
                  {link.icon && <span className="text-gray-300">{link.icon}</span>} {link.label}
                </Link>
              )
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
            <Route path="/" element={<Home />} />
            <Route path="addEmp" element={<AddEmp />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="salarysheet" element={<SalarySheet />} />
            <Route path="salaryslip" element={<SalarySlip />} />
            <Route path="viewAtt" element={<ViewAttendance />} />
            <Route path="profileform" element={<ProfileForm />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
