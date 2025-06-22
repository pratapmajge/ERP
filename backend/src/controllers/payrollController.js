const Payroll = require('../models/Payroll');

// Create a new payroll record
exports.createPayroll = async (req, res) => {
  try {
    const payrollData = { ...req.body };
    // If status or paymentDate are not provided, defaults will be used by the model
    const payroll = new Payroll(payrollData);
    await payroll.save();
    res.status(201).json(payroll);
  } catch (error) {
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
    const userId = employeeId || req.user.id; // Use param ID or fallback to logged-in user's ID
    const { month, year } = req.query;

    const filter = { employee: userId };
    if (month) filter.month = Number(month);
    if (year) filter.year = Number(year);

    const payrolls = await Payroll.find(filter)
      .populate('employee', 'name')
      .sort({ year: -1, month: -1 }); // Sort by most recent first

    res.status(200).json(payrolls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 