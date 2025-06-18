import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';

const summary = [
  { title: 'My Profile', value: 'View and update your profile' },
  { title: 'Attendance', value: 'View your attendance records' },
  { title: 'Payroll', value: 'View your payroll information' },
];

const EmployeeDashboard = () => (
  <Box>
    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
      Welcome!
    </Typography>
    <Grid container spacing={3}>
      {summary.map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item.title}>
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

export default EmployeeDashboard; 