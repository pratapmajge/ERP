import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Sample data - replace with API calls later
const initialDepartments = [
  {
    id: 1,
    name: 'Information Technology',
    description: 'Handles all IT infrastructure and development',
    employeeCount: 25,
    manager: 'John Doe',
  },
  {
    id: 2,
    name: 'Human Resources',
    description: 'Manages recruitment and employee relations',
    employeeCount: 12,
    manager: 'Jane Smith',
  },
  {
    id: 3,
    name: 'Finance',
    description: 'Handles financial operations and accounting',
    employeeCount: 15,
    manager: 'Mike Johnson',
  },
  {
    id: 4,
    name: 'Marketing',
    description: 'Manages marketing campaigns and brand strategy',
    employeeCount: 18,
    manager: 'Sarah Williams',
  },
];

const DepartmentCard = ({ department, onEdit, onDelete }) => {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          '&:hover': {
            transform: 'translateY(-4px)',
            transition: 'transform 0.3s ease-in-out',
          },
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 2,
            }}
          >
            <Typography variant="h6" component="h2" gutterBottom>
              {department.name}
            </Typography>
            <Box>
              <IconButton
                color="primary"
                onClick={() => onEdit(department)}
                size="small"
                sx={{ mr: 1 }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                color="error"
                onClick={() => onDelete(department.id)}
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, minHeight: '40px' }}
          >
            {department.description}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 1,
            }}
          >
            <PeopleIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {department.employeeCount} Employees
            </Typography>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Chip
              label={`Manager: ${department.manager}`}
              size="small"
              sx={{
                backgroundColor: `${theme.palette.primary.main}15`,
                color: theme.palette.primary.main,
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Departments = () => {
  const [departments, setDepartments] = useState(initialDepartments);
  const [open, setOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const theme = useTheme();

  const handleOpen = (department = null) => {
    setSelectedDepartment(department);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedDepartment(null);
    setOpen(false);
  };

  const handleDelete = (id) => {
    setDepartments(departments.filter((dept) => dept.id !== id));
  };

  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Departments
          </Typography>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpen()}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 3,
              }}
            >
              Add Department
            </Button>
          </motion.div>
        </Box>
      </motion.div>

      <Grid container spacing={3}>
        {departments.map((department) => (
          <Grid item xs={12} sm={6} md={4} key={department.id}>
            <DepartmentCard
              department={department}
              onEdit={handleOpen}
              onDelete={handleDelete}
            />
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedDepartment ? 'Edit Department' : 'Add New Department'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Department Name"
              fullWidth
              defaultValue={selectedDepartment?.name}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              defaultValue={selectedDepartment?.description}
            />
            <TextField
              label="Manager"
              fullWidth
              defaultValue={selectedDepartment?.manager}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleClose}>
            {selectedDepartment ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Departments; 