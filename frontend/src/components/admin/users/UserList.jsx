import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Chip,
  Avatar,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { DataTable, ConfirmDialog } from '../common';
import { adminUsersApi } from '../../../services/adminApi';
import { usePermissions } from '../../../hooks/usePermissions';

// Role colors
const ROLE_COLORS = {
  system_admin: 'error',
  admin: 'primary',
  pastor: 'secondary',
  staff: 'info',
  leader: 'success',
  member: 'default',
  visitor: 'default',
};

/**
 * User List component for admin panel
 */
const UserList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { permissions, isSystemAdmin } = usePermissions();

  // State
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  // Filters
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Sorting
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        sort: `${sortOrder === 'desc' ? '-' : ''}${sortBy}`,
      };

      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;

      const response = await adminUsersApi.getAll(params);

      setUsers(response.data || []);
      if (response.pagination) {
        setPagination((prev) => ({ ...prev, ...response.pagination }));
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(t('admin.users.fetchError', 'Failed to load users'));
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.itemsPerPage, search, roleFilter, sortBy, sortOrder, t]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.currentPage !== 1) {
        setPagination((prev) => ({ ...prev, currentPage: 1 }));
      } else {
        fetchUsers();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Handle view user
  const handleView = (user) => {
    navigate(`/admin/users/${user._id}`);
  };

  // Handle delete
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      setDeleting(true);
      await adminUsersApi.delete(userToDelete._id);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(t('admin.users.deleteError', 'Failed to delete user'));
    } finally {
      setDeleting(false);
    }
  };

  // Get user's primary role
  const getPrimaryRole = (user) => {
    if (user.systemRole === 'system_admin') return 'system_admin';
    if (user.churchMemberships?.length > 0) {
      const roles = user.churchMemberships.map((m) => m.role);
      if (roles.includes('admin')) return 'admin';
      if (roles.includes('pastor')) return 'pastor';
      if (roles.includes('staff')) return 'staff';
      if (roles.includes('leader')) return 'leader';
      if (roles.includes('member')) return 'member';
    }
    return 'visitor';
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  // Table columns
  const columns = [
    {
      id: 'name',
      label: t('admin.users.columns.name', 'User'),
      minWidth: 250,
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            src={row.picture}
            alt={row.firstName}
            sx={{ width: 40, height: 40 }}
          >
            {row.firstName?.[0] || row.email?.[0]?.toUpperCase() || <PersonIcon />}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {row.firstName ? `${row.firstName} ${row.lastName || ''}` : '-'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.email}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: 'role',
      label: t('admin.users.columns.role', 'Role'),
      minWidth: 120,
      render: (row) => {
        const role = getPrimaryRole(row);
        return (
          <Chip
            size="small"
            label={t(`admin.users.roles.${role}`, role)}
            color={ROLE_COLORS[role] || 'default'}
          />
        );
      },
    },
    {
      id: 'churches',
      label: t('admin.users.columns.churches', 'Churches'),
      minWidth: 150,
      render: (row) => {
        const count = row.churchMemberships?.length || 0;
        if (count === 0) return '-';
        if (count === 1) {
          const church = row.churchMemberships[0]?.church;
          return church?.name || t('admin.users.oneChurch', '1 church');
        }
        return t('admin.users.multipleChurches', '{{count}} churches', { count });
      },
    },
    {
      id: 'status',
      label: t('admin.users.columns.status', 'Status'),
      minWidth: 100,
      render: (row) => (
        <Chip
          size="small"
          label={row.isActive !== false ? t('common.active', 'Active') : t('common.inactive', 'Inactive')}
          color={row.isActive !== false ? 'success' : 'default'}
        />
      ),
    },
    {
      id: 'createdAt',
      label: t('admin.users.columns.joined', 'Joined'),
      minWidth: 120,
      render: (row) => formatDate(row.createdAt),
    },
  ];

  // Filter toolbar
  const filterToolbar = (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>{t('admin.users.filters.role', 'Role')}</InputLabel>
        <Select
          value={roleFilter}
          label={t('admin.users.filters.role', 'Role')}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <MenuItem value="">{t('common.all', 'All')}</MenuItem>
          <MenuItem value="system_admin">{t('admin.users.roles.system_admin', 'System Admin')}</MenuItem>
          <MenuItem value="admin">{t('admin.users.roles.admin', 'Admin')}</MenuItem>
          <MenuItem value="pastor">{t('admin.users.roles.pastor', 'Pastor')}</MenuItem>
          <MenuItem value="staff">{t('admin.users.roles.staff', 'Staff')}</MenuItem>
          <MenuItem value="leader">{t('admin.users.roles.leader', 'Leader')}</MenuItem>
          <MenuItem value="member">{t('admin.users.roles.member', 'Member')}</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );

  return (
    <Box>
      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        error={error}
        title={t('admin.users.title', 'Users')}
        pagination={pagination}
        onPageChange={(page) => setPagination((prev) => ({ ...prev, currentPage: page }))}
        onRowsPerPageChange={(rowsPerPage) =>
          setPagination((prev) => ({ ...prev, itemsPerPage: rowsPerPage, currentPage: 1 }))
        }
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={(column, order) => {
          setSortBy(column);
          setSortOrder(order);
        }}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t('admin.users.searchPlaceholder', 'Search users...')}
        onView={handleView}
        onDelete={isSystemAdmin ? handleDeleteClick : undefined}
        onRefresh={fetchUsers}
        toolbar={filterToolbar}
        emptyMessage={t('admin.users.empty', 'No users found')}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title={t('admin.users.deleteTitle', 'Delete User')}
        message={t('admin.users.deleteMessage', 'Are you sure you want to delete this user? This action cannot be undone.')}
        confirmLabel={t('common.delete', 'Delete')}
        type="danger"
        loading={deleting}
      />
    </Box>
  );
};

export default UserList;
