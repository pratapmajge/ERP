const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment
} = require('../controllers/departmentController');

// Create a new department (admin only)
router.post('/', auth, authorize('admin'), createDepartment);

// Get all departments (admin, hr)
router.get('/', auth, authorize('admin', 'hr'), getAllDepartments);

// Get department by ID (admin, hr)
router.get('/:id', auth, authorize('admin', 'hr'), getDepartmentById);

// Update department (admin only)
router.put('/:id', auth, authorize('admin'), updateDepartment);

// Delete department (admin only)
router.delete('/:id', auth, authorize('admin'), deleteDepartment);

module.exports = router; 