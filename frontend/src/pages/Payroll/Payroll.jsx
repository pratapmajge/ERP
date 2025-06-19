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
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AttachMoney as MoneyIcon,
  Receipt as ReceiptIcon,
  AccountBalance as BankIcon,
  Search as SearchIcon,
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
  const [searchTerm, setSearchTerm] = useState('');
  const theme = useTheme();
  const user = getUser();
  const isEmployee = user?.role === 'employee';

  useEffect(() => {
    if (isEmployee) {
      console.log('[Payroll] Employee user._id:', user?._id);
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
      const employeeId = user.employeeId || user._id;
      const apiUrl = `http://localhost:5001/api/payroll/employee/${employeeId}?month=${month}&year=${year}`;
      console.log('[Payroll][DEBUG] employeeId:', employeeId);
      console.log('[Payroll][DEBUG] API URL:', apiUrl);
      const response = await fetch(apiUrl, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        console.log('[Payroll][DEBUG] API response:', data);
        setPayroll(data);
      } else {
        console.log('[Payroll][DEBUG] API error:', response.status);
      }
    } catch (error) {
      console.error('[Payroll][DEBUG] Error fetching employee payroll:', error);
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

  // Filter payroll records by employee name or department name
  const filteredPayroll = payroll.filter(record => {
    const empName = record.employee?.name || '';
    const dept = record.employee?.department?.name || '';
    const term = searchTerm.toLowerCase();
    return (
      empName.toLowerCase().includes(term) ||
      dept.toLowerCase().includes(term)
    );
  });

  if (isEmployee) {
    // Employee view: show all payroll records (history) as cards
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
          My Payroll History
        </Typography>
        {payroll.length > 0 ? (
          <>
            {/* Desktop/Tablet Grid */}
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Grid container spacing={3} justifyContent="center">
                {payroll.map((record) => (
                  <Grid item sm={6} md={4} key={record._id}>
                    <Card sx={{ borderRadius: 4, boxShadow: 3, p: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <StatusChip status={record.status} />
                          <Typography variant="h6" sx={{ ml: 2, fontWeight: 'bold' }}>
                            {record.status}
                          </Typography>
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'success.main', mb: 1 }}>
                          ${record.netSalary}
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="body2">Basic Salary: <b>${record.basicSalary}</b></Typography>
                        <Typography variant="body2">Allowances: <b>${record.allowances}</b></Typography>
                        <Typography variant="body2">Deductions: <b>${record.deductions}</b></Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>Payment Date: {record.paymentDate ? new Date(record.paymentDate).toLocaleDateString() : '-'}</Typography>
                        <Typography variant="body2">Month: {record.month}</Typography>
                        <Typography variant="body2">Year: {record.year}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
            {/* Mobile Carousel */}
            <Box sx={{ display: { xs: 'flex', sm: 'none' }, overflowX: 'auto', gap: 2, py: 2 }}>
              {payroll.map((record) => (
                <Card key={record._id} sx={{ minWidth: 280, maxWidth: 320, flex: '0 0 auto', borderRadius: 4, boxShadow: 3, p: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <StatusChip status={record.status} />
                      <Typography variant="h6" sx={{ ml: 2, fontWeight: 'bold' }}>
                        {record.status}
                      </Typography>
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'success.main', mb: 1 }}>
                      ${record.netSalary}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2">Basic Salary: <b>${record.basicSalary}</b></Typography>
                    <Typography variant="body2">Allowances: <b>${record.allowances}</b></Typography>
                    <Typography variant="body2">Deductions: <b>${record.deductions}</b></Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>Payment Date: {record.paymentDate ? new Date(record.paymentDate).toLocaleDateString() : '-'}</Typography>
                    <Typography variant="body2">Month: {record.month}</Typography>
                    <Typography variant="body2">Year: {record.year}</Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </>
        ) : (
          <Card sx={{ maxWidth: 400, mx: 'auto', p: 2 }}>
            <CardContent>
              <Typography color="text.secondary" sx={{ fontWeight: 'bold' }}>
                No payroll record found. Please contact admin if you believe this is an error.
              </Typography>
            </CardContent>
          </Card>
        )}
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
        <TextField
          label="Search payrolls"
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
                {filteredPayroll.map((record) => (
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