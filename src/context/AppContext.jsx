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
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [authToken, setAuthToken] = useState(
    () => localStorage.getItem("token") || ""
  );
  const [emp, setEmp] = useState([]);
  const [role, setRole] = useState(user?.role || "");

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
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
    setAuthToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
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
      fetchAllEmp();
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
      const response = await axios.get(
        "http://localhost:8282/public/getAllEmp"
      );
      if (response.status === 200 && Array.isArray(response.data)) {
        setEmp(response.data);
      } else {
        console.error("Error: API response is not an array", response);
      }
    } catch (error) {
      console.error("API Error while fetching Employee:", error);
    }
  };

  const deleteEmployee = async (empId) => {
    try {
      await axios.delete(`http://localhost:8282/public/deleteEmp/${empId}`);
      toast.success("Employee deleted successfully");
      fetchAllEmp();
    } catch (error) {
      toast.error("Failed to delete employee");
    }
  };

  // ADD: Update Employee API – sends JSON payload to /public/update/{empId}
  const updateEmployee = async (empId, updatedData) => {
    try {
      const response = await axios.put(
        `http://localhost:8282/public/update/${empId}`,
        updatedData,
        { headers: { "Content-Type": "application/json" } }
      );
      fetchAllEmp();
      return response.data;
    } catch (error) {
      console.error("Failed to update employee:", error);
      throw error;
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        loginUser,
        saveUser,
        logoutUser,
        fetchUserProfile,
        forgotPassword,
        addEmp,
        createAttendance,
        fetchAllEmp,
        emp,
        deleteEmployee,
        updateEmployee, // added updateEmployee here
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
