import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  Alert,
  Snackbar,
  Card,
  CardContent,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SendIcon from '@mui/icons-material/Send';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { CHURCH_INFO } from '../../commons/constants';

const ContactInfoCard = ({ icon: IconComponent, title, content, link }) => (
  <Card
    sx={{
      height: '100%',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 4,
      },
    }}
  >
    <CardContent sx={{ textAlign: 'center', py: 4 }}>
      <Box
        sx={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          backgroundColor: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 2,
        }}
      >
        <IconComponent sx={{ fontSize: 30, color: 'white' }} />
      </Box>
      <Typography variant="h6" color="primary.main" gutterBottom>
        {title}
      </Typography>
      {link ? (
        <Typography
          variant="body2"
          component="a"
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: 'text.secondary',
            textDecoration: 'none',
            '&:hover': { color: 'secondary.main' },
          }}
        >
          {content}
        </Typography>
      ) : (
        <Typography variant="body2" color="text.secondary">
          {content}
        </Typography>
      )}
    </CardContent>
  </Card>
);

const SocialButton = ({ icon: IconComponent, href, label, color }) => (
  <Button
    variant="outlined"
    startIcon={<IconComponent />}
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    sx={{
      borderColor: color,
      color: color,
      '&:hover': {
        borderColor: color,
        backgroundColor: `${color}10`,
      },
    }}
  >
    {label}
  </Button>
);

const ContactPage = () => {
  const { t } = useTranslation('home');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSnackbar({
        open: true,
        message: t('contact.successMessage'),
        severity: 'success',
      });
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 1000);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const contactCards = [
    {
      icon: LocationOnIcon,
      title: t('contact.address'),
      content: `${CHURCH_INFO.address.street}, ${CHURCH_INFO.address.city}`,
    },
    {
      icon: PhoneIcon,
      title: t('contact.phone'),
      content: CHURCH_INFO.phone,
      link: `tel:${CHURCH_INFO.phone}`,
    },
    {
      icon: EmailIcon,
      title: t('contact.email'),
      content: CHURCH_INFO.email,
      link: `mailto:${CHURCH_INFO.email}`,
    },
    {
      icon: AccessTimeIcon,
      title: t('contact.officeHours'),
      content: CHURCH_INFO.officeHours,
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: 'linear-gradient(135deg, #1a365d 0%, #2c5282 100%)',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h1" gutterBottom>
            {t('contact.title')}
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.9 }}>
            {t('contact.subtitle')}
          </Typography>
        </Container>
      </Box>

      {/* Contact Info Cards */}
      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: 'background.default' }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {contactCards.map((card, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <ContactInfoCard {...card} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Contact Form Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            {/* Form */}
            <Grid item xs={12} md={7}>
              <Typography variant="h3" color="primary.main" gutterBottom>
                {t('contact.title')}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                {t('contact.description')}
              </Typography>

              <Paper elevation={2} sx={{ p: 4 }}>
                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label={t('contact.yourName')}
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label={t('contact.emailAddress')}
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label={t('contact.phone')}
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label={t('contact.subject')}
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label={t('contact.yourMessage')}
                        name="message"
                        multiline
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        disabled={loading}
                        endIcon={<SendIcon />}
                        sx={{ minWidth: 200 }}
                      >
                        {loading ? t('contact.sending') : t('contact.send')}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>

            {/* Map & Social */}
            <Grid item xs={12} md={5}>
              {/* Map placeholder */}
              <Box
                sx={{
                  width: '100%',
                  height: 300,
                  backgroundColor: 'grey.200',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 4,
                }}
              >
                <Typography color="text.secondary">{t('contact.mapLocation')}</Typography>
              </Box>

              {/* Social Media */}
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" color="primary.main" gutterBottom>
                  Social Media
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                  <SocialButton
                    icon={FacebookIcon}
                    href="https://facebook.com"
                    label="Facebook"
                    color="#1877F2"
                  />
                  <SocialButton
                    icon={YouTubeIcon}
                    href="https://youtube.com/@CRISTOESLARESPUESTAOFICIAL"
                    label="YouTube"
                    color="#FF0000"
                  />
                  <SocialButton
                    icon={WhatsAppIcon}
                    href="https://wa.me/59133424802"
                    label="WhatsApp"
                    color="#25D366"
                  />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactPage;
