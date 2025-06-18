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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

// Sample data - replace with API calls later
const initialAttendance = [
  {
    id: 1,
    employeeName: 'John Doe',
    date: '2024-03-20',
    checkIn: '09:00',
    checkOut: '18:00',
    status: 'Present',
    department: 'IT',
  },
  {
    id: 2,
    employeeName: 'Jane Smith',
    date: '2024-03-20',
    checkIn: '09:15',
    checkOut: '18:30',
    status: 'Present',
    department: 'HR',
  },
  {
    id: 3,
    employeeName: 'Mike Johnson',
    date: '2024-03-20',
    checkIn: '10:00',
    checkOut: '19:00',
    status: 'Late',
    department: 'Finance',
  },
  {
    id: 4,
    employeeName: 'Sarah Williams',
    date: '2024-03-20',
    checkIn: null,
    checkOut: null,
    status: 'Absent',
    department: 'Marketing',
  },
];

const StatusChip = ({ status }) => {
  const theme = useTheme();
  const getStatusColor = () => {
    switch (status) {
      case 'Present':
        return theme.palette.success.main;
      case 'Late':
        return theme.palette.warning.main;
      case 'Absent':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'Present':
        return <CheckCircleIcon fontSize="small" />;
      case 'Late':
        return <AccessTimeIcon fontSize="small" />;
      case 'Absent':
        return <CancelIcon fontSize="small" />;
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

const Attendance = () => {
  const [attendance, setAttendance] = useState(initialAttendance);
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
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
    setAttendance(attendance.filter((record) => record.id !== id));
  };

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
            Attendance
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
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
                Add Record
              </Button>
            </motion.div>
          </Box>
        </Box>
      </motion.div>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee Name</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Check In</TableCell>
                  <TableCell>Check Out</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendance.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.employeeName}</TableCell>
                    <TableCell>{record.department}</TableCell>
                    <TableCell>{record.checkIn || '-'}</TableCell>
                    <TableCell>{record.checkOut || '-'}</TableCell>
                    <TableCell>
                      <StatusChip status={record.status} />
                    </TableCell>
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
          {selectedRecord ? 'Edit Attendance Record' : 'Add Attendance Record'}
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
              label="Check In"
              type="time"
              fullWidth
              defaultValue={selectedRecord?.checkIn}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Check Out"
              type="time"
              fullWidth
              defaultValue={selectedRecord?.checkOut}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              select
              label="Status"
              fullWidth
              defaultValue={selectedRecord?.status || 'Present'}
            >
              <MenuItem value="Present">Present</MenuItem>
              <MenuItem value="Late">Late</MenuItem>
              <MenuItem value="Absent">Absent</MenuItem>
            </TextField>
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

export default Attendance; 