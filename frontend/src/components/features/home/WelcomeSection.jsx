import { Box, Container, Typography, Button, Grid, Avatar } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const WelcomeSection = () => {
  const { t } = useTranslation('home');

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
                  {t('welcome.imagePlaceholder')}
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
                  {t('welcome.yearsMinistry')}
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
              {t('welcome.whoWeAre')}
            </Typography>
            <Typography variant="h2" color="primary.main" sx={{ mb: 3, mt: 1 }}>
              {t('welcome.welcomeFamily')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {t('welcome.description')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              {t('welcome.description2')}
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
                {t('welcome.pastorInitials')}
              </Avatar>
              <Box>
                <Typography variant="h6" color="primary.main">
                  {t('welcome.pastorName')}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontStyle="italic">
                  "{t('welcome.pastorQuote')}"
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
              {t('welcome.learnMore')}
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default WelcomeSection;
