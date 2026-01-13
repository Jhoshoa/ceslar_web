import { Box, Container, Typography, Grid, Card, CardContent, Paper, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import FavoriteIcon from '@mui/icons-material/Favorite';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import HealingIcon from '@mui/icons-material/Healing';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CloudIcon from '@mui/icons-material/Cloud';
import PublicIcon from '@mui/icons-material/Public';
import RestoreIcon from '@mui/icons-material/Restore';
import { SectionTitle } from '../common';

const beliefIcons = {
  trinity: AutoAwesomeIcon,
  salvation: FavoriteIcon,
  healing: HealingIcon,
  baptism: WaterDropIcon,
  predestination: AccountBalanceIcon,
  secondComing: CloudIcon,
  millennium: PublicIcon,
  restoration: RestoreIcon,
};

const BeliefCard = ({ beliefKey, title, description }) => {
  const IconComponent = beliefIcons[beliefKey] || CheckCircleIcon;

  return (
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
            width: 70,
            height: 70,
            borderRadius: '50%',
            backgroundColor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
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

const DoctrinePage = () => {
  const { t } = useTranslation('doctrine');

  const beliefs = [
    'trinity',
    'salvation',
    'healing',
    'baptism',
    'predestination',
    'secondComing',
    'millennium',
    'restoration',
  ];

  const principles = [
    'freeWill',
    'religiousFreedom',
    'science',
    'education',
    'authority',
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

      {/* Beliefs Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: 'background.default' }}>
        <Container maxWidth="lg">
          <SectionTitle title={t('beliefs.title')} />

          <Grid container spacing={3}>
            {beliefs.map((beliefKey) => (
              <Grid item xs={12} sm={6} md={3} key={beliefKey}>
                <BeliefCard
                  beliefKey={beliefKey}
                  title={t(`beliefs.${beliefKey}.title`)}
                  description={t(`beliefs.${beliefKey}.description`)}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Principles Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={5}>
              <Typography variant="overline" color="secondary.main" fontWeight={600}>
                {t('principles.title')}
              </Typography>
              <Typography variant="h2" color="primary.main" sx={{ mt: 1, mb: 3 }}>
                {t('principles.title')}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t('intro')}
              </Typography>
            </Grid>
            <Grid item xs={12} md={7}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <List>
                  {principles.map((principle, index) => (
                    <ListItem key={principle} divider={index < principles.length - 1}>
                      <ListItemIcon>
                        <CheckCircleIcon color="secondary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={t(`principles.${principle}`)}
                        primaryTypographyProps={{ fontWeight: 500 }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Mission Section */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          backgroundColor: 'secondary.main',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" gutterBottom>
            {t('mission.title')}
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, lineHeight: 1.8 }}>
            {t('mission.description')}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default DoctrinePage;
