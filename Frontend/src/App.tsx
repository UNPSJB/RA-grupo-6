// Frontend/src/App.tsx

import React from 'react';
import './App.css';
import { 
  AppBar, Toolbar, Typography, Button, Container, Box, Drawer, 
  List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  CssBaseline, Paper, IconButton
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import QuizIcon from '@mui/icons-material/Quiz'; // Para Preguntas
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer'; // Para Respuestas
import SettingsIcon from '@mui/icons-material/Settings'; // Para Configuración

function App() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };
  
  const drawerList = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Toolbar /> 
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon><QuizIcon /></ListItemIcon>
            <ListItemText primary="Preguntas" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon><QuestionAnswerIcon /></ListItemIcon>
            <ListItemText primary="Respuestas" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon><SettingsIcon /></ListItemIcon>
            <ListItemText primary="Configuración" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer(true)}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Panel de control
          </Typography>
          <Button color="inherit">Logout</Button>
        </Toolbar>
      </AppBar>
      
      <Drawer
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawerList}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar /> {/* espaciador para que el contenido no quede debajo del AppBar */}
        
        {/* componente "Paper" para el contenido principal */}
        <Paper elevation={3} sx={{ padding: '24px' }}>
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>
          <Typography paragraph>
            Acá va el contenido principal de la página, como tablas, gráficos,formularios, etc.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}

export default App;