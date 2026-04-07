import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // agar login nahi hai → redirect to login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // agar login hai → page show
  return children;
}