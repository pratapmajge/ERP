const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

// Create a new attendance record
exports.createAttendance = async (req, res) => {
  try {
    const attendance = new Attendance(req.body);
    await attendance.save();
    await attendance.populate('employee', 'name email department');
    res.status(201).json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all attendance records with employee details
exports.getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate({
        path: 'employee',
        populate: { path: 'department', select: 'name' }
      })
      .sort({ date: -1 });
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get attendance by ID
exports.getAttendanceById = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id)
      .populate({
        path: 'employee',
        populate: { path: 'department', select: 'name' }
      });
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check in employee
exports.checkIn = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if attendance record already exists for today
    let attendance = await Attendance.findOne({
      employee: employeeId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (attendance) {
      if (attendance.checkIn) {
        return res.status(400).json({ message: 'Already checked in today' });
      }
      attendance.checkIn = new Date();
      attendance.status = 'present';
      await attendance.save();
    } else {
      attendance = new Attendance({
        employee: employeeId,
        date: today,
        checkIn: new Date(),
        status: 'present'
      });
      await attendance.save();
    }

    await attendance.populate('employee', 'name email department');
    res.status(200).json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Check out employee
exports.checkOut = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const attendance = await Attendance.findOne({
      employee: employeeId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (!attendance) {
      return res.status(404).json({ message: 'No check-in record found for today' });
    }

    if (attendance.checkOut) {
      return res.status(400).json({ message: 'Already checked out today' });
    }

    attendance.checkOut = new Date();
    await attendance.save();
    await attendance.populate('employee', 'name email department');
    res.status(200).json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get attendance by employee
exports.getAttendanceByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const attendance = await Attendance.find({ employee: employeeId })
      .populate({
        path: 'employee',
        populate: { path: 'department', select: 'name' }
      })
      .sort({ date: -1 });
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update attendance
exports.updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    ).populate('employee', 'name email department');
    
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.status(200).json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete attendance
exports.deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.status(200).json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Haversine formula to calculate distance between two lat/lng points in meters
function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Radius of the earth in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    0.5 - Math.cos(dLat)/2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    (1 - Math.cos(dLon))/2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

// POST /api/attendance/auto-geolocation
exports.autoGeolocationAttendance = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const user = req.user;
    if (user.role !== 'employee') {
      return res.status(403).json({ message: 'Only employees can mark attendance using geolocation.' });
    }
    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required.' });
    }
    // Office location
    const officeLat = 18.432941423854608;
    const officeLng = 73.88695388098188;
    const maxDistance = 6000; // meters (temporarily increased for testing)
    const distance = getDistanceFromLatLonInMeters(lat, lng, officeLat, officeLng);
    console.log('User location:', lat, lng);
    console.log('Office location:', officeLat, officeLng);
    console.log('Calculated distance (meters):', distance);
    if (distance > maxDistance) {
      return res.status(403).json({ message: 'You are not within the allowed office area.' });
    }
    // Find employee by email
    const employee = await Employee.findOne({ email: user.email });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found.' });
    }
    // Check if already marked today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let attendance = await Attendance.findOne({
      employee: employee._id,
      date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
    });
    if (attendance) {
      return res.status(200).json({ message: 'Attendance already marked for today.' });
    }
    // Check time for status
    const now = new Date();
    const hour = now.getHours();
    let status = 'present';
    if (hour >= 13) {
      // After 1PM, do not allow marking, mark as absent if not already present
      // Check if already absent for today
      let absentRecord = await Attendance.findOne({
        employee: employee._id,
        date: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
        status: 'absent'
      });
      if (!absentRecord) {
        absentRecord = new Attendance({
          employee: employee._id,
          date: today,
          status: 'absent'
        });
        await absentRecord.save();
      }
      return res.status(403).json({ message: "You can't mark attendance due to exceeded time. You are marked absent for today." });
    } else if (hour >= 10) {
      status = 'late';
    } else {
      status = 'present';
    }
    // Mark attendance
    attendance = new Attendance({
      employee: employee._id,
      date: today,
      checkIn: now,
      status
    });
    await attendance.save();
    await attendance.populate('employee', 'name email department');
    res.status(201).json({ message: `Attendance marked as ${status}.`, attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 