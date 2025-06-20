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
  Brightness4,
  Brightness7,
  AccountCircle
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme as useCustomTheme } from '../../context/ThemeContext';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, LineChart, Line } from 'recharts';

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
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const { isDarkMode, toggleTheme } = useCustomTheme();
  const themeMode = isDarkMode ? 'dark' : 'light';
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchAllStats();
  }, []);

  const fetchAllStats = async () => {
    try {
      const token = localStorage.getItem('token');
      // Fetch employees
      const employeesResponse = await fetch(`${apiUrl}/api/employees`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const employeesData = await employeesResponse.json();
      setEmployees(employeesData);
      // Fetch departments
      const departmentsResponse = await fetch(`${apiUrl}/api/departments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const departmentsData = await departmentsResponse.json();
      setDepartments(departmentsData);
      // Fetch payrolls
      const payrollsResponse = await fetch(`${apiUrl}/api/payroll`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const payrollsData = await payrollsResponse.json();
      setPayrolls(payrollsData);
      // Fetch attendance
      const attendanceResponse = await fetch(`${apiUrl}/api/attendance`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const attendanceData = await attendanceResponse.json();
      setAttendance(attendanceData);
      setStats({
        totalEmployees: employeesData.length,
        totalDepartments: departmentsData.length,
        activeAttendance: Math.floor(Math.random() * employeesData.length), // Mock for now
        totalPayroll: employeesData.reduce((sum, emp) => sum + (emp.salary || 0), 0)
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

  // Employees by Department (Pie Chart)
  const departmentCounts = departments.map((dept) => ({
    name: dept.name,
    value: employees.filter(emp => (emp.department?._id || emp.department) === (dept._id || dept.id)).length
  })).filter(d => d.value > 0);
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a29bfe', '#fdcb6e', '#00b894', '#e17055'];

  // Payroll Trend (Line Chart)
  const getMonthYear = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  };
  const payrollByMonth = {};
  payrolls.forEach((p) => {
    const key = getMonthYear(`${p.year}-${p.month}-01`);
    if (!payrollByMonth[key]) payrollByMonth[key] = 0;
    payrollByMonth[key] += p.netSalary || 0;
  });
  // Get last 5 months
  const sortedMonths = Object.keys(payrollByMonth).sort().slice(-5);
  const payrollTrendData = sortedMonths.map(month => ({
    month,
    payroll: payrollByMonth[month]
  }));

  // Attendance Overview (Bar Chart)
  // Get last 5 days
  const getDateStr = (date) => {
    const d = new Date(date);
    return d.toISOString().slice(0, 10);
  };
  const today = new Date();
  const last5Days = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (4 - i));
    return getDateStr(d);
  });
  const attendanceByDay = last5Days.map(dateStr => {
    const records = attendance.filter(a => getDateStr(a.date) === dateStr);
    return {
      date: dateStr,
      Present: records.filter(r => r.status === 'present').length,
      Absent: records.filter(r => r.status === 'absent').length,
      Late: records.filter(r => r.status === 'late').length,
    };
  });

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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AccountCircle fontSize="large" color="inherit" sx={{ mr: 2 }} />
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Welcome, Admin! 👋
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Here's what's happening in your organization today
              </Typography>
            </Box>
          </Box>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <IconButton
              onClick={fetchAllStats}
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
            <Grid item xs={12} md={4}>
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
                    Employees by Department
                  </Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={departmentCounts}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {departmentCounts.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
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
                    Payroll Trend (Last 5 Months)
                  </Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={payrollTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Line type="monotone" dataKey="payroll" stroke="#8884d8" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
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
                    Attendance Overview (Last 5 Days)
                  </Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={attendanceByDay} stackOffset="sign">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey="Present" stackId="a" fill="#43e97b" />
                      <Bar dataKey="Absent" stackId="a" fill="#e17055" />
                      <Bar dataKey="Late" stackId="a" fill="#fdcb6e" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </motion.div>

      <Box sx={{ position: 'fixed', top: 24, right: 32, zIndex: 1000 }}>
        <Tooltip title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`} arrow>
          <IconButton onClick={toggleTheme} sx={{ color: themeMode === 'dark' ? '#00eaff' : '#8f5cff', background: themeMode === 'dark' ? 'rgba(20, 20, 40, 0.85)' : 'rgba(255,255,255,0.85)', boxShadow: themeMode === 'dark' ? '0 2px 16px #00eaff88' : '0 2px 16px #a29bfe88', border: `2px solid ${themeMode === 'dark' ? '#00eaff44' : '#a29bfe44'}`, backdropFilter: 'blur(12px)', transition: 'all 0.3s', '&:hover': { background: themeMode === 'dark' ? 'rgba(0,234,255,0.18)' : 'rgba(160,155,254,0.18)' } }} aria-label="Toggle theme">
            {isDarkMode ? <Brightness7 fontSize="medium" /> : <Brightness4 fontSize="medium" />}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default AdminDashboard; 