import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Button,
  Divider,
  Skeleton,
  Alert,
} from '@mui/material';
import ChurchIcon from '@mui/icons-material/Church';
import EventIcon from '@mui/icons-material/Event';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import GroupsIcon from '@mui/icons-material/Groups';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { StatsCard } from '../common';
import { usePermissions } from '../../../hooks/usePermissions';
import { churchesApi, eventsApi, sermonsApi, usersApi } from '../../../services/api';

/**
 * Admin Dashboard component with statistics and recent activity
 */
const AdminDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isSystemAdmin, isAdmin, permissions } = usePermissions();

  const [stats, setStats] = useState({
    churches: 0,
    events: 0,
    sermons: 0,
    users: 0,
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [recentSermons, setRecentSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch counts in parallel
        const [churchesRes, eventsRes, sermonsRes] = await Promise.all([
          churchesApi.getAll({ limit: 1 }).catch(() => ({ pagination: { totalItems: 0 } })),
          eventsApi.getAll({ limit: 5 }).catch(() => ({ data: [], pagination: { totalItems: 0 } })),
          sermonsApi.getAll({ limit: 5 }).catch(() => ({ data: [], pagination: { totalItems: 0 } })),
        ]);

        setStats({
          churches: churchesRes?.pagination?.totalItems || 0,
          events: eventsRes?.pagination?.totalItems || 0,
          sermons: sermonsRes?.pagination?.totalItems || 0,
          users: 0, // Will be fetched if user has permission
        });

        setRecentEvents(eventsRes?.data || []);
        setRecentSermons(sermonsRes?.data || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(t('admin.dashboard.error', 'Failed to load dashboard data'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Box>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {t('admin.dashboard.welcome', 'Welcome back!')}
        </Typography>
        <Typography color="text.secondary">
          {t('admin.dashboard.subtitle', "Here's what's happening with your church platform.")}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {permissions.canViewChurches && (
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title={t('admin.dashboard.totalChurches', 'Total Churches')}
              value={stats.churches}
              icon={<ChurchIcon sx={{ fontSize: 28 }} />}
              color="primary"
              loading={loading}
              onClick={() => navigate('/admin/churches')}
            />
          </Grid>
        )}

        {permissions.canViewEvents && (
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title={t('admin.dashboard.totalEvents', 'Total Events')}
              value={stats.events}
              icon={<EventIcon sx={{ fontSize: 28 }} />}
              color="success"
              loading={loading}
              onClick={() => navigate('/admin/events')}
            />
          </Grid>
        )}

        {permissions.canViewSermons && (
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title={t('admin.dashboard.totalSermons', 'Total Sermons')}
              value={stats.sermons}
              icon={<VideoLibraryIcon sx={{ fontSize: 28 }} />}
              color="warning"
              loading={loading}
              onClick={() => navigate('/admin/sermons')}
            />
          </Grid>
        )}

        {permissions.canViewUsers && (
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title={t('admin.dashboard.totalUsers', 'Total Users')}
              value={stats.users}
              icon={<PeopleIcon sx={{ fontSize: 28 }} />}
              color="info"
              loading={loading}
              onClick={() => navigate('/admin/users')}
            />
          </Grid>
        )}
      </Grid>

      {/* Quick Actions & Recent Activity */}
      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title={t('admin.dashboard.quickActions', 'Quick Actions')}
              titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
            />
            <Divider />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {permissions.canCreateEvent && (
                  <Button
                    variant="outlined"
                    startIcon={<EventIcon />}
                    onClick={() => navigate('/admin/events/new')}
                    fullWidth
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    {t('admin.dashboard.createEvent', 'Create Event')}
                  </Button>
                )}
                {permissions.canCreateSermon && (
                  <Button
                    variant="outlined"
                    startIcon={<VideoLibraryIcon />}
                    onClick={() => navigate('/admin/sermons/new')}
                    fullWidth
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    {t('admin.dashboard.createSermon', 'Add Sermon')}
                  </Button>
                )}
                {permissions.canCreateChurch && (
                  <Button
                    variant="outlined"
                    startIcon={<ChurchIcon />}
                    onClick={() => navigate('/admin/churches/new')}
                    fullWidth
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    {t('admin.dashboard.createChurch', 'Add Church')}
                  </Button>
                )}
                {permissions.canCreateMinistry && (
                  <Button
                    variant="outlined"
                    startIcon={<GroupsIcon />}
                    onClick={() => navigate('/admin/ministries/new')}
                    fullWidth
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    {t('admin.dashboard.createMinistry', 'Add Ministry')}
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Events */}
        {permissions.canViewEvents && (
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                title={t('admin.dashboard.recentEvents', 'Recent Events')}
                titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
                action={
                  <Button size="small" onClick={() => navigate('/admin/events')}>
                    {t('common.viewAll', 'View All')}
                  </Button>
                }
              />
              <Divider />
              <CardContent sx={{ p: 0 }}>
                {loading ? (
                  <List>
                    {[1, 2, 3].map((i) => (
                      <ListItem key={i}>
                        <ListItemAvatar>
                          <Skeleton variant="circular" width={40} height={40} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={<Skeleton width="60%" />}
                          secondary={<Skeleton width="40%" />}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : recentEvents.length === 0 ? (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography color="text.secondary">
                      {t('admin.dashboard.noEvents', 'No events yet')}
                    </Typography>
                  </Box>
                ) : (
                  <List>
                    {recentEvents.slice(0, 5).map((event) => (
                      <ListItem
                        key={event._id}
                        button
                        onClick={() => navigate(`/admin/events/${event._id}`)}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'success.light' }}>
                            <EventIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={event.name || event.title}
                          secondary={formatDate(event.date || event.startDate)}
                          primaryTypographyProps={{ noWrap: true }}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Recent Sermons */}
        {permissions.canViewSermons && (
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                title={t('admin.dashboard.recentSermons', 'Recent Sermons')}
                titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
                action={
                  <Button size="small" onClick={() => navigate('/admin/sermons')}>
                    {t('common.viewAll', 'View All')}
                  </Button>
                }
              />
              <Divider />
              <CardContent sx={{ p: 0 }}>
                {loading ? (
                  <List>
                    {[1, 2, 3].map((i) => (
                      <ListItem key={i}>
                        <ListItemAvatar>
                          <Skeleton variant="circular" width={40} height={40} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={<Skeleton width="60%" />}
                          secondary={<Skeleton width="40%" />}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : recentSermons.length === 0 ? (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography color="text.secondary">
                      {t('admin.dashboard.noSermons', 'No sermons yet')}
                    </Typography>
                  </Box>
                ) : (
                  <List>
                    {recentSermons.slice(0, 5).map((sermon) => (
                      <ListItem
                        key={sermon._id}
                        button
                        onClick={() => navigate(`/admin/sermons/${sermon._id}`)}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'warning.light' }}>
                            <VideoLibraryIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={sermon.title}
                          secondary={sermon.speaker || formatDate(sermon.date)}
                          primaryTypographyProps={{ noWrap: true }}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
