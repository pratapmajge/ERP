const Progress = require('../models/Progress');
const Employee = require('../models/Employee');

// Create a new progress/task for an employee
exports.createProgress = async (req, res) => {
  try {
    const { employee, project, task, progress, status, dueDate } = req.body;
    // Only allow if the employee is assigned to this manager
    const emp = await Employee.findOne({ _id: employee, manager: req.user._id });
    if (!emp) {
      return res.status(403).json({ message: 'You can only add progress for your assigned employees.' });
    }
    const prog = await Progress.create({ employee, project, task, progress, status, dueDate });
    res.status(201).json(prog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a progress/task
exports.updateProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const progressEntry = await Progress.findById(id).populate('employee');
    if (!progressEntry) {
      return res.status(404).json({ message: 'Progress entry not found' });
    }

    const isManager = String(progressEntry.employee.manager) === String(req.user._id);
    const isOwner = progressEntry.employee.email === req.user.email;

    if (!isManager && !isOwner) {
      return res.status(403).json({ message: 'You are not authorized to update this task.' });
    }

    // Managers can update task details
    if (isManager) {
      const { project, task, dueDate } = req.body;
      if (project !== undefined) progressEntry.project = project;
      if (task !== undefined) progressEntry.task = task;
      if (dueDate !== undefined) progressEntry.dueDate = dueDate;
    }

    // Employees can update their own progress
    if (isOwner) {
      const { progress, status } = req.body;
      if (progress !== undefined) progressEntry.progress = progress;
      if (status !== undefined) progressEntry.status = status;
    }

    await progressEntry.save();
    res.json(progressEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all progress for employees assigned to this manager
exports.getProgressForManager = async (req, res) => {
  try {
    const employees = await Employee.find({ manager: req.user._id }).select('_id');
    const employeeIds = employees.map(emp => emp._id);
    const progress = await Progress.find({ employee: { $in: employeeIds } }).populate('employee', 'name');
    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all progress for the logged-in employee
exports.getProgressForEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOne({ email: req.user.email });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    const progress = await Progress.find({ employee: employee._id }).populate('employee', 'name');
    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employee progress' });
  }
}; 