const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  resetPassword,
  getEmployeePassword
} = require('../controllers/employeeController');

// Create a new employee (admin only)
router.post('/', auth, authorize('admin'), createEmployee);

// Get all employees (admin, hr)
router.get('/', auth, authorize('admin', 'hr'), getAllEmployees);

// Get employee by ID (admin, hr)
router.get('/:id', auth, authorize('admin', 'hr'), getEmployeeById);

// Update employee (admin only)
router.put('/:id', auth, authorize('admin'), updateEmployee);

// Delete employee (admin only)
router.delete('/:id', auth, authorize('admin'), deleteEmployee);

// Reset employee password (admin only)
router.post('/:id/reset-password', auth, authorize('admin'), resetPassword);

// Get employee password (admin only)
router.get('/:id/password', auth, authorize('admin'), getEmployeePassword);

module.exports = router; 