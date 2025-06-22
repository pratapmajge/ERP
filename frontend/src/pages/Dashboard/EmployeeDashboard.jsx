import React from 'react';
import { Box, Typography, Grid, Card, CardContent, IconButton, Tooltip } from '@mui/material';
import { useOutletContext } from 'react-router-dom';
import { useTheme as useCustomTheme } from '../../context/ThemeContext';
import { Brightness4, Brightness7, AccountCircle, AssignmentInd, MonetizationOn, AccessTime } from '@mui/icons-material';

const summary = [
  { title: 'My Profile', value: 'View and update your profile', icon: <AccountCircle fontSize="large" color="primary" /> },
  { title: 'Attendance', value: 'View your attendance records', icon: <AccessTime fontSize="large" color="action" /> },
  { title: 'Payroll', value: 'View your payroll information', icon: <MonetizationOn fontSize="large" color="success" /> },
];

const EmployeeDashboard = () => {
  const { isDarkMode, toggleTheme } = useCustomTheme();
  const themeMode = isDarkMode ? 'dark' : 'light';
  const { userProfile } = useOutletContext();

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
        Welcome, {userProfile?.name}!
      </Typography>
      <Grid container spacing={3}>
        {summary.map((item) => (
          <Grid xs={12} sm={6} md={4} key={item.title}>
            <Card>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {item.icon}
                <Typography variant="h6" sx={{ mt: 1 }}>{item.title}</Typography>
                <Typography color="text.secondary">{item.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
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

export default EmployeeDashboard; 