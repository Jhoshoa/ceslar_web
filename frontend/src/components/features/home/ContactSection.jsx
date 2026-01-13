import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Snackbar,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SendIcon from '@mui/icons-material/Send';
import { SectionTitle } from '../../common';
import { CHURCH_INFO } from '../../../commons/constants';

const ContactSection = () => {
  const { t } = useTranslation('home');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
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
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const contactInfo = [
    {
      icon: LocationOnIcon,
      title: t('contact.address'),
      content: `${CHURCH_INFO.address.street}, ${CHURCH_INFO.address.city}, ${CHURCH_INFO.address.state} ${CHURCH_INFO.address.zipCode}`,
    },
    {
      icon: PhoneIcon,
      title: t('contact.phone'),
      content: CHURCH_INFO.phone,
    },
    {
      icon: EmailIcon,
      title: t('contact.email'),
      content: CHURCH_INFO.email,
    },
    {
      icon: AccessTimeIcon,
      title: t('contact.officeHours'),
      content: CHURCH_INFO.officeHours,
    },
  ];

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        <SectionTitle
          title={t('contact.title')}
          subtitle={t('contact.description')}
        />

        <Grid container spacing={6}>
          {/* Contact Form */}
          <Grid item xs={12} md={7}>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                backgroundColor: 'white',
                p: { xs: 3, md: 5 },
                borderRadius: 3,
                boxShadow: 2,
              }}
            >
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
                <Grid item xs={12}>
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
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={5}>
            <Box sx={{ pl: { md: 4 } }}>
              {contactInfo.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    gap: 2,
                    mb: 4,
                    p: 2,
                    backgroundColor: 'white',
                    borderRadius: 2,
                    boxShadow: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: 2,
                      backgroundColor: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <item.icon sx={{ color: 'white' }} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="primary.main" fontWeight={600}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.content}
                    </Typography>
                  </Box>
                </Box>
              ))}

              {/* Map placeholder */}
              <Box
                sx={{
                  width: '100%',
                  height: 200,
                  backgroundColor: 'grey.200',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography color="text.secondary">{t('contact.mapLocation')}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

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

export default ContactSection;
