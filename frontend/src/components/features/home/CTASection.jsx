import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

const CTASection = () => {
  return (
    <Box sx={{ py: { xs: 8, md: 10 }, backgroundColor: 'white' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Get Connected CTA */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: { xs: 4, md: 6 },
                backgroundColor: 'primary.main',
                borderRadius: 3,
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <GroupAddIcon
                sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }}
              />
              <Typography variant="h3" color="white" gutterBottom>
                Get Connected
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: 'rgba(255,255,255,0.9)', mb: 4 }}
              >
                Join a small group and experience authentic community.
                Find your place to belong and grow together.
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                component={RouterLink}
                to="/connect"
                sx={{ alignSelf: 'center' }}
              >
                Find a Group
              </Button>
            </Box>
          </Grid>

          {/* Give CTA */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: { xs: 4, md: 6 },
                backgroundColor: 'secondary.main',
                borderRadius: 3,
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <VolunteerActivismIcon
                sx={{ fontSize: 60, color: 'white', mb: 2 }}
              />
              <Typography variant="h3" color="white" gutterBottom>
                Support Our Mission
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: 'rgba(255,255,255,0.9)', mb: 4 }}
              >
                Your generosity helps us serve our community, support missions,
                and share the love of Christ with others.
              </Typography>
              <Button
                variant="contained"
                size="large"
                component={RouterLink}
                to="/give"
                sx={{
                  alignSelf: 'center',
                  backgroundColor: 'white',
                  color: 'secondary.main',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.9)',
                  },
                }}
              >
                Give Online
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CTASection;
