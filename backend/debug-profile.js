const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import models
const User = require('./src/models/User');
const Employee = require('./src/models/Employee');
const Department = require('./src/models/Department');

async function debugProfile() {
  try {
    console.log('Debugging profile data...');
    
    // Get all users
    const users = await User.find({});
    console.log(`Found ${users.length} users:`);
    
    for (const user of users) {
      console.log(`\nUser: ${user.name} (${user.email})`);
      console.log(`Role: ${user.role}`);
      
      // For employees, get employee data
      if (user.role === 'employee') {
        const employee = await Employee.findOne({ email: user.email }).populate('department');
        if (employee) {
          console.log('Employee data:');
          console.log(`  Phone: ${employee.phone}`);
          console.log(`  Position: ${employee.position}`);
          console.log(`  Department: ${employee.department?.name || 'N/A'}`);
          console.log(`  Salary: ${employee.salary} (type: ${typeof employee.salary})`);
          console.log(`  Address: ${employee.address}`);
          console.log(`  Join Date: ${employee.joinDate}`);
        } else {
          console.log('  No employee record found!');
        }
      }
    }
    
    console.log('\nDebug completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error debugging profile:', error);
    process.exit(1);
  }
}

debugProfile(); 