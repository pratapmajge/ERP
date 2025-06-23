const Payroll = require('../models/Payroll');

// Create a new payroll record
exports.createPayroll = async (req, res) => {
  try {
    const payrollData = { ...req.body };
    console.log('[PayrollController] Creating payroll with data:', payrollData);
    
    if (!payrollData.employee) {
      throw new Error('Employee ID is required');
    }

    // Validate that the employee exists
    const User = require('../models/User');
    const employee = await User.findById(payrollData.employee);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const payroll = new Payroll(payrollData);
    await payroll.save();
    console.log('[PayrollController] Created payroll:', payroll);
    
    res.status(201).json(payroll);
  } catch (error) {
    console.error('[PayrollController] Error creating payroll:', error);
    res.status(400).json({ message: error.message });
  }
};

// Get all payroll records
exports.getAllPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.find()
      .populate('employee', 'name');
    res.status(200).json(payrolls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get payroll by ID
exports.getPayrollById = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id)
      .populate('employee', 'name');
    if (!payroll) {
      return res.status(404).json({ message: 'Payroll record not found' });
    }
    res.status(200).json(payroll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update payroll
exports.updatePayroll = async (req, res) => {
  try {
    const updateData = { ...req.body };
    const payroll = await Payroll.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!payroll) {
      return res.status(404).json({ message: 'Payroll record not found' });
    }
    res.status(200).json(payroll);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete payroll
exports.deletePayroll = async (req, res) => {
  try {
    const payroll = await Payroll.findByIdAndDelete(req.params.id);
    if (!payroll) {
      return res.status(404).json({ message: 'Payroll record not found' });
    }
    res.status(200).json({ message: 'Payroll record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get payroll records for a specific employee or the logged-in user
exports.getPayrollByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const userId = employeeId || req.user.id;
    console.log('[PayrollController] Searching for payroll with employeeId:', userId);

    // Validate that the employee exists
    const User = require('../models/User');
    const employee = await User.findById(userId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const filter = { employee: userId };
    console.log('[PayrollController] Using filter:', filter);

    const payrolls = await Payroll.find(filter)
      .populate('employee', 'name email')
      .sort({ year: -1, month: -1 });

    console.log('[PayrollController] Found payrolls:', payrolls);

    res.status(200).json(payrolls);
  } catch (error) {
    console.error('[PayrollController] Error:', error);
    res.status(500).json({ message: error.message });
  }
}; 