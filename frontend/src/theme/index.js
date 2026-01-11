import { createTheme } from '@mui/material/styles';

// Church colors: Red, Blue, White
const theme = createTheme({
  palette: {
    primary: {
      main: '#1a365d', // Deep blue
      light: '#2c5282',
      dark: '#0f2942',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#c53030', // Church red
      light: '#e53e3e',
      dark: '#9b2c2c',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f7fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a202c',
      secondary: '#4a5568',
    },
    error: {
      main: '#e53e3e',
    },
    warning: {
      main: '#dd6b20',
    },
    info: {
      main: '#3182ce',
    },
    success: {
      main: '#38a169',
    },
    divider: '#e2e8f0',
  },
  typography: {
    fontFamily: '"Open Sans", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 700,
      fontSize: '3.5rem',
      lineHeight: 1.2,
      '@media (max-width:600px)': {
        fontSize: '2.5rem',
      },
    },
    h2: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
      fontSize: '2.5rem',
      lineHeight: 1.3,
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h3: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.4,
    },
    h4: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 500,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: '1.125rem',
      lineHeight: 1.6,
      color: '#4a5568',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 1px 3px rgba(0, 0, 0, 0.08)',
    '0px 2px 6px rgba(0, 0, 0, 0.08)',
    '0px 4px 12px rgba(0, 0, 0, 0.08)',
    '0px 8px 24px rgba(0, 0, 0, 0.08)',
    '0px 12px 32px rgba(0, 0, 0, 0.1)',
    '0px 16px 40px rgba(0, 0, 0, 0.1)',
    '0px 20px 48px rgba(0, 0, 0, 0.12)',
    '0px 24px 56px rgba(0, 0, 0, 0.12)',
    '0px 28px 64px rgba(0, 0, 0, 0.14)',
    ...Array(15).fill('0px 28px 64px rgba(0, 0, 0, 0.14)'),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontSize: '1rem',
        },
        contained: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
          '&:hover': {
            boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.2)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #1a365d 0%, #2c5282 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #0f2942 0%, #1a365d 100%)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #c53030 0%, #e53e3e 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #9b2c2c 0%, #c53030 100%)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
          borderRadius: 12,
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    },
  },
});

export default theme;
