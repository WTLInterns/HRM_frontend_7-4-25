import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";
import { FaEnvelope, FaLock, FaUser, FaBuilding, FaCheckCircle, FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";
import "../DashoBoard/animations.css";
import axios from "axios";

const Login = () => {
  console.log("Login component rendering");
  const { loginUser, user, setUser } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [fromLogout, setFromLogout] = useState(false);

  // Clear form fields on initial load and check if coming from logout
  useEffect(() => {
    console.log("Login component mounted, location state:", location.state);
    setEmail("");
    setPassword("");
    
    // Check if coming from logout page
    if (location.state && location.state.fromLogout) {
      console.log("Coming from logout page, preventing auto-redirect");
      console.log("fromLogout state detected in location:", location.state.fromLogout);
      setFromLogout(true);
      
      // Clear any localStorage remainders to ensure clean login state
      console.log("Clearing localStorage items due to logout redirect");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      
      // Additional clean up for any other items if needed
      // localStorage.removeItem("otherItem");
    } else {
      console.log("Not coming from logout page, fromLogout set to false");
      // Only reset fromLogout if we're not coming from logout page
      // This ensures the flag persists through rerenders when needed
      setFromLogout(false);
    }
  }, [location]);

  // Handle user state changes and redirections
  useEffect(() => {
    console.log("User state changed in Login component");
    console.log("Current user:", user);
    console.log("fromLogout flag:", fromLogout);
    
    // Skip redirection if we just came from logout
    if (fromLogout) {
      console.log("Skipping redirection as we came from logout");
      return;
    }
    
    // Check for existing login
    try {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      console.log("Stored user from localStorage:", storedUser);
      console.log("Token exists in localStorage:", !!token);
      
      // Only redirect if both user and token exist
      if (storedUser && token) {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log("Parsed user from localStorage:", parsedUser);
          
          // Validate that the user object has required properties
          if (!parsedUser || !parsedUser.role) {
            console.log("Invalid user data in localStorage, clearing...");
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            return;
          }
          
          if (parsedUser.role === "MASTER_ADMIN") {
            console.log("Found stored Master Admin user, redirecting to /masteradmin");
            navigate("/masteradmin");
            return;
          } else if (parsedUser.role === "SUBADMIN") {
            console.log("Found stored SUB_ADMIN user, redirecting to /dashboard");
            navigate("/dashboard");
            return;
          } else if (parsedUser.role === "EMPLOYEE") {
            console.log("Found stored Employee user, redirecting to /userDashboard");
            navigate("/userDashboard");
            return;
          } else {
            console.log("Unknown user role in localStorage:", parsedUser.role);
          }
        } catch (parseError) {
          console.error("Error parsing user from localStorage:", parseError);
          // Clear invalid JSON data
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      } else {
        console.log("Missing user or token in localStorage, staying on login page");
      }

      // Check context user if localStorage check didn't redirect
      if (user) {
        console.log("User found in context, role:", user.role);
        if (user.role === "SUBADMIN") {
          console.log("Redirecting to /dashboard");
          navigate("/dashboard");
        } else if (user.role === "EMPLOYEE") {
          console.log("Redirecting to /userDashboard");
          navigate("/userDashboard");
        } else if (user.role === "MASTER_ADMIN") {
          console.log("Redirecting to /masteradmin");
          navigate("/masteradmin");
        } else {
          console.log("Unknown user role:", user.role);
        }
      } else {
        console.log("No user found in context, staying on login page");
      }
    } catch (error) {
      console.error("Error in Login useEffect:", error);
      // Clear potentially corrupted data
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, [user, navigate, fromLogout]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("Login attempt with:", email, password);

    try {
      console.log("Attempting login through API...");
      
      // Determine API endpoint based on email domain or other logic
      // This is a simple example - you may need more complex logic
      const loginEndpoint = email.includes("master") ? "/admin/login" : "/api/subadmin/login";
      console.log("Using login endpoint:", loginEndpoint);
      
      // Send params in URL rather than request body to match @RequestParam in backend
      const response = await axios.post(`${loginEndpoint}?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
      
      console.log("Login API response:", response);
      
      if (response.data) {
        // Format user data from API response
        const userData = {
          ...response.data,
          // Keep the role as provided by the API - don't override
          role: response.data.role,
          firstName: response.data.name || response.data.firstName || "User",
          lastName: response.data.lastname || response.data.lastName || ""
        };
        
        // Save to localStorage first (before setting user in context)
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", response.data.token || "demo-token");
        console.log("User data saved to localStorage:", userData);
        
        // Set fromLogout to false so redirection can happen
        setFromLogout(false);
        
        // Set in context
        if (setUser) {
          setUser(userData);
          console.log("User set in context:", userData);
        } else {
          console.error("setUser function is not available");
        }
        
        // Show success modal
        setSuccessMessage(`Login successful! Welcome to your dashboard.`);
        setShowSuccessModal(true);
        
        // Wait a little longer before redirecting to ensure state propagation
        setTimeout(() => {
          try {
            console.log("About to navigate based on role:", userData.role);
            setShowSuccessModal(false);
            setLoading(false);
            
            // Navigate based on role
            if (userData.role === "MASTER_ADMIN") {
              navigate("/masteradmin", { replace: true });
            } else if (userData.role === "SUBADMIN") {
              navigate("/dashboard", { replace: true });
            } else if (userData.role === "EMPLOYEE") {
              navigate("/userDashboard", { replace: true });
            } else {
              // Default fallback
              navigate("/dashboard", { replace: true });
            }
          } catch (navError) {
            console.error("Navigation error:", navError);
          }
        }, 2500);
        
        return;
      } else {
        throw new Error("Empty response from login API");
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      setLoading(false);
      
      // Handle specific error messages
      if (error.response) {
        const errorMessage = error.response.data?.message || "Invalid credentials";
        setError(errorMessage);
        toast.error(`Login failed: ${errorMessage}`);
      } else if (error.request) {
        setError("Network error: Server not responding");
        toast.error("Network error: Server not responding");
      } else {
        setError(`Error: ${error.message}`);
        toast.error(`Error: ${error.message}`);
      }
    }
  };

  // Close success modal
  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Add this function to the component
  const forceCleanLogin = (e) => {
    e.preventDefault();
    
    console.log("Force cleaning all storage and state");
    
    // Clear all localStorage
    localStorage.clear();
    sessionStorage.clear();
    
    // Reset state
    setFromLogout(true); // This prevents auto-redirect
    setEmail("");
    setPassword("");
    setError("");
    
    // Add a success message
    toast.success("Login state cleared successfully");
    
    // Force reload the page
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  // Debug unmounting
  useEffect(() => {
    return () => {
      console.log("Login component unmounting, current user:", user);
      console.log("Login localStorage on unmount:", {
        user: localStorage.getItem("user"),
        token: !!localStorage.getItem("token")
      });
    };
  }, [user]);

  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden animate-fadeIn bg-slate-900">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full bg-login-image opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/80 via-slate-900/90 to-slate-900/95"></div>
        
        {/* Animated orbs */}
        <div className="absolute top-[10%] left-[15%] w-72 h-72 rounded-full bg-blue-600/20 animate-float blur-3xl"></div>
        <div className="absolute bottom-[20%] right-[10%] w-80 h-80 rounded-full bg-indigo-600/20 animate-float-delay blur-3xl"></div>
        <div className="absolute top-[40%] right-[30%] w-64 h-64 rounded-full bg-sky-600/20 animate-pulse-slow blur-3xl"></div>
      </div>

      {/* Toast Container */}
      <ToastContainer 
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div className="bg-gradient-to-br from-green-900/90 to-green-800/90 backdrop-blur-xl rounded-xl shadow-2xl border border-green-700/50 max-w-md p-6 z-10 animate-scaleIn text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-600/30 flex items-center justify-center">
                <FaCheckCircle className="text-green-400 text-4xl animate-pulse-slow" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Login Successful!</h3>
            <p className="text-green-100 mb-6">{successMessage}</p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-md w-full mx-4 relative">
        {/* Logo/Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-4 animate-scaleIn">
            <FaBuilding className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-wide animate-fadeIn animate-delay-300">HRM SYSTEM</h1>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mt-2 rounded-full animate-fadeIn animate-delay-500"></div>
        </div>

        {/* Login Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden animate-scaleIn animate-delay-500">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Welcome Back</h2>
            
            {error && (
              <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 mb-4 animate-pulse">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email or Mobile
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-blue-400" />
                  </div>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="off"
                    className="block w-full pl-10 pr-3 py-3 bg-slate-700/50 border border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-100"
                    placeholder="Enter your email or mobile"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-blue-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    className="block w-full pl-10 pr-10 py-3 bg-slate-700/50 border border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-100"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-gray-400 hover:text-blue-400 transition-colors duration-200" />
                    ) : (
                      <FaEye className="text-gray-400 hover:text-blue-400 transition-colors duration-200" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full px-4 py-3 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
                  disabled={loading}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {loading ? (
                      <>
                        <ClipLoader color="#fff" size={20} />
                        <span className="ml-2">Logging in...</span>
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 transform scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100"></span>
                </button>
              </div>
              
              <div className="flex items-center justify-between mt-4 text-sm">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-blue-400 hover:text-blue-300 transition duration-300 hover:underline"
                >
                  Forgot Password?
                </button>
                
                <button
                  type="button"
                  onClick={forceCleanLogin}
                  className="text-xs text-gray-400 hover:text-blue-400 hover:underline transition-all duration-300"
                >
                  Force Clean Login
                </button>
              </div>
            </form>
          </div>
          
          <div className="bg-slate-900/50 p-4 border-t border-slate-700/50">
            <p className="text-xs text-center text-gray-400">
              By signing in, you agree to our terms and privacy policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
