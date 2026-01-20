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
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import { DataTable, ConfirmDialog } from '../common';
import { adminSermonsApi } from '../../../services/adminApi';
import { usePermissions } from '../../../hooks/usePermissions';

/**
 * Sermon List component for admin panel
 */
const SermonList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { permissions } = usePermissions();

  // State
  const [sermons, setSermons] = useState([]);
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
  const [seriesFilter, setSeriesFilter] = useState('');

  // Sorting
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Series list
  const [seriesList, setSeriesList] = useState([]);

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sermonToDelete, setSermonToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch series
  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const response = await adminSermonsApi.getSeries();
        setSeriesList(response.data || []);
      } catch (err) {
        console.error('Error fetching series:', err);
      }
    };
    fetchSeries();
  }, []);

  // Fetch sermons
  const fetchSermons = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        sort: `${sortOrder === 'desc' ? '-' : ''}${sortBy}`,
      };

      if (search) params.search = search;
      if (seriesFilter) params.series = seriesFilter;

      const response = await adminSermonsApi.getAll(params);

      setSermons(response.data || []);
      if (response.pagination) {
        setPagination((prev) => ({
          ...prev,
          ...response.pagination,
        }));
      }
    } catch (err) {
      console.error('Error fetching sermons:', err);
      setError(t('admin.sermons.fetchError', 'Failed to load sermons'));
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.itemsPerPage, search, seriesFilter, sortBy, sortOrder, t]);

  useEffect(() => {
    fetchSermons();
  }, [fetchSermons]);

  // Handle delete
  const handleDeleteClick = (sermon) => {
    setSermonToDelete(sermon);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!sermonToDelete) return;

    try {
      setDeleting(true);
      await adminSermonsApi.delete(sermonToDelete._id);
      setDeleteDialogOpen(false);
      setSermonToDelete(null);
      fetchSermons();
    } catch (err) {
      console.error('Error deleting sermon:', err);
      setError(t('admin.sermons.deleteError', 'Failed to delete sermon'));
    } finally {
      setDeleting(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  // Table columns
  const columns = [
    {
      id: 'title',
      label: t('admin.sermons.columns.title', 'Title'),
      minWidth: 250,
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            src={row.thumbnail}
            alt={row.title}
            sx={{ width: 48, height: 48, bgcolor: 'warning.light' }}
            variant="rounded"
          >
            <VideoLibraryIcon />
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {row.title}
            </Typography>
            {row.series && (
              <Typography variant="caption" color="text.secondary">
                {row.series}
              </Typography>
            )}
          </Box>
        </Box>
      ),
    },
    {
      id: 'speaker',
      label: t('admin.sermons.columns.speaker', 'Speaker'),
      minWidth: 150,
      accessor: 'speaker',
    },
    {
      id: 'date',
      label: t('admin.sermons.columns.date', 'Date'),
      minWidth: 120,
      render: (row) => formatDate(row.date),
    },
    {
      id: 'church',
      label: t('admin.sermons.columns.church', 'Church'),
      minWidth: 150,
      accessor: (row) => row.church?.name || '-',
    },
    {
      id: 'views',
      label: t('admin.sermons.columns.views', 'Views'),
      minWidth: 80,
      align: 'center',
      accessor: (row) => row.views || 0,
    },
  ];

  // Filter toolbar
  const filterToolbar = (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>{t('admin.sermons.filters.series', 'Series')}</InputLabel>
        <Select
          value={seriesFilter}
          label={t('admin.sermons.filters.series', 'Series')}
          onChange={(e) => setSeriesFilter(e.target.value)}
        >
          <MenuItem value="">{t('common.all', 'All')}</MenuItem>
          {seriesList.map((series) => (
            <MenuItem key={series} value={series}>
              {series}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );

  return (
    <Box>
      <DataTable
        columns={columns}
        data={sermons}
        loading={loading}
        error={error}
        title={t('admin.sermons.title', 'Sermons')}
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
        searchPlaceholder={t('admin.sermons.searchPlaceholder', 'Search sermons...')}
        onAdd={permissions.canCreateSermon ? () => navigate('/admin/sermons/new') : undefined}
        onEdit={(sermon) => navigate(`/admin/sermons/${sermon._id}`)}
        onDelete={permissions.canDeleteSermon ? handleDeleteClick : undefined}
        onRefresh={fetchSermons}
        toolbar={filterToolbar}
        emptyMessage={t('admin.sermons.empty', 'No sermons found')}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title={t('admin.sermons.deleteTitle', 'Delete Sermon')}
        message={t('admin.sermons.deleteMessage', 'Are you sure you want to delete "{{title}}"?', { title: sermonToDelete?.title })}
        confirmLabel={t('common.delete', 'Delete')}
        type="danger"
        loading={deleting}
      />
    </Box>
  );
};

export default SermonList;
