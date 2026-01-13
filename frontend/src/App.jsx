import { Routes, Route } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Layout from './components/layout/Layout';
import HomePage from './components/pages/HomePage';
import ChurchesPage from './components/pages/ChurchesPage';
import ChurchDetailPage from './components/pages/ChurchDetailPage';
import Loading from './components/common/Loading';

// Lazy load other pages for better performance
// import AboutPage from './components/pages/AboutPage';
// import MinistriesPage from './components/pages/MinistriesPage';
// import SermonsPage from './components/pages/SermonsPage';
// import EventsPage from './components/pages/EventsPage';
// import ContactPage from './components/pages/ContactPage';
// import GivePage from './components/pages/GivePage';

function App() {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return <Loading fullScreen message="Loading..." />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* Church Routes */}
        <Route path="/churches" element={<ChurchesPage />} />
        <Route path="/churches/:country" element={<ChurchesPage />} />
        <Route path="/churches/:country/:department" element={<ChurchesPage />} />
        <Route path="/churches/:country/:department/:slug" element={<ChurchDetailPage />} />

        {/* Add more routes as pages are created */}
        {/* <Route path="/about" element={<AboutPage />} /> */}
        {/* <Route path="/ministries" element={<MinistriesPage />} /> */}
        {/* <Route path="/sermons" element={<SermonsPage />} /> */}
        {/* <Route path="/events" element={<EventsPage />} /> */}
        {/* <Route path="/contact" element={<ContactPage />} /> */}
        {/* <Route path="/give" element={<GivePage />} /> */}
      </Routes>
    </Layout>
  );
}

export default App;
