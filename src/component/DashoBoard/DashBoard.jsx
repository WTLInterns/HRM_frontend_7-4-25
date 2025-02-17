import React, { useEffect, useState } from "react";
import { Link, Routes, Route } from "react-router-dom";
import Attendance from "./Attendance";
import SalarySheet from "./SalarySheet";
import SalarySlip from "./SalarySlip";
import AddEmp from "./AddEmp";
import { IoIosLogOut } from "react-icons/io";
import { FaReceipt, FaRegCalendarCheck } from "react-icons/fa";
import { useApp } from "../../context/AppContext";
import { IoIosPersonAdd } from "react-icons/io";
import { LuNotebookPen } from "react-icons/lu";
import { MdOutlinePageview } from "react-icons/md";
import { BiSolidSpreadsheet } from "react-icons/bi";
import ViewAttendance from "./ViewAttendance";

const Dashboard = () => {
  const { fetchAllEmp, emp, logoutUser } = useApp();

  useEffect(() => {
    fetchAllEmp();
  }, []);

  const activeEmp = emp.filter((emp) => emp.status === "active");

  const jobRolesSet = new Set(emp.map((employee) => employee.jobRole));

  const jobRoleCounts = Array.from(jobRolesSet).reduce((acc, jobRole) => {
    const count = emp.filter((emp) => emp.jobRole === jobRole).length;
    acc[jobRole] = count;
    console.log(jobRole);

    return acc;
  }, {});
  // console.log()

  const activeEmpCount = activeEmp.length;

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-blue-900 text-white flex flex-col fixed h-full">
        <div className="p-4 text-center text-xl font-bold border-b border-blue-700">
          My Dashboard
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/dashboard"
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
            style={{
              position: "relative",
              top: "298px",
            }}
          >
            <IoIosLogOut /> Logout
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-6 w-full ml-64 transition">
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="bg-white shadow-md p-4 rounded-lg text-center">
            <h2 className="text-xl font-bold text-gray-700">Total Employees</h2>
            <p className="text-2xl font-semibold">{emp.length}</p>
          </div>
          <div className="bg-white shadow-md p-4 rounded-lg text-center">
            <h2 className="text-xl font-bold text-gray-700">
              Active Employees
            </h2>
            <p className="text-2xl font-semibold">{activeEmpCount}</p>
          </div>
          <div className="bg-white shadow-md p-4 rounded-lg">
            <h2 className="text-xl font-bold text-gray-700">
              Active Employees by Job Role
            </h2>
            <div className="flex flex-wrap gap-4 mt-4">
              {Object.entries(jobRoleCounts).map(([jobRole, count]) => (
                <div
                  key={jobRole}
                  className="flex items-center bg-blue-100 p-2 rounded-lg shadow-md w-24 justify-between"
                >
                  <div className="text-sm font-semibold truncate w-full">
                    {jobRole}
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 mr-2" />
                    <span>{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Routes>
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
