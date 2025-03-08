import React, { useEffect } from "react";
import { Link, Routes, Route } from "react-router-dom";
import Attendance from "./Attendance";
import SalarySheet from "./SalarySheet";
import SalarySlip from "./SalarySlip";
import AddEmp from "./AddEmp";
import ViewAttendance from "./ViewAttendance";
import { IoIosLogOut, IoIosPersonAdd } from "react-icons/io";
import { LuNotebookPen } from "react-icons/lu";
import { MdOutlinePageview } from "react-icons/md";
import { FaReceipt } from "react-icons/fa";
import { BiSolidSpreadsheet } from "react-icons/bi";
import { useApp } from "../../context/AppContext";
import Navbar2 from "./Navbar2";

const Dashboard = () => {
  const { fetchAllEmp, emp, logoutUser } = useApp();

  useEffect(() => {
    fetchAllEmp();
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

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col fixed h-full">
        <div className="p-4 text-center text-xl font-bold border-b border-blue-700">
          My Dashboard
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {/* <Link
            to="/dashboard"
            className="flex items-center gap-2 p-2 rounded hover:bg-blue-700 hover:text-gray-200"
          >
            Dashboard
          </Link> */}

          <Link
            to="/dashboard/n"
            className="flex items-center gap-2 p-2 rounded hover:bg-blue-700 hover:text-gray-200"
          >
            Dashboard
          </Link>
          <Link
            to="/dashboard/addEmp"
            className="flex items-center gap-2 p-2 rounded hover:bg-blue-700 hover:text-gray-200"
          >
            <IoIosPersonAdd />
            Add Employee
          </Link>
          <Link
            to="/dashboard/attendance"
            className="flex items-center gap-2 p-2 rounded hover:bg-blue-700 hover:text-gray-200"
          >
            <LuNotebookPen />
            Attendance
          </Link>
          <Link
            to="/dashboard/viewAtt"
            className="flex items-center gap-2 p-2 rounded hover:bg-blue-700 hover:text-gray-200"
          >
            <MdOutlinePageview />
            View Attendance
          </Link>
          <Link
            to="/dashboard/salaryslip"
            className="flex items-center gap-2 p-2 rounded hover:bg-blue-700 hover:text-gray-200"
          >
            <FaReceipt />
            Salary Slip
          </Link>
          <Link
            to="/dashboard/salarysheet"
            className="flex items-center gap-2 p-2 rounded hover:bg-blue-700 hover:text-gray-200"
          >
            <BiSolidSpreadsheet />
            Salary Sheet
          </Link>
          <button
            onClick={logoutUser}
            className="flex items-center gap-2 p-2 rounded hover:bg-blue-700 hover:text-gray-200"
            style={{ position: "relative", top: "298px" }}
          >
            <IoIosLogOut /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 w-full ml-64 transition">
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="bg-white shadow-md p-4 rounded-lg text-center">
            <h2 className="text-xl font-bold text-gray-700">Total Employees</h2>
            <p className="text-2xl font-semibold">{emp.length}</p>
          </div>
          <div className="bg-white shadow-md p-4 rounded-lg text-center">
            <h2 className="text-xl font-bold text-gray-700">Active Employees</h2>
            <p className="text-2xl font-semibold">{activeEmpCount}</p>
          </div>
          <div className="bg-white shadow-md p-4 rounded-lg text-center">
            <h2 className="text-xl font-bold text-gray-700">Inactive Employees</h2>
            <p className="text-2xl font-semibold ">{inactiveEmpCount}
             
            </p>
          </div>
{/* 
          <div className="bg-white shadow-md p-4 rounded-lg col-span-3">
            <h2 className="text-xl font-bold text-gray-700">Employees by Job Role</h2>
            <div className="flex flex-wrap gap-4 mt-4">
              {Object.entries(jobRoleSummary).map(([role, counts]) => (
                <div
                  key={role}
                  className="flex flex-col bg-blue-100 p-4 rounded-lg shadow-md w-40"
                >
                  <div className="text-sm font-semibold truncate">{role}</div>
                  <div className="flex items-center text-sm mt-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 mr-1"></span>
                    <span>{counts.active}</span>
                    <span className="mx-2">|</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 mr-1"></span>
                    <span>{counts.inactive}</span>
                  </div>
                </div>
              ))}
            </div>
          </div> */}
        </div>

        {/* Routes */}
        <Routes>
        <Route path="n" element={<Navbar2 />} />

          <Route path="addEmp" element={<AddEmp />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="salarysheet" element={<SalarySheet />} />
          <Route path="salaryslip" element={<SalarySlip />} />
          <Route path="viewAtt" element={<ViewAttendance />} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;
