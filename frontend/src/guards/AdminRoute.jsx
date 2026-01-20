import { Navigate, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import PropTypes from 'prop-types';
import { usePermissions } from '../hooks/usePermissions';
import Loading from '../components/common/Loading';
import { Box, Container, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

/**
 * Route guard for admin pages
 * Checks authentication and role-based access
 */
const AdminRoute = ({
  children,
  requiredRoles = [],
  requiredPermission = null,
  fallbackPath = '/',
}) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { isAuthenticated, isLoading: authLoading, loginWithRedirect } = useAuth0();
  const { hasAnyRole, permissions, loading: permissionsLoading, canManageContent } = usePermissions();

  // Show loading while checking auth
  if (authLoading || permissionsLoading) {
    return <Loading fullScreen message={t('common.loading', 'Loading...')} />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: 3,
          }}
        >
          <LockOutlinedIcon sx={{ fontSize: 80, color: 'text.secondary' }} />
          <Typography variant="h5" gutterBottom>
            {t('admin.auth.loginRequired', 'Authentication Required')}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            {t('admin.auth.loginMessage', 'Please sign in to access the admin panel.')}
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => loginWithRedirect({
              appState: { returnTo: location.pathname },
            })}
          >
            {t('common.signIn', 'Sign In')}
          </Button>
        </Box>
      </Container>
    );
  }

  // Check if user has required roles
  if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
    return <AccessDenied />;
  }

  // Check specific permission
  if (requiredPermission && !permissions[requiredPermission]) {
    return <AccessDenied />;
  }

  // Check basic admin access
  if (!canManageContent) {
    return <AccessDenied />;
  }

  return children;
};

/**
 * Access denied component
 */
const AccessDenied = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: 3,
        }}
      >
        <LockOutlinedIcon sx={{ fontSize: 80, color: 'error.main' }} />
        <Typography variant="h5" gutterBottom>
          {t('admin.auth.accessDenied', 'Access Denied')}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          {t('admin.auth.noPermission', 'You do not have permission to access this page.')}
        </Typography>
        <Button variant="contained" href="/">
          {t('common.goHome', 'Go to Home')}
        </Button>
      </Box>
    </Container>
  );
};

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRoles: PropTypes.arrayOf(PropTypes.string),
  requiredPermission: PropTypes.string,
  fallbackPath: PropTypes.string,
};

export default AdminRoute;
