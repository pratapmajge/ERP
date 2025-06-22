const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const { createProgress, updateProgress, getProgressForManager, getProgressForEmployee } = require('../controllers/progressController');

// Create a new progress/task (manager only)
router.post('/', auth, authorize('manager'), createProgress);

// Update a progress/task (manager only)
router.put('/:id', auth, authorize('manager'), updateProgress);

// Get all progress for manager's employees (manager only)
router.get('/', auth, authorize('manager'), getProgressForManager);

// Get all progress for the logged-in employee (employee only)
router.get('/employee', auth, authorize('employee'), getProgressForEmployee);

module.exports = router; 