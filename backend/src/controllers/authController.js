const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Employee = require('../models/Employee');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Register new user (only for admin/HR registration)
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'employee' // Default role is employee
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login user with employee verification
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // For employees, check if they exist in the Employee collection
    if (user.role === 'employee') {
      const employee = await Employee.findOne({ email: user.email });
      if (!employee) {
        return res.status(403).json({ 
          message: 'You are not registered by admin. Please contact your administrator to be added to the system.' 
        });
      }
    }

    // Update lastLogin
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      lastLogin: user.lastLogin,
      token
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    let user = await User.findById(req.user._id).select('-password').populate('department');

    if (user.role === 'employee') {
      const employee = await Employee.findOne({ email: user.email }).populate('department').populate('manager');
      if (employee) {
        // For employees, the Employee record is the source of truth for these details.
        const profileData = {
          ...user.toObject(),
          employeeId: employee._id,
          phone: employee.phone,
          position: employee.position,
          department: employee.department, // This now comes populated
          manager: employee.manager,
          salary: employee.salary,
          joinDate: employee.joinDate,
          address: employee.address,
        };
        return res.json(profileData);
      }
    }
    
    // For non-employees, the User record is the source of truth.
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update current user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address, department, position, salary } = req.body;
    
    // Consolidate update data
    const updateData = { name, phone, address, department, position, salary };

    // Update user basic info on the main User model for everyone
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    // If the user is also an employee, sync changes to the separate Employee record
    if (user.role === 'employee') {
      await Employee.findOneAndUpdate(
        { email: user.email },
        { $set: updateData },
        { new: true, runValidators: true }
      );
    }
    
    // After updating, refetch the complete profile to ensure consistency
    let finalUser = await User.findById(req.user._id).select('-password').populate('department');

    if (finalUser.role === 'employee') {
      const employee = await Employee.findOne({ email: finalUser.email }).populate('department').populate('manager');
      if (employee) {
        const profileData = {
          ...finalUser.toObject(),
          employeeId: employee._id,
          phone: employee.phone,
          position: employee.position,
          department: employee.department,
          manager: employee.manager,
          salary: employee.salary,
          joinDate: employee.joinDate,
          address: employee.address,
        };
        return res.json(profileData);
      }
    }

    res.json(finalUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 