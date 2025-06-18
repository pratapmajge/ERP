const express = require('express');
const router = express.Router();
const employeeRoutes = require('./employeeRoutes');
const departmentRoutes = require('./departmentRoutes');
const attendanceRoutes = require('./attendanceRoutes');
const payrollRoutes = require('./payrollRoutes');
const authRoutes = require('./authRoutes');

// Authentication routes
router.use('/auth', authRoutes);

// Employee routes
router.use('/employees', employeeRoutes);

// Department routes
router.use('/departments', departmentRoutes);

// Attendance routes
router.use('/attendance', attendanceRoutes);

// Payroll routes
router.use('/payroll', payrollRoutes);

module.exports = router; 