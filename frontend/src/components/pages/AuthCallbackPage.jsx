import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

/**
 * Auth0 callback handler page
 * Handles the redirect after Auth0 login and redirects to the appropriate page
 */
const AuthCallbackPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error } = useAuth0();

  useEffect(() => {
    // If there's an error, show it
    if (error) {
      console.error('Auth0 callback error:', error);
      // Still redirect after a short delay
      setTimeout(() => navigate('/'), 2000);
      return;
    }

    // Once loading is complete, redirect
    if (!isLoading) {
      // Check for returnTo in URL state (set during login)
      const params = new URLSearchParams(window.location.search);
      const returnTo = params.get('returnTo') || '/';

      if (isAuthenticated) {
        // User is logged in, redirect to intended destination or admin
        const destination = returnTo.startsWith('/admin') ? returnTo : '/admin';
        navigate(destination, { replace: true });
      } else {
        // Not authenticated, go home
        navigate('/', { replace: true });
      }
    }
  }, [isLoading, isAuthenticated, error, navigate]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        gap: 2,
      }}
    >
      {error ? (
        <>
          <Typography color="error" variant="h6">
            {t('auth.error', 'Authentication Error')}
          </Typography>
          <Typography color="text.secondary">
            {error.message}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {t('auth.redirecting', 'Redirecting...')}
          </Typography>
        </>
      ) : (
        <>
          <CircularProgress size={48} />
          <Typography color="text.secondary">
            {t('auth.completing', 'Completing sign in...')}
          </Typography>
        </>
      )}
    </Box>
  );
};

export default AuthCallbackPage;
