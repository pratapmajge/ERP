import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Alert,
  useTheme,
  Chip,
  Divider,
  IconButton,
  Paper,
  MenuItem,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  Phone as PhoneIcon,
  AttachMoney as MoneyIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Security as SecurityIcon,
  CalendarToday as CalendarIcon,
  Badge as BadgeIcon,
  CalendarMonth as CalendarMonthIcon,
  Wc as WcIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Profile = () => {
  const theme = useTheme();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('Fetched user data:', userData);
        setUser(userData);
        setFormData({
          name: userData.name || '',
          phone: userData.phone || '',
          address: userData.address || '',
        });
      } else {
        console.error('Failed to fetch user profile');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user.name || '',
      phone: user.phone || '',
      address: user.address || '',
    });
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data);
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        setFormData({
          name: data.name || '',
          phone: data.phone || '',
          address: data.address || '',
        });
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h6" sx={{ color: 'text.secondary' }}>
            Loading your profile...
          </Typography>
        </motion.div>
      </Box>
    );
  }

  const getGradientBackground = () => {
    return theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)';
  };

  const getCardGradient = () => {
    return theme.palette.mode === 'dark'
      ? 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
      : 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(240,245,255,0.85) 100%)';
  };

  const getTextColor = () => {
    return theme.palette.mode === 'dark' ? 'white' : '#1a202c';
  };

  const getSecondaryTextColor = () => {
    return theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.8)' : '#4a5568';
  };

  const getCardBorder = () => {
    return theme.palette.mode === 'dark' 
      ? '1px solid rgba(255,255,255,0.2)'
      : '1px solid rgba(147,197,253,0.3)';
  };

  const getInputBackground = () => {
    return theme.palette.mode === 'dark'
      ? 'rgba(255,255,255,0.1)'
      : 'rgba(240,245,255,0.7)';
  };

  const getCardShadow = () => {
    return theme.palette.mode === 'dark' 
      ? '0 20px 40px rgba(0,0,0,0.1)'
      : '0 20px 40px rgba(147,197,253,0.15)';
  };

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Background Gradient */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: getGradientBackground(),
          zIndex: -1,
        }}
      />

      {/* Floating Background Elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '100px',
          height: '100px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          zIndex: -1,
        }}
      />
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: '150px',
          height: '150px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '50%',
          zIndex: -1,
        }}
      />

      <Box sx={{ p: { xs: 1, sm: 2, md: 4 }, position: 'relative', zIndex: 1, maxWidth: '1400px', mx: 'auto', width: '100%', overflow: 'hidden' }}>
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                fontWeight: 800,
                background: theme.palette.mode === 'dark' 
                  ? 'linear-gradient(45deg, #fff, #f0f0f0)'
                  : 'linear-gradient(45deg, #2d3748, #4a5568)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
                textShadow: theme.palette.mode === 'dark' 
                  ? '0 2px 4px rgba(0,0,0,0.1)'
                  : '0 2px 4px rgba(0,0,0,0.03)',
                fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' },
              }}
            >
              Profile Dashboard
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: getSecondaryTextColor(),
                fontWeight: 300,
                fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' },
              }}
            >
              Manage your personal information and preferences
            </Typography>
          </Box>
        </motion.div>

        {/* Alerts */}
        {error && (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert severity="error" sx={{ mb: 4, borderRadius: 3, maxWidth: '600px', mx: 'auto' }}>
              {error}
            </Alert>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert severity="success" sx={{ mb: 4, borderRadius: 3, maxWidth: '600px', mx: 'auto' }}>
              {success}
            </Alert>
          </motion.div>
        )}

        <Grid container spacing={{ xs: 2, md: 4 }} sx={{ justifyContent: 'center' }}>
          {/* Left Column - Hero Profile Card */}
          <Grid item xs={12} lg={6} sx={{ display: 'flex', justifyContent: 'center' }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ width: '100%', maxWidth: '600px' }}
            >
              <Card
                sx={{
                  background: getCardGradient(),
                  backdropFilter: 'blur(20px)',
                  border: getCardBorder(),
                  borderRadius: 4,
                  boxShadow: getCardShadow(),
                  overflow: 'visible',
                  position: 'relative',
                  height: 'fit-content',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  py: 4,
                  px: { xs: 2, sm: 3 },
                  ...(theme.palette.mode === 'light' && {
                    backgroundImage: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(240,245,255,0.90) 100%)',
                    border: '1px solid rgba(147,197,253,0.4)',
                  }),
                }}
              >
                {/* Floating Action Button */}
                <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 2 }}>
                  {!isEditing ? (
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <IconButton
                        onClick={handleEdit}
                        sx={{
                          background: 'linear-gradient(45deg, #667eea, #764ba2)',
                          color: 'white',
                          boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
                          },
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </motion.div>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <IconButton
                          onClick={handleCancel}
                          disabled={loading}
                          sx={{
                            background: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            backdropFilter: 'blur(10px)',
                          }}
                        >
                          <CancelIcon />
                        </IconButton>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <IconButton
                          onClick={handleSave}
                          disabled={loading}
                          sx={{
                            background: 'linear-gradient(45deg, #4caf50, #45a049)',
                            color: 'white',
                            boxShadow: '0 8px 20px rgba(76, 175, 80, 0.4)',
                            '&:hover': {
                              background: 'linear-gradient(45deg, #45a049, #3d8b40)',
                            },
                          }}
                        >
                          <SaveIcon />
                        </IconButton>
                      </motion.div>
                    </Box>
                  )}
                </Box>

                <CardContent sx={{ textAlign: 'center', p: 0, width: '100%' }}>
                  {/* Profile Avatar */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Avatar
                      src={user.profilePhoto ? `http://localhost:5001${user.profilePhoto}` : ''}
                      sx={{
                        width: { xs: 110, sm: 130, md: 150 },
                        height: { xs: 110, sm: 130, md: 150 },
                        mx: 'auto',
                        mb: 2.5,
                        background: 'linear-gradient(45deg, #667eea, #764ba2)',
                        fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                        boxShadow: '0 15px 35px rgba(102, 126, 234, 0.3)',
                        border: '4px solid rgba(255,255,255,0.3)',
                      }}
                    >
                      <PersonIcon sx={{ fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' } }} />
                    </Avatar>
                  </motion.div>

                  {/* Name and Role */}
                  <Typography 
                    variant="h5" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 700,
                      color: getTextColor(),
                      mb: 0.5,
                      fontSize: { xs: '1.35rem', sm: '1.7rem', md: '2.1rem' },
                    }}
                  >
                    {user.name}
                  </Typography>
                  <Chip
                    icon={<BadgeIcon />}
                    label={user.role}
                    sx={{
                      background: theme.palette.mode === 'dark'
                        ? 'linear-gradient(45deg, #667eea, #764ba2)'
                        : 'linear-gradient(45deg, #a8edea, #fed6e3)',
                      color: theme.palette.mode === 'dark' ? 'white' : '#2d3748',
                      fontWeight: 600,
                      mb: 2.5,
                      px: 2,
                      py: 0.5,
                      fontSize: '0.95rem',
                    }}
                  />

                  <Divider sx={{ my: 2, opacity: theme.palette.mode === 'dark' ? 0.3 : 0.15 }} />

                  {/* Quick Stats - vertical layout with icons */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BusinessIcon sx={{ color: theme.palette.mode === 'dark' ? '#667eea' : '#38b2ac', fontSize: 22 }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: getTextColor(), fontSize: '1rem' }}>
                        {user.department || 'N/A'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <WorkIcon sx={{ color: theme.palette.mode === 'dark' ? '#764ba2' : '#f687b3', fontSize: 22 }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: getTextColor(), fontSize: '1rem' }}>
                        {user.position || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Right Column - Information Cards */}
          <Grid item xs={12} lg={8} sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{ width: '100%' }}
            >
              <Grid container spacing={{ xs: 2, md: 3 }}>
                {/* Personal Information Card */}
                <Grid item xs={12}>
                  <Card
                    sx={{
                      background: getCardGradient(),
                      backdropFilter: 'blur(20px)',
                      border: getCardBorder(),
                      borderRadius: 4,
                      boxShadow: getCardShadow(),
                      ...(theme.palette.mode === 'light' && {
                        backgroundImage: 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(240,245,255,0.85) 100%), linear-gradient(45deg, rgba(147,197,253,0.05) 0%, rgba(196,181,253,0.05) 100%)',
                        border: '1px solid rgba(147,197,253,0.4)',
                      }),
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, md: 4 } }}>
                        <PersonIcon sx={{ mr: 2, color: theme.palette.mode === 'dark' ? '#667eea' : '#38b2ac', fontSize: { xs: 24, md: 28 } }} />
                        <Typography variant="h5" sx={{ fontWeight: 600, color: getTextColor(), fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                          Personal Information
                        </Typography>
                      </Box>
                      
                      <Grid container spacing={{ xs: 2, md: 3 }}>
                        {/* Row 1: Name, DOB */}
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Full Name"
                            name="name"
                            fullWidth
                            value={formData.name}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                                background: getInputBackground(),
                                backdropFilter: 'blur(10px)',
                              },
                              '& .MuiInputLabel-root': {
                                color: getSecondaryTextColor(),
                              },
                            }}
                            InputProps={{
                              startAdornment: <PersonIcon sx={{ mr: 1, color: theme.palette.mode === 'dark' ? 'action.active' : '#38b2ac' }} />, 
                            }}
                          />
                        </Grid>
                        {/* Row 2: Gender, Email */}
                        <Grid item xs={12} sm={6} sx={{ mt: { xs: 0, md: 1 } }}>
                          <TextField
                            label="Email"
                            name="email"
                            type="email"
                            fullWidth
                            value={user.email || ''}
                            disabled={true}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                                background: getInputBackground(),
                                backdropFilter: 'blur(10px)',
                              },
                              '& .MuiInputLabel-root': {
                                color: getSecondaryTextColor(),
                              },
                            }}
                            InputProps={{
                              startAdornment: <EmailIcon sx={{ mr: 1, color: theme.palette.mode === 'dark' ? 'action.active' : '#f5576c' }} />, 
                            }}
                            helperText="Email cannot be changed"
                          />
                        </Grid>
                        {/* Row 3: Phone, Emergency Contact */}
                        <Grid item xs={12} sm={6} sx={{ mt: { xs: 0, md: 1 } }}>
                          <TextField
                            label="Phone"
                            name="phone"
                            type="tel"
                            fullWidth
                            value={formData.phone}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                                background: getInputBackground(),
                                backdropFilter: 'blur(10px)',
                              },
                              '& .MuiInputLabel-root': {
                                color: getSecondaryTextColor(),
                              },
                            }}
                            InputProps={{
                              startAdornment: <PhoneIcon sx={{ mr: 1, color: theme.palette.mode === 'dark' ? 'action.active' : '#f6ad55' }} />, 
                            }}
                          />
                        </Grid>
                        {/* Divider before address */}
                        <Grid item xs={12} sx={{ mt: 2, mb: 1 }}>
                          <Divider sx={{ opacity: 0.5 }} />
                        </Grid>
                        {/* Address full width */}
                        <Grid item xs={12}>
                          <TextField
                            label="Address"
                            name="address"
                            fullWidth
                            multiline
                            rows={3}
                            value={formData.address}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                                background: getInputBackground(),
                                backdropFilter: 'blur(10px)',
                              },
                              '& .MuiInputLabel-root': {
                                color: getSecondaryTextColor(),
                              },
                            }}
                            InputProps={{
                              startAdornment: <LocationIcon sx={{ mr: 1, color: theme.palette.mode === 'dark' ? 'action.active' : '#f5576c' }} />, 
                            }}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Work Information Card */}
                <Grid item xs={12} md={6}>
                  <Card
                    sx={{
                      background: getCardGradient(),
                      backdropFilter: 'blur(20px)',
                      border: getCardBorder(),
                      borderRadius: 4,
                      boxShadow: getCardShadow(),
                      height: '100%',
                      ...(theme.palette.mode === 'light' && {
                        backgroundImage: 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(240,245,255,0.85) 100%), linear-gradient(45deg, rgba(147,197,253,0.05) 0%, rgba(196,181,253,0.05) 100%)',
                        border: '1px solid rgba(147,197,253,0.4)',
                      }),
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, md: 4 } }}>
                        <WorkIcon sx={{ mr: 2, color: theme.palette.mode === 'dark' ? '#764ba2' : '#f687b3', fontSize: { xs: 24, md: 28 } }} />
                        <Typography variant="h6" sx={{ fontWeight: 600, color: getTextColor(), fontSize: { xs: '1rem', md: '1.25rem' } }}>
                          Work Details
                        </Typography>
                      </Box>
                      
                      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Box sx={{ mb: { xs: 2, md: 4 } }}>
                          <Typography variant="body2" sx={{ color: getSecondaryTextColor(), mb: 1, fontSize: '0.875rem' }}>
                            Department
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.mode === 'dark' ? '#667eea' : '#38b2ac', fontSize: { xs: '0.875rem', md: '1rem' } }}>
                            {user.department || 'Not Assigned'}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ mb: { xs: 2, md: 4 } }}>
                          <Typography variant="body2" sx={{ color: getSecondaryTextColor(), mb: 1, fontSize: '0.875rem' }}>
                            Position
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.mode === 'dark' ? '#764ba2' : '#f687b3', fontSize: { xs: '0.875rem', md: '1rem' } }}>
                            {user.position || 'Not Assigned'}
                          </Typography>
                        </Box>
                        
                        <Box>
                          <Typography variant="body2" sx={{ color: getSecondaryTextColor(), mb: 1, fontSize: '0.875rem' }}>
                            Salary
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: '#48bb78', fontSize: { xs: '0.875rem', md: '1rem' } }}>
                            {user.salary ? (typeof user.salary === 'number' ? `$${user.salary.toLocaleString()}` : `$${user.salary}`) : 'Not Set'}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Account Security Card */}
                <Grid item xs={12} md={6}>
                  <Card
                    sx={{
                      background: getCardGradient(),
                      backdropFilter: 'blur(20px)',
                      border: getCardBorder(),
                      borderRadius: 4,
                      boxShadow: getCardShadow(),
                      height: '100%',
                      ...(theme.palette.mode === 'light' && {
                        backgroundImage: 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(240,245,255,0.85) 100%), linear-gradient(45deg, rgba(147,197,253,0.05) 0%, rgba(196,181,253,0.05) 100%)',
                        border: '1px solid rgba(147,197,253,0.4)',
                      }),
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, md: 4 } }}>
                        <SecurityIcon sx={{ mr: 2, color: '#4caf50', fontSize: { xs: 24, md: 28 } }} />
                        <Typography variant="h6" sx={{ fontWeight: 600, color: getTextColor(), fontSize: { xs: '1rem', md: '1.25rem' } }}>
                          Account Security
                        </Typography>
                      </Box>
                      
                      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Box sx={{ mb: { xs: 2, md: 4 } }}>
                          <Typography variant="body2" sx={{ color: getSecondaryTextColor(), mb: 1, fontSize: '0.875rem' }}>
                            Account Status
                          </Typography>
                          <Chip
                            label="Active"
                            color="success"
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                        
                        <Box sx={{ mb: { xs: 2, md: 4 } }}>
                          <Typography variant="body2" sx={{ color: getSecondaryTextColor(), mb: 1, fontSize: '0.875rem' }}>
                            Last Login
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: getTextColor(), fontSize: { xs: '0.875rem', md: '1rem' } }}>
                            {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
                          </Typography>
                        </Box>
                        
                        <Box>
                          <Typography variant="body2" sx={{ color: getSecondaryTextColor(), mb: 1, fontSize: '0.875rem' }}>
                            Member Since
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: getTextColor(), fontSize: { xs: '0.875rem', md: '1rem' } }}>
                            {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : (user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A')}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </motion.div>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Profile; 