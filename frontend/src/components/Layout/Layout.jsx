import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  AccessTime as AccessTimeIcon,
  AttachMoney as MoneyIcon,
  AccountCircle as AccountCircleIcon,
  Brightness4,
  Brightness7,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme as useCustomTheme } from '../../context/ThemeContext';
import { clearAuth, getUser } from '../../utils/auth';
import CircularProgress from '@mui/material/CircularProgress';
import Fade from '@mui/material/Fade';

const drawerWidth = 240;

const Layout = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const { isDarkMode, toggleTheme } = useCustomTheme();
  
  // Check if screen is mobile
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const isDark = theme.palette.mode === 'dark';

  // Get user role
  const user = getUser();
  const role = user?.role || 'employee'; // Default to employee if no role

  // Role-based menu items
  let roleMenuItems = [];
  if (role === 'admin' || role === 'hr') {
    roleMenuItems = [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/app' },
      { text: 'Employees', icon: <PeopleIcon />, path: '/app/employees' },
      { text: 'Departments', icon: <BusinessIcon />, path: '/app/departments' },
      { text: 'Attendance', icon: <AccessTimeIcon />, path: '/app/attendance' },
      { text: 'Payroll', icon: <MoneyIcon />, path: '/app/payroll' },
    ];
  } else if (role === 'employee') {
    roleMenuItems = [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/app' },
      { text: 'Attendance', icon: <AccessTimeIcon />, path: '/app/attendance' },
      { text: 'Payroll', icon: <MoneyIcon />, path: '/app/payroll' },
      { text: 'My Profile', icon: <AccountCircleIcon />, path: '/app/profile' },
    ];
  }

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogout = () => {
    // Clear authentication data
    setLogoutLoading(true);
    setTimeout(() => {
      clearAuth();
      navigate('/');
      handleProfileMenuClose();
      setLogoutLoading(false);
    }, 1000);
  };

  // Close drawer on mobile when clicking a menu item
  const handleMenuClick = (path) => {
    navigate(path);
    if (isMobile) {
      setOpen(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          background: isDark 
            ? 'rgba(26, 26, 46, 0.8)' 
            : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: isDark 
            ? '1px solid rgba(255, 255, 255, 0.1)' 
            : '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: isDark 
            ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
            : '0 8px 32px rgba(0, 0, 0, 0.1)',
          left: 0,
          width: '100%',
          ...(isMobile && {
            left: 0,
            width: '100%',
          }),
          ...(!isMobile && {
            left: open ? drawerWidth : theme.spacing(7),
            width: open ? `calc(100% - ${drawerWidth}px)` : `calc(100% - ${theme.spacing(7)})`,
            transition: theme.transitions.create(['width', 'left'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }),
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, sm: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Typography 
                variant="h6" 
                noWrap 
                component="div" 
                sx={{ 
                  fontWeight: 'bold',
                  background: isDark 
                    ? 'linear-gradient(45deg, #667eea, #764ba2)' 
                    : 'linear-gradient(45deg, #667eea, #764ba2)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                }}
              >
                ERP System
              </Typography>
            </motion.div>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
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
                    width: 36,
                    height: 36,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      transform: 'scale(1.12)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.18)'
                    },
                    transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
                    p: 0
                  }}
                >
                  <Box sx={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isDarkMode ? <Brightness7 fontSize="small" /> : <Brightness4 fontSize="small" />}
                  </Box>
                </IconButton>
              </Tooltip>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.95 }}
            >
              <Tooltip title="User Profile" arrow>
                <IconButton
                  size="small"
                  edge="end"
                  aria-label="account of current user"
                  aria-haspopup="true"
                  onClick={() => navigate('/app/profile')}
                  color="inherit"
                  sx={{
                    width: 36,
                    height: 36,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      transform: 'scale(1.12)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.18)'
                    },
                    transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
                    p: 0
                  }}
                >
                  <Avatar sx={{ 
                    bgcolor: theme.palette.primary.main,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    width: 28,
                    height: 28
                  }}>
                    <PersonIcon fontSize="small" />
                  </Avatar>
                </IconButton>
              </Tooltip>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.95 }}
            >
              <Tooltip title="Logout" arrow>
                <IconButton
                  size="small"
                  edge="end"
                  aria-label="logout"
                  onClick={handleLogout}
                  color="inherit"
                  sx={{
                    width: 36,
                    height: 36,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      transform: 'scale(1.12)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.18)'
                    },
                    transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
                    ml: 1,
                    p: 0
                  }}
                >
                  <Box sx={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LogoutIcon fontSize="small" />
                  </Box>
                </IconButton>
              </Tooltip>
            </motion.div>
          </Box>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: {
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
                borderRadius: 2
              }
            }}
          >
            <MenuItem onClick={handleProfileMenuClose} sx={{ gap: 1 }}>
              <PersonIcon fontSize="small" />
              Profile
            </MenuItem>
            <MenuItem onClick={handleProfileMenuClose} sx={{ gap: 1 }}>
              <SettingsIcon fontSize="small" />
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ gap: 1, color: 'error.main' }}>
              <LogoutIcon fontSize="small" />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={open}
        onClose={isMobile ? handleDrawerToggle : undefined}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
          '& .MuiDrawer-paper': {
            background: isDark 
              ? 'rgba(26, 26, 46, 0.9)' 
              : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRight: isDark 
              ? '1px solid rgba(255, 255, 255, 0.1)' 
              : '1px solid rgba(0, 0, 0, 0.1)',
            boxShadow: isDark 
              ? '4px 0 32px rgba(0, 0, 0, 0.3)' 
              : '4px 0 32px rgba(0, 0, 0, 0.1)',
            width: drawerWidth,
            boxSizing: 'border-box',
            ...(isMobile && {
              width: drawerWidth,
            }),
            ...(!isMobile && {
              ...(open && {
                width: drawerWidth,
                transition: theme.transitions.create('width', {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                }),
                boxSizing: 'border-box',
              }),
              ...(!open && {
                transition: theme.transitions.create('width', {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.leavingScreen,
                }),
                overflowX: 'hidden',
                width: theme.spacing(7),
                boxSizing: 'border-box',
              }),
            }),
          },
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1],
          }}
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <IconButton 
              onClick={handleDrawerToggle}
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
              {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </motion.div>
        </Toolbar>
        <Divider sx={{ 
          borderColor: isDark 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(0, 0, 0, 0.1)' 
        }} />
        <List>
          {roleMenuItems.map((item, index) => (
            <motion.div
              key={item.text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ListItem disablePadding sx={{ display: 'block', mb: 0.5 }}>
                <Tooltip title={!open ? item.text : ''} placement="right" arrow>
                  <ListItemButton
                    onClick={() => handleMenuClick(item.path)}
                    selected={location.pathname === item.path}
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: open ? 2.5 : 1.5,
                      mx: 1,
                      borderRadius: 2,
                      backgroundColor: location.pathname === item.path 
                        ? 'rgba(255, 255, 255, 0.2)' 
                        : 'transparent',
                      backdropFilter: 'blur(10px)',
                      border: location.pathname === item.path 
                        ? '1px solid rgba(255, 255, 255, 0.3)' 
                        : '1px solid transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateX(4px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      },
                      transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                        color: location.pathname === item.path 
                          ? theme.palette.primary.main 
                          : 'inherit',
                        display: 'flex',
                        transition: 'margin 0.3s cubic-bezier(0.4,0,0.2,1)',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {open && (
                      <ListItemText
                        primary={item.text}
                        sx={{
                          opacity: open ? 1 : 0,
                          color: location.pathname === item.path 
                            ? theme.palette.primary.main 
                            : 'inherit',
                          fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                          transition: 'opacity 0.3s cubic-bezier(0.4,0,0.2,1)',
                        }}
                      />
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            </motion.div>
          ))}
        </List>
      </Drawer>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: { xs: 1.5, sm: 2, md: 3 },
          width: '100%',
          mt: 8,
          background: isDark 
            ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)' 
            : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          minHeight: '100vh',
          overflowX: 'auto',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        {logoutLoading && (
          <Fade in={logoutLoading} unmountOnExit>
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(30, 41, 59, 0.75)',
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
                Logging out...
              </Typography>
            </Box>
          </Fade>
        )}
        <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Outlet />
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout; 