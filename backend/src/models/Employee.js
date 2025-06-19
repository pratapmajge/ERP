const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: [true, 'Please specify department']
  },
  position: {
    type: String,
    required: [true, 'Please provide a position'],
    trim: true
  },
  joinDate: {
    type: Date,
    required: [true, 'Please provide join date']
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true,
    default: ''
  },
  salary: {
    type: Number,
    required: [true, 'Please provide a salary']
  },
  role: {
    type: String,
    enum: ['admin', 'hr', 'employee'],
    default: 'employee'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  profilePhoto: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model('Employee', employeeSchema); 