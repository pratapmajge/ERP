import { createTheme } from '@mui/material/styles';

const baseTheme = {
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          boxShadow: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
            },
          },
        },
      },
    },
  },
};

export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#9B59B6',
      light: '#BB8FCE',
      dark: '#8E44AD',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#E67E22',
      light: '#F5B041',
      dark: '#D35400',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#27AE60',
      light: '#2ECC71',
      dark: '#219A52',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#F1C40F',
      light: '#F9E79F',
      dark: '#D4AC0D',
      contrastText: '#2C3E50',
    },
    error: {
      main: '#E74C3C',
      light: '#F1948A',
      dark: '#CB4335',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FDFEFE',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2C3E50',
      secondary: '#7F8C8D',
    },
  },
});

export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#8f5cff', // Neon purple
      light: '#a084ff',
      dark: '#4e1fff',
      contrastText: '#0ff',
    },
    secondary: {
      main: '#00eaff', // Neon cyan
      light: '#5ffbf1',
      dark: '#00bcd4',
      contrastText: '#fff',
    },
    success: {
      main: '#00ffb8',
      light: '#5fffc6',
      dark: '#00b884',
      contrastText: '#0f0',
    },
    warning: {
      main: '#ffb300',
      light: '#ffd740',
      dark: '#ff8f00',
      contrastText: '#fff',
    },
    error: {
      main: '#ff3576', // Neon pink
      light: '#ff7cae',
      dark: '#c4004e',
      contrastText: '#fff',
    },
    background: {
      default: '#0a0618', // Deep black-violet
      paper: 'rgba(20, 20, 40, 0.85)', // Glassy overlay
    },
    text: {
      primary: '#e0e7ff', // Soft white
      secondary: '#a5b4fc', // Muted neon
    },
    divider: 'rgba(130, 0, 255, 0.18)',
  },
  components: {
    ...baseTheme.components,
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'rgba(20, 20, 40, 0.85)',
          backdropFilter: 'blur(24px)',
          border: '1.5px solid rgba(130, 0, 255, 0.18)',
          boxShadow: '0 8px 32px 0 #8f5cff44, 0 1.5px 12px 0 #00eaff33',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, rgba(20,20,40,0.95) 60%, rgba(143,92,255,0.12) 100%)',
          border: '1.5px solid #8f5cff44',
          boxShadow: '0 8px 32px 0 #8f5cff44, 0 1.5px 12px 0 #00eaff33',
          backdropFilter: 'blur(24px)',
          color: '#e0e7ff',
          '&:hover': {
            border: '1.5px solid #00eaff',
            boxShadow: '0 12px 48px 0 #00eaffcc',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 700,
          background: 'linear-gradient(90deg, #8f5cff 0%, #00eaff 100%)',
          color: '#fff',
          boxShadow: '0 2px 16px 0 #00eaff55',
          border: '1.5px solid #8f5cff44',
          '&:hover': {
            background: 'linear-gradient(90deg, #00eaff 0%, #8f5cff 100%)',
            boxShadow: '0 4px 32px 0 #00eaffcc',
            border: '1.5px solid #00eaff',
          },
        },
        contained: {
          boxShadow: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #8f5cff 0%, #00eaff 100%)',
          color: '#fff',
          border: '1.5px solid #00eaff',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: 'rgba(143,92,255,0.08)',
            border: '1.5px solid #8f5cff44',
            color: '#e0e7ff',
            '&:hover': {
              background: 'rgba(0,234,255,0.08)',
              borderColor: '#00eaff',
            },
            '&.Mui-focused': {
              background: 'rgba(0,234,255,0.12)',
              borderColor: '#00eaff',
              boxShadow: '0 0 0 2px #00eaff44',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#a5b4fc',
          },
        },
      },
    },
  },
});

// Default export for backward compatibility
export default lightTheme; 