import React from "react";
import { useApp } from "../../context/AppContext";
import "./animations.css";
import { FaUsers, FaUserCheck, FaUserMinus, FaBriefcase } from "react-icons/fa";

const Home = () => {
  const { emp } = useApp();

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
    <div className="animate-fadeIn">
      {/* Stats Cards - responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        <div className="bg-white shadow-md p-6 rounded-lg text-center transition-all duration-300 hover:shadow-xl card-hover animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          <div className="flex justify-center mb-3">
            <FaUsers className="text-blue-500 text-4xl animate-float" />
          </div>
          <h2 className="text-lg md:text-xl font-bold text-gray-700">Total Employees</h2>
          <p className="text-2xl md:text-3xl font-semibold text-blue-600 mt-2">{emp.length}</p>
        </div>
        <div className="bg-white shadow-md p-6 rounded-lg text-center transition-all duration-300 hover:shadow-xl card-hover animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <div className="flex justify-center mb-3">
            <FaUserCheck className="text-green-500 text-4xl animate-float" />
          </div>
          <h2 className="text-lg md:text-xl font-bold text-gray-700">Active Employees</h2>
          <p className="text-2xl md:text-3xl font-semibold text-green-600 mt-2">{activeEmpCount}</p>
        </div>
        <div className="bg-white shadow-md p-6 rounded-lg text-center sm:col-span-2 lg:col-span-1 transition-all duration-300 hover:shadow-xl card-hover animate-fadeIn" style={{ animationDelay: '0.3s' }}>
          <div className="flex justify-center mb-3">
            <FaUserMinus className="text-red-500 text-4xl animate-float" />
          </div>
          <h2 className="text-lg md:text-xl font-bold text-gray-700">Inactive Employees</h2>
          <p className="text-2xl md:text-3xl font-semibold text-red-600 mt-2">{inactiveEmpCount}</p>
        </div>
      </div>

      {/* Job Role Summary */}
      <div className="bg-white shadow-md p-6 rounded-lg mb-6 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
        <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
          <FaBriefcase className="mr-2 text-blue-500" /> Employees by Job Role
        </h2>
        <div className="flex flex-wrap gap-4 mt-4">
          {Object.entries(jobRoleSummary).map(([role, counts], index) => (
            <div
              key={role}
              className="flex flex-col bg-blue-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:bg-blue-100 animate-fadeIn"
              style={{ animationDelay: `${0.5 + (index * 0.1)}s` }}
            >
              <div className="text-sm font-semibold truncate text-blue-800">{role}</div>
              <div className="flex items-center text-sm mt-2">
                <span className="w-3 h-3 rounded-full bg-green-500 mr-1 animate-pulse-slow"></span>
                <span className="font-medium">{counts.active}</span>
                <span className="mx-2 text-gray-400">|</span>
                <span className="w-3 h-3 rounded-full bg-red-500 mr-1 animate-pulse-slow"></span>
                <span className="font-medium">{counts.inactive}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home; 