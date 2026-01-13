import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Typography,
  Box,
} from '@mui/material';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { membershipApi } from '../../../services/api';
import { useAuth } from '../../../hooks/useAuth';

const JoinChurchButton = ({
  church,
  userMembership = null,
  onMembershipChange,
  variant = 'contained',
  fullWidth = false,
}) => {
  const { t } = useTranslation('membership');
  const { isAuthenticated, login } = useAuth();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleOpenDialog = () => {
    if (!isAuthenticated) {
      login({ appState: { returnTo: window.location.pathname } });
      return;
    }
    setDialogOpen(true);
    setError(null);
    setSuccess(null);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setMessage('');
    setError(null);
    if (success && onMembershipChange) {
      onMembershipChange();
    }
    setSuccess(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await membershipApi.requestMembership(church._id, message);
      setSuccess(response.message || t('requestSuccess'));

      if (onMembershipChange) {
        onMembershipChange();
      }
    } catch (err) {
      setError(err.response?.data?.message || t('requestError'));
    } finally {
      setLoading(false);
    }
  };

  // Already a member
  if (userMembership?.status === 'approved') {
    return (
      <Button
        variant="outlined"
        color="success"
        startIcon={<CheckCircleIcon />}
        disabled
        fullWidth={fullWidth}
      >
        {t('alreadyMember')}
      </Button>
    );
  }

  // Pending request
  if (userMembership?.status === 'pending') {
    return (
      <Button
        variant="outlined"
        color="warning"
        startIcon={<HourglassEmptyIcon />}
        disabled
        fullWidth={fullWidth}
      >
        {t('pendingRequest')}
      </Button>
    );
  }

  return (
    <>
      <Button
        variant={variant}
        color="primary"
        startIcon={<GroupAddIcon />}
        onClick={handleOpenDialog}
        fullWidth={fullWidth}
      >
        {t('joinChurch')}
      </Button>

      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {t('joinChurchTitle', { church: church.name })}
        </DialogTitle>

        <DialogContent>
          {success ? (
            <Alert severity="success" sx={{ mt: 1 }}>
              {success}
            </Alert>
          ) : (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {church.settings?.requireApproval
                  ? t('joinDescription.requiresApproval')
                  : t('joinDescription.automatic')
                }
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <TextField
                fullWidth
                multiline
                rows={3}
                label={t('messageLabel')}
                placeholder={t('messagePlaceholder')}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={loading}
                helperText={t('messageHelper')}
              />
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            {success ? t('close') : t('cancel')}
          </Button>
          {!success && (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {t('submitRequest')}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

JoinChurchButton.propTypes = {
  church: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    settings: PropTypes.shape({
      requireApproval: PropTypes.bool,
    }),
  }).isRequired,
  userMembership: PropTypes.shape({
    status: PropTypes.string,
  }),
  onMembershipChange: PropTypes.func,
  variant: PropTypes.string,
  fullWidth: PropTypes.bool,
};

export default JoinChurchButton;
