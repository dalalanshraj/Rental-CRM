import { BrowserRouter, Routes, Route } from "react-router-dom";

// AUTH
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// DASHBOARD PAGES
import Dashboard from "./pages/dashboard/Dashboard";
import Leads from "./pages/dashboard/Leads";

// LAYOUT + PROTECTION
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* AUTH ROUTES */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* DASHBOARD ROUTES */}
        <Route
          path="/app/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/leads"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Leads />
              </MainLayout>
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}