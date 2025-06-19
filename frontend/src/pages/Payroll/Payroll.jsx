import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Card,
  CardContent,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AttachMoney as MoneyIcon,
  Receipt as ReceiptIcon,
  AccountBalance as BankIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { getUser } from '../../utils/auth';

const StatusChip = ({ status }) => {
  const theme = useTheme();
  const getStatusColor = () => {
    switch (status) {
      case 'Paid':
        return theme.palette.success.main;
      case 'Pending':
        return theme.palette.warning.main;
      case 'Failed':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'Paid':
        return <ReceiptIcon fontSize="small" />;
      case 'Pending':
        return <MoneyIcon fontSize="small" />;
      case 'Failed':
        return <BankIcon fontSize="small" />;
      default:
        return null;
    }
  };

  return (
    <Chip
      icon={getStatusIcon()}
      label={status}
      size="small"
      sx={{
        backgroundColor: `${getStatusColor()}15`,
        color: getStatusColor(),
        '& .MuiChip-icon': {
          color: getStatusColor(),
        },
      }}
    />
  );
};

const StatCard = ({ title, value, icon, color }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'visible',
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <Box>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {title}
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                ${value.toLocaleString()}
              </Typography>
            </Box>
            <Box
              sx={{
                backgroundColor: `${color}15`,
                borderRadius: '50%',
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {icon}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Payroll = () => {
  const [payroll, setPayroll] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [formData, setFormData] = useState({
    employee: '',
    basicSalary: '',
    allowances: '',
    deductions: '',
    netSalary: '',
    status: 'Pending',
    paymentDate: null,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const theme = useTheme();
  const user = getUser();
  const isEmployee = user?.role === 'employee';

  useEffect(() => {
    if (isEmployee) {
      fetchEmployeePayroll();
    } else {
      fetchPayroll();
      fetchEmployees();
    }
  }, []);

  const fetchPayroll = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/payroll', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setPayroll(data);
      }
    } catch (error) {
      console.error('Error fetching payroll:', error);
    }
  };

  const fetchEmployeePayroll = async () => {
    try {
      const token = localStorage.getItem('token');
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();
      const response = await fetch(`http://localhost:5001/api/payroll/employee/${user._id}?month=${month}&year=${year}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setPayroll(data);
      }
    } catch (error) {
      console.error('Error fetching employee payroll:', error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/employees', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleOpen = (record = null) => {
    if (record) {
      setSelectedRecord(record);
      setFormData({
        employee: record.employee?._id || record.employee,
        basicSalary: record.basicSalary,
        allowances: record.allowances,
        deductions: record.deductions,
        netSalary: record.netSalary,
        status: record.status || 'Pending',
        paymentDate: record.paymentDate ? new Date(record.paymentDate) : null,
        month: record.month,
        year: record.year,
      });
    } else {
      setSelectedRecord(null);
      setFormData({
        employee: '',
        basicSalary: '',
        allowances: '',
        deductions: '',
        netSalary: '',
        status: 'Pending',
        paymentDate: null,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedRecord(null);
    setOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, paymentDate: date }));
  };

  const handleMonthChange = (date) => {
    setSelectedMonth(date);
    setFormData((prev) => ({ ...prev, month: date.getMonth() + 1, year: date.getFullYear() }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = selectedRecord
        ? `http://localhost:5001/api/payroll/${selectedRecord._id}`
        : 'http://localhost:5001/api/payroll';
      const method = selectedRecord ? 'PUT' : 'POST';
      const body = { ...formData };
      if (body.paymentDate instanceof Date) {
        body.paymentDate = body.paymentDate.toISOString();
      }
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        fetchPayroll();
        handleClose();
      }
    } catch (error) {
      console.error('Error saving payroll:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this payroll record?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/payroll/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        fetchPayroll();
      }
    } catch (error) {
      console.error('Error deleting payroll:', error);
    }
  };

  // Calculate summary statistics
  const totalSalary = payroll.reduce((sum, record) => sum + (record.netSalary || 0), 0);
  const pendingSalary = payroll
    .filter((record) => record.status === 'Pending')
    .reduce((sum, record) => sum + (record.netSalary || 0), 0);
  const paidSalary = payroll
    .filter((record) => record.status === 'Paid')
    .reduce((sum, record) => sum + (record.netSalary || 0), 0);

  if (isEmployee) {
    // Employee view: show only current month's payroll status
    const currentPayroll = payroll[0];
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
          My Payroll Status (Current Month)
        </Typography>
        {currentPayroll ? (
          <Card sx={{ maxWidth: 400, mx: 'auto', p: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Status: <StatusChip status={currentPayroll.status} />
              </Typography>
              {currentPayroll.status === 'Paid' && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ReceiptIcon color="success" sx={{ mr: 1 }} />
                  <Typography color="success.main" sx={{ fontWeight: 'bold' }}>
                    Your salary for this month has been <b>paid</b> by admin.
                  </Typography>
                </Box>
              )}
              {currentPayroll.status === 'Pending' && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <MoneyIcon color="warning" sx={{ mr: 1 }} />
                  <Typography color="warning.main" sx={{ fontWeight: 'bold' }}>
                    Your salary for this month is <b>pending</b> admin approval/payment.
                  </Typography>
                </Box>
              )}
              {currentPayroll.status === 'Failed' && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BankIcon color="error" sx={{ mr: 1 }} />
                  <Typography color="error.main" sx={{ fontWeight: 'bold' }}>
                    Payment failed. Please contact admin.
                  </Typography>
                </Box>
              )}
              <Typography>Net Salary: ${currentPayroll.netSalary}</Typography>
              <Typography>Basic Salary: ${currentPayroll.basicSalary}</Typography>
              <Typography>Allowances: ${currentPayroll.allowances}</Typography>
              <Typography>Deductions: ${currentPayroll.deductions}</Typography>
              <Typography>Payment Date: {currentPayroll.paymentDate ? new Date(currentPayroll.paymentDate).toLocaleDateString() : '-'}</Typography>
              <Typography>Month: {currentPayroll.month}</Typography>
              <Typography>Year: {currentPayroll.year}</Typography>
            </CardContent>
          </Card>
        ) : (
          <Typography>No payroll record found for this month.</Typography>
        )}
        {/* Optionally, add a simple history below */}
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
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
            Payroll Management
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Select Month"
                value={selectedMonth}
                onChange={handleMonthChange}
                views={['month', 'year']}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
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
                Add Salary Record
              </Button>
            </motion.div>
          </Box>
        </Box>
      </motion.div>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Total Salary"
            value={totalSalary}
            icon={<MoneyIcon sx={{ color: theme.palette.primary.main }} />}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Pending Payments"
            value={pendingSalary}
            icon={<MoneyIcon sx={{ color: theme.palette.warning.main }} />}
            color={theme.palette.warning.main}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Paid Amount"
            value={paidSalary}
            icon={<ReceiptIcon sx={{ color: theme.palette.success.main }} />}
            color={theme.palette.success.main}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee Name</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Basic Salary</TableCell>
                  <TableCell>Allowances</TableCell>
                  <TableCell>Deductions</TableCell>
                  <TableCell>Net Salary</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Payment Date</TableCell>
                  <TableCell>Month</TableCell>
                  <TableCell>Year</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payroll.map((record) => (
                  <TableRow key={record._id}>
                    <TableCell>{record.employee?.name || '-'}</TableCell>
                    <TableCell>{record.employee?.department?.name || '-'}</TableCell>
                    <TableCell>${record.basicSalary}</TableCell>
                    <TableCell>${record.allowances}</TableCell>
                    <TableCell>${record.deductions}</TableCell>
                    <TableCell>${record.netSalary}</TableCell>
                    <TableCell>
                      <StatusChip status={record.status} />
                    </TableCell>
                    <TableCell>{record.paymentDate ? new Date(record.paymentDate).toLocaleDateString() : '-'}</TableCell>
                    <TableCell>{record.month}</TableCell>
                    <TableCell>{record.year}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpen(record)}
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(record._id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedRecord ? 'Edit Salary Record' : 'Add Salary Record'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              select
              label="Employee"
              name="employee"
              value={formData.employee}
              onChange={handleInputChange}
              fullWidth
              required
            >
              {employees.map((emp) => (
                <MenuItem key={emp._id} value={emp._id}>
                  {emp.name} ({emp.department?.name || '-'})
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Basic Salary"
              name="basicSalary"
              type="number"
              value={formData.basicSalary}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              label="Allowances"
              name="allowances"
              type="number"
              value={formData.allowances}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Deductions"
              name="deductions"
              type="number"
              value={formData.deductions}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Net Salary"
              name="netSalary"
              type="number"
              value={formData.netSalary}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              fullWidth
            >
              <MenuItem value="Paid">Paid</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Failed">Failed</MenuItem>
            </TextField>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Payment Date"
                value={formData.paymentDate}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
            <TextField
              label="Month"
              name="month"
              type="number"
              value={formData.month}
              onChange={handleInputChange}
              fullWidth
              inputProps={{ min: 1, max: 12 }}
              required
            />
            <TextField
              label="Year"
              name="year"
              type="number"
              value={formData.year}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {selectedRecord ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Payroll; 