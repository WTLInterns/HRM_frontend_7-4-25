import React, { useEffect } from "react";
import { useApp } from "../../context/AppContext";
import "./animations.css";
import { FaUsers, FaUserCheck, FaUserMinus, FaBriefcase, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { Pie, Bar } from 'react-chartjs-2';

const Home = () => {
  const { emp } = useApp();
  
  // Calculate stats locally if not provided from context
  const activeEmp = emp.filter((employee) => employee.status === "Active" || employee.status === "active");
  const inactiveEmp = emp.filter((employee) => employee.status === "Inactive" || employee.status === "inactive");
  const activeEmpCount = activeEmp.length;
  const inactiveEmpCount = inactiveEmp.length;
  
  // For salary calculations
  const activeSalary = activeEmp.reduce((sum, emp) => sum + (parseFloat(emp.salary) || 0), 0);
  const inactiveSalary = inactiveEmp.reduce((sum, emp) => sum + (parseFloat(emp.salary) || 0), 0);
  const totalSalary = activeSalary + inactiveSalary;
  const companyBudget = 1000000; // 10 lakh budget
  const profitLoss = companyBudget - totalSalary;
  const isProfitable = profitLoss > 0;
  
  const stats = {
    totalEmployees: emp.length,
    activeEmployees: activeEmpCount,
    inactiveEmployees: inactiveEmpCount,
    totalSalary,
    activeSalary,
    inactiveSalary,
    profitLoss
  };

  // Prepare pie chart data
  const pieChartData = {
    labels: ['Active Salary', 'Inactive Salary'],
    datasets: [
      {
        data: [stats.activeSalary, stats.inactiveSalary],
        backgroundColor: [
          'rgba(56, 189, 248, 0.85)',   // Sky blue for active
          'rgba(251, 113, 133, 0.85)',  // Modern pink for inactive
        ],
        borderColor: [
          'rgba(56, 189, 248, 1)',
          'rgba(251, 113, 133, 1)',
        ],
        borderWidth: 0,
        hoverBackgroundColor: [
          'rgba(56, 189, 248, 1)',
          'rgba(251, 113, 133, 1)',
        ],
        hoverBorderColor: '#ffffff',
        hoverBorderWidth: 2,
        borderRadius: 6,
        spacing: 8,
        offset: 6,
      },
    ],
  };

  // Mock yearly data for the bar chart
  const yearlyData = [
    { year: 2020, profit: 150000, loss: 50000 },
    { year: 2021, profit: 200000, loss: 30000 },
    { year: 2022, profit: 250000, loss: 100000 },
    { year: 2023, profit: 300000, loss: 150000 },
    { year: 2024, profit: 350000, loss: 200000 }
  ];

  // Prepare bar chart data
  const barChartData = {
    labels: yearlyData.map(item => item.year),
    datasets: [
      {
        label: 'Profit',
        data: yearlyData.map(item => item.profit),
        backgroundColor: 'rgba(56, 189, 248, 0.85)',
        borderColor: 'rgba(56, 189, 248, 1)',
        borderWidth: 1,
      },
      {
        label: 'Loss',
        data: yearlyData.map(item => item.loss),
        backgroundColor: 'rgba(251, 113, 133, 0.85)',
        borderColor: 'rgba(251, 113, 133, 1)',
        borderWidth: 1,
      }
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    radius: '85%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleFont: {
          size: 16,
          weight: 'bold'
        },
        bodyFont: {
          size: 14
        },
        padding: 15,
        cornerRadius: 8,
        caretSize: 0,
        borderColor: '#475569',
        borderWidth: 0,
        displayColors: false,
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ₹${value.toLocaleString()} (${percentage}%)`;
          },
          labelTextColor: () => '#ffffff'
        }
      }
    }
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#ffffff',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#475569',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ₹${context.raw.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#ffffff'
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#ffffff',
          callback: (value) => `₹${value.toLocaleString()}`
        }
      }
    }
  };

  // Group employees by job role and count active/inactive for each role
  const jobRoleSummary = emp.reduce((acc, employee) => {
    const role = employee.jobRole;
    if (!acc[role]) {
      acc[role] = { active: 0, inactive: 0 };
    }
    if (employee.status === "Active" || employee.status === "active") {
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
        <div className="bg-slate-800 shadow-md p-6 rounded-lg text-center transition-all duration-300 hover:shadow-xl card-hover animate-fadeIn border border-blue-900 hover:border-blue-700" style={{ animationDelay: '0.1s' }}>
          <div className="flex justify-center mb-3">
            <FaUsers className="text-blue-400 text-4xl animate-float" />
          </div>
          <h2 className="text-lg md:text-xl font-bold text-gray-100">Total Employees</h2>
          <p className="text-2xl md:text-3xl font-semibold text-blue-400 mt-2">{emp.length}</p>
        </div>
        <div className="bg-slate-800 shadow-md p-6 rounded-lg text-center transition-all duration-300 hover:shadow-xl card-hover animate-fadeIn border border-blue-900 hover:border-blue-700" style={{ animationDelay: '0.2s' }}>
          <div className="flex justify-center mb-3">
            <FaUserCheck className="text-green-400 text-4xl animate-float" />
          </div>
          <h2 className="text-lg md:text-xl font-bold text-gray-100">Active Employees</h2>
          <p className="text-2xl md:text-3xl font-semibold text-green-400 mt-2">{activeEmpCount}</p>
        </div>
        <div className="bg-slate-800 shadow-md p-6 rounded-lg text-center sm:col-span-2 lg:col-span-1 transition-all duration-300 hover:shadow-xl card-hover animate-fadeIn border border-blue-900 hover:border-blue-700" style={{ animationDelay: '0.3s' }}>
          <div className="flex justify-center mb-3">
            <FaUserMinus className="text-red-400 text-4xl animate-float" />
          </div>
          <h2 className="text-lg md:text-xl font-bold text-gray-100">Inactive Employees</h2>
          <p className="text-2xl md:text-3xl font-semibold text-red-400 mt-2">{inactiveEmpCount}</p>
        </div>
      </div>

      {/* Job Role Summary */}
      <div className="bg-slate-800 shadow-md p-6 rounded-lg mb-6 animate-fadeIn border border-blue-900" style={{ animationDelay: '0.4s' }}>
        <h2 className="text-xl font-bold text-gray-100 mb-4 flex items-center">
          <FaBriefcase className="mr-2 text-blue-400" /> Employees by Job Role
        </h2>
        <div className="flex flex-wrap gap-4 mt-4">
          {Object.entries(jobRoleSummary).map(([role, counts], index) => (
            <div
              key={role}
              className="flex flex-col bg-slate-700 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:bg-slate-600 animate-fadeIn border border-blue-900"
              style={{ animationDelay: `${0.5 + (index * 0.1)}s` }}
            >
              <div className="text-sm font-semibold truncate text-blue-300">{role}</div>
              <div className="flex items-center text-sm mt-2 text-gray-200">
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

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-gray-400 text-sm mb-2">Total Employees</h3>
          <p className="text-2xl font-bold text-white">{stats.totalEmployees}</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-gray-400 text-sm mb-2">Active Employees</h3>
          <p className="text-2xl font-bold text-blue-400">{stats.activeEmployees}</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-gray-400 text-sm mb-2">Inactive Employees</h3>
          <p className="text-2xl font-bold text-red-400">{stats.inactiveEmployees}</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-gray-400 text-sm mb-2">Company Status</h3>
          <div className="flex items-center">
            <p className="text-2xl font-bold mr-2">
              {isProfitable ? (
                <span className="text-green-400">Profit</span>
              ) : (
                <span className="text-red-400">Loss</span>
              )}
            </p>
            {isProfitable ? (
              <FaArrowUp className="text-green-400" />
            ) : (
              <FaArrowDown className="text-red-400" />
            )}
          </div>
          <p className="text-sm text-gray-400 mt-1">
            {isProfitable ? '₹' + stats.profitLoss.toLocaleString() : '₹' + Math.abs(stats.profitLoss).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-4">Salary Distribution</h3>
          <div className="h-80">
            <Pie data={pieChartData} options={chartOptions} />
          </div>
          <div className="mt-4 flex justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-400 rounded-full mr-2"></div>
              <span className="text-gray-300">Active Salary</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-400 rounded-full mr-2"></div>
              <span className="text-gray-300">Inactive Salary</span>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-4">Yearly Performance</h3>
          <div className="h-80">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-white mb-4">Budget Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-700 p-4 rounded-lg">
            <h4 className="text-gray-400 text-sm">Total Budget</h4>
            <p className="text-2xl font-bold text-white">₹10,00,000</p>
          </div>
          <div className="bg-slate-700 p-4 rounded-lg">
            <h4 className="text-gray-400 text-sm">Total Salary</h4>
            <p className="text-2xl font-bold text-white">₹{stats.totalSalary.toLocaleString()}</p>
          </div>
          <div className="bg-slate-700 p-4 rounded-lg">
            <h4 className="text-gray-400 text-sm">Remaining Budget</h4>
            <p className={`text-2xl font-bold ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
              ₹{Math.abs(stats.profitLoss).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 