import type { NavigateFunction } from "react-router-dom";

export const getAuthToken = () => {
  return (
    localStorage.getItem("adminToken") || localStorage.getItem("authToken")
  );
};

export const handleLogout = (navigate: NavigateFunction) => {
  console.log("User logged out");
  localStorage.removeItem("authToken");
  localStorage.removeItem("adminToken");
  navigate("/admin-login", { replace: true });
};
