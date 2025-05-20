import React, { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      console.log("AdminLogin - Token found, verifying");
      axios
        .get("https://nakestudios-be.vercel.app/api/auth/verify", {
          headers: { "x-auth-token": token },
        })
        .then((response) => {
          console.log("AdminLogin - Verification response:", response.data);
          if (response.data.isValid) {
            console.log("AdminLogin - Token valid, redirecting to dashboard");
            navigate("/admin-dashboard", { replace: true });
          } else {
            console.log("AdminLogin - Token invalid, staying on login page");
            localStorage.removeItem("adminToken");
          }
        })
        .catch((error) => {
          console.error(
            "AdminLogin - Token verification error:",
            error.response?.data || error.message
          );
          console.log("AdminLogin - Token invalid, staying on login page");
          localStorage.removeItem("adminToken");
        });
    }
  }, [navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("AdminLogin - Attempting login for:", email);
      const response = await axios.post(
        "https://nakestudios-be.vercel.app/api/auth/login",
        {
          email,
          password,
        }
      );

      console.log("AdminLogin - Full login response:", response.data);
      const { token } = response.data;

      if (!token) {
        throw new Error("No token received from server");
      }

      console.log("AdminLogin - Login successful, token received");
      localStorage.setItem("adminToken", token);
      console.log(
        "AdminLogin - Token stored in localStorage:",
        token.substring(0, 15) + "..."
      );

      axios.defaults.headers.common["x-auth-token"] = token;

      console.log("AdminLogin - Navigating to dashboard");
      navigate("/admin-dashboard", { replace: true });
    } catch (err: any) {
      console.error(
        "AdminLogin - Login failed:",
        err.response?.data || err.message
      );
      setError(
        err.response?.data?.message || "Invalid credentials or server error"
      );
      localStorage.removeItem("adminToken");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Admin Login
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />

          <button
            type="submit"
            className="w-full bg-yellow-500 text-white p-3 rounded-lg hover:bg-yellow-600 transition"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Logging in...
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
