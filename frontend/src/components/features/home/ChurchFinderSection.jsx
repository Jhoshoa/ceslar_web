import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
} from '@mui/material';
import ChurchIcon from '@mui/icons-material/Church';
import { ChurchSelector } from '../churches';

const ChurchFinderSection = () => {
  const { t } = useTranslation('churches');
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        py: 8,
        bgcolor: 'primary.main',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <ChurchIcon sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h3" component="h2" fontWeight={700} gutterBottom>
            {t('title')}
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
            {t('subtitle')}
          </Typography>
        </Box>

        <Paper
          elevation={4}
          sx={{
            p: 4,
            maxWidth: 900,
            mx: 'auto',
            borderRadius: 2,
          }}
        >
          <ChurchSelector
            variant="outlined"
            size="medium"
            showSearchButton={true}
          />
        </Paper>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/churches')}
            sx={{
              color: 'white',
              borderColor: 'white',
              '&:hover': {
                borderColor: 'white',
                bgcolor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            Ver todas las iglesias
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ChurchFinderSection;
