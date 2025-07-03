const mongoose = require('mongoose');

const registrationRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'hr', 'manager', 'employee'],
    default: 'employee'
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  address: {
    type: String,
    trim: true,
    default: ''
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    default: null
  },
  position: {
    type: String,
    trim: true,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminNote: {
    type: String,
    trim: true,
    default: ''
  }
});

module.exports = mongoose.model('RegistrationRequest', registrationRequestSchema); 