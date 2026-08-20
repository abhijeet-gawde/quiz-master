import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import App from './App';
import './styles.css';

const theme = createTheme({
  palette: { primary: { main: '#e85d46', contrastText: '#fff' }, background: { default: '#f6f7fb', paper: '#fff' }, text: { primary: '#19232d', secondary: '#68737d' }, success: { main: '#2f8766' } },
  typography: { fontFamily: '"DM Sans", sans-serif', button: { textTransform: 'none', fontWeight: 800 } },
  shape: { borderRadius: 14 },
  components: { MuiButton: { styleOverrides: { root: { borderRadius: 10, padding: '11px 18px' } } }, MuiLinearProgress: { styleOverrides: { root: { height: 8, borderRadius: 8, backgroundColor: '#e8ebf0' }, bar: { borderRadius: 8 } } } }
});

createRoot(document.getElementById('root')).render(<ThemeProvider theme={theme}><BrowserRouter><App /></BrowserRouter></ThemeProvider>);
