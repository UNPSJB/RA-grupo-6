import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light', // se puede cambiar a dark
    primary: {
      main: '#1976d2', 
    },
    secondary: {
      main: '#dc004e', 
    },
    background: {
      default: '#f4f6f8', // color de fondo
      paper: '#ffffff', // fondo de los componentes
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    // estilos por defecto para componentes específicos
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff', // color del navbar
          color: '#1a2027', // texto del navbar
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)', // sombra navbar
        },
      },
    },
  },
});

export default theme;