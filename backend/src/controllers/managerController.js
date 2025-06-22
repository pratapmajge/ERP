const Manager = require('../models/Manager');
const User = require('../models/User');
const crypto = require('crypto');

// Generate a random password
const generatePassword = () => {
  return crypto.randomBytes(4).toString('hex'); // 8 character password
};

// Create a new manager
exports.createManager = async (req, res) => {
  try {
    // Convert joinDate string to Date object if provided
    const managerData = { ...req.body };
    if (managerData.joinDate) {
      managerData.joinDate = new Date(managerData.joinDate);
    }

    const manager = new Manager(managerData);
    await manager.save();
    
    // Create user account for the manager
    const defaultPassword = generatePassword();
    const user = new User({
      name: manager.name,
      email: manager.email,
      password: defaultPassword,
      role: 'manager'
    });
    await user.save();
    
    // Populate department for response
    await manager.populate('department');
    
    res.status(201).json({
      manager,
      userCredentials: {
        email: manager.email,
        password: defaultPassword,
        message: 'Manager account created. Default password provided.'
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all managers
exports.getAllManagers = async (req, res) => {
  try {
    console.log('🔵 [getAllManagers] /api/managers GET endpoint was called');
    const managers = await Manager.find().populate('department');
    res.status(200).json(managers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset manager password
exports.resetManagerPassword = async (req, res) => {
  try {
    const manager = await Manager.findById(req.params.id);
    if (!manager) {
      return res.status(404).json({ message: 'Manager not found' });
    }
    const newPassword = require('crypto').randomBytes(4).toString('hex');
    const user = await User.findOne({ email: manager.email });
    if (!user) {
      return res.status(404).json({ message: 'User account not found' });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({
      message: 'Password reset successfully',
      newPassword,
      email: manager.email
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update manager
exports.updateManager = async (req, res) => {
  try {
    const manager = await Manager.findById(req.params.id);
    if (!manager) {
      return res.status(404).json({ message: 'Manager not found' });
    }
    // Update manager fields
    Object.assign(manager, req.body);
    await manager.save();
    // Update user account
    await User.findOneAndUpdate(
      { email: manager.email },
      {
        name: manager.name,
        email: manager.email
      }
    );
    res.status(200).json(manager);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete manager
exports.deleteManager = async (req, res) => {
  try {
    const manager = await Manager.findById(req.params.id);
    if (!manager) {
      return res.status(404).json({ message: 'Manager not found' });
    }
    // Delete user account
    await User.findOneAndDelete({ email: manager.email });
    // Delete manager
    await Manager.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Manager and associated account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a simplified list of managers for dropdowns
exports.getManagersList = async (req, res) => {
  try {
    const managers = await User.find({ role: 'manager' }).select('name _id');
    res.status(200).json(managers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching managers list' });
  }
}; 