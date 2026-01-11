import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import EventIcon from '@mui/icons-material/Event';

const HeroSection = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: { xs: '80vh', md: '90vh' },
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #1a365d 0%, #2c5282 50%, #1a365d 100%)',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.5,
        },
      }}
    >
      {/* Decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(197,48,48,0.2) 0%, transparent 70%)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={8} lg={7}>
            <Typography
              variant="overline"
              sx={{
                color: 'secondary.main',
                letterSpacing: 3,
                fontWeight: 600,
                mb: 2,
                display: 'block',
              }}
            >
              Welcome to Our Church
            </Typography>
            <Typography
              variant="h1"
              sx={{
                color: 'white',
                mb: 3,
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              A Place of Faith,
              <br />
              <Box component="span" sx={{ color: 'secondary.light' }}>
                Hope & Love
              </Box>
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                mb: 4,
                maxWidth: 500,
                fontWeight: 400,
                lineHeight: 1.8,
              }}
            >
              Join our community as we worship together, grow in faith, and
              serve one another. Everyone is welcome here.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                component={RouterLink}
                to="/visit"
                startIcon={<EventIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                }}
              >
                Plan Your Visit
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={RouterLink}
                to="/watch"
                startIcon={<PlayArrowIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  borderColor: 'white',
                  color: 'white',
                  borderWidth: 2,
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 2,
                  },
                }}
              >
                Watch Online
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Service Times Banner */}
        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: 20, md: 40 },
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 4 },
            backgroundColor: 'rgba(255,255,255,0.95)',
            borderRadius: 2,
            px: { xs: 3, sm: 5 },
            py: { xs: 2, sm: 3 },
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            width: { xs: '90%', sm: 'auto' },
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="overline"
              color="secondary.main"
              fontWeight={600}
            >
              Sunday Worship
            </Typography>
            <Typography variant="h5" color="primary.main" fontWeight={700}>
              10:00 AM
            </Typography>
          </Box>
          <Box
            sx={{
              width: { xs: '100%', sm: 1 },
              height: { xs: 1, sm: 'auto' },
              backgroundColor: 'divider',
            }}
          />
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="overline"
              color="secondary.main"
              fontWeight={600}
            >
              Wednesday Bible Study
            </Typography>
            <Typography variant="h5" color="primary.main" fontWeight={700}>
              7:00 PM
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;
