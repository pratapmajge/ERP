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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  useTheme,
  Tooltip,
  Avatar,
  CircularProgress,
  Fade,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Key as KeyIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Person as PersonIcon,
  EditOutlined as EditOutlinedIcon,
  VpnKeyOutlined as VpnKeyOutlinedIcon,
  DeleteOutline as DeleteOutlineIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwords, setPasswords] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    position: '',
    joinDate: '',
    phone: '',
    salary: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const theme = useTheme();

  // Fetch employees and departments on component mount
  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/employees', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
        // Clear passwords when employees are refreshed
        setPasswords({});
      } else {
        console.error('Failed to fetch employees');
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/departments', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setDepartments(data);
      } else {
        console.error('Failed to fetch departments');
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleOpen = (employee = null) => {
    if (employee) {
      setSelectedEmployee(employee);
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        department: employee.department?._id || employee.department || '',
        position: employee.position || '',
        joinDate: employee.joinDate ? employee.joinDate.split('T')[0] : '',
        phone: employee.phone || '',
        salary: employee.salary || '',
      });
    } else {
      setSelectedEmployee(null);
      setFormData({
        name: '',
        email: '',
        department: '',
        position: '',
        joinDate: '',
        phone: '',
        salary: '',
      });
    }
    setError('');
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedEmployee(null);
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
    setOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const url = selectedEmployee 
        ? `http://localhost:5001/api/employees/${selectedEmployee._id}`
        : 'http://localhost:5001/api/employees';
      
      const method = selectedEmployee ? 'PUT' : 'POST';
      
      let response;
      
      if (selectedEmployee) {
        // Update existing employee (no photo upload for now)
        response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
      } else {
        // Create new employee with photo upload
        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
          formDataToSend.append(key, formData[key]);
        });
        
        response = await fetch(url, {
          method,
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formDataToSend,
        });
      }

      const data = await response.json();

      if (response.ok) {
        if (!selectedEmployee && data.userCredentials) {
          // Show credentials for new employee
          alert(`Employee created successfully!\n\nLogin Credentials:\nEmail: ${data.userCredentials.email}\nPassword: ${data.userCredentials.password}\n\nPlease save these credentials and share them with the employee.`);
        }
        handleClose();
        fetchEmployees(); // Refresh the list
        // Clear passwords when employees are updated
        setPasswords({});
      } else {
        setError(data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5001/api/employees/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          fetchEmployees(); // Refresh the list
          // Clear passwords when employee is deleted
          setPasswords({});
        } else {
          console.error('Failed to delete employee');
        }
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  const handleResetPassword = async (id) => {
    if (window.confirm('Are you sure you want to reset this employee\'s password?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5001/api/employees/${id}/reset-password`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          alert(`Password reset successfully!\n\nNew Credentials:\nEmail: ${data.email}\nPassword: ${data.newPassword}\n\nPlease share these new credentials with the employee.`);
        } else {
          console.error('Failed to reset password:', data.message);
        }
      } catch (error) {
        console.error('Error resetting password:', error);
      }
    }
  };

  const handleGetPassword = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/employees/${id}/password`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Update the passwords state with the new password
        setPasswords(prev => ({
          ...prev,
          [id]: data.password
        }));
      } else {
        console.error('Failed to get password:', data.message);
        alert('Failed to get password: ' + data.message);
      }
    } catch (error) {
      console.error('Error getting password:', error);
      alert('Error getting password. Please try again.');
    }
  };

  // Filter employees by name, email, or department name
  const filteredEmployees = employees.filter(emp => {
    const name = emp.name || '';
    const email = emp.email || '';
    const dept = emp.department?.name || emp.department || '';
    const term = searchTerm.toLowerCase();
    return (
      name.toLowerCase().includes(term) ||
      email.toLowerCase().includes(term) ||
      dept.toLowerCase().includes(term)
    );
  });

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 4 } }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Employees
          </Typography>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpen()}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 3,
              }}
            >
              Add Employee
            </Button>
          </motion.div>
        </Box>
        <TextField
          label="Search employees"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mb: 3, background: 'rgba(102,126,234,0.06)', borderRadius: 2, boxShadow: 1, '& .MuiOutlinedInput-root': { borderRadius: 2, boxShadow: 1, '&:hover': { boxShadow: 3, background: 'rgba(102,126,234,0.10)' }, '&.Mui-focused': { boxShadow: 4, background: 'rgba(102,126,234,0.13)' } } }}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          autoComplete="off"
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ color: 'primary.main', mr: 1 }} />
            ),
          }}
        />
      </motion.div>

      <Card>
        <CardContent>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: 3,
            p: 2
          }}>
            {filteredEmployees.map((employee, index) => (
              <motion.div
                key={employee._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Card 
                  sx={{ 
                    height: '100%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 4,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.1)',
                    '&:hover': {
                      boxShadow: '0 12px 40px rgba(0,0,0,0.25), 0 8px 24px rgba(0,0,0,0.15)',
                      transform: 'translateY(-4px)'
                    },
                    transition: 'all 0.3s ease-in-out',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      zIndex: 1
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                      transform: 'translateX(-100%)',
                      transition: 'transform 0.6s ease-in-out',
                      zIndex: 1
                    },
                    '&:hover::after': {
                      transform: 'translateX(100%)'
                    }
                  }}
                >
                  <CardContent sx={{ position: 'relative', zIndex: 2, p: 3 }}>
                    {/* Header with Avatar and Name */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Avatar
                        sx={{
                          width: 60,
                          height: 60,
                          mr: 2,
                          border: '3px solid rgba(255,255,255,0.3)',
                          boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                          borderRadius: '50%'
                        }}
                      >
                        {employee.name ? employee.name.charAt(0).toUpperCase() : <PersonIcon sx={{ fontSize: 30 }} />}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                          {employee.name}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          {employee.position}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Employee Details */}
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <Typography variant="body2" sx={{ minWidth: 80, opacity: 0.8 }}>
                          Email:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {employee.email}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <Typography variant="body2" sx={{ minWidth: 80, opacity: 0.8 }}>
                          Department:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {employee.department?.name || employee.department || '-'}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <Typography variant="body2" sx={{ minWidth: 80, opacity: 0.8 }}>
                          Phone:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {employee.phone || '-'}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <Typography variant="body2" sx={{ minWidth: 80, opacity: 0.8 }}>
                          Join Date:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {employee.joinDate ? new Date(employee.joinDate).toLocaleDateString() : '-'}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <Typography variant="body2" sx={{ minWidth: 80, opacity: 0.8 }}>
                          Salary:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {employee.salary ? `$${employee.salary}` : '-'}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Password Section */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                        Password:
                      </Typography>
                      {passwords[employee._id] ? (
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1,
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          p: 1.5,
                          borderRadius: 2,
                          border: '1px solid rgba(255,255,255,0.2)',
                          backdropFilter: 'blur(10px)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', flex: 1 }}>
                            {passwords[employee._id]}
                          </Typography>
                          <Tooltip title="Hide Password" arrow>
                            <IconButton
                              size="small"
                              onClick={() => setPasswords(prev => {
                                const newPasswords = { ...prev };
                                delete newPasswords[employee._id];
                                return newPasswords;
                              })}
                              sx={{ 
                                color: 'white',
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                borderRadius: 1,
                                '&:hover': {
                                  backgroundColor: 'rgba(255,255,255,0.2)',
                                  transform: 'scale(1.1)'
                                },
                                transition: 'all 0.2s ease-in-out'
                              }}
                            >
                              <VisibilityOffIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      ) : (
                        <Tooltip title="Show Password" arrow>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleGetPassword(employee._id)}
                            startIcon={<VisibilityIcon />}
                            sx={{ 
                              color: 'white', 
                              borderColor: 'rgba(255,255,255,0.3)',
                              borderRadius: 2,
                              backdropFilter: 'blur(10px)',
                              '&:hover': {
                                borderColor: 'white',
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                              },
                              transition: 'all 0.2s ease-in-out'
                            }}
                          >
                            Show Password
                          </Button>
                        </Tooltip>
                      )}
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ 
                      display: 'flex', 
                      gap: 1,
                      justifyContent: 'flex-end'
                    }}>
                      <Tooltip title="Edit Employee" arrow>
                        <IconButton
                          onClick={() => handleOpen(employee)}
                          size="small"
                          sx={{ 
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            borderRadius: 2,
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.3)',
                            '&:hover': { 
                              backgroundColor: 'rgba(255,255,255,0.3)',
                              transform: 'scale(1.1)',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                            },
                            transition: 'all 0.2s ease-in-out'
                          }}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Reset Password" arrow>
                        <IconButton
                          onClick={() => handleResetPassword(employee._id)}
                          size="small"
                          sx={{ 
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            borderRadius: 2,
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.3)',
                            '&:hover': { 
                              backgroundColor: 'rgba(255,255,255,0.3)',
                              transform: 'scale(1.1)',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                            },
                            transition: 'all 0.2s ease-in-out'
                          }}
                        >
                          <VpnKeyOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Delete Employee" arrow>
                        <IconButton
                          onClick={() => handleDelete(employee._id)}
                          size="small"
                          sx={{ 
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            borderRadius: 2,
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.3)',
                            '&:hover': { 
                              backgroundColor: 'rgba(255,255,255,0.3)',
                              transform: 'scale(1.1)',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                            },
                            transition: 'all 0.2s ease-in-out'
                          }}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedEmployee ? 'Edit Employee' : 'Add New Employee'}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Name"
              name="name"
              fullWidth
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <TextField
              label="Department"
              name="department"
              select
              fullWidth
              value={formData.department}
              onChange={handleInputChange}
              required
            >
              {departments.map((dept) => (
                <MenuItem key={dept._id} value={dept._id}>
                  {dept.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Position"
              name="position"
              fullWidth
              value={formData.position}
              onChange={handleInputChange}
              required
            />
            <TextField
              label="Join Date"
              name="joinDate"
              type="date"
              fullWidth
              value={formData.joinDate}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              label="Phone"
              name="phone"
              fullWidth
              value={formData.phone}
              onChange={handleInputChange}
            />
            <TextField
              label="Salary"
              name="salary"
              type="number"
              fullWidth
              value={formData.salary}
              onChange={handleInputChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Saving...' : (selectedEmployee ? 'Update' : 'Add')}
          </Button>
        </DialogActions>
      </Dialog>

      {loading && (
        <Fade in={loading} unmountOnExit>
          <Box sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(30, 41, 59, 0.85)',
            zIndex: 9999,
            transition: 'background 0.3s',
          }}>
            <CircularProgress 
              size={70} 
              thickness={5} 
              sx={{
                color: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                mb: 2,
                filter: 'drop-shadow(0 0 12px #667eea88) drop-shadow(0 0 24px #764ba288)'
              }}
            />
            <Typography 
              variant="h6" 
              sx={{ color: '#fff', fontWeight: 600, letterSpacing: 1, mt: 1, textShadow: '0 2px 8px #0008' }}
            >
              {selectedEmployee ? 'Updating employee...' : 'Adding employee...'}
            </Typography>
          </Box>
        </Fade>
      )}
    </Box>
  );
};

export default Employees; 