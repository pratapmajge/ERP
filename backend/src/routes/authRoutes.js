const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const {
  register,
  login,
  getProfile,
  updateProfile,
  registerRequest,
  listRegistrationRequests,
  approveRegistrationRequest,
  rejectRegistrationRequest
} = require('../controllers/authController');

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Get user profile
router.get('/profile', auth, getProfile);

// Update user profile
router.put('/profile', auth, updateProfile);

// Registration request (public)
router.post('/register-request', registerRequest);

// Admin: list, approve, reject registration requests
router.get('/registration-requests', auth, authorize('admin'), listRegistrationRequests);
router.post('/registration-requests/:id/approve', auth, authorize('admin'), approveRegistrationRequest);
router.post('/registration-requests/:id/reject', auth, authorize('admin'), rejectRegistrationRequest);

module.exports = router; 