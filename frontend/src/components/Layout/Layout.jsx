import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
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
  Grid,
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
  Assignment as AssignmentIcon,
  Task as TaskIcon,
  CheckCircle,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme as useCustomTheme } from '../../context/ThemeContext';
import { ManagerDataProvider } from '../../context/ManagerDataContext.jsx';
import { clearAuth, getUser } from '../../utils/auth';
import { api } from '../../utils/api';
import CircularProgress from '@mui/material/CircularProgress';
import Fade from '@mui/material/Fade';

const drawerWidth = 240;

const ManagerSpecificWrapper = ({ role, children }) => {
  if (role === 'manager') {
    return <ManagerDataProvider>{children}</ManagerDataProvider>;
  }
  return children;
}

const Layout = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const { isDarkMode, toggleTheme } = useCustomTheme();
  const [userProfile, setUserProfile] = useState(null);
  
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const isDark = theme.palette.mode === 'dark';

  const user = getUser();
  const userId = user?._id;
  const role = user?.role || 'employee';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log('--- FETCHING PROFILE ---');
        const profile = await api.get('/auth/profile');
        console.log('--- RECEIVED PROFILE DATA ---', profile);
        setUserProfile(profile);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        clearAuth();
        navigate('/');
      }
    };
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  // Role-based menu items
  let roleMenuItems = [];
  if (role === 'admin' || role === 'hr') {
    roleMenuItems = [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/app' },
      { text: 'Employees', icon: <PeopleIcon />, path: '/app/employees' },
      ...(role === 'admin' ? [{ text: 'Managers', icon: <PersonIcon />, path: '/app/managers' }] : []),
      { text: 'Departments', icon: <BusinessIcon />, path: '/app/departments' },
      { text: 'Attendance', icon: <AccessTimeIcon />, path: '/app/attendance' },
      { text: 'Payroll', icon: <MoneyIcon />, path: '/app/payroll' },
    ];
  } else if (role === 'manager') {
    roleMenuItems = [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/app' },
      { text: 'My Employees', icon: <PeopleIcon />, path: '/app/my-employees' },
      { text: 'Manage Tasks', icon: <TaskIcon />, path: '/app/manage-tasks' },
      { text: 'Completed Tasks', icon: <CheckCircle />, path: '/app/completed-tasks' },
      { text: 'Payroll', icon: <MoneyIcon />, path: '/app/payroll' },
      { text: 'My Profile', icon: <AccountCircleIcon />, path: '/app/profile' },
    ];
  } else if (role === 'employee') {
    roleMenuItems = [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/app' },
      { text: 'My Tasks', icon: <TaskIcon />, path: '/app/my-tasks' },
      { text: 'Attendance', icon: <AccessTimeIcon />, path: '/app/attendance' },
      { text: 'Payroll', icon: <MoneyIcon />, path: '/app/payroll' },
      { text: 'My Profile', icon: <AccountCircleIcon />, path: '/app/profile' },
    ];
  }

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  const handleMenuClick = (path) => {
    navigate(path);
    if (isMobile) {
      setOpen(false);
    }
  };

  const [employeeSidebarData, setEmployeeSidebarData] = useState({ manager: null, tasks: [] });

  useEffect(() => {
    if (role === 'employee' && userProfile) {
      console.log('--- EMPLOYEE SIDEBAR EFFECT ---');
      console.log('User profile for sidebar:', userProfile);
      console.log('Manager data:', userProfile.manager);
      const fetchSidebarData = async () => {
        let tasks = [];
        try {
          const allTasks = await api.get('/progress/employee');
          console.log('--- RECEIVED TASKS ---', allTasks);
          tasks = allTasks.filter(t => t.employee && (t.employee._id === userProfile.employeeId));
          console.log('--- FILTERED TASKS ---', tasks);
        } catch (error) {
          console.error('Failed to fetch tasks:', error);
        }
        setEmployeeSidebarData({ manager: userProfile.manager || null, tasks });
      };
      fetchSidebarData();
    }
  }, [userProfile, role]);

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
                    : 'linear-gradient(45deg, #2196f3, #00bcd4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Manager Portal
              </Typography>
            </motion.div>
          </Box>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: -20 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ rotate: 360, scale: 1.1, transition: { duration: 0.5 } }}
            >
              <Tooltip title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`} arrow>
                <IconButton onClick={toggleTheme} sx={{ mr: 1, color: theme.palette.text.primary, background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', '&:hover': { background: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' } }}>
                  {isDarkMode ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
              </Tooltip>
            </motion.div>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: -20 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.1 }}
            >
              <Tooltip title="Profile">
                <IconButton onClick={() => handleMenuClick('/app/profile')} sx={{ p: 0, ml: 1 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', transition: 'box-shadow 0.3s ease', '&:hover': { boxShadow: `0 0 12px ${theme.palette.primary.light}` } }}>
                    {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : <AccountCircleIcon />}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </motion.div>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: -20 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ x: [0, -4, 4, -4, 4, 0], transition: { duration: 0.5, ease: 'easeInOut' } }}
            >
              <Tooltip title="Logout" arrow>
                <IconButton onClick={handleLogout} sx={{ ml: 2, color: theme.palette.error.main, background: isDark ? 'rgba(255, 82, 82, 0.1)' : 'rgba(255, 82, 82, 0.1)', '&:hover': { background: isDark ? 'rgba(255, 82, 82, 0.2)' : 'rgba(255, 82, 82, 0.2)' } }}>
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </motion.div>
          </motion.div>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: isDark ? 'rgba(17, 25, 40, 0.9)' : 'rgba(255, 255, 255, 0.95)',
            borderRight: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', p: 1 }}>
          <List>
            {roleMenuItems.map((item, index) => (
              <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    borderRadius: 2,
                    mb: 0.5,
                    bgcolor: location.pathname === item.path ? 'rgba(0, 123, 255, 0.1)' : 'transparent',
                    '&:hover': {
                      bgcolor: 'rgba(0, 123, 255, 0.05)',
                    },
                  }}
                  onClick={() => handleMenuClick(item.path)}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                      color: location.pathname === item.path ? 'primary.main' : 'inherit',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      
      {role === 'employee' && (
        <Box sx={{ width: 260, background: isDark ? 'rgba(26, 26, 46, 0.95)' : 'rgba(240,245,255,0.95)', borderRight: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e0e7ef', p: 2, display: { xs: 'none', md: 'block' }, paddingTop: '80px' }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>My Manager</Typography>
          {employeeSidebarData.manager ? (
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ mr: 1, bgcolor: 'primary.main' }}><PersonIcon /></Avatar>
                <Box>
                  <Typography sx={{ fontWeight: 600 }}>{employeeSidebarData.manager.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{employeeSidebarData.manager.email}</Typography>
                </Box>
              </Box>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>No manager assigned.</Typography>
          )}
          <Divider sx={{ mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>My Tasks</Typography>
          {employeeSidebarData.tasks.length === 0 ? (
            <Typography variant="body2" color="text.secondary">No tasks yet.</Typography>
          ) : (
            <List dense>
              {employeeSidebarData.tasks.map((task) => (
                <ListItem key={task._id} sx={{ mb: 1, alignItems: 'flex-start', display: 'block' }}>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{task.project}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ListItemIcon sx={{ minWidth: 32 }}><AssignmentIcon color="primary" /></ListItemIcon>
                    <ListItemText
                      primary={<Typography sx={{ fontWeight: 500 }}>{task.task}</Typography>}
                    />
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          overflowY: 'auto',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: '80px',
        }}
      >
        <Toolbar sx={{ display: { sm: 'none' } }} />
        <ManagerSpecificWrapper role={role}>
          <Outlet context={{ userProfile }} />
        </ManagerSpecificWrapper>
      </Box>
    </Box>
  );
};

export default Layout; 