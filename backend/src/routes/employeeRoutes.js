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
  getEmployeePassword,
  getEmployeesByManager
} = require('../controllers/employeeController');

console.log('>>> employeeRoutes.js loaded');

// Create a new employee (admin only)
router.post('/', auth, authorize('admin'), createEmployee);

// Get all employees (admin, hr)
router.get('/', auth, authorize('admin', 'hr'), getAllEmployees);

// Get employees assigned to the logged-in manager
router.get('/assigned', (req, res, next) => {
  console.log('>>> /api/employees/assigned route hit');
  next();
}, auth, getEmployeesByManager);

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