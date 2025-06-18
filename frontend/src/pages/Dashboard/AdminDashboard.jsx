import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent,
  useTheme,
  Avatar,
  IconButton,
  Tooltip,
  LinearProgress,
  Chip
} from '@mui/material';
import {
  People as PeopleIcon,
  Business as BusinessIcon,
  AccessTime as AccessTimeIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Refresh as RefreshIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Schedule as ScheduleIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    activeAttendance: 0,
    totalPayroll: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch employees
      const employeesResponse = await fetch('http://localhost:5001/api/employees', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const employees = await employeesResponse.json();
      
      // Fetch departments
      const departmentsResponse = await fetch('http://localhost:5001/api/departments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const departments = await departmentsResponse.json();
      
      setStats({
        totalEmployees: employees.length,
        totalDepartments: departments.length,
        activeAttendance: Math.floor(Math.random() * employees.length), // Mock data
        totalPayroll: employees.reduce((sum, emp) => sum + (emp.salary || 0), 0)
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  const summaryCards = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees,
      icon: <PeopleIcon />,
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      trend: '+12%',
      trendUp: true,
      description: 'Active employees in the system'
    },
    {
      title: 'Departments',
      value: stats.totalDepartments,
      icon: <BusinessIcon />,
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      trend: '+5%',
      trendUp: true,
      description: 'Organizational departments'
    },
    {
      title: 'Active Attendance',
      value: stats.activeAttendance,
      icon: <AccessTimeIcon />,
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      trend: '+8%',
      trendUp: true,
      description: 'Employees currently present'
    },
    {
      title: 'Total Payroll',
      value: `$${stats.totalPayroll.toLocaleString()}`,
      icon: <MoneyIcon />,
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      trend: '+15%',
      trendUp: true,
      description: 'Monthly payroll budget'
    }
  ];

  const quickActions = [
    { title: 'Add Employee', icon: <PersonIcon />, color: '#667eea' },
    { title: 'Create Department', icon: <GroupIcon />, color: '#f093fb' },
    { title: 'View Attendance', icon: <ScheduleIcon />, color: '#4facfe' },
    { title: 'Process Payroll', icon: <PaymentIcon />, color: '#43e97b' }
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
            p: 3,
            background: isDark 
              ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 3,
            color: 'white',
            boxShadow: isDark
              ? '0 8px 32px rgba(0,0,0,0.4)'
              : '0 8px 32px rgba(0,0,0,0.1)',
            border: isDark
              ? '1px solid rgba(255,255,255,0.1)'
              : '1px solid rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
              Welcome, Admin! 👋
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Here's what's happening in your organization today
            </Typography>
          </Box>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <IconButton
              onClick={fetchStats}
              disabled={loading}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  transform: 'rotate(180deg)'
                },
                transition: 'all 0.3s ease-in-out'
              }}
            >
              <RefreshIcon />
            </IconButton>
          </motion.div>
        </Box>
      </motion.div>

      {/* Statistics Cards */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          {summaryCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={card.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    background: card.color,
                    color: 'white',
                    borderRadius: 3,
                    boxShadow: isDark 
                      ? '0 8px 32px rgba(0,0,0,0.3)' 
                      : '0 8px 32px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      zIndex: 1
                    }
                  }}
                >
                  <CardContent sx={{ position: 'relative', zIndex: 2, p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Avatar
                        sx={{
                          width: 50,
                          height: 50,
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          border: '2px solid rgba(255,255,255,0.3)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }}
                      >
                        {card.icon}
                      </Avatar>
                      <Chip
                        label={card.trend}
                        size="small"
                        icon={card.trendUp ? <TrendingUpIcon /> : <TrendingDownIcon />}
                        sx={{
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          fontWeight: 500,
                          '& .MuiChip-label': { px: 1 }
                        }}
                      />
                    </Box>
                    
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {loading ? '...' : card.value}
                    </Typography>
                    
                    <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
                      {card.title}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {card.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          {quickActions.map((action, index) => (
            <Grid item xs={12} sm={6} md={3} key={action.title}>
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  sx={{
                    background: isDark 
                      ? 'rgba(26, 26, 46, 0.8)' 
                      : 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(20px)',
                    border: isDark 
                      ? '1px solid rgba(255, 255, 255, 0.1)' 
                      : '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: 3,
                    boxShadow: isDark 
                      ? '0 4px 20px rgba(0,0,0,0.3)' 
                      : '0 4px 20px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: isDark 
                        ? '0 8px 32px rgba(0,0,0,0.4)' 
                        : '0 8px 32px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Avatar
                      sx={{
                        width: 60,
                        height: 60,
                        mx: 'auto',
                        mb: 2,
                        backgroundColor: action.color,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }}
                    >
                      {action.icon}
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                      {action.title}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      {/* System Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
            System Overview
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  background: isDark 
                    ? 'rgba(26, 26, 46, 0.8)' 
                    : 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: isDark 
                    ? '1px solid rgba(255, 255, 255, 0.1)' 
                    : '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: 3,
                  boxShadow: isDark 
                    ? '0 4px 20px rgba(0,0,0,0.3)' 
                    : '0 4px 20px rgba(0,0,0,0.1)'
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Employee Distribution
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Active Employees</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {stats.activeAttendance} / {stats.totalEmployees}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(stats.activeAttendance / Math.max(stats.totalEmployees, 1)) * 100}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
                        }
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  background: isDark 
                    ? 'rgba(26, 26, 46, 0.8)' 
                    : 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: isDark 
                    ? '1px solid rgba(255, 255, 255, 0.1)' 
                    : '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: 3,
                  boxShadow: isDark 
                    ? '0 4px 20px rgba(0,0,0,0.3)' 
                    : '0 4px 20px rgba(0,0,0,0.1)'
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Recent Activity
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: '#667eea' }}>
                        <PersonIcon fontSize="small" />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          New employee registered
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                          2 minutes ago
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: '#f093fb' }}>
                        <BusinessIcon fontSize="small" />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          Department updated
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                          15 minutes ago
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </motion.div>
    </Box>
  );
};

export default AdminDashboard; 