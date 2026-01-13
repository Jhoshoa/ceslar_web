import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Avatar,
  Chip,
  IconButton,
  Button,
  Stack,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Skeleton,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import RefreshIcon from '@mui/icons-material/Refresh';
import { membershipApi } from '../../../services/api';

const ROLES = ['admin', 'pastor', 'leader', 'member', 'visitor'];

const roleColors = {
  admin: 'error',
  pastor: 'primary',
  leader: 'secondary',
  member: 'default',
  visitor: 'default',
};

const MembershipManagement = ({ churchId, churchName }) => {
  const { t } = useTranslation('membership');

  // Tab state
  const [tab, setTab] = useState(0);

  // Pending requests state
  const [pendingRequests, setPendingRequests] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(true);
  const [pendingPagination, setPendingPagination] = useState({ page: 0, limit: 10, total: 0 });

  // Members state
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(true);
  const [membersPagination, setMembersPagination] = useState({ page: 0, limit: 10, total: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Dialog states
  const [approveDialog, setApproveDialog] = useState({ open: false, user: null });
  const [rejectDialog, setRejectDialog] = useState({ open: false, user: null, reason: '' });
  const [roleDialog, setRoleDialog] = useState({ open: false, user: null, role: '' });
  const [removeDialog, setRemoveDialog] = useState({ open: false, user: null });

  // Operation states
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Fetch pending requests
  const fetchPendingRequests = useCallback(async () => {
    try {
      setPendingLoading(true);
      const response = await membershipApi.getPendingRequests(churchId, {
        page: pendingPagination.page + 1,
        limit: pendingPagination.limit,
      });
      setPendingRequests(response.data || []);
      setPendingPagination((prev) => ({
        ...prev,
        total: response.pagination?.total || 0,
      }));
    } catch (err) {
      setError(err.response?.data?.message || t('fetchError'));
    } finally {
      setPendingLoading(false);
    }
  }, [churchId, pendingPagination.page, pendingPagination.limit, t]);

  // Fetch members
  const fetchMembers = useCallback(async () => {
    try {
      setMembersLoading(true);
      const response = await membershipApi.getChurchMembers(churchId, {
        page: membersPagination.page + 1,
        limit: membersPagination.limit,
        search: searchQuery || undefined,
        role: roleFilter || undefined,
      });
      setMembers(response.data || []);
      setMembersPagination((prev) => ({
        ...prev,
        total: response.pagination?.total || 0,
      }));
    } catch (err) {
      setError(err.response?.data?.message || t('fetchError'));
    } finally {
      setMembersLoading(false);
    }
  }, [churchId, membersPagination.page, membersPagination.limit, searchQuery, roleFilter, t]);

  useEffect(() => {
    if (tab === 0) {
      fetchPendingRequests();
    } else {
      fetchMembers();
    }
  }, [tab, fetchPendingRequests, fetchMembers]);

  // Handle approve
  const handleApprove = async () => {
    setProcessing(true);
    setError(null);
    try {
      await membershipApi.approveMembership(
        churchId,
        approveDialog.user._id,
        approveDialog.role || 'member'
      );
      setSuccess(t('approveSuccess', { name: `${approveDialog.user.firstName} ${approveDialog.user.lastName}` }));
      setApproveDialog({ open: false, user: null });
      fetchPendingRequests();
    } catch (err) {
      setError(err.response?.data?.message || t('approveError'));
    } finally {
      setProcessing(false);
    }
  };

  // Handle reject
  const handleReject = async () => {
    setProcessing(true);
    setError(null);
    try {
      await membershipApi.rejectMembership(
        churchId,
        rejectDialog.user._id,
        rejectDialog.reason
      );
      setSuccess(t('rejectSuccess'));
      setRejectDialog({ open: false, user: null, reason: '' });
      fetchPendingRequests();
    } catch (err) {
      setError(err.response?.data?.message || t('rejectError'));
    } finally {
      setProcessing(false);
    }
  };

  // Handle role update
  const handleRoleUpdate = async () => {
    setProcessing(true);
    setError(null);
    try {
      await membershipApi.updateMemberRole(
        churchId,
        roleDialog.user._id,
        roleDialog.role
      );
      setSuccess(t('roleUpdateSuccess', { name: `${roleDialog.user.firstName} ${roleDialog.user.lastName}` }));
      setRoleDialog({ open: false, user: null, role: '' });
      fetchMembers();
    } catch (err) {
      setError(err.response?.data?.message || t('roleUpdateError'));
    } finally {
      setProcessing(false);
    }
  };

  // Handle remove member
  const handleRemove = async () => {
    setProcessing(true);
    setError(null);
    try {
      await membershipApi.removeMember(churchId, removeDialog.user._id);
      setSuccess(t('removeSuccess', { name: `${removeDialog.user.firstName} ${removeDialog.user.lastName}` }));
      setRemoveDialog({ open: false, user: null });
      fetchMembers();
    } catch (err) {
      setError(err.response?.data?.message || t('removeError'));
    } finally {
      setProcessing(false);
    }
  };

  const renderSkeleton = () => (
    <TableBody>
      {[1, 2, 3].map((i) => (
        <TableRow key={i}>
          <TableCell><Skeleton variant="circular" width={40} height={40} /></TableCell>
          <TableCell><Skeleton width="60%" /></TableCell>
          <TableCell><Skeleton width="80%" /></TableCell>
          <TableCell><Skeleton width={80} /></TableCell>
          <TableCell><Skeleton width={100} /></TableCell>
        </TableRow>
      ))}
    </TableBody>
  );

  return (
    <Paper sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight={600}>
          {t('management.title')}
        </Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={() => (tab === 0 ? fetchPendingRequests() : fetchMembers())}
        >
          {t('refresh')}
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab
          label={
            <Stack direction="row" spacing={1} alignItems="center">
              <span>{t('management.pendingTab')}</span>
              {pendingPagination.total > 0 && (
                <Chip size="small" label={pendingPagination.total} color="warning" />
              )}
            </Stack>
          }
        />
        <Tab label={t('management.membersTab')} />
      </Tabs>

      {/* Pending Requests Tab */}
      {tab === 0 && (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width={60}></TableCell>
                  <TableCell>{t('management.name')}</TableCell>
                  <TableCell>{t('management.email')}</TableCell>
                  <TableCell>{t('management.requestDate')}</TableCell>
                  <TableCell align="right">{t('management.actions')}</TableCell>
                </TableRow>
              </TableHead>
              {pendingLoading ? (
                renderSkeleton()
              ) : pendingRequests.length === 0 ? (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        {t('management.noPending')}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                <TableBody>
                  {pendingRequests.map((request) => (
                    <TableRow key={request.user._id}>
                      <TableCell>
                        <Avatar src={request.user.avatar}>
                          {request.user.firstName?.charAt(0)}
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={500}>
                          {request.user.firstName} {request.user.lastName}
                        </Typography>
                      </TableCell>
                      <TableCell>{request.user.email}</TableCell>
                      <TableCell>
                        {new Date(request.membership.joinedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title={t('approve')}>
                          <IconButton
                            color="success"
                            onClick={() => setApproveDialog({ open: true, user: request.user, role: 'member' })}
                          >
                            <CheckIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t('reject')}>
                          <IconButton
                            color="error"
                            onClick={() => setRejectDialog({ open: true, user: request.user, reason: '' })}
                          >
                            <CloseIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={pendingPagination.total}
            page={pendingPagination.page}
            onPageChange={(_, page) => setPendingPagination((p) => ({ ...p, page }))}
            rowsPerPage={pendingPagination.limit}
            onRowsPerPageChange={(e) =>
              setPendingPagination((p) => ({ ...p, limit: parseInt(e.target.value), page: 0 }))
            }
          />
        </>
      )}

      {/* Members Tab */}
      {tab === 1 && (
        <>
          <Stack direction="row" spacing={2} mb={2}>
            <TextField
              size="small"
              placeholder={t('management.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ flex: 1 }}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>{t('management.filterRole')}</InputLabel>
              <Select
                value={roleFilter}
                label={t('management.filterRole')}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <MenuItem value="">{t('management.allRoles')}</MenuItem>
                {ROLES.map((role) => (
                  <MenuItem key={role} value={role}>
                    {t(`roles.${role}`)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width={60}></TableCell>
                  <TableCell>{t('management.name')}</TableCell>
                  <TableCell>{t('management.email')}</TableCell>
                  <TableCell>{t('management.role')}</TableCell>
                  <TableCell>{t('management.memberSince')}</TableCell>
                  <TableCell align="right">{t('management.actions')}</TableCell>
                </TableRow>
              </TableHead>
              {membersLoading ? (
                renderSkeleton()
              ) : members.length === 0 ? (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        {t('management.noMembers')}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member._id}>
                      <TableCell>
                        <Avatar src={member.avatar}>
                          {member.firstName?.charAt(0)}
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={500}>
                          {member.firstName} {member.lastName}
                        </Typography>
                      </TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={t(`roles.${member.role}`)}
                          color={roleColors[member.role]}
                        />
                      </TableCell>
                      <TableCell>
                        {member.memberSince
                          ? new Date(member.memberSince).toLocaleDateString()
                          : '-'}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title={t('management.changeRole')}>
                          <IconButton
                            onClick={() =>
                              setRoleDialog({ open: true, user: member, role: member.role })
                            }
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t('management.removeMember')}>
                          <IconButton
                            color="error"
                            onClick={() => setRemoveDialog({ open: true, user: member })}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={membersPagination.total}
            page={membersPagination.page}
            onPageChange={(_, page) => setMembersPagination((p) => ({ ...p, page }))}
            rowsPerPage={membersPagination.limit}
            onRowsPerPageChange={(e) =>
              setMembersPagination((p) => ({ ...p, limit: parseInt(e.target.value), page: 0 }))
            }
          />
        </>
      )}

      {/* Approve Dialog */}
      <Dialog open={approveDialog.open} onClose={() => !processing && setApproveDialog({ open: false, user: null })}>
        <DialogTitle>{t('management.approveTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {t('management.approveMessage', {
              name: `${approveDialog.user?.firstName} ${approveDialog.user?.lastName}`,
            })}
          </DialogContentText>
          <FormControl fullWidth>
            <InputLabel>{t('management.assignRole')}</InputLabel>
            <Select
              value={approveDialog.role || 'member'}
              label={t('management.assignRole')}
              onChange={(e) => setApproveDialog((p) => ({ ...p, role: e.target.value }))}
            >
              {ROLES.map((role) => (
                <MenuItem key={role} value={role}>
                  {t(`roles.${role}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApproveDialog({ open: false, user: null })} disabled={processing}>
            {t('cancel')}
          </Button>
          <Button variant="contained" color="success" onClick={handleApprove} disabled={processing}>
            {t('approve')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialog.open} onClose={() => !processing && setRejectDialog({ open: false, user: null, reason: '' })}>
        <DialogTitle>{t('management.rejectTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {t('management.rejectMessage', {
              name: `${rejectDialog.user?.firstName} ${rejectDialog.user?.lastName}`,
            })}
          </DialogContentText>
          <TextField
            fullWidth
            multiline
            rows={3}
            label={t('management.rejectReason')}
            value={rejectDialog.reason}
            onChange={(e) => setRejectDialog((p) => ({ ...p, reason: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialog({ open: false, user: null, reason: '' })} disabled={processing}>
            {t('cancel')}
          </Button>
          <Button variant="contained" color="error" onClick={handleReject} disabled={processing}>
            {t('reject')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Role Change Dialog */}
      <Dialog open={roleDialog.open} onClose={() => !processing && setRoleDialog({ open: false, user: null, role: '' })}>
        <DialogTitle>{t('management.changeRoleTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {t('management.changeRoleMessage', {
              name: `${roleDialog.user?.firstName} ${roleDialog.user?.lastName}`,
            })}
          </DialogContentText>
          <FormControl fullWidth>
            <InputLabel>{t('management.newRole')}</InputLabel>
            <Select
              value={roleDialog.role}
              label={t('management.newRole')}
              onChange={(e) => setRoleDialog((p) => ({ ...p, role: e.target.value }))}
            >
              {ROLES.map((role) => (
                <MenuItem key={role} value={role}>
                  {t(`roles.${role}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRoleDialog({ open: false, user: null, role: '' })} disabled={processing}>
            {t('cancel')}
          </Button>
          <Button variant="contained" onClick={handleRoleUpdate} disabled={processing}>
            {t('save')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Remove Member Dialog */}
      <Dialog open={removeDialog.open} onClose={() => !processing && setRemoveDialog({ open: false, user: null })}>
        <DialogTitle>{t('management.removeTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('management.removeMessage', {
              name: `${removeDialog.user?.firstName} ${removeDialog.user?.lastName}`,
              church: churchName,
            })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemoveDialog({ open: false, user: null })} disabled={processing}>
            {t('cancel')}
          </Button>
          <Button variant="contained" color="error" onClick={handleRemove} disabled={processing}>
            {t('management.confirmRemove')}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

MembershipManagement.propTypes = {
  churchId: PropTypes.string.isRequired,
  churchName: PropTypes.string,
};

export default MembershipManagement;
