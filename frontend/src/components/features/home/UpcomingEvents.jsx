import { Box, Container, Typography, Card, CardContent, Button, Grid, Chip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { SectionTitle } from '../../common';
import { formatDate, formatTime } from '../../../helpers/formatters';

// Mock data - replace with API call
const mockEvents = [
  {
    id: 1,
    title: 'Sunday Worship Service',
    description: 'Join us for our weekly Sunday worship service.',
    startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    location: { name: 'Main Sanctuary' },
    type: 'service',
    isFeatured: true,
  },
  {
    id: 2,
    title: 'Youth Group Night',
    description: 'Fun and faith-filled evening for teens.',
    startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    location: { name: 'Youth Center' },
    type: 'youth_event',
    isFeatured: false,
  },
  {
    id: 3,
    title: 'Community Outreach Day',
    description: 'Serving our community together.',
    startDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    location: { name: 'Church Parking Lot' },
    type: 'outreach',
    isFeatured: true,
  },
];

const EventCard = ({ event, featured = false, t }) => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'visible',
        ...(featured && {
          border: '2px solid',
          borderColor: 'secondary.main',
        }),
      }}
    >
      {featured && (
        <Chip
          label={t('upcomingEvents.featured')}
          color="secondary"
          size="small"
          sx={{
            position: 'absolute',
            top: -12,
            right: 16,
          }}
        />
      )}
      <CardContent sx={{ flexGrow: 1, pt: featured ? 3 : 2 }}>
        {/* Date badge */}
        <Box
          sx={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'primary.main',
            color: 'white',
            borderRadius: 2,
            px: 2,
            py: 1,
            mb: 2,
          }}
        >
          <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
            {formatDate(event.startDate, 'MMM')}
          </Typography>
          <Typography variant="h5" fontWeight={700}>
            {formatDate(event.startDate, 'D')}
          </Typography>
        </Box>

        <Typography variant="h5" color="primary.main" gutterBottom>
          {event.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {event.description}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTimeIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {formatTime(event.startDate)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOnIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {event.location.name}
            </Typography>
          </Box>
        </Box>
      </CardContent>
      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          component={RouterLink}
          to={`/events/${event.id}`}
        >
          {t('upcomingEvents.learnMore')}
        </Button>
      </Box>
    </Card>
  );
};

const UpcomingEvents = ({ events = mockEvents }) => {
  const { t } = useTranslation('home');

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: 'white' }}>
      <Container maxWidth="lg">
        <SectionTitle
          title={t('upcomingEvents.title')}
          subtitle={t('upcomingEvents.description')}
        />

        <Grid container spacing={4}>
          {events.slice(0, 3).map((event) => (
            <Grid item xs={12} md={4} key={event.id}>
              <EventCard event={event} featured={event.isFeatured} t={t} />
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={RouterLink}
            to="/events"
            startIcon={<CalendarMonthIcon />}
            endIcon={<ArrowForwardIcon />}
          >
            {t('upcomingEvents.viewAll')}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default UpcomingEvents;
