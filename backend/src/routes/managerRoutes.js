const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const { 
  createManager, 
  getAllManagers, 
  getManagerById, 
  updateManager, 
  deleteManager,
  getManagersList,
  resetManagerPassword
} = require('../controllers/managerController');

// Route to get a simple list of managers (for selection)
router.get('/list', auth, authorize('admin', 'hr'), getManagersList);

// Create a new manager (admin only)
router.post('/', auth, authorize('admin'), createManager);

// Get all managers (admin only)
router.get('/', auth, authorize('admin'), getAllManagers);

// Reset manager password (admin only)
router.post('/:id/reset-password', auth, authorize('admin'), resetManagerPassword);

// Update manager (admin only)
router.put('/:id', auth, authorize('admin'), updateManager);

// Delete manager (admin only)
router.delete('/:id', auth, authorize('admin'), deleteManager);

module.exports = router; 