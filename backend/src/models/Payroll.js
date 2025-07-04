const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please specify a user']
  },
  month: {
    type: Number,
    required: [true, 'Please provide a month (1-12)'],
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: [true, 'Please provide a year']
  },
  basicSalary: {
    type: Number,
    required: [true, 'Please provide basic salary']
  },
  allowances: {
    type: Number,
    default: 0
  },
  deductions: {
    type: Number,
    default: 0
  },
  netSalary: {
    type: Number,
    required: [true, 'Please provide net salary']
  },
  status: {
    type: String,
    enum: ['Paid', 'Pending', 'Failed'],
    default: 'Pending',
  },
  paymentDate: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Payroll', payrollSchema); 