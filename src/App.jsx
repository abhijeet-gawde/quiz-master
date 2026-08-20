import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return <Box className="app"><AppBar position="static" elevation={0}><Toolbar sx={{ maxWidth: 1200, width: '100%', mx: 'auto' }}><Typography component={Link} to="/" className="brand">QUIZ<span>•</span>MASTER</Typography><Typography sx={{ ml: 'auto' }} variant="body2" className="header-note">Learn by checking your thinking</Typography></Toolbar></AppBar><AppRoutes /></Box>;
}
