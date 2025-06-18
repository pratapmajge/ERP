import React, { useState } from 'react';
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

// Sample data - replace with API calls later
const initialPayroll = [
  {
    id: 1,
    employeeName: 'John Doe',
    department: 'IT',
    basicSalary: 5000,
    allowances: 1000,
    deductions: 500,
    netSalary: 5500,
    status: 'Paid',
    paymentDate: '2024-03-15',
  },
  {
    id: 2,
    employeeName: 'Jane Smith',
    department: 'HR',
    basicSalary: 4500,
    allowances: 800,
    deductions: 400,
    netSalary: 4900,
    status: 'Pending',
    paymentDate: null,
  },
  {
    id: 3,
    employeeName: 'Mike Johnson',
    department: 'Finance',
    basicSalary: 5500,
    allowances: 1200,
    deductions: 600,
    netSalary: 6100,
    status: 'Paid',
    paymentDate: '2024-03-15',
  },
  {
    id: 4,
    employeeName: 'Sarah Williams',
    department: 'Marketing',
    basicSalary: 4800,
    allowances: 900,
    deductions: 450,
    netSalary: 5250,
    status: 'Pending',
    paymentDate: null,
  },
];

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
  const [payroll, setPayroll] = useState(initialPayroll);
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const theme = useTheme();

  const handleOpen = (record = null) => {
    setSelectedRecord(record);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedRecord(null);
    setOpen(false);
  };

  const handleDelete = (id) => {
    setPayroll(payroll.filter((record) => record.id !== id));
  };

  // Calculate summary statistics
  const totalSalary = payroll.reduce((sum, record) => sum + record.netSalary, 0);
  const pendingSalary = payroll
    .filter((record) => record.status === 'Pending')
    .reduce((sum, record) => sum + record.netSalary, 0);
  const paidSalary = payroll
    .filter((record) => record.status === 'Paid')
    .reduce((sum, record) => sum + record.netSalary, 0);

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
                onChange={(newValue) => setSelectedMonth(newValue)}
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
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payroll.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.employeeName}</TableCell>
                    <TableCell>{record.department}</TableCell>
                    <TableCell>${record.basicSalary}</TableCell>
                    <TableCell>${record.allowances}</TableCell>
                    <TableCell>${record.deductions}</TableCell>
                    <TableCell>${record.netSalary}</TableCell>
                    <TableCell>
                      <StatusChip status={record.status} />
                    </TableCell>
                    <TableCell>{record.paymentDate || '-'}</TableCell>
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
                        onClick={() => handleDelete(record.id)}
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
              label="Employee Name"
              fullWidth
              defaultValue={selectedRecord?.employeeName}
            />
            <TextField
              label="Department"
              fullWidth
              defaultValue={selectedRecord?.department}
            />
            <TextField
              label="Basic Salary"
              type="number"
              fullWidth
              defaultValue={selectedRecord?.basicSalary}
            />
            <TextField
              label="Allowances"
              type="number"
              fullWidth
              defaultValue={selectedRecord?.allowances}
            />
            <TextField
              label="Deductions"
              type="number"
              fullWidth
              defaultValue={selectedRecord?.deductions}
            />
            <TextField
              select
              label="Status"
              fullWidth
              defaultValue={selectedRecord?.status || 'Pending'}
            >
              <MenuItem value="Paid">Paid</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Failed">Failed</MenuItem>
            </TextField>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Payment Date"
                value={selectedRecord?.paymentDate ? new Date(selectedRecord.paymentDate) : null}
                onChange={(newValue) => {}}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleClose}>
            {selectedRecord ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Payroll; 