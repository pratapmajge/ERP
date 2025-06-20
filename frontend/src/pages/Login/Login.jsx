import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Link,
  Paper,
  IconButton,
  InputAdornment,
  Alert,
  useTheme,
  Avatar,
  Tooltip,
  CircularProgress,
  Fade,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Brightness4,
  Brightness7,
  Lock as LockIcon,
  Email as EmailIcon,
  Login as LoginIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme as useCustomTheme } from '../../context/ThemeContext';
import { setAuth, clearAuth } from '../../utils/auth';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useCustomTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(location.state?.message || '');
  const [loading, setLoading] = useState(false);

  const isDark = theme.palette.mode === 'dark';
  const apiUrl = import.meta.env.VITE_API_URL;

  // Clear any existing tokens when component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('🔄 Clearing existing token on login page');
      clearAuth();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('Login attempt with:', formData);

    try {
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (response.ok) {
        // Store the token and user data
        const userData = {
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role
        };
        setAuth(data.token, userData);
        
        // Fetch full profile and update localStorage
        try {
          const profileRes = await fetch(`${apiUrl}/api/auth/profile`, {
            headers: { 'Authorization': `Bearer ${data.token}` },
          });
          if (profileRes.ok) {
            const profileData = await profileRes.json();
            setAuth(data.token, profileData);
            console.log('Full profile data stored:', profileData);
          }
        } catch (e) {
          console.error('Failed to fetch full profile after login:', e);
        }

        console.log('Login successful, token stored:', data.token);
        console.log('User data:', userData);
        navigate('/app');
      } else {
        // Handle specific error for not registered by admin
        if (response.status === 403) {
          setError('You are not registered by admin. Please contact your administrator to be added to the system.');
        } else {
          // Clear any existing invalid tokens for other errors
          clearAuth();
          setError(data.message || 'Invalid Credentials');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      // Clear any existing invalid tokens
      clearAuth();
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: isDark
          ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          zIndex: 1
        }
      }}
    >
      {/* Header */}
      <Box
        component="header"
        sx={{
          py: 2,
          px: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          zIndex: 2,
          backdropFilter: 'blur(20px)',
          backgroundColor: isDark 
            ? 'rgba(26, 26, 46, 0.8)' 
            : 'rgba(255, 255, 255, 0.8)',
          borderBottom: isDark 
            ? '1px solid rgba(255, 255, 255, 0.1)' 
            : '1px solid rgba(0, 0, 0, 0.1)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography 
            variant="h5" 
            component="h1" 
            sx={{ 
              fontWeight: 'bold',
              background: isDark 
                ? 'linear-gradient(45deg, #667eea, #764ba2)' 
                : 'linear-gradient(45deg, #667eea, #764ba2)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            ERP System
          </Typography>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <Tooltip title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`} arrow>
            <IconButton
              color="inherit"
              onClick={toggleTheme}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.3s ease-in-out'
              }}
            >
              {isDarkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>
        </motion.div>
      </Box>

      {/* Main Content */}
      <Container component="main" maxWidth="sm" sx={{ mt: 8, mb: 4, position: 'relative', zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: 4,
              background: isDark
                ? 'rgba(26, 26, 46, 0.9)'
                : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              border: isDark 
                ? '1px solid rgba(255, 255, 255, 0.1)' 
                : '1px solid rgba(0, 0, 0, 0.1)',
              boxShadow: isDark
                ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                : '0 8px 32px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                transform: 'translateX(-100%)',
                transition: 'transform 0.6s ease-in-out',
                zIndex: 1
              },
              '&:hover::before': {
                transform: 'translateX(100%)'
              }
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 2, width: '100%' }}>
              {/* Logo and Title */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                style={{ textAlign: 'center', marginBottom: '2rem' }}
              >
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    mx: 'auto',
                    mb: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                    border: '3px solid rgba(255,255,255,0.2)'
                  }}
                >
                  <LockIcon sx={{ fontSize: 40 }} />
                </Avatar>
                
                <Typography
                  component="h1"
                  variant="h4"
                  gutterBottom
                  sx={{
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1
                  }}
                >
                  Welcome Back
                </Typography>
                
                <Typography variant="body1" sx={{ opacity: 0.8, mb: 3 }}>
                  Sign in to access your account
                </Typography>
              </motion.div>

              {/* Alerts */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {success && (
                  <Alert
                    severity="success"
                    sx={{
                      width: '100%',
                      mb: 2,
                      borderRadius: 2,
                      backgroundColor: 'rgba(46, 204, 113, 0.1)',
                      border: '1px solid rgba(46, 204, 113, 0.3)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    {success}
                  </Alert>
                )}

                {error && (
                  <Alert
                    severity="error"
                    sx={{
                      width: '100%',
                      mb: 2,
                      borderRadius: 2,
                      backgroundColor: 'rgba(231, 76, 60, 0.1)',
                      border: '1px solid rgba(231, 76, 60, 0.3)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    {error}
                  </Alert>
                )}
              </motion.div>

              {/* Form */}
              <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <TextField
                    required
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 2,
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'rgba(255, 255, 255, 0.15)',
                          borderColor: '#667eea',
                          boxShadow: '0 0 0 2px rgba(102, 126, 234, 0.2)'
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <TextField
                    required
                    fullWidth
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 2,
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'rgba(255, 255, 255, 0.15)',
                          borderColor: '#667eea',
                          boxShadow: '0 0 0 2px rgba(102, 126, 234, 0.2)'
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={loading}
                      startIcon={<LoginIcon />}
                      sx={{
                        mb: 2,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: 2,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        textTransform: 'none',
                        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)'
                        },
                        '&:disabled': {
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: 'rgba(255, 255, 255, 0.5)'
                        },
                        transition: 'all 0.3s ease-in-out'
                      }}
                    >
                      {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Don't have an account?{' '}
                      <Link
                        component={RouterLink}
                        to="/register"
                        underline="hover"
                        sx={{
                          color: '#667eea',
                          fontWeight: 500,
                          '&:hover': {
                            color: '#5a6fd8',
                          },
                        }}
                      >
                        Sign up
                      </Link>
                    </Typography>
                  </Box>
                </motion.div>
              </Box>
            </Box>
          </Paper>
        </motion.div>
      </Container>

      {loading && (
        <Fade in={loading} unmountOnExit>
          <Box sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(30, 41, 59, 0.85)',
            zIndex: 9999,
            transition: 'background 0.3s',
          }}>
            <CircularProgress 
              size={70} 
              thickness={5} 
              sx={{
                color: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                mb: 2,
                filter: 'drop-shadow(0 0 12px #667eea88) drop-shadow(0 0 24px #764ba288)'
              }}
            />
            <Typography 
              variant="h6" 
              sx={{ color: '#fff', fontWeight: 600, letterSpacing: 1, mt: 1, textShadow: '0 2px 8px #0008' }}
            >
              Logging in...
            </Typography>
          </Box>
        </Fade>
      )}
    </Box>
  );
};

export default Login; 