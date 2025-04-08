import React, { useContext, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { useApp } from "../../context/AppContext";

const isTokenValid = (token) => {
  if (!token) return false;
  try {
    const decoded = jwtDecode(token);
    return decoded.exp > Date.now() / 1000;
  } catch (error) {
    console.error("Token decoding failed:", error);
    return false;
  }
};

const ProtectRoute = ({ children }) => {
  const authContext = useApp();
  if (!authContext) {
    console.error("AuthContext is undefined. Ensure it is wrapped properly.");
    return null;
  }

  const { user, logoutUser } = authContext;
  const token = localStorage.getItem("token");
  const [hasToastShown, setHasToastShown] = useState(false);

  const isValidToken = isTokenValid(token);

  useEffect(() => {
    if (token && !isValidToken && !hasToastShown) {
      localStorage.removeItem("token");
      logoutUser();
      localStorage.removeItem("invoice-token");
      toast.error("Please login to access this page");
      setHasToastShown(true);
    }
  }, [token, isValidToken, user]);

  if (!user || !isValidToken) {
    return <Navigate to="/login" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectRoute;
