import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#0052cc',
      light: '#2563eb',
      dark: '#003d99',
    },
    secondary: {
      main: '#5e6c84',
    },
    error: {
      main: '#dc2626',
    },
    warning: {
      main: '#ffab00',
    },
    success: {
      main: '#36b37e',
    },
    info: {
      main: '#97a0af',
    },
    background: {
      default: '#f4f5f7',
      paper: '#ffffff',
    },
    text: {
      primary: '#172b4d',
      secondary: '#5e6c84',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '0.875rem',
    },
    body2: {
      fontSize: '0.75rem',
    },
  },
  shape: {
    borderRadius: 6,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 1px rgba(9, 30, 66, 0.15)',
        },
      },
    },
  },
});
