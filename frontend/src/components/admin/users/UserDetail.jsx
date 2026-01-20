import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Avatar,
  Chip,
  Divider,
  IconButton,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import ChurchIcon from '@mui/icons-material/Church';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { adminUsersApi, adminQuestionsApi } from '../../../services/adminApi';

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
 * User Detail component for viewing user information
 */
const UserDetail = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [userRes, answersRes] = await Promise.all([
          adminUsersApi.getById(id),
          adminUsersApi.getAnswers(id).catch(() => ({ data: [] })),
        ]);

        setUser(userRes.data);
        setAnswers(answersRes.data || []);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError(t('admin.users.fetchError', 'Failed to load user'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, t]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <IconButton onClick={() => navigate('/admin/users')} sx={{ mb: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box>
        <IconButton onClick={() => navigate('/admin/users')} sx={{ mb: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Alert severity="warning">{t('admin.users.notFound', 'User not found')}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton onClick={() => navigate('/admin/users')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight={600}>
          {t('admin.users.detailTitle', 'User Details')}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', pt: 4 }}>
              <Avatar
                src={user.picture}
                alt={user.firstName}
                sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
              >
                <PersonIcon sx={{ fontSize: 60 }} />
              </Avatar>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                {user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.email}
              </Typography>
              <Chip
                label={t(`admin.users.roles.${user.systemRole || 'user'}`, user.systemRole || 'User')}
                color={ROLE_COLORS[user.systemRole] || 'default'}
                sx={{ mb: 2 }}
              />

              <Divider sx={{ my: 2 }} />

              {/* Contact Info */}
              <Box sx={{ textAlign: 'left' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <EmailIcon color="action" fontSize="small" />
                  <Typography variant="body2">{user.email}</Typography>
                </Box>
                {user.phone && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <PhoneIcon color="action" fontSize="small" />
                    <Typography variant="body2">{user.phone}</Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarTodayIcon color="action" fontSize="small" />
                  <Typography variant="body2">
                    {t('admin.users.joinedOn', 'Joined {{date}}', { date: formatDate(user.createdAt) })}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Details */}
        <Grid item xs={12} md={8}>
          {/* Church Memberships */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('admin.users.sections.memberships', 'Church Memberships')}
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {user.churchMemberships?.length > 0 ? (
                <List>
                  {user.churchMemberships.map((membership, index) => (
                    <ListItem key={index} divider={index < user.churchMemberships.length - 1}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.light' }}>
                          <ChurchIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={membership.church?.name || t('admin.users.unknownChurch', 'Unknown Church')}
                        secondary={
                          <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                            <Chip
                              size="small"
                              label={t(`admin.users.roles.${membership.role}`, membership.role)}
                              color={ROLE_COLORS[membership.role] || 'default'}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {t('admin.users.since', 'Since {{date}}', { date: formatDate(membership.joinedAt) })}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary" textAlign="center" sx={{ py: 3 }}>
                  {t('admin.users.noMemberships', 'No church memberships')}
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Registration Answers */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('admin.users.sections.answers', 'Registration Answers')}
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {answers.length > 0 ? (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>
                          {t('admin.users.answersTable.question', 'Question')}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                          {t('admin.users.answersTable.answer', 'Answer')}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {answers.map((answer, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Typography variant="body2">
                              {answer.question?.text || t('admin.users.unknownQuestion', 'Question')}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {Array.isArray(answer.value) ? answer.value.join(', ') : answer.value || '-'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography color="text.secondary" textAlign="center" sx={{ py: 3 }}>
                  {t('admin.users.noAnswers', 'No registration answers')}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserDetail;
