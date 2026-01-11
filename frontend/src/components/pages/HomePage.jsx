import { Box } from '@mui/material';
import {
  HeroSection,
  WelcomeSection,
  UpcomingEvents,
  LatestSermon,
  MinistriesSection,
  CTASection,
  ContactSection,
} from '../features/home';

const HomePage = () => {
  return (
    <Box>
      {/* Hero Section with service times */}
      <HeroSection />

      {/* Welcome message from pastor */}
      <WelcomeSection />

      {/* Upcoming events preview */}
      <UpcomingEvents />

      {/* Latest sermon with video */}
      <LatestSermon />

      {/* Ministries highlight */}
      <MinistriesSection />

      {/* Call-to-action: Connect & Give */}
      <CTASection />

      {/* Contact form and info */}
      <ContactSection />
    </Box>
  );
};

export default HomePage;
