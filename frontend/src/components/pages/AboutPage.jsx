import { Box, Container, Typography, Grid, Card, CardContent, Button, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HistoryIcon from '@mui/icons-material/History';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import GroupsIcon from '@mui/icons-material/Groups';
import ChurchIcon from '@mui/icons-material/Church';
import PublicIcon from '@mui/icons-material/Public';
import PeopleIcon from '@mui/icons-material/People';
import { SectionTitle } from '../common';

const valueIcons = {
  faith: ChurchIcon,
  love: FavoriteIcon,
  service: VolunteerActivismIcon,
  unity: GroupsIcon,
};

const ValueCard = ({ valueKey, title, description }) => {
  const IconComponent = valueIcons[valueKey] || ChurchIcon;

  return (
    <Card
      sx={{
        height: '100%',
        textAlign: 'center',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
          '& .value-icon': {
            backgroundColor: 'secondary.main',
          },
        },
      }}
    >
      <CardContent sx={{ py: 4 }}>
        <Box
          className="value-icon"
          sx={{
            width: 70,
            height: 70,
            borderRadius: '50%',
            backgroundColor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
            transition: 'all 0.3s ease',
          }}
        >
          <IconComponent sx={{ fontSize: 35, color: 'white' }} />
        </Box>
        <Typography variant="h5" color="primary.main" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

const TimelineItem = ({ date, title, description, isLast }) => (
  <Box sx={{ display: 'flex', mb: isLast ? 0 : 4 }}>
    {/* Timeline line */}
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 3 }}>
      <Box
        sx={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          backgroundColor: 'secondary.main',
          border: '3px solid',
          borderColor: 'primary.main',
        }}
      />
      {!isLast && (
        <Box
          sx={{
            width: 2,
            flexGrow: 1,
            backgroundColor: 'primary.light',
            mt: 1,
          }}
        />
      )}
    </Box>
    {/* Content */}
    <Box sx={{ pb: isLast ? 0 : 2 }}>
      <Typography variant="overline" color="secondary.main" fontWeight={600}>
        {date}
      </Typography>
      <Typography variant="h5" color="primary.main" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Box>
  </Box>
);

const StatBox = ({ icon: IconComponent, number, label }) => (
  <Box sx={{ textAlign: 'center' }}>
    <IconComponent sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
    <Typography variant="h3" color="white" fontWeight={700}>
      {number}
    </Typography>
    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
      {label}
    </Typography>
  </Box>
);

const AboutPage = () => {
  const { t } = useTranslation('about');

  const values = ['faith', 'love', 'service', 'unity'];

  const timelineEvents = [
    { key: '1969', ...t('history.timeline.1969', { returnObjects: true }) },
    { key: '1969b', ...t('history.timeline.1969b', { returnObjects: true }) },
    { key: '1972', ...t('history.timeline.1972', { returnObjects: true }) },
    { key: '1978', ...t('history.timeline.1978', { returnObjects: true }) },
    { key: '2002', ...t('history.timeline.2002', { returnObjects: true }) },
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
            {t('title')}
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.9, mb: 3 }}>
            {t('subtitle')}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.85, maxWidth: 700, mx: 'auto' }}>
            {t('intro')}
          </Typography>
        </Container>
      </Box>

      {/* Mission & Vision Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: 'background.default' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 4, height: '100%' }}>
                <Typography variant="h3" color="primary.main" gutterBottom>
                  {t('mission.title')}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {t('mission.description')}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={2}
                sx={{
                  p: 4,
                  height: '100%',
                  backgroundColor: 'primary.main',
                  color: 'white',
                }}
              >
                <Typography variant="h3" gutterBottom>
                  {t('mission.vision.title')}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  {t('mission.vision.description')}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Values Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: 'white' }}>
        <Container maxWidth="lg">
          <SectionTitle title={t('values.title')} />

          <Grid container spacing={3}>
            {values.map((valueKey) => (
              <Grid item xs={12} sm={6} md={3} key={valueKey}>
                <ValueCard
                  valueKey={valueKey}
                  title={t(`values.${valueKey}.title`)}
                  description={t(`values.${valueKey}.description`)}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* History Timeline Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: 'background.default' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            <Grid item xs={12} md={5}>
              <Box sx={{ position: 'sticky', top: 100 }}>
                <HistoryIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h2" color="primary.main" gutterBottom>
                  {t('history.title')}
                </Typography>
                <Typography variant="h5" color="text.secondary">
                  {t('history.subtitle')}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={7}>
              <Box>
                {timelineEvents.map((event, index) => (
                  <TimelineItem
                    key={event.key}
                    date={event.date}
                    title={event.title}
                    description={event.description}
                    isLast={index === timelineEvents.length - 1}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Presence Stats Section */}
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          backgroundColor: 'primary.main',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h3" color="white" textAlign="center" gutterBottom>
            {t('presence.title')}
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: 'rgba(255,255,255,0.8)', textAlign: 'center', mb: 6, maxWidth: 600, mx: 'auto' }}
          >
            {t('presence.description')}
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={4} sm={3}>
              <StatBox icon={PublicIcon} number="6+" label={t('presence.countries')} />
            </Grid>
            <Grid item xs={4} sm={3}>
              <StatBox icon={ChurchIcon} number="50+" label={t('presence.churches')} />
            </Grid>
            <Grid item xs={4} sm={3}>
              <StatBox icon={PeopleIcon} number="10k+" label={t('presence.members')} />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: { xs: 8, md: 10 },
          backgroundColor: 'secondary.main',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" color="white" gutterBottom>
            {t('cta.title')}
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 4 }}>
            {t('cta.description')}
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={RouterLink}
            to="/churches"
            sx={{
              backgroundColor: 'white',
              color: 'secondary.main',
              px: 4,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.9)',
              },
            }}
          >
            {t('cta.button')}
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default AboutPage;
