import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Box,
  Button,
  Chip,
  Stack,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DirectionsIcon from '@mui/icons-material/Directions';

const ChurchCard = ({ church, variant = 'standard' }) => {
  const { t, i18n } = useTranslation('churches');
  const navigate = useNavigate();
  const currentLang = i18n.language;

  const {
    name,
    slug,
    country,
    department,
    city,
    address,
    phone,
    coverImage,
    logo,
    level,
    isHeadquarters,
    serviceSchedule = [],
    shortDescription,
  } = church;

  const handleViewDetails = () => {
    const urlPath = `/churches/${country?.toLowerCase()}/${department?.toLowerCase()}/${slug}`;
    navigate(urlPath);
  };

  const handleGetDirections = () => {
    if (church.coordinates?.lat && church.coordinates?.lng) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${church.coordinates.lat},${church.coordinates.lng}`,
        '_blank'
      );
    } else if (address) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name}, ${address}, ${city}, ${country}`)}`,
        '_blank'
      );
    }
  };

  // Get first service for display
  const mainService = serviceSchedule.find(s => s.type === 'sunday_service') || serviceSchedule[0];

  // Get description in current language
  const description = shortDescription?.[currentLang] || shortDescription?.es || '';

  // Level labels
  const levelLabels = {
    headquarters: 'Sede Central',
    country: 'Nacional',
    department: 'Departamental',
    province: 'Provincial',
    local: 'Local',
  };

  if (variant === 'compact') {
    return (
      <Card
        sx={{
          display: 'flex',
          cursor: 'pointer',
          transition: 'box-shadow 0.2s',
          '&:hover': { boxShadow: 4 },
        }}
        onClick={handleViewDetails}
      >
        {logo && (
          <CardMedia
            component="img"
            sx={{ width: 80, objectFit: 'contain', p: 1 }}
            image={logo}
            alt={name}
          />
        )}
        <CardContent sx={{ flex: 1, py: 1.5 }}>
          <Typography variant="subtitle1" fontWeight={600} noWrap>
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {city}, {department}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
      }}
    >
      {/* Cover Image */}
      <CardMedia
        component="img"
        height={180}
        image={coverImage || '/images/church-placeholder.jpg'}
        alt={name}
        sx={{ objectFit: 'cover' }}
      />

      <CardContent sx={{ flexGrow: 1 }}>
        {/* Badges */}
        <Stack direction="row" spacing={1} mb={1}>
          {isHeadquarters && (
            <Chip
              label="Sede Central"
              size="small"
              color="primary"
            />
          )}
          {level && level !== 'headquarters' && (
            <Chip
              label={levelLabels[level] || level}
              size="small"
              variant="outlined"
            />
          )}
        </Stack>

        {/* Name */}
        <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
          {name}
        </Typography>

        {/* Description */}
        {description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {description}
          </Typography>
        )}

        {/* Location */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
          <LocationOnIcon fontSize="small" color="action" sx={{ mt: 0.3 }} />
          <Typography variant="body2" color="text.secondary">
            {address ? `${address}, ` : ''}{city}, {department}, {country}
          </Typography>
        </Box>

        {/* Phone */}
        {phone && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <PhoneIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {phone}
            </Typography>
          </Box>
        )}

        {/* Service Time */}
        {mainService && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTimeIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {t(`schedule.${mainService.type?.replace('_', '')}`, mainService.type)} - {mainService.startTime}
            </Typography>
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button
          size="small"
          variant="contained"
          onClick={handleViewDetails}
          fullWidth
        >
          {t('card.viewDetails')}
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<DirectionsIcon />}
          onClick={handleGetDirections}
        >
          {t('card.getDirections')}
        </Button>
      </CardActions>
    </Card>
  );
};

export default ChurchCard;
