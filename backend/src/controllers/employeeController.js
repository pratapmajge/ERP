const Employee = require('../models/Employee');
const User = require('../models/User');
const crypto = require('crypto');

// Generate a random password
const generatePassword = () => {
  return crypto.randomBytes(4).toString('hex'); // 8 character password
};

// Create a new employee
exports.createEmployee = async (req, res) => {
  try {
    // Convert joinDate string to Date object if provided
    const employeeData = { ...req.body };
    if (employeeData.joinDate) {
      employeeData.joinDate = new Date(employeeData.joinDate);
    }

    // Remove file upload logic
    // Do not set profilePhoto

    const employee = new Employee(employeeData);
    await employee.save();
    
    // Create user account for the employee
    const defaultPassword = generatePassword();
    const user = new User({
      name: employee.name,
      email: employee.email,
      password: defaultPassword,
      role: 'employee'
    });
    await user.save();
    
    // Populate department for response
    await employee.populate('department');
    
    res.status(201).json({
      employee,
      userCredentials: {
        email: employee.email,
        password: defaultPassword,
        message: 'Employee account created. Default password provided.'
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate('department');
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate('department');
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update employee
exports.updateEmployee = async (req, res) => {
  try {
    // Convert joinDate string to Date object if provided
    const updateData = { ...req.body };
    if (updateData.joinDate) {
      updateData.joinDate = new Date(updateData.joinDate);
    }
    
    const employee = await Employee.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    ).populate('department');
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    // Update user account if email changed
    if (updateData.email) {
      await User.findOneAndUpdate(
        { email: employee.email },
        { 
          name: employee.name,
          email: employee.email 
        }
      );
    }
    
    res.status(200).json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete employee
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    // Delete associated user account
    await User.findOneAndDelete({ email: employee.email });
    
    // Delete employee
    await Employee.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: 'Employee and associated account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset employee password
exports.resetPassword = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    const newPassword = generatePassword();
    
    // Find user and update password to trigger pre-save middleware
    const user = await User.findOne({ email: employee.email });
    if (!user) {
      return res.status(404).json({ message: 'User account not found' });
    }
    
    user.password = newPassword;
    await user.save(); // This will trigger the pre-save middleware to hash the password
    
    res.status(200).json({
      message: 'Password reset successfully',
      newPassword,
      email: employee.email
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get employee password (admin only)
exports.getEmployeePassword = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    // Get user account
    const user = await User.findOne({ email: employee.email });
    if (!user) {
      return res.status(404).json({ message: 'User account not found' });
    }
    
    // Generate a new password for admin to see
    const newPassword = generatePassword();
    
    // Update user password
    user.password = newPassword;
    await user.save(); // This will trigger the pre-save middleware to hash the password
    
    res.status(200).json({
      message: 'New password generated successfully',
      email: employee.email,
      password: newPassword
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 