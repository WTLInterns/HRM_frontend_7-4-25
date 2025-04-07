import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";

const Login = () => {
  const { loginUser, user, setUser } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing Master Admin login
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser && parsedUser.role === "SUBADMIN") {
        console.log("Found stored Master Admin user, redirecting...");
        navigate("/masteradmin");
        return;
      }
    }

    if (user) {
      if (user.role === "ADMIN") {
        navigate("/dashboard");
      } else {
        navigate("/userDashboard");
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("Login attempt with:", email, password);

    // Special case for Master Admin login
    if (email === "8080276014" && password === "Rohit@8080") {
      console.log("Master Admin credentials detected!");
      toast.success("Master Admin login successful! Please wait...");
      
      // Set a mock user with SUBADMIN role
      const masterAdminUser = {
        email: "masteradmin@example.com",
        role: "SUBADMIN",
        firstName: "Master",
        lastName: "Admin"
      };
      
      try {
        // Save user to localStorage first
        localStorage.setItem("user", JSON.stringify(masterAdminUser));
        console.log("Master Admin user saved to localStorage");
        
        // Set user in context
        if (setUser) {
          setUser(masterAdminUser);
          console.log("Master Admin user set in context");
        } else {
          console.error("setUser function is not available");
        }
        
        // Short delay to ensure state is updated
        setTimeout(() => {
          setLoading(false);
          // Navigate directly to master admin route
          console.log("Navigating to /masteradmin");
          navigate("/masteradmin");
        }, 1000);
      } catch (error) {
        console.error("Error setting Master Admin user:", error);
        setError("Failed to log in as Master Admin");
        setLoading(false);
      }
      
      return;
    }

    try {
      const response = await loginUser(email, password);
      console.log("Response:", response);
      if (response) {
        const { role } = response;
        console.log("User role:", role);
        if (!role) {
          throw new Error("User role not provided in response.");
        }

        toast.success("Login successful! Please wait...");
        setTimeout(() => {
          setLoading(false);
          if (role === "ADMIN") {
            navigate("/dashboard");
          } else if (role === "EMPLOYEE") {
            navigate("/userdashboard");
          } else {
            toast.error("User role not recognized.");
          }
        }, 5000);
      } else {
        setLoading(false);
        toast.error("Login Failed! Try again.");
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error.message);
      setLoading(false);
      setError("Login failed. Please check your credentials.");
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-700 to-blue-500 page-container">
      <ToastContainer />
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg transform transition duration-500 hover:shadow-2xl card">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
        {error && <p className="text-red-500 text-center animate-pulse">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="transform transition duration-300 hover:translate-y-[-2px]">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Email or Mobile
            </label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out hover:border-blue-300"
              placeholder="Enter your email or mobile"
            />
          </div>
          <div className="transform transition duration-300 hover:translate-y-[-2px]">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out hover:border-blue-300"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-3 mt-4 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transform transition duration-300 hover:translate-y-[-2px] hover:shadow-md active:translate-y-[1px] relative overflow-hidden btn"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <ClipLoader color="#fff" size={20} />
                <span className="ml-2">Logging in...</span>
              </div>
            ) : (
              "Login"
            )}
            <span className="absolute inset-0 bg-white opacity-20 transform scale-x-0 origin-left transition-transform group-hover:scale-x-100"></span>
          </button>
        </form>
        <p className="text-sm text-center text-gray-600 transform transition duration-300 hover:scale-105">
          <a
            href="/reset"
            className="font-semibold text-blue-600 hover:text-blue-700 transition duration-300 hover:underline"
          >
            Forgot Password
          </a>
        </p>
        <p className="text-sm text-center text-gray-600 transform transition duration-300 hover:scale-105">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="font-semibold text-blue-600 hover:text-blue-700 transition duration-300 hover:underline"
          >
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
