const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  createAttendance,
  getAllAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
  checkIn,
  checkOut,
  getAttendanceByEmployee
} = require('../controllers/attendanceController');

// Create a new attendance record (admin, hr)
router.post('/', auth, authorize('admin', 'hr'), createAttendance);

// Get all attendance records (admin, hr)
router.get('/', auth, authorize('admin', 'hr'), getAllAttendance);

// Check in employee (employee can check themselves in)
router.post('/checkin', auth, checkIn);

// Check out employee (employee can check themselves out)
router.post('/checkout', auth, checkOut);

// Get attendance by employee ID (admin, hr, or employee for their own)
router.get('/employee/:employeeId', auth, getAttendanceByEmployee);

// Get attendance by ID (admin, hr)
router.get('/:id', auth, authorize('admin', 'hr'), getAttendanceById);

// Update attendance (admin, hr)
router.put('/:id', auth, authorize('admin', 'hr'), updateAttendance);

// Delete attendance (admin only)
router.delete('/:id', auth, authorize('admin'), deleteAttendance);

module.exports = router; 