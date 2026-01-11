import { Box, Container, Typography, Button, Grid, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { formatDate, formatDuration } from '../../../helpers/formatters';

// Mock data - replace with API call
const mockSermon = {
  id: 1,
  title: 'The Power of Faith',
  description: 'Exploring how faith can move mountains and transform our daily lives. A powerful message about trusting God in all circumstances.',
  speakerName: 'Pastor John Smith',
  date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  duration: 45,
  series: { name: 'Faith Foundations' },
  scripture: { fullReference: 'Hebrews 11:1-6' },
};

const LatestSermon = ({ sermon = mockSermon }) => {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(135deg, #1a365d 0%, #2c5282 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          background: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\'/%3E%3C/g%3E%3C/svg%3E")',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={6} alignItems="center">
          {/* Video/Thumbnail Side */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                paddingTop: '56.25%', // 16:9 aspect ratio
                backgroundColor: 'rgba(0,0,0,0.3)',
                borderRadius: 3,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconButton
                  sx={{
                    width: 80,
                    height: 80,
                    backgroundColor: 'secondary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'secondary.dark',
                      transform: 'scale(1.1)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <PlayCircleFilledIcon sx={{ fontSize: 50 }} />
                </IconButton>
              </Box>
              {/* Duration badge */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  right: 16,
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                }}
              >
                <Typography variant="caption" fontWeight={600}>
                  {formatDuration(sermon.duration)}
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
              Latest Message
            </Typography>
            <Typography
              variant="h2"
              sx={{ color: 'white', mb: 2, mt: 1 }}
            >
              {sermon.title}
            </Typography>

            {sermon.series && (
              <Typography
                variant="subtitle2"
                sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}
              >
                Series: {sermon.series.name}
              </Typography>
            )}

            <Typography
              variant="body1"
              sx={{ color: 'rgba(255,255,255,0.9)', mb: 3 }}
            >
              {sermon.description}
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                  Speaker
                </Typography>
                <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                  {sermon.speakerName}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                  Date
                </Typography>
                <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                  {formatDate(sermon.date)}
                </Typography>
              </Box>
              {sermon.scripture && (
                <Box>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    Scripture
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                    {sermon.scripture.fullReference}
                  </Typography>
                </Box>
              )}
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                startIcon={<PlayCircleFilledIcon />}
              >
                Watch Now
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<HeadphonesIcon />}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                Listen
              </Button>
              <Button
                variant="text"
                size="large"
                component={RouterLink}
                to="/sermons"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                All Sermons
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LatestSermon;
