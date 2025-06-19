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

    // Generate token
    const token = generateToken(user._id);

    res.json({
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

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    // For employees, get additional data from Employee collection
    if (user.role === 'employee') {
      const employee = await Employee.findOne({ email: user.email }).populate('department');
      if (employee) {
        const profileData = {
          ...user.toObject(),
          phone: employee.phone,
          position: employee.position,
          department: employee.department?.name || '',
          salary: employee.salary,
          joinDate: employee.joinDate,
          address: employee.address,
          profilePhoto: employee.profilePhoto
        };
        console.log('Profile data for employee:', profileData); // Debug log
        return res.json(profileData);
      }
    }
    
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update current user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    
    // Update user basic info
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name },
      { new: true, runValidators: true }
    ).select('-password');
    
    // For employees, update employee data
    if (user.role === 'employee') {
      const updateData = {
        phone: phone,
        address: address
      };

      console.log('--- DEBUG: Incoming updateProfile fields ---');
      console.log('phone:', phone, typeof phone);
      console.log('address:', address, typeof address);
      console.log('Full updateData:', updateData);

      console.log('Attempting to update Employee with:', updateData);
      const beforeEmployee = await Employee.findOne({ email: user.email });
      console.log('Employee before update:', beforeEmployee);

      if (Object.keys(updateData).length > 0) {
        await Employee.findOneAndUpdate(
          { email: user.email },
          { $set: updateData },
          { new: true, runValidators: true, upsert: true }
        );
      }

      const afterEmployee = await Employee.findOne({ email: user.email });
      console.log('Employee after update:', afterEmployee);
      // Get updated employee data
      const employee = await Employee.findOne({ email: user.email }).populate('department');
      if (employee) {
        const updatedProfileData = {
          ...user.toObject(),
          phone: employee.phone,
          position: employee.position,
          department: employee.department?.name || '',
          salary: employee.salary,
          joinDate: employee.joinDate,
          address: employee.address,
          profilePhoto: employee.profilePhoto
        };
        console.log('Updated profile data for employee:', updatedProfileData); // Debug log
        return res.json(updatedProfileData);
      }
    }
    
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 