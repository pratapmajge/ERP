import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';

const summary = [
  { title: 'Employees', value: 'Manage employees' },
  { title: 'Departments', value: 'View departments' },
  { title: 'Attendance', value: 'View attendance records' },
  { title: 'Payroll', value: 'View payroll' },
];

const HRDashboard = () => (
  <Box>
    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
      Welcome, HR!
    </Typography>
    <Grid container spacing={3}>
      {summary.map((item) => (
        <Grid item xs={12} sm={6} md={3} key={item.title}>
          <Card>
            <CardContent>
              <Typography variant="h6">{item.title}</Typography>
              <Typography color="text.secondary">{item.value}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default HRDashboard; 