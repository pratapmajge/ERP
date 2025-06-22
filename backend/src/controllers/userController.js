const User = require('../models/User');

// Get all users who can be paid (employees and managers)
exports.getPayees = async (req, res) => {
  try {
    const payees = await User.find({ role: { $in: ['employee', 'manager'] } })
      .select('name role');
    res.status(200).json(payees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 