import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import DeleteIcon from '@mui/icons-material/Delete';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

/**
 * Reusable confirmation dialog component
 */
const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  cancelLabel,
  loading = false,
  type = 'warning', // 'warning' | 'danger' | 'info' | 'question'
  confirmColor,
}) => {
  const { t } = useTranslation();

  // Get icon and color based on type
  const getTypeConfig = () => {
    switch (type) {
      case 'danger':
        return {
          icon: <DeleteIcon sx={{ fontSize: 48 }} />,
          color: 'error.main',
          bgColor: 'error.lighter',
          defaultConfirmColor: 'error',
        };
      case 'info':
        return {
          icon: <ErrorOutlineIcon sx={{ fontSize: 48 }} />,
          color: 'info.main',
          bgColor: 'info.lighter',
          defaultConfirmColor: 'info',
        };
      case 'question':
        return {
          icon: <HelpOutlineIcon sx={{ fontSize: 48 }} />,
          color: 'primary.main',
          bgColor: 'primary.lighter',
          defaultConfirmColor: 'primary',
        };
      case 'warning':
      default:
        return {
          icon: <WarningAmberIcon sx={{ fontSize: 48 }} />,
          color: 'warning.main',
          bgColor: 'warning.lighter',
          defaultConfirmColor: 'warning',
        };
    }
  };

  const config = getTypeConfig();
  const finalConfirmColor = confirmColor || config.defaultConfirmColor;

  const handleConfirm = () => {
    if (!loading) {
      onConfirm?.();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle sx={{ pb: 0 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            pt: 2,
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: config.bgColor || `${config.color}15`,
              color: config.color,
              mb: 2,
            }}
          >
            {config.icon}
          </Box>
          <Typography variant="h6" fontWeight={600}>
            {title || t('admin.confirm.title', 'Confirm Action')}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ textAlign: 'center', pb: 1 }}>
        <Typography color="text.secondary">
          {message || t('admin.confirm.message', 'Are you sure you want to proceed?')}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'center', gap: 1 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          color="inherit"
          variant="outlined"
          sx={{ minWidth: 100 }}
        >
          {cancelLabel || t('common.cancel', 'Cancel')}
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={loading}
          color={finalConfirmColor}
          variant="contained"
          startIcon={loading && <CircularProgress size={16} color="inherit" />}
          sx={{ minWidth: 100 }}
        >
          {confirmLabel || t('common.confirm', 'Confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  title: PropTypes.string,
  message: PropTypes.string,
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  loading: PropTypes.bool,
  type: PropTypes.oneOf(['warning', 'danger', 'info', 'question']),
  confirmColor: PropTypes.oneOf(['primary', 'secondary', 'error', 'warning', 'info', 'success']),
};

export default ConfirmDialog;
