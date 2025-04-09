import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AppContext = createContext();

export const useApp = () => {
  return useContext(AppContext);
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      // Clear the corrupted data
      localStorage.removeItem("user");
      return null;
    }
  });
  const [authToken, setAuthToken] = useState(
    () => localStorage.getItem("token") || ""
  );
  const [emp, setEmp] = useState([]);
  const [role, setRole] = useState(user?.role || "");
  const [loading, setLoading] = useState(true);
  const [isProfitable, setIsProfitable] = useState(false);
  const [companyBudget] = useState(1000000); // 10 lakh budget
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    inactiveEmployees: 0,
    totalSalary: 0,
    activeSalary: 0,
    inactiveSalary: 0,
    profitLoss: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem("user", JSON.stringify(user));
      } catch (error) {
        console.error("Error storing user in localStorage:", error);
      }
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    if (authToken) {
      localStorage.setItem("token", authToken);
    } else {
      localStorage.removeItem("token");
    }
  }, [authToken]);

  const loginUser = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:8282/auth/login", {
        email,
        password,
      });
      console.log("API Response:", response.data);
      const { token, role, email: userEmail } = response.data;
      setAuthToken(token);
      setUser({ email: userEmail, role });
      return response.data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const saveUser = async (userData) => {
    try {
      const response = await axios.post(
        "http://localhost:8282/auth/register",
        userData
      );
      const { token, user } = response.data;
      setAuthToken(token);
      setUser(user);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to save user:", error);
      throw error;
    }
  };

  const logoutUser = () => {
    // Clear user data
    setUser(null);
    setEmp([]);
    // Clear local storage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Navigate to logout page
    navigate('/logout');
  };

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get("http://localhost:8282/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };

  const forgotPassword = async (updatedUser) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.put(
        "http://localhost:8282/auth/reset",
        updatedUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Password reset successful:", response.data);
      setUser(response.data);
    } catch (error) {
      console.error(
        "Failed to reset password:",
        error.response?.data || error.message
      );
    }
  };

  const addEmp = async (userData) => {
    try {
      const response = await axios.post(
        "http://localhost:8282/public/addEmp",
        userData
      );
      setEmp(prevEmp => [...prevEmp, response.data]);
      return response.data;
    } catch (error) {
      console.error("Failed to save user:", error);
      throw error;
    }
  };

  const createAttendance = async (attendanceData, email) => {
    try {
      const response = await axios.post(
        "http://localhost:8282/public/att",
        attendanceData,
        { params: { email } }
      );
      if (response.status === 201) {
        console.log("Attendance created:", response.data);
        return response.data;
      } else {
        throw new Error("Error creating attendance");
      }
    } catch (err) {
      console.error(
        "Failed to create attendance:",
        err.response?.data?.message || err.message
      );
      throw err;
    }
  };

  const fetchAllEmp = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8282/public/getAllEmp');
      setEmp(response.data);
      calculateStats(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (employees) => {
    try {
      const activeEmployees = employees.filter(employee => employee.status === "active");
      const inactiveEmployees = employees.filter(employee => employee.status === "inactive");
      
      const activeSalary = activeEmployees.reduce((sum, emp) => sum + (emp.salary || 0), 0);
      const inactiveSalary = inactiveEmployees.reduce((sum, emp) => sum + (emp.salary || 0), 0);
      const totalSalary = activeSalary + inactiveSalary;
      
      const profitLoss = companyBudget - totalSalary;
      const profitable = profitLoss > 0;
      setIsProfitable(profitable);
      
      setStats({
        totalEmployees: employees.length,
        activeEmployees: activeEmployees.length,
        inactiveEmployees: inactiveEmployees.length,
        totalSalary,
        activeSalary,
        inactiveSalary,
        profitLoss
      });
    } catch (error) {
      console.error("Error calculating stats:", error);
    }
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

  // Define yearlyData which was missing
  const yearlyData = [
    { year: '2020', profit: 80000, loss: 20000 },
    { year: '2021', profit: 90000, loss: 15000 },
    { year: '2022', profit: 120000, loss: 25000 },
    { year: '2023', profit: 150000, loss: 30000 },
    { year: '2024', profit: 200000, loss: 40000 },
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
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1500,
      easing: 'easeOutCirc',
      delay: (context) => context.dataIndex * 200
    },
    elements: {
      arc: {
        borderWidth: 0
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

  const deleteEmployee = async (empId) => {
    try {
      await axios.delete(`http://localhost:8282/public/deleteEmp/${empId}`);
      toast.success("Employee deleted successfully");
      setEmp(prevEmp => prevEmp.filter(emp => emp.empId !== empId));
    } catch (error) {
      toast.error("Failed to delete employee");
    }
  };

  const updateEmployee = async (empId, updatedData) => {
    try {
      const response = await axios.put(
        `http://localhost:8282/public/update/${empId}`,
        updatedData,
        { headers: { "Content-Type": "application/json" } }
      );
      setEmp(prevEmp => prevEmp.map(emp => 
        emp.empId === empId ? response.data : emp
      ));
      return response.data;
    } catch (error) {
      console.error("Failed to update employee:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchAllEmp();
  }, []);

  const value = {
    user,
    setUser,
    authToken,
    setAuthToken,
    emp,
    setEmp,
    role,
    setRole,
    loading,
    setLoading,
    isProfitable,
    stats,
    companyBudget,
    loginUser,
    logoutUser,
    fetchUserProfile,
    forgotPassword,
    addEmp,
    createAttendance,
    fetchAllEmp,
    deleteEmployee,
    updateEmployee,
    pieChartData,
    barChartData,
    chartOptions,
    barChartOptions
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
