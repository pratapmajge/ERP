import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress, LinearProgress, Card, CardContent, CardHeader, Grid, Chip } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { api } from '../utils/api';

const CompletedTasks = () => {
  const [employees, setEmployees] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [employeesData, progressData] = await Promise.all([
          api.get('/employees/assigned'),
          api.get('/progress')
        ]);
        setEmployees(employeesData);
        setProgress(progressData.filter(p => p.managerCompleted));
      } catch (error) {
        console.error('Failed to fetch completed tasks:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const progressByEmployee = employees.reduce((acc, emp) => {
    acc[emp._id] = progress.filter((p) => p.employee._id === emp._id);
    return acc;
  }, {});

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Completed Tasks</Typography>
      <Paper sx={{ p: 2, mt: 3, bgcolor: 'background.default', boxShadow: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
            <CircularProgress />
          </Box>
        ) : employees.length === 0 ? (
          <Typography>No employees assigned to you yet.</Typography>
        ) : (
          <Grid container spacing={3}>
            {employees
              .filter(emp => emp.name)
              .map(emp => (
                <Grid item xs={12} md={6} lg={4} key={emp._id}>
                  <Card sx={{ bgcolor: 'background.paper', borderRadius: 3, boxShadow: 2 }}>
                    <CardHeader
                      avatar={<CheckCircle color="success" />}
                      title={emp.name}
                      subheader={emp.position}
                      sx={{ pb: 0 }}
                    />
                    <CardContent>
                      {progressByEmployee[emp._id]?.length ? (
                        progressByEmployee[emp._id].map((task, idx) => (
                          <Box key={task._id} sx={{ mb: 2, p: 2, borderRadius: 2, bgcolor: 'grey.900', color: 'white' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                              {idx + 1}. {task.project} - {task.task}
                            </Typography>
                            <Chip
                              label="Completed"
                              color="success"
                              size="small"
                              sx={{ mb: 1, mt: 1 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                              <LinearProgress variant="determinate" value={task.progress} sx={{ flex: 1, mr: 1 }} />
                              <Typography variant="caption">{task.progress}%</Typography>
                            </Box>
                          </Box>
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">No completed tasks.</Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        )}
      </Paper>
    </Box>
  );
};

export default CompletedTasks; 