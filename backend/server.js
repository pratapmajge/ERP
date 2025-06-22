console.log('>>> server.js loaded at', __filename);
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./src/config/database');
const routes = require('./src/routes');
const cron = require('node-cron');
const Employee = require('./src/models/Employee');
const Attendance = require('./src/models/Attendance');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api', routes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to ERP System API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Scheduled job for marking absentees
cron.schedule('0 18 * * *', async () => {
  console.log('Running daily check for absent employees...');
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const employees = await Employee.find();
    
    for (const employee of employees) {
      const attendance = await Attendance.findOne({
        employee: employee._id,
        date: { $gte: today }
      });

      if (!attendance) {
        // Mark as absent
        await Attendance.create({
          employee: employee._id,
          status: 'Absent'
        });
        console.log(`Marked ${employee.name} as absent.`);
      }
    }
  } catch (error) {
    console.error('Error in daily absentee check:', error);
  }
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 