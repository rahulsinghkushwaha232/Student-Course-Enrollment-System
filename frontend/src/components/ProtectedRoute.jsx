import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {

  const token = localStorage.getItem("token");

  // Token nahi hai → Login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Token hai → requested page
  return <Outlet />;
}

export default ProtectedRoute;