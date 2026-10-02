import { BrowserRouter, Routes, Route } from "react-router-dom";
 

// AUTH
import Login from "./pages/auth/Login";
// import Register from "./pages/auth/Register";

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
import Settings from "./pages/Settings";
import CreateSuccessToast from "./components/CreateSuccessToast";
import { CreateSuccessProvider } from "./context/CreateSuccessContext";

export default function App() {
  return (
   <BrowserRouter>
      <CreateSuccessProvider>

        <Routes>

          {/* AUTH */}

          <Route
            path="/"
            element={<Login />}
          />

          {/* 
          <Route
            path="/register"
            element={<Register />}
          />
          */}

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

          {/* ORGANIZATIONS */}

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

          {/* SINGLE ORGANIZATION */}

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

          {/* ACTIVITIES */}

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

          {/* PROFILE */}

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

          {/* SETTINGS */}

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Settings />
                </MainLayout>
              </ProtectedRoute>
            }
          />

        </Routes>

        {/* GLOBAL CREATE SUCCESS TOAST */}
        <CreateSuccessToast />

      </CreateSuccessProvider>
    </BrowserRouter>
  );
}
