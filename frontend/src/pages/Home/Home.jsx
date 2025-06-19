import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  IconButton,
  Typography,
  useTheme,
  Tooltip,
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  People,
  Business,
  AccessTime,
  AttachMoney,
  Security,
  Analytics,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme as useCustomTheme } from '../../context/ThemeContext';

// 3D Cube faces content
const featureIcons = [
  <People fontSize="large" />, <Business fontSize="large" />, <AccessTime fontSize="large" />,
  <AttachMoney fontSize="large" />, <Security fontSize="large" />, <Analytics fontSize="large" />
];

const Animated3DCube = ({ themeMode }) => (
  <Box
    sx={{
      perspective: '1200px',
      width: { xs: 180, sm: 260 },
      height: { xs: 180, sm: 260 },
      mx: 'auto',
      my: 4,
      position: 'relative',
      zIndex: 2,
    }}
  >
    <motion.div
      animate={{ rotateY: [0, 360], rotateX: [0, 360] }}
      transition={{ repeat: Infinity, duration: 16, ease: 'linear' }}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        transformStyle: 'preserve-3d',
      }}
    >
      {[...Array(6)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 48,
            color: themeMode === 'dark' ? '#00eaff' : '#8f5cff',
            background: themeMode === 'dark'
              ? 'linear-gradient(135deg, rgba(20,20,40,0.95) 60%, rgba(143,92,255,0.12) 100%)'
              : 'linear-gradient(135deg, #f3e8ff 60%, #e0e7ff 100%)',
            border: '2.5px solid rgba(143,92,255,0.18)',
            boxShadow: themeMode === 'dark'
              ? '0 8px 32px 0 #8f5cff44, 0 1.5px 12px 0 #00eaff33'
              : '0 8px 32px 0 #a29bfe44, 0 1.5px 12px 0 #f093fb33',
            borderRadius: 4,
            backdropFilter: 'blur(12px)',
            transform: `rotateY(${i * 90}deg) translateZ(90px)` + (i === 4 ? ' rotateX(90deg)' : '') + (i === 5 ? ' rotateX(-90deg)' : ''),
          }}
        >
          {featureIcons[i]}
        </Box>
      ))}
    </motion.div>
  </Box>
);

const OrbitingIcon = ({ icon, angle, radius, duration, themeMode }) => (
  <motion.div
    style={{
      position: 'absolute',
      left: '50%',
      top: '50%',
      zIndex: 1,
      transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${radius}px)`
    }}
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration, ease: 'linear' }}
  >
    <Box
      sx={{
        background: themeMode === 'dark'
          ? 'linear-gradient(135deg, #8f5cff 0%, #00eaff 100%)'
          : 'linear-gradient(135deg, #a29bfe 0%, #f093fb 100%)',
        color: '#fff',
        borderRadius: '50%',
        width: 56,
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: themeMode === 'dark'
          ? '0 0 24px #00eaff88'
          : '0 0 24px #a29bfe88',
        border: '2px solid #fff2',
      }}
    >
      {icon}
    </Box>
  </motion.div>
);

const Animated3DHome = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useCustomTheme();
  const themeMode = isDarkMode ? 'dark' : 'light';

  // Animated background
  const bgGradient = themeMode === 'dark'
    ? 'radial-gradient(ellipse at 60% 40%, #0a0618 0%, #1a1a2e 60%, #8f5cff22 100%)'
    : 'radial-gradient(ellipse at 60% 40%, #f3e8ff 0%, #e0e7ff 60%, #a29bfe22 100%)';

  const [magnet, setMagnet] = useState({ x: 0, y: 0, isHover: false });
  const btnRef = useRef();

  const handleMouseMove = (e) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const btnX = rect.left + rect.width / 2;
    const btnY = rect.top + rect.height / 2;
    const distX = e.clientX - btnX;
    const distY = e.clientY - btnY;
    const distance = Math.sqrt(distX * distX + distY * distY);
    if (distance < 100) {
      setMagnet({ x: distX * 0.25, y: distY * 0.25, isHover: false });
    } else {
      setMagnet({ x: 0, y: 0, isHover: false });
    }
  };
  const handleMouseLeave = () => setMagnet({ x: 0, y: 0, isHover: false });
  const handleMouseEnter = () => setMagnet((m) => ({ ...m, isHover: true }));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        overflow: 'hidden',
        position: 'relative',
        background: bgGradient,
        transition: 'background 0.6s',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Theme toggle and header */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', p: 2, display: 'flex', justifyContent: 'space-between', zIndex: 10 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: themeMode === 'dark' ? '#00eaff' : '#8f5cff', letterSpacing: 2 }}>
          ERP SYSTEM
        </Typography>
        <Tooltip title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`} arrow>
          <IconButton onClick={toggleTheme} sx={{ color: themeMode === 'dark' ? '#00eaff' : '#8f5cff' }}>
            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Login and Register Buttons - now in the top right corner */}
      <Box sx={{ position: 'absolute', top: 0, right: 0, p: 2, zIndex: 12, display: 'flex', gap: 2 }}>
        <motion.div
          whileHover={{ scale: 1.08, y: -2, boxShadow: themeMode === 'dark' ? '0 4px 16px #00eaffcc' : '0 4px 16px #a29bfecc' }}
          whileTap={{ scale: 0.96 }}
        >
          <Button
            variant="outlined"
            size="medium"
            onClick={() => navigate('/login')}
            sx={{
              px: 4,
              py: 1.2,
              fontWeight: 700,
              fontSize: '1rem',
              borderRadius: 8,
              color: themeMode === 'dark' ? '#00eaff' : '#8f5cff',
              border: `2px solid ${themeMode === 'dark' ? '#00eaff' : '#8f5cff'}`,
              background: 'transparent',
              boxShadow: themeMode === 'dark'
                ? '0 2px 8px #00eaff44'
                : '0 2px 8px #a29bfe44',
              textShadow: '0 1px 2px #0006',
              transition: 'all 0.3s',
              '&:hover': {
                background: themeMode === 'dark'
                  ? 'rgba(0,234,255,0.08)'
                  : 'rgba(160,155,254,0.08)',
              },
            }}
          >
            Login
          </Button>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.08, y: -2, boxShadow: themeMode === 'dark' ? '0 4px 16px #00eaffcc' : '0 4px 16px #a29bfecc' }}
          whileTap={{ scale: 0.96 }}
        >
          <Button
            variant="contained"
            size="medium"
            onClick={() => navigate('/register')}
            sx={{
              px: 4,
              py: 1.2,
              fontWeight: 700,
              fontSize: '1rem',
              borderRadius: 8,
              background: themeMode === 'dark'
                ? 'linear-gradient(90deg, #8f5cff 0%, #00eaff 100%)'
                : 'linear-gradient(90deg, #a29bfe 0%, #f093fb 100%)',
              color: '#fff',
              boxShadow: themeMode === 'dark'
                ? '0 2px 8px #00eaff88'
                : '0 2px 8px #a29bfe88',
              textShadow: '0 1px 2px #0006',
              transition: 'all 0.3s',
            }}
          >
            Register
          </Button>
        </motion.div>
      </Box>

      {/* Theme Toggle Icon - floating in top right above Login/Register */}
      <Box
        sx={{ position: 'fixed', bottom: 20, left: 24, zIndex: 2000 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <Tooltip title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`} arrow>
          <IconButton
            ref={btnRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={toggleTheme}
            sx={{
              color: '#fff',
              background: themeMode === 'dark'
                ? 'linear-gradient(135deg, #1a1a2e 0%, #8f5cff 100%)'
                : 'linear-gradient(135deg, #a29bfe 0%, #f093fb 100%)',
              boxShadow: themeMode === 'dark' ? '0 2px 16px #00eaff88' : '0 2px 16px #a29bfe88',
              border: `2px solid ${themeMode === 'dark' ? '#00eaff44' : '#a29bfe44'}`,
              backdropFilter: 'blur(12px)',
              transition: 'all 0.5s cubic-bezier(0.4,1.2,0.4,1)',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                background: themeMode === 'dark'
                  ? 'linear-gradient(270deg, #8f5cff 0%, #00eaff 50%, #f093fb 100%)'
                  : 'linear-gradient(270deg, #a29bfe 0%, #f093fb 50%, #8f5cff 100%)',
                animation: 'colorMorph 1.2s linear',
                transform: 'scale(1.13)',
                boxShadow: themeMode === 'dark'
                  ? '0 0 32px 12px #00eaffcc, 0 2px 24px #00eaff88'
                  : '0 0 32px 12px #a29bfecc, 0 2px 24px #a29bfe88',
                borderColor: themeMode === 'dark' ? '#00eaff' : '#a29bfe',
              },
              '@keyframes colorMorph': {
                '0%': {
                  background: themeMode === 'dark'
                    ? 'linear-gradient(135deg, #1a1a2e 0%, #8f5cff 100%)'
                    : 'linear-gradient(135deg, #a29bfe 0%, #f093fb 100%)',
                },
                '50%': {
                  background: themeMode === 'dark'
                    ? 'linear-gradient(270deg, #8f5cff 0%, #00eaff 50%, #f093fb 100%)'
                    : 'linear-gradient(270deg, #a29bfe 0%, #f093fb 50%, #8f5cff 100%)',
                },
                '100%': {
                  background: themeMode === 'dark'
                    ? 'linear-gradient(135deg, #1a1a2e 0%, #8f5cff 100%)'
                    : 'linear-gradient(135deg, #a29bfe 0%, #f093fb 100%)',
                },
              },
            }}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Brightness7 fontSize="medium" /> : <Brightness4 fontSize="medium" />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* 3D Cube and Orbiting Icons */}
      <Box sx={{ position: 'relative', width: 340, height: 340, mx: 'auto', my: 6 }}>
        <Animated3DCube themeMode={themeMode} />
        {/* Orbiting feature icons */}
        {featureIcons.map((icon, i) => (
          <OrbitingIcon
            key={i}
            icon={icon}
            angle={i * 60}
            radius={140}
            duration={8 + i}
            themeMode={themeMode}
          />
        ))}
      </Box>

      {/* Hero Text and Buttons */}
      <Box sx={{ textAlign: 'center', zIndex: 2, mb: 4 }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 900,
            letterSpacing: 1,
            color: themeMode === 'dark' ? '#00eaff' : '#8f5cff',
            textShadow: themeMode === 'dark'
              ? '0 2px 24px #00eaff88, 0 1px 0 #000'
              : '0 2px 24px #a29bfe88, 0 1px 0 #fff',
            mb: 2,
            fontSize: { xs: '2.2rem', sm: '3.2rem' },
          }}
        >
          Welcome to the Future of ERP
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: themeMode === 'dark' ? '#e0e7ff' : '#2C3E50',
            opacity: 0.85,
            mb: 4,
            fontWeight: 500,
            fontSize: { xs: '1.1rem', sm: '1.5rem' },
          }}
        >
          3D. Animated. Unforgettable. <br /> All your business, one immersive platform.
        </Typography>
      </Box>

      {/* Add subtle parallax/floating effect to hero area background */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 16, ease: 'easeInOut' }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 600, zIndex: 1, pointerEvents: 'none' }}
      >
        {/* Optional: add a blurred, floating gradient shape for extra depth */}
        <Box
          sx={{
            width: 400,
            height: 400,
            borderRadius: '50%',
            position: 'absolute',
            left: { xs: '-120px', md: '40px' },
            top: { xs: '40px', md: '80px' },
            background: themeMode === 'dark'
              ? 'radial-gradient(circle at 30% 30%, #00eaff44 0%, #8f5cff22 100%)'
              : 'radial-gradient(circle at 30% 30%, #a29bfe44 0%, #f093fb22 100%)',
            filter: 'blur(60px)',
            opacity: 0.7,
          }}
        />
      </motion.div>

      {/* Features Section */}
      <Box sx={{ width: '100%', py: { xs: 6, md: 10 }, px: 2, maxWidth: 1400, mx: 'auto' }}>
        <Typography variant="h3" align="center" sx={{ fontWeight: 800, mb: 6, color: themeMode === 'dark' ? '#00eaff' : '#8f5cff', letterSpacing: 1 }}>
          ERP Modules
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
          {[
            { icon: <People fontSize="large" />, title: 'Employee Management', desc: 'Manage your workforce, onboarding, and records.' },
            { icon: <Business fontSize="large" />, title: 'Department Management', desc: 'Organize teams, assign managers, and structure your company.' },
            { icon: <AccessTime fontSize="large" />, title: 'Attendance Tracking', desc: 'Track time, presence, and leave with precision.' },
            { icon: <AttachMoney fontSize="large" />, title: 'Payroll', desc: 'Automate payroll, taxes, and payslips.' },
            { icon: <Security fontSize="large" />, title: 'Role-Based Access', desc: 'Enterprise-grade security and permissions.' },
            { icon: <Analytics fontSize="large" />, title: 'Analytics', desc: 'Visualize and analyze your business data.' },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 + 0.2 }}
              whileHover={{ scale: 1.06, boxShadow: themeMode === 'dark' ? '0 8px 32px #00eaffcc' : '0 8px 32px #a29bfecc' }}
              style={{ minWidth: 260, maxWidth: 320, flex: 1 }}
            >
              <Box
                sx={{
                  background: themeMode === 'dark'
                    ? 'linear-gradient(135deg, rgba(20,20,40,0.95) 60%, rgba(143,92,255,0.12) 100%)'
                    : 'linear-gradient(135deg, #f3e8ff 60%, #e0e7ff 100%)',
                  border: `2px solid ${themeMode === 'dark' ? '#00eaff44' : '#a29bfe44'}`,
                  borderRadius: 5,
                  boxShadow: themeMode === 'dark'
                    ? '0 8px 32px 0 #8f5cff44, 0 1.5px 12px 0 #00eaff33'
                    : '0 8px 32px 0 #a29bfe44, 0 1.5px 12px 0 #f093fb33',
                  color: themeMode === 'dark' ? '#e0e7ff' : '#2C3E50',
                  p: 4,
                  mb: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minHeight: 220,
                  backdropFilter: 'blur(12px)',
                  transition: 'all 0.3s',
                }}
              >
                <Box sx={{ mb: 2, color: themeMode === 'dark' ? '#00eaff' : '#8f5cff', fontSize: 48 }}>{f.icon}</Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{f.title}</Typography>
                <Typography variant="body1" sx={{ opacity: 0.8 }}>{f.desc}</Typography>
              </Box>
            </motion.div>
          ))}
        </Box>
      </Box>

      {/* Why Choose Us Section */}
      <Box sx={{ width: '100%', py: { xs: 6, md: 10 }, px: 2, maxWidth: 1200, mx: 'auto' }}>
        <Typography variant="h3" align="center" sx={{ fontWeight: 800, mb: 6, color: themeMode === 'dark' ? '#00eaff' : '#8f5cff', letterSpacing: 1 }}>
          Why Choose Us?
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
          {[
            { icon: <Security fontSize="large" />, title: 'Secure & Reliable', desc: 'Your data is protected with enterprise-grade security.' },
            { icon: <Analytics fontSize="large" />, title: 'Insightful Analytics', desc: 'Make smarter decisions with real-time insights.' },
            { icon: <AttachMoney fontSize="large" />, title: 'Cost Effective', desc: 'Affordable plans for businesses of all sizes.' },
            { icon: <People fontSize="large" />, title: 'User Friendly', desc: 'Intuitive design for everyone in your organization.' },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 + 0.2 }}
              whileHover={{ scale: 1.06, boxShadow: themeMode === 'dark' ? '0 8px 32px #00eaffcc' : '0 8px 32px #a29bfecc' }}
              style={{ minWidth: 220, maxWidth: 300, flex: 1 }}
            >
              <Box
                sx={{
                  background: themeMode === 'dark'
                    ? 'linear-gradient(135deg, rgba(20,20,40,0.95) 60%, rgba(143,92,255,0.12) 100%)'
                    : 'linear-gradient(135deg, #f3e8ff 60%, #e0e7ff 100%)',
                  border: `2px solid ${themeMode === 'dark' ? '#00eaff44' : '#a29bfe44'}`,
                  borderRadius: 5,
                  boxShadow: themeMode === 'dark'
                    ? '0 8px 32px 0 #8f5cff44, 0 1.5px 12px 0 #00eaff33'
                    : '0 8px 32px 0 #a29bfe44, 0 1.5px 12px 0 #f093fb33',
                  color: themeMode === 'dark' ? '#e0e7ff' : '#2C3E50',
                  p: 4,
                  mb: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minHeight: 180,
                  backdropFilter: 'blur(12px)',
                  transition: 'all 0.3s',
                }}
              >
                <Box sx={{ mb: 2, color: themeMode === 'dark' ? '#00eaff' : '#8f5cff', fontSize: 40 }}>{f.icon}</Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{f.title}</Typography>
                <Typography variant="body1" sx={{ opacity: 0.8 }}>{f.desc}</Typography>
              </Box>
            </motion.div>
          ))}
        </Box>
      </Box>

      {/* CTA Section */}
      <Box sx={{ width: '100%', py: { xs: 6, md: 10 }, px: 2, maxWidth: 900, mx: 'auto', textAlign: 'center' }}>
        <Typography variant="h3" sx={{ fontWeight: 900, mb: 3, color: themeMode === 'dark' ? '#00eaff' : '#8f5cff', letterSpacing: 1 }}>
          Ready to experience the next generation of ERP?
        </Typography>
        <motion.div
          whileHover={{ scale: 1.08, y: -4, boxShadow: themeMode === 'dark' ? '0 8px 32px #00eaffcc' : '0 8px 32px #a29bfecc' }}
          whileTap={{ scale: 0.96 }}
          style={{ display: 'inline-block' }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            sx={{
              px: 6,
              py: 2,
              fontWeight: 700,
              fontSize: '1.2rem',
              borderRadius: 8,
              background: themeMode === 'dark'
                ? 'linear-gradient(90deg, #8f5cff 0%, #00eaff 100%)'
                : 'linear-gradient(90deg, #a29bfe 0%, #f093fb 100%)',
              color: '#fff',
              boxShadow: themeMode === 'dark'
                ? '0 4px 24px #00eaff88'
                : '0 4px 24px #a29bfe88',
              textShadow: '0 1px 2px #0006',
              transition: 'all 0.3s',
            }}
          >
            Get Started Now
          </Button>
        </motion.div>
      </Box>
    </Box>
  );
};

export default Animated3DHome; 