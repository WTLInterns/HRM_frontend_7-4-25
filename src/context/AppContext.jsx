import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AppContext = createContext();

export const useApp = () => {
  return useContext(AppContext);
};

// Set up Axios defaults
axios.defaults.withCredentials = false;
// Set base URL
axios.defaults.baseURL = 'http://localhost:8282';

// Create an axios interceptor to add auth token to all requests
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

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
    totalEmployees: emp.length,
    activeEmployees: emp.filter(employee => employee.status === "Active" || employee.status === "active").length,
    inactiveEmployees: emp.filter(employee => employee.status === "Inactive" || employee.status === "inactive").length,
    totalSalary: emp.reduce((sum, employee) => sum + (parseFloat(employee.salary) || 0), 0),
    activeSalary: emp.filter(e => e.status === "Active" || e.status === "active")
      .reduce((sum, e) => sum + (parseFloat(e.salary) || 0), 0),
    inactiveSalary: emp.filter(e => e.status === "Inactive" || e.status === "inactive")
      .reduce((sum, e) => sum + (parseFloat(e.salary) || 0), 0),
    profitLoss: 1000000 - emp.reduce((sum, employee) => sum + (parseFloat(employee.salary) || 0), 0)
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
      // Determine which API endpoint to use based on email pattern or other logic
      const loginEndpoint = email.includes("master") ? "/admin/login" : "/api/subadmin/login";
      console.log("Using login endpoint:", loginEndpoint);
      
      // Send params in URL rather than request body to match @RequestParam in backend
      const response = await axios.post(`${loginEndpoint}?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
      
      console.log("API Response:", response.data);
      const { token, role } = response.data;
      setAuthToken(token);
      setUser({
        ...response.data,
        email: response.data.email || email,
        role: role // Keep the original role from the response
      });
      return response.data;
    } catch (error) {
      console.error("Login failed:", error);
      if (error.response) {
        console.log("Error response from server:", error.response);
        toast.error(`Login failed: ${error.response.data?.message || 'Invalid credentials'}`);
      } else if (error.request) {
        toast.error("Network error: Server not responding");
      } else {
        toast.error(`Error: ${error.message}`);
      }
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
    console.log("Explicit logout requested by user action");
    // Clear user data
    setUser(null);
    setEmp([]);
    // Clear local storage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Navigate to logout page with specific flag
    navigate('/logout', { state: { manualLogout: true } });
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
      // Convert types to match Java model expectations
      const formattedData = {
        ...userData,
        phone: typeof userData.phone === 'string' ? parseInt(userData.phone, 10) : userData.phone,
        salary: typeof userData.salary === 'string' ? parseInt(userData.salary, 10) : userData.salary,
        enabled: true,
        username: userData.email,
        accountNonLocked: true,
        accountNonExpired: true,
        credentialsNonExpired: true
      };
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };
      
      console.log("Making API request to add employee:", formattedData);
      // Use relative path since baseURL is now configured
      const response = await axios.post('/public/addEmp', formattedData, config);
      console.log("API response:", response);
      
      // Update local state with the new employee
      setEmp(prevEmp => [...prevEmp, response.data]);
      // Dispatch an event to notify components that employees have been updated
      window.dispatchEvent(new Event('employeesUpdated'));
      toast.success("Employee added successfully!");
      return response.data;
    } catch (error) {
      console.error("Failed to add employee:", error);
      // Show a more detailed error message
      if (error.response) {
        console.log("Error response from server:", error.response);
        
        if (error.response.status === 403) {
          toast.error("Access denied. Please check your login credentials or permissions.");
        } else {
          toast.error(`Server error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
        }
      } else if (error.request) {
        // Request was made but no response received
        toast.error("Network error: Cannot connect to the server. Is the backend running?");
      } else {
        // Other error
        toast.error(`Error: ${error.message}`);
      }
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
      // Try to obtain a CSRF token first if the server uses CSRF protection
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };
      
      console.log("Making API request to fetch employees...");
      // Use relative path since baseURL is now configured
      const response = await axios.get('/public/getAllEmp', config);
      console.log("API response:", response);
      
      if (response.data) {
        setEmp(response.data);
        calculateStats(response.data);
      } else {
        console.warn("Empty response from getAllEmp API");
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      // Show an error toast
      if (error.response) {
        // Server responded with an error status code
        console.log("Error response from server:", error.response);
        
        if (error.response.status === 403) {
          toast.error("Access denied. Please check your login credentials or permissions.");
        } else {
          toast.error(`Server error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
        }
      } else if (error.request) {
        // Request was made but no response received
        toast.error("Network error: Cannot connect to the server. Is the backend running?");
      } else {
        // Other error
        toast.error(`Error: ${error.message}`);
      }
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
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };
      
      console.log(`Making API request to delete employee with ID: ${empId}`);
      // Use relative path since baseURL is now configured
      await axios.delete(`/public/deleteEmp/${empId}`, config);
      console.log("Employee deleted successfully");
      
      toast.success("Employee deleted successfully");
      setEmp(prevEmp => prevEmp.filter(emp => emp.empId !== empId));
    } catch (error) {
      console.error("Failed to delete employee:", error);
      // Show a more detailed error message
      if (error.response) {
        console.log("Error response from server:", error.response);
        
        if (error.response.status === 403) {
          toast.error("Access denied. Please check your login credentials or permissions.");
        } else {
          toast.error(`Server error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
        }
      } else if (error.request) {
        toast.error("Network error: Cannot connect to the server. Is the backend running?");
      } else {
        toast.error(`Error: ${error.message}`);
      }
    }
  };

  const updateEmployee = async (empId, updatedData) => {
    try {
      // Convert types to match Java model expectations
      const formattedData = {
        ...updatedData,
        phone: typeof updatedData.phone === 'string' ? parseInt(updatedData.phone, 10) : updatedData.phone,
        salary: typeof updatedData.salary === 'string' ? parseInt(updatedData.salary, 10) : updatedData.salary,
        enabled: true,
        username: updatedData.email,
        accountNonLocked: true,
        accountNonExpired: true,
        credentialsNonExpired: true
      };
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };
      
      console.log(`Making API request to update employee with ID: ${empId}`, formattedData);
      // Use relative path since baseURL is now configured
      const response = await axios.put(`/public/update/${empId}`, formattedData, config);
      console.log("API response:", response);
      
      setEmp(prevEmp => prevEmp.map(emp => 
        emp.empId === empId ? response.data : emp
      ));
      toast.success("Employee updated successfully");
      return response.data;
    } catch (error) {
      console.error("Failed to update employee:", error);
      // Show a more detailed error message
      if (error.response) {
        console.log("Error response from server:", error.response);
        
        if (error.response.status === 403) {
          toast.error("Access denied. Please check your login credentials or permissions.");
        } else {
          toast.error(`Server error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
        }
      } else if (error.request) {
        toast.error("Network error: Cannot connect to the server. Is the backend running?");
      } else {
        toast.error(`Error: ${error.message}`);
      }
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
