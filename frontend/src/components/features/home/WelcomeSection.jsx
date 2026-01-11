import { Box, Container, Typography, Button, Grid, Avatar } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const WelcomeSection = () => {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          {/* Image/Visual Side */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                height: { xs: 300, md: 450 },
              }}
            >
              {/* Main image placeholder */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: { xs: '10%', md: 0 },
                  width: { xs: '80%', md: '85%' },
                  height: '85%',
                  backgroundColor: 'primary.light',
                  borderRadius: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.2rem',
                  background: 'linear-gradient(135deg, #1a365d 0%, #2c5282 100%)',
                }}
              >
                <Typography variant="h4" sx={{ opacity: 0.3 }}>
                  Church Image
                </Typography>
              </Box>
              {/* Accent box */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: { xs: '5%', md: 0 },
                  width: { xs: 150, md: 200 },
                  height: { xs: 150, md: 200 },
                  backgroundColor: 'secondary.main',
                  borderRadius: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: '0 8px 32px rgba(197,48,48,0.3)',
                }}
              >
                <Typography variant="h2" fontWeight={700}>
                  50+
                </Typography>
                <Typography variant="body2">
                  Years of Ministry
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Content Side */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="overline"
              sx={{
                color: 'secondary.main',
                letterSpacing: 2,
                fontWeight: 600,
              }}
            >
              Who We Are
            </Typography>
            <Typography variant="h2" color="primary.main" sx={{ mb: 3, mt: 1 }}>
              Welcome to Our Family
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              We are a vibrant, welcoming community of believers committed to
              loving God, loving people, and making disciples. Whether you're
              exploring faith for the first time or looking for a church home,
              we invite you to join us.
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Our church is a place where you can find meaningful relationships,
              grow in your faith, and discover your purpose. We believe that
              everyone has a place here, and we can't wait to meet you.
            </Typography>

            {/* Pastor info */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 4,
                p: 3,
                backgroundColor: 'white',
                borderRadius: 2,
                boxShadow: 1,
              }}
            >
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  backgroundColor: 'primary.main',
                  fontSize: '1.5rem',
                }}
              >
                JS
              </Avatar>
              <Box>
                <Typography variant="h6" color="primary.main">
                  Pastor John Smith
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  "We exist to help people find and follow Jesus."
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              color="primary"
              size="large"
              component={RouterLink}
              to="/about"
              endIcon={<ArrowForwardIcon />}
            >
              Learn More About Us
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default WelcomeSection;
