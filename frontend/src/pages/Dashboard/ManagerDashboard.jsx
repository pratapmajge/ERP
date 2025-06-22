import React from 'react';
import {
  Box, Typography, Paper, Grid, useTheme, CircularProgress, Alert
} from '@mui/material';
import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { People as PeopleIcon, Assignment as AssignmentIcon } from '@mui/icons-material';
import { useManagerData } from '../../context/ManagerDataContext.jsx';

const COLORS = ['#00C49F', '#FFBB28', '#0088FE', '#FF8042'];

const StatCard = ({ title, value, icon, color }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  return (
    <Paper 
      sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center',
        background: isDark ? `linear-gradient(145deg, #2b2b4e, #1a1a36)` : `linear-gradient(145deg, ${color[100]}, ${color[300]})`,
        color: isDark ? theme.palette.common.white : color[900],
        borderRadius: 4,
        boxShadow: `0 4px 20px 0 rgba(0,0,0,0.12)`
      }}
    >
      <Box sx={{ 
        mr: 2, 
        p: 1.5, 
        bgcolor: 'rgba(255,255,255,0.2)',
        borderRadius: '50%'
      }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{value}</Typography>
        <Typography variant="body2">{title}</Typography>
      </Box>
    </Paper>
  );
};

const ManagerDashboard = () => {
  const { employees, progress, loading, error } = useManagerData();
  const theme = useTheme();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const employeeDepartmentData = employees.reduce((acc, emp) => {
    const dept = emp.department?.name || 'Unassigned';
    const existing = acc.find(item => item.name === dept);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: dept, value: 1 });
    }
    return acc;
  }, []);

  const progressStatusData = progress.reduce((acc, p) => {
    const status = p.status || 'Unknown';
    const existing = acc.find(item => item.name === status);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: status, value: 1 });
    }
    return acc;
  }, []);

  const tasksInProgress = progress.filter(p => p.status === 'In Progress').length;
  const totalTasks = progress.length;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Welcome, Manager!</Typography>
      
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Total Employees" value={employees.length} icon={<PeopleIcon />} color={theme.palette.info} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Tasks In Progress" value={tasksInProgress} icon={<AssignmentIcon />} color={theme.palette.warning} />
        </Grid>

        <Grid item xs={12} md={6}></Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2, height: 400, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom align="center">Employee Departments</Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={employeeDepartmentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
                  {employeeDepartmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} employees`, name]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 2, height: 400, display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <Typography variant="h6" gutterBottom align="center">Task Status</Typography>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={progressStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={80} outerRadius={110} fill="#82ca9d" paddingAngle={5}>
                        {progressStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Tasks']} />
                    <Legend iconSize={10} />
                </PieChart>
            </ResponsiveContainer>
            <Box
              sx={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 20,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                pointerEvents: 'none',
              }}
            >
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>{totalTasks}</Typography>
              <Typography variant="overline" color="text.secondary">Total Tasks</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ManagerDashboard;