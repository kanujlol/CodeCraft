import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import VideoRoom from './components/VideoRoom';
import './index.css';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#039be5',
    },
    secondary: {
      main: '#ff6e40',
    },
    background: {
      default: '#ECEFF1',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Codecraft LiveConnect: Collaborate, Discuss, and Code Together
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <VideoRoom />
      </Container>
    </ThemeProvider>
  );
}

export default App;