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
import EventIcon from '@mui/icons-material/Event';
import { DataTable, ConfirmDialog } from '../common';
import { adminEventsApi } from '../../../services/adminApi';
import { usePermissions } from '../../../hooks/usePermissions';

// Event status colors
const STATUS_COLORS = {
  upcoming: 'primary',
  ongoing: 'success',
  completed: 'default',
  cancelled: 'error',
};

/**
 * Event List component for admin panel
 */
const EventList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { permissions } = usePermissions();

  // State
  const [events, setEvents] = useState([]);
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
  const [statusFilter, setStatusFilter] = useState('');

  // Sorting
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch events
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        sort: `${sortOrder === 'desc' ? '-' : ''}${sortBy}`,
      };

      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;

      const response = await adminEventsApi.getAll(params);

      setEvents(response.data || []);
      if (response.pagination) {
        setPagination((prev) => ({
          ...prev,
          ...response.pagination,
        }));
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(t('admin.events.fetchError', 'Failed to load events'));
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.itemsPerPage, search, statusFilter, sortBy, sortOrder, t]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.currentPage !== 1) {
        setPagination((prev) => ({ ...prev, currentPage: 1 }));
      } else {
        fetchEvents();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Handle delete
  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!eventToDelete) return;

    try {
      setDeleting(true);
      await adminEventsApi.delete(eventToDelete._id);
      setDeleteDialogOpen(false);
      setEventToDelete(null);
      fetchEvents();
    } catch (err) {
      console.error('Error deleting event:', err);
      setError(t('admin.events.deleteError', 'Failed to delete event'));
    } finally {
      setDeleting(false);
    }
  };

  // Get event status
  const getEventStatus = (event) => {
    const now = new Date();
    const startDate = new Date(event.date || event.startDate);
    const endDate = event.endDate ? new Date(event.endDate) : startDate;

    if (event.status === 'cancelled') return 'cancelled';
    if (now < startDate) return 'upcoming';
    if (now > endDate) return 'completed';
    return 'ongoing';
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Table columns
  const columns = [
    {
      id: 'name',
      label: t('admin.events.columns.name', 'Event'),
      minWidth: 250,
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            src={row.image}
            alt={row.name || row.title}
            sx={{ width: 48, height: 48, bgcolor: 'success.light' }}
            variant="rounded"
          >
            <EventIcon />
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {row.name || row.title}
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
      id: 'date',
      label: t('admin.events.columns.date', 'Date'),
      minWidth: 180,
      render: (row) => (
        <Typography variant="body2">
          {formatDate(row.date || row.startDate)}
        </Typography>
      ),
    },
    {
      id: 'location',
      label: t('admin.events.columns.location', 'Location'),
      minWidth: 150,
      accessor: (row) => row.location?.address || row.location || '-',
    },
    {
      id: 'status',
      label: t('admin.events.columns.status', 'Status'),
      minWidth: 100,
      render: (row) => {
        const status = getEventStatus(row);
        return (
          <Chip
            size="small"
            label={t(`admin.events.statuses.${status}`, status)}
            color={STATUS_COLORS[status] || 'default'}
          />
        );
      },
    },
    {
      id: 'registrations',
      label: t('admin.events.columns.registrations', 'Registrations'),
      minWidth: 100,
      align: 'center',
      accessor: (row) => row.registrations?.length || row.registrationCount || 0,
    },
  ];

  // Filter toolbar
  const filterToolbar = (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>{t('admin.events.filters.status', 'Status')}</InputLabel>
        <Select
          value={statusFilter}
          label={t('admin.events.filters.status', 'Status')}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <MenuItem value="">{t('common.all', 'All')}</MenuItem>
          <MenuItem value="upcoming">{t('admin.events.statuses.upcoming', 'Upcoming')}</MenuItem>
          <MenuItem value="ongoing">{t('admin.events.statuses.ongoing', 'Ongoing')}</MenuItem>
          <MenuItem value="completed">{t('admin.events.statuses.completed', 'Completed')}</MenuItem>
          <MenuItem value="cancelled">{t('admin.events.statuses.cancelled', 'Cancelled')}</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );

  return (
    <Box>
      <DataTable
        columns={columns}
        data={events}
        loading={loading}
        error={error}
        title={t('admin.events.title', 'Events')}
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
        searchPlaceholder={t('admin.events.searchPlaceholder', 'Search events...')}
        // Actions
        onAdd={permissions.canCreateEvent ? () => navigate('/admin/events/new') : undefined}
        onEdit={(event) => navigate(`/admin/events/${event._id}`)}
        onDelete={permissions.canDeleteEvent ? handleDeleteClick : undefined}
        onRefresh={fetchEvents}
        // Toolbar
        toolbar={filterToolbar}
        // Empty state
        emptyMessage={t('admin.events.empty', 'No events found')}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title={t('admin.events.deleteTitle', 'Delete Event')}
        message={t(
          'admin.events.deleteMessage',
          'Are you sure you want to delete "{{name}}"? This action cannot be undone.',
          { name: eventToDelete?.name || eventToDelete?.title }
        )}
        confirmLabel={t('common.delete', 'Delete')}
        type="danger"
        loading={deleting}
      />
    </Box>
  );
};

export default EventList;
