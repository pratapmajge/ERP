import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  useTheme,
  Avatar,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Person as PersonIcon, VpnKey as VpnKeyIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import Tooltip from '@mui/material/Tooltip';

const Managers = () => {
  const [managers, setManagers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [credentials, setCredentials] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    position: '',
    joinDate: '',
    phone: '',
    salary: '',
  });
  const [resetLoading, setResetLoading] = useState({});
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const theme = useTheme();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchManagers();
    fetchDepartments();
  }, []);

  const fetchManagers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/managers`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setManagers(data);
      }
    } catch (error) {
      console.error('Error fetching managers:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/departments`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setDepartments(data);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleOpen = () => {
    setFormData({
      name: '',
      email: '',
      department: '',
      position: '',
      joinDate: '',
      phone: '',
      salary: '',
    });
    setError('');
    setCredentials(null);
    setOpen(true);
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      department: '',
      position: '',
      joinDate: '',
      phone: '',
      salary: '',
    });
    setError('');
    setCredentials(null);
    setOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setCredentials(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/managers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setCredentials(data.userCredentials);
        handleClose();
        fetchManagers();
      } else {
        setError(data.message || 'Operation failed');
      }
    } catch (error) {
      setError('Error creating manager');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (managerId) => {
    setResetLoading(prev => ({ ...prev, [managerId]: true }));
    setError('');
    setCredentials(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/managers/${managerId}/reset-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setCredentials({ email: data.email, password: data.newPassword, message: data.message });
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (error) {
      setError('Error resetting password');
    } finally {
      setResetLoading(prev => ({ ...prev, [managerId]: false }));
    }
  };

  const handleEditOpen = (manager) => {
    setEditData({ ...manager, department: manager.department?._id || manager.department });
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditData(null);
    setEditOpen(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/managers/${editData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });
      if (response.ok) {
        handleEditClose();
        fetchManagers();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update manager');
      }
    } catch (error) {
      setError('Error updating manager');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (managerId) => {
    if (!window.confirm('Are you sure you want to delete this manager?')) return;
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/managers/${managerId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        fetchManagers();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete manager');
      }
    } catch (error) {
      setError('Error deleting manager');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Managers</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
          Add Manager
        </Button>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {credentials && (
        <Alert severity="success" sx={{ mb: 2 }}>
          <strong>Manager created!</strong><br />
          Email: {credentials.email}<br />
          Password: {credentials.password}<br />
          <em>{credentials.message}</em>
        </Alert>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Join Date</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Salary</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {managers.map((manager) => (
              <TableRow key={manager._id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 1 }}><PersonIcon /></Avatar>
                    {manager.name}
                  </Box>
                </TableCell>
                <TableCell>{manager.email}</TableCell>
                <TableCell>{manager.department?.name || ''}</TableCell>
                <TableCell>{manager.position}</TableCell>
                <TableCell>{manager.joinDate ? new Date(manager.joinDate).toLocaleDateString() : ''}</TableCell>
                <TableCell>{manager.phone}</TableCell>
                <TableCell>{manager.salary}</TableCell>
                <TableCell>
                  <Tooltip title="Reset Password" arrow>
                    <span>
                      <Button variant="outlined" size="small" startIcon={<VpnKeyIcon color="primary" />} onClick={() => handleResetPassword(manager._id)} disabled={resetLoading[manager._id]} sx={{ mr: 1 }}>
                        {resetLoading[manager._id] ? <CircularProgress size={18} /> : ''}
                      </Button>
                    </span>
                  </Tooltip>
                  <Tooltip title="Edit" arrow>
                    <span>
                      <Button variant="outlined" size="small" startIcon={<EditIcon color="action" />} onClick={() => handleEditOpen(manager)} sx={{ mr: 1 }}>
                      </Button>
                    </span>
                  </Tooltip>
                  <Tooltip title="Delete" arrow>
                    <span>
                      <Button variant="outlined" size="small" color="error" startIcon={<DeleteIcon color="error" />} onClick={() => handleDelete(manager._id)}>
                      </Button>
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add Manager</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
            required
          />
          <TextField
            margin="normal"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
            required
            type="email"
          />
          <TextField
            margin="normal"
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            fullWidth
            required
            select
          >
            {departments.map((dept) => (
              <MenuItem key={dept._id} value={dept._id}>{dept.name}</MenuItem>
            ))}
          </TextField>
          <TextField
            margin="normal"
            label="Position"
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            fullWidth
            required
          />
          <TextField
            margin="normal"
            label="Join Date"
            name="joinDate"
            value={formData.joinDate}
            onChange={handleInputChange}
            fullWidth
            required
            type="date"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="normal"
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="normal"
            label="Salary"
            name="salary"
            value={formData.salary}
            onChange={handleInputChange}
            fullWidth
            required
            type="number"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Add Manager'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={editOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Manager</DialogTitle>
        <DialogContent>
          <TextField margin="normal" label="Name" name="name" value={editData?.name || ''} onChange={handleEditChange} fullWidth required />
          <TextField margin="normal" label="Email" name="email" value={editData?.email || ''} onChange={handleEditChange} fullWidth required type="email" />
          <TextField margin="normal" label="Department" name="department" value={editData?.department || ''} onChange={handleEditChange} fullWidth required select>
            {departments.map((dept) => (
              <MenuItem key={dept._id} value={dept._id}>{dept.name}</MenuItem>
            ))}
          </TextField>
          <TextField margin="normal" label="Position" name="position" value={editData?.position || ''} onChange={handleEditChange} fullWidth required />
          <TextField margin="normal" label="Join Date" name="joinDate" value={editData?.joinDate ? editData.joinDate.split('T')[0] : ''} onChange={handleEditChange} fullWidth required type="date" InputLabelProps={{ shrink: true }} />
          <TextField margin="normal" label="Phone" name="phone" value={editData?.phone || ''} onChange={handleEditChange} fullWidth />
          <TextField margin="normal" label="Salary" name="salary" value={editData?.salary || ''} onChange={handleEditChange} fullWidth required type="number" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained" disabled={loading}>{loading ? <CircularProgress size={18} /> : 'Save'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Managers; 