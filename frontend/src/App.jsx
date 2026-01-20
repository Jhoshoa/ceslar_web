import { Routes, Route } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Layout from './components/layout/Layout';
import HomePage from './components/pages/HomePage';
import ChurchesPage from './components/pages/ChurchesPage';
import ChurchDetailPage from './components/pages/ChurchDetailPage';
import DoctrinePage from './components/pages/DoctrinePage';
import AboutPage from './components/pages/AboutPage';
import ContactPage from './components/pages/ContactPage';
import Loading from './components/common/Loading';
import PWAPrompts from './components/common/PWAPrompts';
import AuthCallbackPage from './components/pages/AuthCallbackPage';
import AuthDebugPage from './components/pages/AuthDebugPage';

// Admin imports
import AdminRoute from './guards/AdminRoute';
import { AdminLayout } from './components/admin/layout';
import {
  AdminDashboardPage,
  AdminChurchesPage,
  AdminChurchFormPage,
  AdminEventsPage,
  AdminEventFormPage,
  AdminSermonsPage,
  AdminSermonFormPage,
  AdminMinistriesPage,
  AdminMinistryFormPage,
  AdminQuestionsPage,
  AdminUsersPage,
  AdminUserDetailPage,
} from './components/pages/admin';

function App() {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return <Loading fullScreen message="Loading..." />;
  }

  return (
    <>
      <Routes>
        {/* Auth callback - no layout needed */}
        <Route path="/callback" element={<AuthCallbackPage />} />

        {/* Debug page for Auth0 troubleshooting */}
        <Route path="/auth-debug" element={<AuthDebugPage />} />

        {/* Public Routes - with standard Layout */}
        <Route element={<Layout><HomePage /></Layout>} path="/" />

        {/* Church Routes */}
        <Route path="/churches" element={<Layout><ChurchesPage /></Layout>} />
        <Route path="/churches/:country" element={<Layout><ChurchesPage /></Layout>} />
        <Route path="/churches/:country/:department" element={<Layout><ChurchesPage /></Layout>} />
        <Route path="/churches/:country/:department/:slug" element={<Layout><ChurchDetailPage /></Layout>} />

        {/* Content Pages */}
        <Route path="/about" element={<Layout><AboutPage /></Layout>} />
        <Route path="/doctrine" element={<Layout><DoctrinePage /></Layout>} />
        <Route path="/contact" element={<Layout><ContactPage /></Layout>} />

        {/* Admin Routes - with AdminLayout and protection */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          {/* Dashboard */}
          <Route index element={<AdminDashboardPage />} />

          {/* Churches */}
          <Route path="churches" element={<AdminChurchesPage />} />
          <Route path="churches/new" element={<AdminChurchFormPage />} />
          <Route path="churches/:id" element={<AdminChurchFormPage />} />

          {/* Events */}
          <Route path="events" element={<AdminEventsPage />} />
          <Route path="events/new" element={<AdminEventFormPage />} />
          <Route path="events/:id" element={<AdminEventFormPage />} />

          {/* Sermons */}
          <Route path="sermons" element={<AdminSermonsPage />} />
          <Route path="sermons/new" element={<AdminSermonFormPage />} />
          <Route path="sermons/:id" element={<AdminSermonFormPage />} />

          {/* Ministries */}
          <Route path="ministries" element={<AdminMinistriesPage />} />
          <Route path="ministries/new" element={<AdminMinistryFormPage />} />
          <Route path="ministries/:id" element={<AdminMinistryFormPage />} />

          {/* Questions (System Admin only) */}
          <Route
            path="questions"
            element={
              <AdminRoute requiredRoles={['system_admin']}>
                <AdminQuestionsPage />
              </AdminRoute>
            }
          />

          {/* Users */}
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="users/:id" element={<AdminUserDetailPage />} />
        </Route>
      </Routes>
      <PWAPrompts />
    </>
  );
}

export default App;
