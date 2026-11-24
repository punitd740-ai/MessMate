import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/student/StudentDashboard';
import MessOwnerDashboard from './pages/owner/MessOwnerDashboard';
import SuperAdminDashboard from './pages/admin/SuperAdminDashboard';

// Protected Route wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-semibold text-slate-500">Loading MessMate session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // If student tries to access admin or owner
    if (user?.role === 'student') return <Navigate to="/student" replace />;
    if (user?.role === 'mess_owner') return <Navigate to="/owner" replace />;
    if (user?.role === 'super_admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

// Layout with standard Navbar & Footer for public pages
const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
};

// Temporary placeholder for Mess Owner (Phase 4 preview)
const MessOwnerPlaceholder = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl text-center space-y-4 border border-slate-100">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto font-bold text-xl">
          👨‍🍳
        </div>
        <h2 className="text-xl font-bold text-slate-900">Mess Owner Portal</h2>
        <p className="text-xs text-slate-500">
          Logged in as <strong>{user?.name}</strong> ({user?.email}).
        </p>
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-100">
          Phase 1 backend APIs (Kitchen Planning, Demand Calculation, Shared Savings Verification & Inventory) are fully live on the server. Phase 4 will render this dashboard UI next!
        </div>
        <div className="flex gap-2 justify-center">
          <a href="/student" className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl">
            Switch to Student View
          </a>
          <a href="/" className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl">
            Home
          </a>
        </div>
      </div>
    </div>
  );
};

// Temporary placeholder for Super Admin (Phase 5 preview)
const SuperAdminPlaceholder = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl text-center space-y-4 border border-slate-100">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto font-bold text-xl">
          🛡️
        </div>
        <h2 className="text-xl font-bold text-slate-900">Super Admin Platform</h2>
        <p className="text-xs text-slate-500">
          Logged in as <strong>{user?.name}</strong> ({user?.email}).
        </p>
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-100">
          Platform-wide metrics, mess audit, user management and Future AI preview metrics are active on backend. Full UI will be rendered in Phase 5!
        </div>
        <div className="flex gap-2 justify-center">
          <a href="/student" className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl">
            Switch to Student View
          </a>
          <a href="/" className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl">
            Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <LandingPage />
              </PublicLayout>
            }
          />
          <Route
            path="/login"
            element={
              <PublicLayout>
                <Login />
              </PublicLayout>
            }
          />
          <Route
            path="/register"
            element={
              <PublicLayout>
                <Register />
              </PublicLayout>
            }
          />

          {/* Student Dashboard (Protected for student role) */}
          <Route
            path="/student/*"
            element={
              <ProtectedRoute allowedRoles={['student', 'super_admin']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          {/* Mess Owner Portal */}
          <Route
            path="/owner/*"
            element={
              <ProtectedRoute allowedRoles={['mess_owner', 'super_admin']}>
                <MessOwnerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Super Admin Portal */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
