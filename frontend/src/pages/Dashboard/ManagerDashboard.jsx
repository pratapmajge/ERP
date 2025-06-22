import React from 'react';
import {
  Box, Typography, Paper, Grid, useTheme, CircularProgress, Alert
} from '@mui/material';
import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useManagerData } from '../../context/ManagerDataContext.jsx';

const COLORS = ['#00C49F', '#FFBB28', '#0088FE', '#FF8042'];

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

  const totalTasks = progress.length;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Welcome, Manager!</Typography>
      
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Charts Row */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, height: 400, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom align="center">Employee Departments</Typography>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={employeeDepartmentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
                      {employeeDepartmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${name}: ${value} employees`]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid item xs={12} md={7}>
               <Paper sx={{ p: 2, height: 420, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" gutterBottom align="center">Task Status</Typography>
                 <Box sx={{ flexGrow: 1, position: 'relative' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                           <Pie data={progressStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius="70%" outerRadius="90%" fill="#82ca9d" paddingAngle={5}>
                                {progressStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => [value, 'Tasks']} />
                        </PieChart>
                    </ResponsiveContainer>
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
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
                 </Box>
                 {/* Custom Legend */}
                 <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                    {progressStatusData.map((entry, index) => (
                      <Box key={entry.name} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box sx={{ width: 14, height: 14, bgcolor: COLORS[index % COLORS.length], borderRadius: '2px' }} />
                        <Typography variant="body2" color="text.secondary">{entry.name}</Typography>
                      </Box>
                    ))}
                 </Box>
                </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ManagerDashboard;