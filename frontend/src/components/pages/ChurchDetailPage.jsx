import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Breadcrumbs,
  Link,
  Skeleton,
  Alert,
  Chip,
  Stack,
  Divider,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  ImageList,
  ImageListItem,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ChurchIcon from '@mui/icons-material/Church';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DirectionsIcon from '@mui/icons-material/Directions';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { churchesApi } from '../../services/api';

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

const ChurchDetailPage = () => {
  const { t, i18n } = useTranslation('churches');
  const { t: tCommon } = useTranslation('common');
  const { country, department, slug } = useParams();
  const navigate = useNavigate();
  const currentLang = i18n.language;

  const [church, setChurch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChurch = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await churchesApi.getBySlug(slug);
        setChurch(response.data);
      } catch (err) {
        setError(err.message || 'Error loading church');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchChurch();
    }
  }, [slug]);

  const handleGetDirections = () => {
    if (church?.coordinates?.lat && church?.coordinates?.lng) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${church.coordinates.lat},${church.coordinates.lng}`,
        '_blank'
      );
    } else if (church?.address) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${church.name}, ${church.address}, ${church.city}, ${church.country}`)}`,
        '_blank'
      );
    }
  };

  const getLocalizedText = (obj) => {
    if (!obj) return '';
    return obj[currentLang] || obj.es || obj.en || '';
  };

  const levelLabels = {
    headquarters: 'Sede Central Internacional',
    country: 'Sede Nacional',
    department: 'Sede Departamental',
    province: 'Sede Provincial',
    local: 'Iglesia Local',
  };

  const renderBreadcrumbs = () => (
    <Breadcrumbs sx={{ mb: 3 }}>
      <Link
        underline="hover"
        color="inherit"
        href="/"
        onClick={(e) => { e.preventDefault(); navigate('/'); }}
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
      </Link>
      <Link
        underline="hover"
        color="inherit"
        href="/churches"
        onClick={(e) => { e.preventDefault(); navigate('/churches'); }}
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        <ChurchIcon sx={{ mr: 0.5 }} fontSize="small" />
        {t('title')}
      </Link>
      {country && (
        <Link
          underline="hover"
          color="inherit"
          href={`/churches/${country}`}
          onClick={(e) => { e.preventDefault(); navigate(`/churches/${country}`); }}
        >
          {decodeURIComponent(country)}
        </Link>
      )}
      {department && (
        <Link
          underline="hover"
          color="inherit"
          href={`/churches/${country}/${department}`}
          onClick={(e) => { e.preventDefault(); navigate(`/churches/${country}/${department}`); }}
        >
          {decodeURIComponent(department)}
        </Link>
      )}
      {church && (
        <Typography color="text.primary">{church.name}</Typography>
      )}
    </Breadcrumbs>
  );

  const renderSkeleton = () => (
    <Box>
      <Skeleton variant="rectangular" height={300} sx={{ mb: 3 }} />
      <Skeleton variant="text" width="60%" height={48} />
      <Skeleton variant="text" width="40%" />
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          <Skeleton variant="rectangular" height={200} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Skeleton variant="rectangular" height={200} />
        </Grid>
      </Grid>
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ py: 4 }}>
        <Container maxWidth="lg">
          {renderBreadcrumbs()}
          {renderSkeleton()}
        </Container>
      </Box>
    );
  }

  if (error || !church) {
    return (
      <Box sx={{ py: 4 }}>
        <Container maxWidth="lg">
          {renderBreadcrumbs()}
          <Alert severity="error">{error || 'Church not found'}</Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        {renderBreadcrumbs()}

        {/* Hero Section */}
        <Box
          sx={{
            position: 'relative',
            height: { xs: 200, md: 300 },
            borderRadius: 2,
            overflow: 'hidden',
            mb: 4,
          }}
        >
          <Box
            component="img"
            src={church.coverImage || '/images/church-placeholder.jpg'}
            alt={church.name}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              p: 3,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
              color: 'white',
            }}
          >
            <Stack direction="row" spacing={1} mb={1}>
              {church.isHeadquarters && (
                <Chip label="Sede Central" size="small" color="primary" />
              )}
              {church.level && (
                <Chip
                  label={levelLabels[church.level]}
                  size="small"
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
              )}
            </Stack>
            <Typography variant="h3" component="h1" fontWeight={700}>
              {church.name}
            </Typography>
            <Typography variant="subtitle1">
              {church.city}, {church.department}, {church.country}
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            {/* About Section */}
            {(church.description || church.history) && (
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom fontWeight={600}>
                  {t('detail.about')}
                </Typography>
                {church.description && (
                  <Typography variant="body1" paragraph>
                    {getLocalizedText(church.description)}
                  </Typography>
                )}
                {church.history && (
                  <>
                    <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mt: 3 }}>
                      {t('detail.history')}
                    </Typography>
                    <Typography variant="body1">
                      {getLocalizedText(church.history)}
                    </Typography>
                  </>
                )}
                {church.foundedDate && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Fundada: {new Date(church.foundedDate).toLocaleDateString(currentLang)}
                  </Typography>
                )}
              </Paper>
            )}

            {/* Service Schedule */}
            {church.serviceSchedule?.length > 0 && (
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom fontWeight={600}>
                  {t('detail.schedule')}
                </Typography>
                <List>
                  {church.serviceSchedule.map((service, index) => (
                    <ListItem key={index} divider={index < church.serviceSchedule.length - 1}>
                      <ListItemIcon>
                        <AccessTimeIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography fontWeight={600}>
                            {tCommon(`time.days.${DAYS[service.dayOfWeek]}`)} - {service.startTime}
                            {service.endTime && ` - ${service.endTime}`}
                          </Typography>
                        }
                        secondary={
                          t(`schedule.${service.type?.replace('_', '')}`, service.typeName || service.type)
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}

            {/* Leadership */}
            {church.leadership?.length > 0 && (
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom fontWeight={600}>
                  {t('detail.leadership')}
                </Typography>
                <Grid container spacing={2}>
                  {church.leadership.map((leader, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          src={leader.user?.avatar}
                          sx={{ width: 56, height: 56 }}
                        >
                          {leader.user?.firstName?.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography fontWeight={600}>
                            {leader.user?.firstName} {leader.user?.lastName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {leader.title || leader.role}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            )}

            {/* Gallery */}
            {church.gallery?.length > 0 && (
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom fontWeight={600}>
                  {t('detail.gallery')}
                </Typography>
                <ImageList cols={3} gap={8}>
                  {church.gallery.slice(0, 6).map((image, index) => (
                    <ImageListItem key={index}>
                      <img
                        src={image.url}
                        alt={getLocalizedText(image.caption) || `Gallery ${index + 1}`}
                        loading="lazy"
                        style={{ borderRadius: 8 }}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </Paper>
            )}
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Contact Card */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                {t('detail.contact')}
              </Typography>

              <List dense>
                {/* Address */}
                <ListItem>
                  <ListItemIcon>
                    <LocationOnIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={church.address}
                    secondary={`${church.city}, ${church.department}, ${church.country}`}
                  />
                </ListItem>

                {/* Phone */}
                {church.phone && (
                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText>
                      <Link href={`tel:${church.phone}`} underline="hover">
                        {church.phone}
                      </Link>
                    </ListItemText>
                  </ListItem>
                )}

                {/* Email */}
                {church.email && (
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText>
                      <Link href={`mailto:${church.email}`} underline="hover">
                        {church.email}
                      </Link>
                    </ListItemText>
                  </ListItem>
                )}

                {/* Website */}
                {church.website && (
                  <ListItem>
                    <ListItemIcon>
                      <LanguageIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText>
                      <Link href={church.website} target="_blank" underline="hover">
                        {church.website}
                      </Link>
                    </ListItemText>
                  </ListItem>
                )}
              </List>

              <Button
                variant="contained"
                fullWidth
                startIcon={<DirectionsIcon />}
                onClick={handleGetDirections}
                sx={{ mt: 2 }}
              >
                {t('card.getDirections')}
              </Button>
            </Paper>

            {/* Social Media */}
            {church.socialMedia && Object.values(church.socialMedia).some(Boolean) && (
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Redes Sociales
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {church.socialMedia.facebook && (
                    <Button
                      variant="outlined"
                      startIcon={<FacebookIcon />}
                      href={church.socialMedia.facebook}
                      target="_blank"
                      size="small"
                    >
                      Facebook
                    </Button>
                  )}
                  {church.socialMedia.youtube && (
                    <Button
                      variant="outlined"
                      startIcon={<YouTubeIcon />}
                      href={church.socialMedia.youtube}
                      target="_blank"
                      size="small"
                      color="error"
                    >
                      YouTube
                    </Button>
                  )}
                  {church.socialMedia.instagram && (
                    <Button
                      variant="outlined"
                      startIcon={<InstagramIcon />}
                      href={church.socialMedia.instagram}
                      target="_blank"
                      size="small"
                      sx={{ color: '#E4405F', borderColor: '#E4405F' }}
                    >
                      Instagram
                    </Button>
                  )}
                  {church.socialMedia.whatsapp && (
                    <Button
                      variant="outlined"
                      startIcon={<WhatsAppIcon />}
                      href={`https://wa.me/${church.socialMedia.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      size="small"
                      color="success"
                    >
                      WhatsApp
                    </Button>
                  )}
                </Stack>
              </Paper>
            )}

            {/* Map Placeholder */}
            {church.coordinates?.lat && church.coordinates?.lng && (
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  {t('detail.location')}
                </Typography>
                <Box
                  sx={{
                    height: 200,
                    bgcolor: 'grey.200',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography color="text.secondary">
                    Mapa (Leaflet integration pending)
                  </Typography>
                </Box>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ChurchDetailPage;
