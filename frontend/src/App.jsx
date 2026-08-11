import { BrowserRouter, Routes, Route } from "react-router-dom";

// AUTH
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// DASHBOARD
import Dashboard from "./pages/dashboard/Dashboard";
import Leads from "./pages/dashboard/Leads";
import LeadDetails from "./pages/dashboard/LeadDetails";

// LAYOUT
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Organizations from "./pages/dashboard/OrganizationsTable";
import OrganizationDetails from "./pages/dashboard/OrganizationDetails";
import Activities from "./pages/dashboard/Activities";
import PersonalPreferences from "./pages/PersonalPreferences";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* AUTH */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* DASHBOARD */}
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

        {/* LEADS TABLE */}
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

        {/* SINGLE LEAD */}
        <Route
          path="/app/leads/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <LeadDetails />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* LEADS TABLE */}
        <Route
          path="/app/organizations"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Organizations />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/organizations/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <OrganizationDetails />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/activities"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Activities />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/profile"
          element={
            <ProtectedRoute>
              <MainLayout>
                 <PersonalPreferences />
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
