import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';

// Layout components
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import InitializeAuth from './components/auth/InitializeAuth';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import Appointments from './pages/appointments/Appointments';
import BookAppointment from './pages/appointments/BookAppointment';
import Services from './pages/services/Services';
import Profile from './pages/profile/Profile';
import StaffSchedule from './pages/staff/StaffSchedule';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageServices from './pages/admin/ManageServices';
import ManageStaff from './pages/admin/ManageStaff';
import ManageUsers from './pages/admin/ManageUsers';
import Notifications from './pages/notifications/Notifications';
import Settings from './pages/settings/Settings';

const App = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <Box sx={{ display: 'flex' }}>
      <InitializeAuth />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
          <Route path="services" element={<Services />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="book-appointment" element={<BookAppointment />} />
            <Route path="profile" element={<Profile />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />

            {/* Staff routes */}
            {user?.role === 'staff' && (
              <Route path="staff-schedule" element={<StaffSchedule />} />
            )}

            {/* Admin routes */}
            {user?.role === 'admin' && (
              <>
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="manage-services" element={<ManageServices />} />
                <Route path="manage-staff" element={<ManageStaff />} />
                <Route path="manage-users" element={<ManageUsers />} />
              </>
            )}
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Box>
  );
};

export default App;