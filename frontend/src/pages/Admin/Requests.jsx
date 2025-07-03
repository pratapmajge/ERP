import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/api/auth/registration-requests`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch requests');
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line
  }, []);

  const handleAction = async (id, action) => {
    setActionLoading(id + action);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/api/auth/registration-requests/${id}/${action}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: action === 'reject' ? JSON.stringify({ adminNote: 'Rejected by admin' }) : undefined
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Action failed');
      setSnackbar({ open: true, message: data.message, severity: 'success' });
      fetchRequests();
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Registration Requests</Typography>
      {loading ? (
        <CircularProgress />
      ) : requests.length === 0 ? (
        <Typography>No pending requests.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((req) => (
                <TableRow key={req._id}>
                  <TableCell>{req.name}</TableCell>
                  <TableCell>{req.email}</TableCell>
                  <TableCell>{req.role}</TableCell>
                  <TableCell>{req.department?.name || '-'}</TableCell>
                  <TableCell>{req.position || '-'}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      sx={{ mr: 1 }}
                      disabled={actionLoading === req._id + 'approve'}
                      onClick={() => handleAction(req._id, 'approve')}
                    >
                      {actionLoading === req._id + 'approve' ? <CircularProgress size={20} /> : 'Approve'}
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      disabled={actionLoading === req._id + 'reject'}
                      onClick={() => handleAction(req._id, 'reject')}
                    >
                      {actionLoading === req._id + 'reject' ? <CircularProgress size={20} /> : 'Reject'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Requests; 