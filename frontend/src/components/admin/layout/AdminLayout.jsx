import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const DRAWER_WIDTH = 260;
const DRAWER_COLLAPSED_WIDTH = 72;

const AdminLayout = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Get page title from current path
  const getPageTitle = () => {
    const path = location.pathname;

    if (path === '/admin') return t('admin.nav.dashboard', 'Dashboard');
    if (path.includes('/admin/churches')) return t('admin.nav.churches', 'Churches');
    if (path.includes('/admin/events')) return t('admin.nav.events', 'Events');
    if (path.includes('/admin/sermons')) return t('admin.nav.sermons', 'Sermons');
    if (path.includes('/admin/ministries')) return t('admin.nav.ministries', 'Ministries');
    if (path.includes('/admin/questions')) return t('admin.nav.questions', 'Questions');
    if (path.includes('/admin/users')) return t('admin.nav.users', 'Users');

    return t('admin.title', 'Admin Panel');
  };

  // Close mobile sidebar on route change
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCollapseSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sidebar */}
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={!isMobile && sidebarCollapsed}
      />

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          ml: isMobile ? 0 : sidebarCollapsed ? `${DRAWER_COLLAPSED_WIDTH}px` : `${DRAWER_WIDTH}px`,
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        {/* Header */}
        <AdminHeader
          title={getPageTitle()}
          onToggleSidebar={handleToggleSidebar}
          sidebarCollapsed={sidebarCollapsed}
          onCollapseSidebar={handleCollapseSidebar}
        />

        {/* Page content */}
        <Box
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3 },
            mt: 8, // Account for header height
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
