const Department = require('../models/Department');
const Employee = require('../models/Employee');

// Create a new department
exports.createDepartment = async (req, res) => {
  try {
    if (req.body.manager === "") req.body.manager = null;
    const department = new Department(req.body);
    await department.save();
    await department.populate('manager', 'name email');
    res.status(201).json(department);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all departments with employee count and manager info
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate('manager', 'name email');
    
    // Get employee count for each department
    const departmentsWithCount = await Promise.all(
      departments.map(async (dept) => {
        const employeeCount = await Employee.countDocuments({ department: dept._id });
        return {
          ...dept.toObject(),
          employeeCount
        };
      })
    );
    
    res.status(200).json(departmentsWithCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get department by ID with employee count and manager info
exports.getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id).populate('manager', 'name email');
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    
    // Get employee count for this department
    const employeeCount = await Employee.countDocuments({ department: req.params.id });
    
    res.status(200).json({
      ...department.toObject(),
      employeeCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update department
exports.updateDepartment = async (req, res) => {
  try {
    if (req.body.manager === "") req.body.manager = null;
    const department = await Department.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    ).populate('manager', 'name email');
    
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.status(200).json(department);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete department
exports.deleteDepartment = async (req, res) => {
  try {
    // Check if department has employees
    const employeeCount = await Employee.countDocuments({ department: req.params.id });
    if (employeeCount > 0) {
      return res.status(400).json({ 
        message: `Cannot delete department. It has ${employeeCount} employee(s) assigned.` 
      });
    }
    
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.status(200).json({ message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 