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
  IconButton,
  FormControlLabel,
  Switch,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupsIcon from '@mui/icons-material/Groups';
import { adminMinistriesApi, adminChurchesApi } from '../../../services/adminApi';

/**
 * Ministry Form component for create/edit
 */
const MinistryForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    church: '',
    meetingDay: '',
    meetingTime: '',
    meetingLocation: '',
    isActive: true,
    visibility: 'church_only',
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Loading states
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Churches
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

  // Fetch ministry data if editing
  useEffect(() => {
    if (!isEdit) return;

    const fetchMinistry = async () => {
      try {
        setLoading(true);
        const response = await adminMinistriesApi.getById(id);
        const ministry = response.data;

        setFormData({
          name: ministry.name || '',
          description: ministry.description || '',
          church: ministry.church?._id || ministry.church || '',
          meetingDay: ministry.meetingDay || '',
          meetingTime: ministry.meetingTime || '',
          meetingLocation: ministry.meetingLocation || '',
          isActive: ministry.isActive !== false,
          visibility: ministry.visibility || 'church_only',
        });

        if (ministry.image) setImagePreview(ministry.image);
      } catch (err) {
        console.error('Error fetching ministry:', err);
        setError(t('admin.ministries.fetchError', 'Failed to load ministry'));
      } finally {
        setLoading(false);
      }
    };

    fetchMinistry();
  }, [id, isEdit, t]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
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

      let ministryId = id;

      if (isEdit) {
        await adminMinistriesApi.update(id, formData);
      } else {
        const response = await adminMinistriesApi.create(formData);
        ministryId = response.data._id;
      }

      if (image) {
        const formData = new FormData();
        formData.append('image', image);
        await adminMinistriesApi.uploadImage(ministryId, formData);
      }

      setSuccess(true);
      setTimeout(() => navigate('/admin/ministries'), 1500);
    } catch (err) {
      console.error('Error saving ministry:', err);
      setError(err.response?.data?.message || t('admin.ministries.saveError', 'Failed to save ministry'));
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
        <IconButton onClick={() => navigate('/admin/ministries')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight={600}>
          {isEdit ? t('admin.ministries.editTitle', 'Edit Ministry') : t('admin.ministries.createTitle', 'Create Ministry')}
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>{t('admin.ministries.saveSuccess', 'Ministry saved successfully!')}</Alert>}

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('admin.ministries.sections.basic', 'Ministry Details')}
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('admin.ministries.fields.name', 'Ministry Name')}
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>{t('admin.ministries.fields.church', 'Church')}</InputLabel>
                    <Select
                      name="church"
                      value={formData.church}
                      onChange={handleChange}
                      label={t('admin.ministries.fields.church', 'Church')}
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
                    label={t('admin.ministries.fields.description', 'Description')}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Meeting Info */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('admin.ministries.sections.meeting', 'Meeting Information')}
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>{t('admin.ministries.fields.meetingDay', 'Meeting Day')}</InputLabel>
                    <Select
                      name="meetingDay"
                      value={formData.meetingDay}
                      onChange={handleChange}
                      label={t('admin.ministries.fields.meetingDay', 'Meeting Day')}
                    >
                      <MenuItem value="">{t('common.none', 'None')}</MenuItem>
                      <MenuItem value="sunday">{t('days.sunday', 'Sunday')}</MenuItem>
                      <MenuItem value="monday">{t('days.monday', 'Monday')}</MenuItem>
                      <MenuItem value="tuesday">{t('days.tuesday', 'Tuesday')}</MenuItem>
                      <MenuItem value="wednesday">{t('days.wednesday', 'Wednesday')}</MenuItem>
                      <MenuItem value="thursday">{t('days.thursday', 'Thursday')}</MenuItem>
                      <MenuItem value="friday">{t('days.friday', 'Friday')}</MenuItem>
                      <MenuItem value="saturday">{t('days.saturday', 'Saturday')}</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('admin.ministries.fields.meetingTime', 'Meeting Time')}
                    name="meetingTime"
                    value={formData.meetingTime}
                    onChange={handleChange}
                    placeholder="7:00 PM"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('admin.ministries.fields.meetingLocation', 'Meeting Location')}
                    name="meetingLocation"
                    value={formData.meetingLocation}
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
                {t('admin.ministries.fields.image', 'Ministry Image')}
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ textAlign: 'center' }}>
                {imagePreview ? (
                  <Box
                    component="img"
                    src={imagePreview}
                    sx={{
                      width: '100%',
                      height: 150,
                      objectFit: 'cover',
                      borderRadius: 1,
                      mb: 2,
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      height: 150,
                      bgcolor: 'grey.200',
                      borderRadius: 1,
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <GroupsIcon sx={{ fontSize: 60, color: 'grey.400' }} />
                  </Box>
                )}
                <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />}>
                  {t('common.upload', 'Upload')}
                  <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                </Button>
                {imagePreview && (
                  <IconButton color="error" onClick={() => { setImage(null); setImagePreview(''); }} sx={{ ml: 1 }}>
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Status */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('admin.ministries.sections.status', 'Status')}
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <FormControlLabel
                control={<Switch name="isActive" checked={formData.isActive} onChange={handleChange} />}
                label={t('admin.ministries.fields.isActive', 'Active')}
                sx={{ mb: 2 }}
              />

              <FormControl fullWidth>
                <InputLabel>{t('admin.ministries.fields.visibility', 'Visibility')}</InputLabel>
                <Select
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleChange}
                  label={t('admin.ministries.fields.visibility', 'Visibility')}
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

      {/* Submit */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={() => navigate('/admin/ministries')} disabled={saving}>
          {t('common.cancel', 'Cancel')}
        </Button>
        <Button type="submit" variant="contained" disabled={saving} startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}>
          {saving ? t('common.saving', 'Saving...') : t('common.save', 'Save')}
        </Button>
      </Box>
    </Box>
  );
};

export default MinistryForm;
