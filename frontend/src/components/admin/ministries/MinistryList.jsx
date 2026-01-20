import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Chip,
  Avatar,
  Typography,
} from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import { DataTable, ConfirmDialog } from '../common';
import { adminMinistriesApi } from '../../../services/adminApi';
import { usePermissions } from '../../../hooks/usePermissions';

/**
 * Ministry List component for admin panel
 */
const MinistryList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { permissions } = usePermissions();

  // State
  const [ministries, setMinistries] = useState([]);
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

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ministryToDelete, setMinistryToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch ministries
  const fetchMinistries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
      };

      if (search) params.search = search;

      const response = await adminMinistriesApi.getAll(params);

      setMinistries(response.data || []);
      if (response.pagination) {
        setPagination((prev) => ({ ...prev, ...response.pagination }));
      }
    } catch (err) {
      console.error('Error fetching ministries:', err);
      setError(t('admin.ministries.fetchError', 'Failed to load ministries'));
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.itemsPerPage, search, t]);

  useEffect(() => {
    fetchMinistries();
  }, [fetchMinistries]);

  // Handle delete
  const handleDeleteClick = (ministry) => {
    setMinistryToDelete(ministry);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!ministryToDelete) return;

    try {
      setDeleting(true);
      await adminMinistriesApi.delete(ministryToDelete._id);
      setDeleteDialogOpen(false);
      setMinistryToDelete(null);
      fetchMinistries();
    } catch (err) {
      console.error('Error deleting ministry:', err);
      setError(t('admin.ministries.deleteError', 'Failed to delete ministry'));
    } finally {
      setDeleting(false);
    }
  };

  // Table columns
  const columns = [
    {
      id: 'name',
      label: t('admin.ministries.columns.name', 'Ministry'),
      minWidth: 250,
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            src={row.image}
            alt={row.name}
            sx={{ width: 48, height: 48, bgcolor: 'info.light' }}
          >
            <GroupsIcon />
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {row.name}
            </Typography>
            {row.church?.name && (
              <Typography variant="caption" color="text.secondary">
                {row.church.name}
              </Typography>
            )}
          </Box>
        </Box>
      ),
    },
    {
      id: 'description',
      label: t('admin.ministries.columns.description', 'Description'),
      minWidth: 250,
      render: (row) => (
        <Typography variant="body2" noWrap sx={{ maxWidth: 250 }}>
          {row.description || '-'}
        </Typography>
      ),
    },
    {
      id: 'leader',
      label: t('admin.ministries.columns.leader', 'Leader'),
      minWidth: 150,
      accessor: (row) => row.leader?.firstName ? `${row.leader.firstName} ${row.leader.lastName || ''}` : '-',
    },
    {
      id: 'members',
      label: t('admin.ministries.columns.members', 'Members'),
      minWidth: 100,
      align: 'center',
      accessor: (row) => row.members?.length || row.memberCount || 0,
    },
    {
      id: 'status',
      label: t('admin.ministries.columns.status', 'Status'),
      minWidth: 100,
      render: (row) => (
        <Chip
          size="small"
          label={row.isActive !== false ? t('common.active', 'Active') : t('common.inactive', 'Inactive')}
          color={row.isActive !== false ? 'success' : 'default'}
        />
      ),
    },
  ];

  return (
    <Box>
      <DataTable
        columns={columns}
        data={ministries}
        loading={loading}
        error={error}
        title={t('admin.ministries.title', 'Ministries')}
        pagination={pagination}
        onPageChange={(page) => setPagination((prev) => ({ ...prev, currentPage: page }))}
        onRowsPerPageChange={(rowsPerPage) =>
          setPagination((prev) => ({ ...prev, itemsPerPage: rowsPerPage, currentPage: 1 }))
        }
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder={t('admin.ministries.searchPlaceholder', 'Search ministries...')}
        onAdd={permissions.canCreateMinistry ? () => navigate('/admin/ministries/new') : undefined}
        onEdit={(ministry) => navigate(`/admin/ministries/${ministry._id}`)}
        onDelete={permissions.canDeleteMinistry ? handleDeleteClick : undefined}
        onRefresh={fetchMinistries}
        emptyMessage={t('admin.ministries.empty', 'No ministries found')}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title={t('admin.ministries.deleteTitle', 'Delete Ministry')}
        message={t('admin.ministries.deleteMessage', 'Are you sure you want to delete "{{name}}"?', { name: ministryToDelete?.name })}
        confirmLabel={t('common.delete', 'Delete')}
        type="danger"
        loading={deleting}
      />
    </Box>
  );
};

export default MinistryList;
