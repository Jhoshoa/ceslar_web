import { Box } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Header />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: { xs: '64px', md: '72px' }, // Account for fixed header
        }}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
