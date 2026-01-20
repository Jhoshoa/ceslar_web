import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

/**
 * Reusable form dialog component
 */
const FormDialog = ({
  open,
  onClose,
  onSubmit,
  title,
  subtitle,
  children,
  loading = false,
  submitLabel,
  cancelLabel,
  submitDisabled = false,
  maxWidth = 'sm',
  fullWidth = true,
  fullScreen: forceFullScreen,
  showActions = true,
  disableBackdropClick = false,
  disableEscapeKeyDown = false,
  dividers = true,
  contentSx = {},
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const fullScreen = forceFullScreen ?? isMobile;

  // Handle dialog close
  const handleClose = (event, reason) => {
    if (loading) return;
    if (disableBackdropClick && reason === 'backdropClick') return;
    if (disableEscapeKeyDown && reason === 'escapeKeyDown') return;
    onClose?.();
  };

  // Handle submit
  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!loading && !submitDisabled) {
      onSubmit?.();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && open && !loading && !disableEscapeKeyDown) {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, loading, disableEscapeKeyDown, onClose]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      fullScreen={fullScreen}
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit,
      }}
    >
      {/* Title */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 2,
          pb: subtitle ? 1 : 2,
        }}
      >
        <Box>
          <Typography variant="h6" component="div" fontWeight={600}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <IconButton
          edge="end"
          onClick={() => onClose?.()}
          disabled={loading}
          sx={{ mt: -0.5, mr: -1 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent dividers={dividers} sx={{ py: 2, ...contentSx }}>
        {children}
      </DialogContent>

      {/* Actions */}
      {showActions && (
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => onClose?.()}
            disabled={loading}
            color="inherit"
          >
            {cancelLabel || t('common.cancel', 'Cancel')}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || submitDisabled}
            startIcon={loading && <CircularProgress size={16} color="inherit" />}
          >
            {submitLabel || t('common.save', 'Save')}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

FormDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  children: PropTypes.node,
  loading: PropTypes.bool,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  submitDisabled: PropTypes.bool,
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  fullWidth: PropTypes.bool,
  fullScreen: PropTypes.bool,
  showActions: PropTypes.bool,
  disableBackdropClick: PropTypes.bool,
  disableEscapeKeyDown: PropTypes.bool,
  dividers: PropTypes.bool,
  contentSx: PropTypes.object,
};

export default FormDialog;
