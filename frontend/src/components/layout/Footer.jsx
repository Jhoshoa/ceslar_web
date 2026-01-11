import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  TextField,
  Button,
  Divider,
} from '@mui/material';
import ChurchIcon from '@mui/icons-material/Church';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TwitterIcon from '@mui/icons-material/Twitter';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {
  APP_NAME,
  NAV_ITEMS,
  SOCIAL_LINKS,
  CHURCH_INFO,
  SERVICE_TIMES,
} from '../../commons/constants';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        pt: 8,
        pb: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* About Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <ChurchIcon sx={{ fontSize: 32 }} />
              <Typography variant="h5" fontWeight={700}>
                {APP_NAME}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
              A place of faith, hope, and love. Join us as we worship together
              and grow in our relationship with God and one another.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                component="a"
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: 'white', '&:hover': { color: 'secondary.main' } }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                component="a"
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: 'white', '&:hover': { color: 'secondary.main' } }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                component="a"
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: 'white', '&:hover': { color: 'secondary.main' } }}
              >
                <YouTubeIcon />
              </IconButton>
              <IconButton
                component="a"
                href={SOCIAL_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: 'white', '&:hover': { color: 'secondary.main' } }}
              >
                <TwitterIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Quick Links
            </Typography>
            <Box component="nav">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  component={RouterLink}
                  to={item.path}
                  sx={{
                    display: 'block',
                    color: 'rgba(255,255,255,0.8)',
                    py: 0.5,
                    '&:hover': {
                      color: 'white',
                      textDecoration: 'none',
                    },
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Service Times */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Service Times
            </Typography>
            {SERVICE_TIMES.map((service, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTimeIcon sx={{ fontSize: 18, opacity: 0.8 }} />
                  <Typography variant="body2" fontWeight={600}>
                    {service.day} - {service.time}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.8, ml: 3.5 }}>
                  {service.name}
                </Typography>
              </Box>
            ))}
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
              <LocationOnIcon sx={{ fontSize: 20, mt: 0.3 }} />
              <Typography variant="body2">
                {CHURCH_INFO.address.street}
                <br />
                {CHURCH_INFO.address.city}, {CHURCH_INFO.address.state}{' '}
                {CHURCH_INFO.address.zipCode}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <PhoneIcon sx={{ fontSize: 20 }} />
              <Link
                href={`tel:${CHURCH_INFO.phone}`}
                sx={{ color: 'white', '&:hover': { color: 'secondary.main' } }}
              >
                {CHURCH_INFO.phone}
              </Link>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmailIcon sx={{ fontSize: 20 }} />
              <Link
                href={`mailto:${CHURCH_INFO.email}`}
                sx={{ color: 'white', '&:hover': { color: 'secondary.main' } }}
              >
                {CHURCH_INFO.email}
              </Link>
            </Box>
          </Grid>
        </Grid>

        {/* Newsletter */}
        <Box
          sx={{
            mt: 6,
            mb: 4,
            p: 4,
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: 2,
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h5" fontWeight={600}>
                Subscribe to Our Newsletter
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Stay updated with our latest news, events, and sermons.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="form"
                sx={{
                  display: 'flex',
                  gap: 1,
                  flexDirection: { xs: 'column', sm: 'row' },
                }}
              >
                <TextField
                  placeholder="Enter your email"
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      borderRadius: 1,
                    },
                  }}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ whiteSpace: 'nowrap', px: 4 }}
                >
                  Subscribe
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', my: 3 }} />

        {/* Copyright */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            &copy; {currentYear} {APP_NAME}. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link
              component={RouterLink}
              to="/privacy"
              sx={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '0.875rem',
                '&:hover': { color: 'white' },
              }}
            >
              Privacy Policy
            </Link>
            <Link
              component={RouterLink}
              to="/terms"
              sx={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '0.875rem',
                '&:hover': { color: 'white' },
              }}
            >
              Terms of Service
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
