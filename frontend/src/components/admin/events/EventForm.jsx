import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Divider,
  Avatar,
  IconButton,
  FormControlLabel,
  Switch,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';
import { adminEventsApi, adminChurchesApi } from '../../../services/adminApi';

// Event types
const EVENT_TYPES = ['service', 'conference', 'workshop', 'meeting', 'outreach', 'other'];

/**
 * Event Form component for create/edit
 */
const EventForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'service',
    date: '',
    endDate: '',
    location: {
      address: '',
      city: '',
    },
    church: '',
    isRecurring: false,
    recurringPattern: '',
    registrationRequired: false,
    maxAttendees: '',
    visibility: 'church_only',
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Loading states
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Churches for dropdown
  const [churches, setChurches] = useState([]);

  // Fetch churches
  useEffect(() => {
    const fetchChurches = async () => {
      try {
        const response = await adminChurchesApi.getAll({ limit: 100 });
        setChurches(response.data || []);
      } catch (err) {
        console.error('Error fetching churches:', err);
      }
    };
    fetchChurches();
  }, []);

  // Fetch event data if editing
  useEffect(() => {
    if (!isEdit) return;

    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await adminEventsApi.getById(id);
        const event = response.data;

        // Format dates for input
        const formatDateForInput = (dateStr) => {
          if (!dateStr) return '';
          const date = new Date(dateStr);
          return date.toISOString().slice(0, 16);
        };

        setFormData({
          name: event.name || event.title || '',
          description: event.description || '',
          type: event.type || 'service',
          date: formatDateForInput(event.date || event.startDate),
          endDate: formatDateForInput(event.endDate),
          location: {
            address: event.location?.address || event.location || '',
            city: event.location?.city || '',
          },
          church: event.church?._id || event.church || '',
          isRecurring: event.isRecurring || false,
          recurringPattern: event.recurringPattern || '',
          registrationRequired: event.registrationRequired || false,
          maxAttendees: event.maxAttendees || '',
          visibility: event.visibility || 'church_only',
        });

        if (event.image) setImagePreview(event.image);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError(t('admin.events.fetchError', 'Failed to load event'));
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, isEdit, t]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImage(file);
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      setSaving(true);

      // Prepare data
      const data = {
        ...formData,
        maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : undefined,
      };

      let eventId = id;

      if (isEdit) {
        await adminEventsApi.update(id, data);
      } else {
        const response = await adminEventsApi.create(data);
        eventId = response.data._id;
      }

      // Upload image if provided
      if (image) {
        const formData = new FormData();
        formData.append('image', image);
        await adminEventsApi.uploadImage(eventId, formData);
      }

      setSuccess(true);

      setTimeout(() => {
        navigate('/admin/events');
      }, 1500);
    } catch (err) {
      console.error('Error saving event:', err);
      setError(err.response?.data?.message || t('admin.events.saveError', 'Failed to save event'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton onClick={() => navigate('/admin/events')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight={600}>
          {isEdit
            ? t('admin.events.editTitle', 'Edit Event')
            : t('admin.events.createTitle', 'Create Event')}
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>{t('admin.events.saveSuccess', 'Event saved successfully!')}</Alert>}

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('admin.events.sections.basic', 'Event Details')}
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('admin.events.fields.name', 'Event Name')}
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>{t('admin.events.fields.type', 'Event Type')}</InputLabel>
                    <Select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      label={t('admin.events.fields.type', 'Event Type')}
                    >
                      {EVENT_TYPES.map((type) => (
                        <MenuItem key={type} value={type}>
                          {t(`admin.events.types.${type}`, type)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>{t('admin.events.fields.church', 'Church')}</InputLabel>
                    <Select
                      name="church"
                      value={formData.church}
                      onChange={handleChange}
                      label={t('admin.events.fields.church', 'Church')}
                    >
                      <MenuItem value="">{t('common.none', 'None')}</MenuItem>
                      {churches.map((church) => (
                        <MenuItem key={church._id} value={church._id}>
                          {church.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label={t('admin.events.fields.description', 'Description')}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Date & Time */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('admin.events.sections.datetime', 'Date & Time')}
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('admin.events.fields.startDate', 'Start Date & Time')}
                    name="date"
                    type="datetime-local"
                    value={formData.date}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('admin.events.fields.endDate', 'End Date & Time')}
                    name="endDate"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        name="isRecurring"
                        checked={formData.isRecurring}
                        onChange={handleChange}
                      />
                    }
                    label={t('admin.events.fields.isRecurring', 'Recurring Event')}
                  />
                </Grid>
                {formData.isRecurring && (
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>{t('admin.events.fields.recurringPattern', 'Repeat')}</InputLabel>
                      <Select
                        name="recurringPattern"
                        value={formData.recurringPattern}
                        onChange={handleChange}
                        label={t('admin.events.fields.recurringPattern', 'Repeat')}
                      >
                        <MenuItem value="daily">{t('admin.events.recurring.daily', 'Daily')}</MenuItem>
                        <MenuItem value="weekly">{t('admin.events.recurring.weekly', 'Weekly')}</MenuItem>
                        <MenuItem value="monthly">{t('admin.events.recurring.monthly', 'Monthly')}</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>

          {/* Location */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('admin.events.sections.location', 'Location')}
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('admin.events.fields.address', 'Address')}
                    name="location.address"
                    value={formData.location.address}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('admin.events.fields.city', 'City')}
                    name="location.city"
                    value={formData.location.city}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Image */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('admin.events.fields.image', 'Event Image')}
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ textAlign: 'center' }}>
                {imagePreview ? (
                  <Box
                    component="img"
                    src={imagePreview}
                    sx={{
                      width: '100%',
                      height: 180,
                      objectFit: 'cover',
                      borderRadius: 1,
                      mb: 2,
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      height: 180,
                      bgcolor: 'grey.200',
                      borderRadius: 1,
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <EventIcon sx={{ fontSize: 60, color: 'grey.400' }} />
                  </Box>
                )}
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                >
                  {t('common.upload', 'Upload')}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Button>
                {imagePreview && (
                  <IconButton
                    color="error"
                    onClick={() => {
                      setImage(null);
                      setImagePreview('');
                    }}
                    sx={{ ml: 1 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Registration */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('admin.events.sections.registration', 'Registration')}
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <FormControlLabel
                control={
                  <Switch
                    name="registrationRequired"
                    checked={formData.registrationRequired}
                    onChange={handleChange}
                  />
                }
                label={t('admin.events.fields.registrationRequired', 'Registration Required')}
                sx={{ mb: 2 }}
              />

              {formData.registrationRequired && (
                <TextField
                  fullWidth
                  label={t('admin.events.fields.maxAttendees', 'Max Attendees')}
                  name="maxAttendees"
                  type="number"
                  value={formData.maxAttendees}
                  onChange={handleChange}
                  inputProps={{ min: 0 }}
                />
              )}
            </CardContent>
          </Card>

          {/* Visibility */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('admin.events.sections.visibility', 'Visibility')}
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <FormControl fullWidth>
                <InputLabel>{t('admin.events.fields.visibility', 'Visibility')}</InputLabel>
                <Select
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleChange}
                  label={t('admin.events.fields.visibility', 'Visibility')}
                >
                  <MenuItem value="church_only">{t('admin.visibility.churchOnly', 'Church Only')}</MenuItem>
                  <MenuItem value="department">{t('admin.visibility.department', 'Department')}</MenuItem>
                  <MenuItem value="country">{t('admin.visibility.country', 'Country')}</MenuItem>
                  <MenuItem value="global">{t('admin.visibility.global', 'Global')}</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Submit Button */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={() => navigate('/admin/events')} disabled={saving}>
          {t('common.cancel', 'Cancel')}
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={saving}
          startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
        >
          {saving ? t('common.saving', 'Saving...') : t('common.save', 'Save')}
        </Button>
      </Box>
    </Box>
  );
};

export default EventForm;
