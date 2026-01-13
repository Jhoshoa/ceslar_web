import React, { useState, useEffect } from 'react';
import {
  Snackbar,
  Button,
  IconButton,
  Paper,
  Typography,
  Box,
  Slide,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Close as CloseIcon,
  GetApp as InstallIcon,
  Update as UpdateIcon,
  CloudDone as OfflineIcon,
  SignalWifiOff as OfflineWifiIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import usePWA from '@hooks/usePWA';

/**
 * PWA Prompts Component
 * Handles install prompts, update notifications, and offline status
 */
const PWAPrompts = () => {
  const { t } = useTranslation('common');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    isInstallable,
    isInstalled,
    installApp,
    needRefresh,
    offlineReady,
    updateApp,
    dismissUpdate,
    dismissOfflineReady,
    isOnline,
  } = usePWA();

  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showOfflineNotice, setShowOfflineNotice] = useState(false);
  const [installDismissed, setInstallDismissed] = useState(false);

  // Show install prompt after delay (if not dismissed before)
  useEffect(() => {
    if (isInstallable && !isInstalled && !installDismissed) {
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      const dismissedTime = dismissed ? parseInt(dismissed, 10) : 0;
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);

      // Show again after 7 days if dismissed
      if (!dismissed || daysSinceDismissed > 7) {
        const timer = setTimeout(() => {
          setShowInstallPrompt(true);
        }, 30000); // Show after 30 seconds

        return () => clearTimeout(timer);
      }
    }
  }, [isInstallable, isInstalled, installDismissed]);

  // Show offline notice when going offline
  useEffect(() => {
    if (!isOnline) {
      setShowOfflineNotice(true);
    } else {
      setShowOfflineNotice(false);
    }
  }, [isOnline]);

  const handleInstall = async () => {
    const installed = await installApp();
    if (installed) {
      setShowInstallPrompt(false);
    }
  };

  const handleDismissInstall = () => {
    setShowInstallPrompt(false);
    setInstallDismissed(true);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  return (
    <>
      {/* Install Prompt - Bottom Banner */}
      <Slide direction="up" in={showInstallPrompt} mountOnEnter unmountOnExit>
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: theme.zIndex.snackbar,
            borderRadius: { xs: '16px 16px 0 0', sm: 2 },
            m: { xs: 0, sm: 2 },
            mb: { sm: 2 },
            maxWidth: { sm: 450 },
            mx: { sm: 'auto' },
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: 'white',
              p: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <InstallIcon sx={{ fontSize: 40, mt: 0.5 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {t('pwa.installTitle', 'Instalar aplicacion')}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                  {t('pwa.installMessage', 'Instala nuestra app para acceso rapido y funciones sin conexion.')}
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={handleDismissInstall}
                sx={{ color: 'white', opacity: 0.7, '&:hover': { opacity: 1 } }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="text"
                size="small"
                onClick={handleDismissInstall}
                sx={{ color: 'white', opacity: 0.8 }}
              >
                {t('pwa.notNow', 'Ahora no')}
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={handleInstall}
                startIcon={<InstallIcon />}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': { bgcolor: 'grey.100' },
                }}
              >
                {t('pwa.install', 'Instalar')}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Slide>

      {/* Update Available Snackbar */}
      <Snackbar
        open={needRefresh}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ mb: isMobile ? 8 : 2 }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 2,
            bgcolor: 'info.main',
            color: 'white',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            maxWidth: 400,
          }}
        >
          <UpdateIcon />
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" fontWeight={500}>
              {t('pwa.updateAvailable', 'Nueva version disponible')}
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="small"
            onClick={updateApp}
            sx={{ bgcolor: 'white', color: 'info.main', '&:hover': { bgcolor: 'grey.100' } }}
          >
            {t('pwa.update', 'Actualizar')}
          </Button>
          <IconButton size="small" onClick={dismissUpdate} sx={{ color: 'white' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Paper>
      </Snackbar>

      {/* Offline Ready Snackbar */}
      <Snackbar
        open={offlineReady}
        autoHideDuration={5000}
        onClose={dismissOfflineReady}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 2,
            bgcolor: 'success.main',
            color: 'white',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <OfflineIcon />
          <Typography variant="body2">
            {t('pwa.offlineReady', 'App lista para uso sin conexion')}
          </Typography>
          <IconButton size="small" onClick={dismissOfflineReady} sx={{ color: 'white' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Paper>
      </Snackbar>

      {/* Offline Notice */}
      <Snackbar
        open={showOfflineNotice}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 1.5,
            px: 2,
            bgcolor: 'warning.main',
            color: 'warning.contrastText',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <OfflineWifiIcon fontSize="small" />
          <Typography variant="body2" fontWeight={500}>
            {t('pwa.offline', 'Sin conexion a internet')}
          </Typography>
        </Paper>
      </Snackbar>
    </>
  );
};

export default PWAPrompts;
