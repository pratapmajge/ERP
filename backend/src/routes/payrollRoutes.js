const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  createPayroll,
  getAllPayrolls,
  getPayrollById,
  updatePayroll,
  deletePayroll,
  getPayrollByEmployee
} = require('../controllers/payrollController');

// Create a new payroll record (admin only)
router.post('/', auth, authorize('admin'), createPayroll);

// Get all payroll records (admin, hr)
router.get('/', auth, authorize('admin', 'hr'), getAllPayrolls);

// Get payroll by ID (admin, hr)
router.get('/:id', auth, authorize('admin', 'hr'), getPayrollById);

// Update payroll (admin only)
router.put('/:id', auth, authorize('admin'), updatePayroll);

// Delete payroll (admin only)
router.delete('/:id', auth, authorize('admin'), deletePayroll);

// Get payroll records for a specific employee (admin, hr, or the employee themselves)
router.get('/employee/:employeeId', auth, getPayrollByEmployee);

module.exports = router; 