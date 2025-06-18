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
      main: '#BB8FCE',
      light: '#D7BDE2',
      dark: '#9B59B6',
      contrastText: '#2C3E50',
    },
    secondary: {
      main: '#F5B041',
      light: '#F9E79F',
      dark: '#E67E22',
      contrastText: '#2C3E50',
    },
    success: {
      main: '#2ECC71',
      light: '#82E0AA',
      dark: '#27AE60',
      contrastText: '#2C3E50',
    },
    warning: {
      main: '#F9E79F',
      light: '#FCF3CF',
      dark: '#F1C40F',
      contrastText: '#2C3E50',
    },
    error: {
      main: '#F1948A',
      light: '#F5B7B1',
      dark: '#E74C3C',
      contrastText: '#2C3E50',
    },
    background: {
      default: '#1A1A1A',
      paper: '#2C3E50',
    },
    text: {
      primary: '#ECF0F1',
      secondary: '#BDC3C7',
    },
  },
});

// Default export for backward compatibility
export default lightTheme; 