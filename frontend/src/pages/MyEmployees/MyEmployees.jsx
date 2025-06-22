import React from 'react';
import { Box, Typography, Grid, Card, Avatar, CircularProgress, Alert, useTheme, Divider } from '@mui/material';
import { Email as EmailIcon, Business as BusinessIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useManagerData } from '../../context/ManagerDataContext.jsx';

const MyEmployees = () => {
  const { employees, loading, error } = useManagerData();
  const theme = useTheme();

  const isDark = theme.palette.mode === 'dark';

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, height: '100%', overflowY: 'auto' }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: isDark ? theme.palette.grey[100] : theme.palette.grey[900], mb: 4 }}>
          My Team
        </Typography>
      </motion.div>

      <Grid container spacing={3}>
        {employees.length > 0 ? (
          employees.map((employee, index) => (
            <Grid item xs={12} md={6} key={employee._id}>
              <motion.div
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -5, boxShadow: `0 10px 20px ${isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.1)'}` }}
              >
                <Card sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2.5,
                  borderRadius: 4,
                  background: isDark ? 'linear-gradient(145deg, #2b2b4e, #1a1a36)' : 'linear-gradient(145deg, #F9F9F9, #FFFFFF)',
                  border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
                  transition: 'all 0.3s ease-in-out',
                  boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.5)' : '0 4px 12px rgba(0,0,0,0.05)',
                }}>
                  <Avatar 
                    sx={{ 
                      width: 64, 
                      height: 64, 
                      bgcolor: 'primary.main', 
                      fontSize: '2rem', 
                      color: 'white',
                      mr: 2.5,
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                    }}
                  >
                    {employee.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: isDark ? theme.palette.grey[200] : theme.palette.grey[800] }}>
                      {employee.name}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'primary.main', fontWeight: 500 }}>
                      {employee.position || 'No Position'}
                    </Typography>
                    <Divider sx={{ my: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
                    <Box>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', color: isDark ? theme.palette.grey[400] : theme.palette.grey[600], mb: 0.5 }}>
                        <EmailIcon sx={{ mr: 1, fontSize: '1rem', color: 'inherit' }} /> {employee.email}
                      </Typography>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', color: isDark ? theme.palette.grey[400] : theme.palette.grey[600] }}>
                        <BusinessIcon sx={{ mr: 1, fontSize: '1rem', color: 'inherit' }} /> {employee.department ? employee.department.name : 'No Department'}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ color: theme.palette.text.secondary }}>You have no employees assigned to you.</Typography>
                </Box>
              </motion.div>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default MyEmployees; 