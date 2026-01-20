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
import ChurchIcon from '@mui/icons-material/Church';
import { DataTable, ConfirmDialog } from '../common';
import { adminChurchesApi } from '../../../services/adminApi';
import { usePermissions } from '../../../hooks/usePermissions';

// Church level colors
const LEVEL_COLORS = {
  headquarters: 'error',
  country: 'primary',
  department: 'info',
  province: 'success',
  local: 'default',
};

// Church status colors
const STATUS_COLORS = {
  active: 'success',
  pending: 'warning',
  inactive: 'default',
  suspended: 'error',
};

/**
 * Church List component for admin panel
 */
const ChurchList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { permissions, isSystemAdmin } = usePermissions();

  // State
  const [churches, setChurches] = useState([]);
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
  const [levelFilter, setLevelFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Sorting
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [churchToDelete, setChurchToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch churches
  const fetchChurches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        sort: `${sortOrder === 'desc' ? '-' : ''}${sortBy}`,
      };

      if (search) params.search = search;
      if (levelFilter) params.level = levelFilter;
      if (statusFilter) params.status = statusFilter;

      const response = await adminChurchesApi.getAll(params);

      setChurches(response.data || []);
      if (response.pagination) {
        setPagination((prev) => ({
          ...prev,
          ...response.pagination,
        }));
      }
    } catch (err) {
      console.error('Error fetching churches:', err);
      setError(t('admin.churches.fetchError', 'Failed to load churches'));
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.itemsPerPage, search, levelFilter, statusFilter, sortBy, sortOrder, t]);

  useEffect(() => {
    fetchChurches();
  }, [fetchChurches]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.currentPage !== 1) {
        setPagination((prev) => ({ ...prev, currentPage: 1 }));
      } else {
        fetchChurches();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Handle delete
  const handleDeleteClick = (church) => {
    setChurchToDelete(church);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!churchToDelete) return;

    try {
      setDeleting(true);
      await adminChurchesApi.delete(churchToDelete._id);
      setDeleteDialogOpen(false);
      setChurchToDelete(null);
      fetchChurches();
    } catch (err) {
      console.error('Error deleting church:', err);
      setError(t('admin.churches.deleteError', 'Failed to delete church'));
    } finally {
      setDeleting(false);
    }
  };

  // Table columns
  const columns = [
    {
      id: 'name',
      label: t('admin.churches.columns.name', 'Name'),
      minWidth: 200,
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            src={row.logo}
            alt={row.name}
            sx={{ width: 40, height: 40, bgcolor: 'primary.light' }}
          >
            <ChurchIcon />
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {row.name}
            </Typography>
            {row.slug && (
              <Typography variant="caption" color="text.secondary">
                /{row.slug}
              </Typography>
            )}
          </Box>
        </Box>
      ),
    },
    {
      id: 'level',
      label: t('admin.churches.columns.level', 'Level'),
      minWidth: 120,
      render: (row) => (
        <Chip
          size="small"
          label={t(`admin.churches.levels.${row.level}`, row.level)}
          color={LEVEL_COLORS[row.level] || 'default'}
        />
      ),
    },
    {
      id: 'location',
      label: t('admin.churches.columns.location', 'Location'),
      minWidth: 200,
      render: (row) => (
        <Box>
          <Typography variant="body2">
            {row.location?.city || '-'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {[row.location?.department, row.location?.country]
              .filter(Boolean)
              .join(', ')}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'status',
      label: t('admin.churches.columns.status', 'Status'),
      minWidth: 100,
      render: (row) => (
        <Chip
          size="small"
          label={t(`admin.churches.statuses.${row.status}`, row.status)}
          color={STATUS_COLORS[row.status] || 'default'}
        />
      ),
    },
    {
      id: 'createdAt',
      label: t('admin.churches.columns.created', 'Created'),
      minWidth: 120,
      type: 'date',
      accessor: 'createdAt',
    },
  ];

  // Filter toolbar
  const filterToolbar = (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>{t('admin.churches.filters.level', 'Level')}</InputLabel>
        <Select
          value={levelFilter}
          label={t('admin.churches.filters.level', 'Level')}
          onChange={(e) => setLevelFilter(e.target.value)}
        >
          <MenuItem value="">{t('common.all', 'All')}</MenuItem>
          <MenuItem value="headquarters">{t('admin.churches.levels.headquarters', 'Headquarters')}</MenuItem>
          <MenuItem value="country">{t('admin.churches.levels.country', 'Country')}</MenuItem>
          <MenuItem value="department">{t('admin.churches.levels.department', 'Department')}</MenuItem>
          <MenuItem value="province">{t('admin.churches.levels.province', 'Province')}</MenuItem>
          <MenuItem value="local">{t('admin.churches.levels.local', 'Local')}</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>{t('admin.churches.filters.status', 'Status')}</InputLabel>
        <Select
          value={statusFilter}
          label={t('admin.churches.filters.status', 'Status')}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <MenuItem value="">{t('common.all', 'All')}</MenuItem>
          <MenuItem value="active">{t('admin.churches.statuses.active', 'Active')}</MenuItem>
          <MenuItem value="pending">{t('admin.churches.statuses.pending', 'Pending')}</MenuItem>
          <MenuItem value="inactive">{t('admin.churches.statuses.inactive', 'Inactive')}</MenuItem>
          <MenuItem value="suspended">{t('admin.churches.statuses.suspended', 'Suspended')}</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );

  return (
    <Box>
      <DataTable
        columns={columns}
        data={churches}
        loading={loading}
        error={error}
        title={t('admin.churches.title', 'Churches')}
        // Pagination
        pagination={pagination}
        onPageChange={(page) => setPagination((prev) => ({ ...prev, currentPage: page }))}
        onRowsPerPageChange={(rowsPerPage) =>
          setPagination((prev) => ({ ...prev, itemsPerPage: rowsPerPage, currentPage: 1 }))
        }
        // Sorting
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={(column, order) => {
          setSortBy(column);
          setSortOrder(order);
        }}
        // Search
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t('admin.churches.searchPlaceholder', 'Search churches...')}
        // Actions
        onAdd={permissions.canCreateChurch ? () => navigate('/admin/churches/new') : undefined}
        onEdit={(church) => navigate(`/admin/churches/${church._id}`)}
        onDelete={permissions.canDeleteChurch ? handleDeleteClick : undefined}
        onRefresh={fetchChurches}
        // Toolbar
        toolbar={filterToolbar}
        // Empty state
        emptyMessage={t('admin.churches.empty', 'No churches found')}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title={t('admin.churches.deleteTitle', 'Delete Church')}
        message={t(
          'admin.churches.deleteMessage',
          'Are you sure you want to delete "{{name}}"? This action cannot be undone.',
          { name: churchToDelete?.name }
        )}
        confirmLabel={t('common.delete', 'Delete')}
        type="danger"
        loading={deleting}
      />
    </Box>
  );
};

export default ChurchList;
