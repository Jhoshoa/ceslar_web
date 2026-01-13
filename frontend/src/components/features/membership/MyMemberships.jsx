import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Skeleton,
  Alert,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import ChurchIcon from '@mui/icons-material/Church';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import BlockIcon from '@mui/icons-material/Block';
import { membershipApi } from '../../../services/api';

const statusColors = {
  approved: 'success',
  pending: 'warning',
  rejected: 'error',
  suspended: 'default',
};

const statusIcons = {
  approved: <CheckCircleIcon fontSize="small" />,
  pending: <HourglassEmptyIcon fontSize="small" />,
  rejected: <BlockIcon fontSize="small" />,
};

const roleColors = {
  admin: 'error',
  pastor: 'primary',
  leader: 'secondary',
  member: 'default',
  visitor: 'default',
};

const MyMemberships = () => {
  const { t } = useTranslation('membership');
  const navigate = useNavigate();

  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const fetchMemberships = async () => {
    try {
      setLoading(true);
      const response = await membershipApi.getMyMemberships();
      setMemberships(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || t('fetchError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

  const handleMenuOpen = (event, membership) => {
    setMenuAnchor(event.currentTarget);
    setSelectedMembership(membership);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleLeaveClick = () => {
    handleMenuClose();
    setLeaveDialogOpen(true);
  };

  const handleLeaveConfirm = async () => {
    if (!selectedMembership?.church?._id) return;

    setLeaving(true);
    try {
      await membershipApi.leaveChurch(selectedMembership.church._id);
      setMemberships((prev) =>
        prev.filter((m) => m.church._id !== selectedMembership.church._id)
      );
      setLeaveDialogOpen(false);
      setSelectedMembership(null);
    } catch (err) {
      setError(err.response?.data?.message || t('leaveError'));
    } finally {
      setLeaving(false);
    }
  };

  const handleChurchClick = (church) => {
    if (church.slug) {
      navigate(`/churches/${encodeURIComponent(church.country)}/${encodeURIComponent(church.department || 'default')}/${church.slug}`);
    }
  };

  if (loading) {
    return (
      <Box>
        {[1, 2].map((i) => (
          <Card key={i} sx={{ mb: 2 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Skeleton variant="circular" width={48} height={48} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton width="40%" height={28} />
                  <Skeleton width="60%" height={20} />
                </Box>
                <Skeleton width={80} height={32} />
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (memberships.length === 0) {
    return (
      <Card sx={{ textAlign: 'center', py: 4 }}>
        <ChurchIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {t('noMemberships')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t('noMembershipsHint')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<ChurchIcon />}
          onClick={() => navigate('/churches')}
        >
          {t('findChurch')}
        </Button>
      </Card>
    );
  }

  return (
    <Box>
      {memberships.map((membership) => (
        <Card
          key={membership._id}
          sx={{
            mb: 2,
            cursor: 'pointer',
            transition: 'box-shadow 0.2s',
            '&:hover': { boxShadow: 3 },
          }}
        >
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                src={membership.church?.logo}
                sx={{ width: 48, height: 48 }}
              >
                <ChurchIcon />
              </Avatar>

              <Box
                sx={{ flex: 1 }}
                onClick={() => handleChurchClick(membership.church)}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {membership.church?.name}
                  </Typography>
                  {membership.isPrimaryChurch && (
                    <StarIcon fontSize="small" color="warning" />
                  )}
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {membership.church?.city}, {membership.church?.country}
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  size="small"
                  label={t(`status.${membership.status}`)}
                  color={statusColors[membership.status]}
                  icon={statusIcons[membership.status]}
                />
                {membership.status === 'approved' && (
                  <Chip
                    size="small"
                    label={t(`roles.${membership.role}`)}
                    color={roleColors[membership.role]}
                    variant="outlined"
                  />
                )}
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuOpen(e, membership);
                  }}
                >
                  <MoreVertIcon />
                </IconButton>
              </Stack>
            </Stack>

            {membership.joinedAt && membership.status === 'approved' && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {t('memberSince', {
                  date: new Date(membership.joinedAt).toLocaleDateString(),
                })}
              </Typography>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Actions Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleLeaveClick}>
          <ListItemIcon>
            <ExitToAppIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ color: 'error' }}>
            {t('leaveChurch')}
          </ListItemText>
        </MenuItem>
      </Menu>

      {/* Leave Confirmation Dialog */}
      <Dialog
        open={leaveDialogOpen}
        onClose={() => !leaving && setLeaveDialogOpen(false)}
      >
        <DialogTitle>{t('leaveConfirmTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('leaveConfirmMessage', { church: selectedMembership?.church?.name })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLeaveDialogOpen(false)} disabled={leaving}>
            {t('cancel')}
          </Button>
          <Button
            onClick={handleLeaveConfirm}
            color="error"
            disabled={leaving}
          >
            {leaving ? t('leaving') : t('confirmLeave')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyMemberships;
