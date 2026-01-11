import { Box, Container, Typography, Card, CardContent, Button, Grid, Avatar } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import GroupsIcon from '@mui/icons-material/Groups';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PublicIcon from '@mui/icons-material/Public';
import PeopleIcon from '@mui/icons-material/People';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { SectionTitle } from '../../common';

// Mock data - replace with API call
const mockMinistries = [
  {
    id: 1,
    name: "Children's Ministry",
    shortDescription: 'Fun and faith-filled programs for kids nursery through 5th grade.',
    type: 'children',
    icon: ChildCareIcon,
  },
  {
    id: 2,
    name: 'Youth Ministry',
    shortDescription: 'Helping teens grow in faith and build lasting friendships.',
    type: 'youth',
    icon: GroupsIcon,
  },
  {
    id: 3,
    name: 'Worship & Arts',
    shortDescription: 'Leading worship through music and creative arts.',
    type: 'worship',
    icon: MusicNoteIcon,
  },
  {
    id: 4,
    name: 'Missions & Outreach',
    shortDescription: 'Serving locally and globally to share Christ\'s love.',
    type: 'missions',
    icon: PublicIcon,
  },
  {
    id: 5,
    name: 'Care & Support',
    shortDescription: 'Compassionate support for those in need.',
    type: 'care_support',
    icon: FavoriteIcon,
  },
  {
    id: 6,
    name: 'Small Groups',
    shortDescription: 'Connect with others in meaningful community.',
    type: 'groups',
    icon: PeopleIcon,
  },
];

const MinistryCard = ({ ministry }) => {
  const IconComponent = ministry.icon;

  return (
    <Card
      sx={{
        height: '100%',
        textAlign: 'center',
        transition: 'all 0.3s ease',
        '&:hover': {
          '& .ministry-icon': {
            backgroundColor: 'secondary.main',
            transform: 'scale(1.1)',
          },
        },
      }}
    >
      <CardContent sx={{ py: 4 }}>
        <Avatar
          className="ministry-icon"
          sx={{
            width: 80,
            height: 80,
            backgroundColor: 'primary.main',
            mx: 'auto',
            mb: 3,
            transition: 'all 0.3s ease',
          }}
        >
          <IconComponent sx={{ fontSize: 40 }} />
        </Avatar>
        <Typography variant="h5" color="primary.main" gutterBottom>
          {ministry.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {ministry.shortDescription}
        </Typography>
        <Button
          variant="text"
          color="primary"
          component={RouterLink}
          to={`/ministries/${ministry.id}`}
          endIcon={<ArrowForwardIcon />}
        >
          Learn More
        </Button>
      </CardContent>
    </Card>
  );
};

const MinistriesSection = ({ ministries = mockMinistries }) => {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        <SectionTitle
          title="Our Ministries"
          subtitle="We offer a variety of ministries to help you grow in your faith and connect with others."
        />

        <Grid container spacing={4}>
          {ministries.slice(0, 6).map((ministry) => (
            <Grid item xs={12} sm={6} md={4} key={ministry.id}>
              <MinistryCard ministry={ministry} />
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={RouterLink}
            to="/ministries"
            endIcon={<ArrowForwardIcon />}
          >
            Explore All Ministries
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default MinistriesSection;
