import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, LinearProgress, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem
} from '@mui/material';
import { api } from '../utils/api';

const statusOptions = ['Not Started', 'In Progress', 'Completed'];

const ManageTasks = () => {
  const [employees, setEmployees] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [form, setForm] = useState({ project: '', task: '', progress: 0, status: 'Not Started', dueDate: '' });
  const [editForm, setEditForm] = useState({ project: '', task: '', progress: 0, status: 'Not Started', dueDate: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [employeesData, progressData] = await Promise.all([
        api.get('/employees/assigned'),
        api.get('/progress')
      ]);
      setEmployees(employeesData);
      setProgress(progressData);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (employee) => {
    setSelectedEmployee(employee);
    setForm({ project: '', task: '', progress: 0, status: 'Not Started', dueDate: '' });
    setDialogOpen(true);
  };
  const handleCloseDialog = () => setDialogOpen(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTask = async () => {
    setSubmitting(true);
    try {
      await api.post('/progress', { ...form, employee: selectedEmployee._id });
      handleCloseDialog();
      fetchAll();
    } catch (error) {
      console.error("Failed to add task:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEditDialog = (task) => {
    setSelectedTask(task);
    setEditForm({
      project: task.project || '',
      task: task.task,
      progress: task.progress,
      status: task.status,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
    });
    setEditDialogOpen(true);
  };
  const handleCloseEditDialog = () => setEditDialogOpen(false);
  
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateTask = async () => {
    setSubmitting(true);
    try {
      await api.put(`/progress/${selectedTask._id}`, editForm);
      handleCloseEditDialog();
      fetchAll();
    } catch (error) {
      console.error("Failed to update task:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const progressByEmployee = employees.reduce((acc, emp) => {
    acc[emp._id] = progress.filter((p) => p.employee._id === emp._id);
    return acc;
  }, {});

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Manage Tasks</Typography>
      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" gutterBottom>Team Progress Tracking</Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
            <CircularProgress />
          </Box>
        ) : employees.length === 0 ? (
          <Typography>No employees assigned to you yet.</Typography>
        ) : (
          employees
            .filter(emp => emp.name)
            .map((emp) => (
            <Box key={emp._id} sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, pb: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>{emp.name} <Typography variant="caption" color="text.secondary">({emp.position})</Typography></Typography>
                <Button variant="contained" size="small" onClick={() => handleOpenDialog(emp)}>Add Task</Button>
              </Box>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Task</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Progress</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {progressByEmployee[emp._id]?.length ? progressByEmployee[emp._id].map((task) => (
                    <TableRow key={task._id}>
                      <TableCell>{task.task}</TableCell>
                      <TableCell>{task.status}</TableCell>
                      <TableCell>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinearProgress variant="determinate" value={task.progress} sx={{ width: 100, mr: 1 }} />
                          <Typography variant="body2">{task.progress}%</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Button variant="text" size="small" onClick={() => handleOpenEditDialog(task)}>Edit</Button>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow><TableCell colSpan={5} sx={{ textAlign: 'center' }}>No tasks yet.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          ))
        )}
      </Paper>
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Add Task</DialogTitle>
        <DialogContent>
          <TextField label="Project Name" name="project" value={form.project} onChange={handleFormChange} fullWidth margin="normal" required />
          <TextField label="Task" name="task" value={form.task} onChange={handleFormChange} fullWidth margin="normal" required />
          <TextField label="Due Date" name="dueDate" type="date" value={form.dueDate} onChange={handleFormChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
          <TextField label="Status" name="status" value={form.status} onChange={handleFormChange} fullWidth margin="normal" select>
            {statusOptions.map((opt) => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
          </TextField>
          <TextField label="Progress (%)" name="progress" type="number" value={form.progress} onChange={handleFormChange} fullWidth margin="normal" inputProps={{ min: 0, max: 100 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAddTask} variant="contained" disabled={submitting}>{submitting ? 'Adding...' : 'Add Task'}</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField label="Project Name" name="project" value={editForm.project} onChange={handleEditFormChange} fullWidth margin="normal" required />
          <TextField label="Task" name="task" value={editForm.task} onChange={handleEditFormChange} fullWidth margin="normal" required />
          <TextField label="Due Date" name="dueDate" type="date" value={editForm.dueDate} onChange={handleEditFormChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleUpdateTask} variant="contained" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageTasks; 