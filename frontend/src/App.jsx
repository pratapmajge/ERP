import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { isAuthenticated, clearAuth, validateToken } from './utils/auth';

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

// Component to handle automatic token clearing
const AuthManager = ({ children }) => {
  const location = useLocation();
  
  useEffect(() => {
    // Clear token when user visits public routes (home, login, register)
    const publicRoutes = ['/', '/login', '/register'];
    if (publicRoutes.includes(location.pathname)) {
      const token = localStorage.getItem('token');
      if (token) {
        console.log('🔄 Auto-clearing token on public route:', location.pathname);
        clearAuth();
      }
    }
  }, [location.pathname]);

  return children;
};

// Protected Route Component with token validation
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const hasToken = isAuthenticated();
      
      if (!hasToken) {
        console.log('❌ No token found');
        clearAuth();
        setIsValidating(false);
        return;
      }

      try {
        const isValidToken = await validateToken();
        setIsValid(isValidToken);
        if (!isValidToken) {
          console.log('❌ Invalid token, redirecting to login');
        }
      } catch (error) {
        console.error('Token validation error:', error);
        clearAuth();
        setIsValid(false);
      } finally {
        setIsValidating(false);
      }
    };

    checkAuth();
  }, []);

  if (isValidating) {
    // Show loading state while validating
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <div>Loading...</div>
      </Box>
    );
  }

  if (!isValid) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Public Route Component (redirects to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
  const authenticated = isAuthenticated();
  
  console.log('PublicRoute - authenticated:', authenticated);
  console.log('PublicRoute - token:', localStorage.getItem('token'));
  
  if (authenticated) {
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
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />

              {/* Protected Routes */}
              <Route
                path="/app"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="employees" element={<Employees />} />
                <Route path="departments" element={<Departments />} />
                <Route path="attendance" element={<Attendance />} />
                <Route path="payroll" element={<Payroll />} />
                <Route path="profile" element={<Profile />} />
              </Route>

              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>
        </AuthManager>
      </Router>
    </ThemeProvider>
  );
};

export default App;
