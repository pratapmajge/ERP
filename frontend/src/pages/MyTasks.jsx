import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody,
  CircularProgress, Slider, Select, MenuItem, Tooltip, IconButton
} from '@mui/material';
import { api } from '../utils/api';
import { CheckCircle, HourglassEmpty, PlayCircle, Edit, Save, Cancel } from '@mui/icons-material';

const statusOptions = [
  { value: 'Not Started', icon: <HourglassEmpty />, color: 'gray' },
  { value: 'In Progress', icon: <PlayCircle />, color: 'blue' },
  { value: 'Completed', icon: <CheckCircle />, color: 'green' }
];

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const allTasks = await api.get('/progress/employee');
      setTasks(allTasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (task) => {
    setEditingTaskId(task._id);
  };

  const handleCancel = () => {
    setEditingTaskId(null);
    fetchTasks(); // Refetch to discard any local changes
  };

  const handleSave = async (taskId) => {
    const taskToUpdate = tasks.find(t => t._id === taskId);
    if (!taskToUpdate) return;

    try {
      await api.put(`/progress/${taskId}`, {
        status: taskToUpdate.status,
        progress: taskToUpdate.progress,
      });
      setEditingTaskId(null); // Exit edit mode
    } catch (error) {
      console.error("Failed to save task:", error);
      // Revert local changes by refetching original data
      fetchTasks();
    }
  };

  const handleLocalChange = (taskId, field, value) => {
    setTasks(currentTasks => 
      currentTasks.map(t => 
        t._id === taskId ? { ...t, [field]: value } : t
      )
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>My Tasks</Typography>
      <Paper sx={{ p: 2, mt: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Project</TableCell>
                <TableCell>Task</TableCell>
                <TableCell sx={{ width: '15%' }}>Status</TableCell>
                <TableCell sx={{ width: '25%' }}>Progress</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task) => {
                const isEditing = editingTaskId === task._id;
                return (
                  <TableRow key={task._id}>
                    <TableCell>{task.project}</TableCell>
                    <TableCell>{task.task}</TableCell>
                    <TableCell>
                      <Select
                        value={task.status}
                        onChange={(e) => handleLocalChange(task._id, 'status', e.target.value)}
                        variant="standard"
                        disableUnderline
                        disabled={!isEditing}
                        sx={{ '.MuiSelect-select': { display: 'flex', alignItems: 'center' } }}
                      >
                        {statusOptions.map(opt => (
                          <MenuItem key={opt.value} value={opt.value}>
                            <Tooltip title={opt.value}>
                              {React.cloneElement(opt.icon, { style: { color: opt.color, marginRight: 8 } })}
                            </Tooltip>
                            {opt.value}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Slider
                          value={task.progress}
                          onChange={(e, newValue) => handleLocalChange(task._id, 'progress', newValue)}
                          valueLabelDisplay="auto"
                          disabled={!isEditing}
                          sx={{
                            '& .MuiSlider-thumb': {
                              backgroundColor: 'primary.main',
                            },
                            '& .MuiSlider-rail': {
                              opacity: 0.4,
                            }
                          }}
                        />
                        <Typography variant="body2">{task.progress}%</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell>
                      {isEditing ? (
                        <>
                          <IconButton onClick={() => handleSave(task._id)} size="small" color="primary">
                            <Save />
                          </IconButton>
                          <IconButton onClick={handleCancel} size="small">
                            <Cancel />
                          </IconButton>
                        </>
                      ) : (
                        <IconButton onClick={() => handleEdit(task)} size="small">
                          <Edit />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  );
};

export default MyTasks; 