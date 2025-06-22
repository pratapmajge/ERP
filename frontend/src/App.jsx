import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { isAuthenticated, clearAuth, validateToken, getUser } from './utils/auth';

// Pages
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Employees from './pages/Employees/Employees';
import Departments from './pages/Departments/Departments';
import Attendance from './pages/Attendance/Attendance';
import Payroll from './pages/Payroll/Payroll';
import Profile from './pages/Profile/Profile';
import Managers from './pages/Managers/Managers';
import ManageTasks from './pages/ManageTasks';
import MyTasks from './pages/MyTasks';
import NotFound from './pages/NotFound/NotFound';
import MyEmployees from './pages/MyEmployees/MyEmployees';
import CompletedTasks from './pages/CompletedTasks';

// Component to handle automatic token clearing
const AuthManager = ({ children }) => {
  const location = useLocation();
  
  useEffect(() => {
    const publicRoutes = ['/', '/login', '/register'];
    if (publicRoutes.includes(location.pathname)) {
      if (isAuthenticated()) {
        clearAuth();
      }
    }
  }, [location.pathname]);

  return children;
};

// Protected Route Component with token validation and role checking
const ProtectedRoute = ({ children, requiredRole }) => {
  const location = useLocation();
  const isAuth = isAuthenticated();
  const user = getUser();

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!user || !roles.includes(user.role)) {
      return <Navigate to="/app" replace />; // Redirect to a safe default page
    }
  }

  return children;
};

// Public Route Component (redirects to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
  if (isAuthenticated()) {
    return <Navigate to="/app" replace />;
  }
  return children;
};

const App = () => {
  return (
    <ThemeProvider>
      <CssBaseline />
      <Router>
        <AuthManager>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

              <Route path="/app" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="employees" element={<ProtectedRoute requiredRole="admin"><Employees /></ProtectedRoute>} />
                <Route path="managers" element={<ProtectedRoute requiredRole="admin"><Managers /></ProtectedRoute>} />
                <Route path="departments" element={<ProtectedRoute requiredRole="admin"><Departments /></ProtectedRoute>} />
                <Route path="attendance" element={<ProtectedRoute requiredRole={['admin', 'hr', 'employee']}><Attendance /></ProtectedRoute>} />
                <Route path="payroll" element={<ProtectedRoute requiredRole={['admin', 'employee', 'manager']}><Payroll /></ProtectedRoute>} />
                <Route path="profile" element={<ProtectedRoute requiredRole={['admin', 'employee', 'manager']}><Profile /></ProtectedRoute>} />
                <Route path="manage-tasks" element={<ProtectedRoute requiredRole="manager"><ManageTasks /></ProtectedRoute>} />
                <Route path="completed-tasks" element={<ProtectedRoute requiredRole="manager"><CompletedTasks /></ProtectedRoute>} />
                <Route path="my-employees" element={<ProtectedRoute requiredRole="manager"><MyEmployees /></ProtectedRoute>} />
                <Route path="my-tasks" element={<ProtectedRoute requiredRole="employee"><MyTasks /></ProtectedRoute>} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Box>
        </AuthManager>
      </Router>
    </ThemeProvider>
  );
};

export default App;
