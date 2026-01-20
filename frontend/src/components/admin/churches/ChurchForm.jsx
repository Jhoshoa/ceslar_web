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
  FormHelperText,
  Autocomplete,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import ChurchIcon from '@mui/icons-material/Church';
import { adminChurchesApi, countriesApi } from '../../../services/adminApi';

// Church levels
const LEVELS = ['headquarters', 'country', 'department', 'province', 'local'];
const STATUSES = ['pending', 'active', 'inactive', 'suspended'];

/**
 * Church Form component for create/edit
 */
const ChurchForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    level: 'local',
    status: 'pending',
    description: '',
    parent: '',
    location: {
      address: '',
      city: '',
      department: '',
      country: '',
      postalCode: '',
      coordinates: {
        lat: '',
        lng: '',
      },
    },
    contact: {
      email: '',
      phone: '',
      website: '',
    },
    socialMedia: {
      facebook: '',
      instagram: '',
      youtube: '',
    },
    schedule: {
      sunday: '',
      wednesday: '',
    },
  });

  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [cover, setCover] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');

  // Loading states
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Data for dropdowns
  const [countries, setCountries] = useState([]);
  const [parentChurches, setParentChurches] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoadingCountries(true);
        const data = await countriesApi.getAll();
        setCountries(data);
      } catch (err) {
        console.error('Error fetching countries:', err);
      } finally {
        setLoadingCountries(false);
      }
    };
    fetchCountries();
  }, []);

  // Fetch parent churches for dropdown
  useEffect(() => {
    const fetchParentChurches = async () => {
      try {
        const response = await adminChurchesApi.getAll({ limit: 100 });
        setParentChurches(response.data || []);
      } catch (err) {
        console.error('Error fetching parent churches:', err);
      }
    };
    fetchParentChurches();
  }, []);

  // Fetch church data if editing
  useEffect(() => {
    if (!isEdit) return;

    const fetchChurch = async () => {
      try {
        setLoading(true);
        const response = await adminChurchesApi.getById(id);
        const church = response.data;

        setFormData({
          name: church.name || '',
          slug: church.slug || '',
          level: church.level || 'local',
          status: church.status || 'pending',
          description: church.description || '',
          parent: church.parent?._id || church.parent || '',
          location: {
            address: church.location?.address || '',
            city: church.location?.city || '',
            department: church.location?.department || '',
            country: church.location?.country || '',
            postalCode: church.location?.postalCode || '',
            coordinates: {
              lat: church.location?.coordinates?.lat || '',
              lng: church.location?.coordinates?.lng || '',
            },
          },
          contact: {
            email: church.contact?.email || '',
            phone: church.contact?.phone || '',
            website: church.contact?.website || '',
          },
          socialMedia: {
            facebook: church.socialMedia?.facebook || '',
            instagram: church.socialMedia?.instagram || '',
            youtube: church.socialMedia?.youtube || '',
          },
          schedule: {
            sunday: church.schedule?.sunday || '',
            wednesday: church.schedule?.wednesday || '',
          },
        });

        if (church.logo) setLogoPreview(church.logo);
        if (church.cover) setCoverPreview(church.cover);
      } catch (err) {
        console.error('Error fetching church:', err);
        setError(t('admin.churches.fetchError', 'Failed to load church'));
      } finally {
        setLoading(false);
      }
    };

    fetchChurch();
  }, [id, isEdit, t]);

  // Generate slug from name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child, grandchild] = name.split('.');
      if (grandchild) {
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: {
              ...prev[parent][child],
              [grandchild]: value,
            },
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value,
          },
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Auto-generate slug when name changes (only for new churches)
      if (name === 'name' && !isEdit) {
        setFormData((prev) => ({
          ...prev,
          slug: generateSlug(value),
        }));
      }
    }
  };

  // Handle file upload
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (type === 'logo') {
        setLogo(file);
        setLogoPreview(reader.result);
      } else {
        setCover(file);
        setCoverPreview(reader.result);
      }
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
        location: {
          ...formData.location,
          coordinates:
            formData.location.coordinates.lat && formData.location.coordinates.lng
              ? {
                  lat: parseFloat(formData.location.coordinates.lat),
                  lng: parseFloat(formData.location.coordinates.lng),
                }
              : undefined,
        },
      };

      // Remove empty parent
      if (!data.parent) delete data.parent;

      let churchId = id;

      if (isEdit) {
        await adminChurchesApi.update(id, data);
      } else {
        const response = await adminChurchesApi.create(data);
        churchId = response.data._id;
      }

      // Upload images if provided
      if (logo) {
        const formData = new FormData();
        formData.append('logo', logo);
        await adminChurchesApi.uploadLogo(churchId, formData);
      }

      if (cover) {
        const formData = new FormData();
        formData.append('cover', cover);
        await adminChurchesApi.uploadCover(churchId, formData);
      }

      setSuccess(true);

      // Redirect after short delay
      setTimeout(() => {
        navigate('/admin/churches');
      }, 1500);
    } catch (err) {
      console.error('Error saving church:', err);
      setError(err.response?.data?.message || t('admin.churches.saveError', 'Failed to save church'));
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
        <IconButton onClick={() => navigate('/admin/churches')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight={600}>
          {isEdit
            ? t('admin.churches.editTitle', 'Edit Church')
            : t('admin.churches.createTitle', 'Create Church')}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {t('admin.churches.saveSuccess', 'Church saved successfully!')}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Basic Info */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('admin.churches.sections.basic', 'Basic Information')}
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('admin.churches.fields.name', 'Church Name')}
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('admin.churches.fields.slug', 'URL Slug')}
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                    helperText={t('admin.churches.fields.slugHelp', 'Used in URLs')}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>{t('admin.churches.fields.level', 'Level')}</InputLabel>
                    <Select
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                      label={t('admin.churches.fields.level', 'Level')}
                    >
                      {LEVELS.map((level) => (
                        <MenuItem key={level} value={level}>
                          {t(`admin.churches.levels.${level}`, level)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>{t('admin.churches.fields.status', 'Status')}</InputLabel>
                    <Select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      label={t('admin.churches.fields.status', 'Status')}
                    >
                      {STATUSES.map((status) => (
                        <MenuItem key={status} value={status}>
                          {t(`admin.churches.statuses.${status}`, status)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>{t('admin.churches.fields.parent', 'Parent Church')}</InputLabel>
                    <Select
                      name="parent"
                      value={formData.parent}
                      onChange={handleChange}
                      label={t('admin.churches.fields.parent', 'Parent Church')}
                    >
                      <MenuItem value="">{t('common.none', 'None')}</MenuItem>
                      {parentChurches
                        .filter((c) => c._id !== id)
                        .map((church) => (
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
                    label={t('admin.churches.fields.description', 'Description')}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Location */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('admin.churches.sections.location', 'Location')}
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('admin.churches.fields.address', 'Address')}
                    name="location.address"
                    value={formData.location.address}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('admin.churches.fields.city', 'City')}
                    name="location.city"
                    value={formData.location.city}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('admin.churches.fields.department', 'Department/State')}
                    name="location.department"
                    value={formData.location.department}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    options={countries}
                    getOptionLabel={(option) => option.name || option}
                    value={countries.find((c) => c.name === formData.location.country) || null}
                    onChange={(_, newValue) =>
                      handleChange({
                        target: { name: 'location.country', value: newValue?.name || '' },
                      })
                    }
                    loading={loadingCountries}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t('admin.churches.fields.country', 'Country')}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('admin.churches.fields.postalCode', 'Postal Code')}
                    name="location.postalCode"
                    value={formData.location.postalCode}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('admin.churches.fields.latitude', 'Latitude')}
                    name="location.coordinates.lat"
                    value={formData.location.coordinates.lat}
                    onChange={handleChange}
                    type="number"
                    inputProps={{ step: 'any' }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('admin.churches.fields.longitude', 'Longitude')}
                    name="location.coordinates.lng"
                    value={formData.location.coordinates.lng}
                    onChange={handleChange}
                    type="number"
                    inputProps={{ step: 'any' }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('admin.churches.sections.contact', 'Contact Information')}
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('admin.churches.fields.email', 'Email')}
                    name="contact.email"
                    type="email"
                    value={formData.contact.email}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('admin.churches.fields.phone', 'Phone')}
                    name="contact.phone"
                    value={formData.contact.phone}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('admin.churches.fields.website', 'Website')}
                    name="contact.website"
                    value={formData.contact.website}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('admin.churches.sections.social', 'Social Media')}
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Facebook"
                    name="socialMedia.facebook"
                    value={formData.socialMedia.facebook}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Instagram"
                    name="socialMedia.instagram"
                    value={formData.socialMedia.instagram}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="YouTube"
                    name="socialMedia.youtube"
                    value={formData.socialMedia.youtube}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar - Images & Schedule */}
        <Grid item xs={12} md={4}>
          {/* Logo */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('admin.churches.fields.logo', 'Logo')}
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ textAlign: 'center' }}>
                <Avatar
                  src={logoPreview}
                  sx={{ width: 120, height: 120, mx: 'auto', mb: 2, bgcolor: 'primary.light' }}
                >
                  <ChurchIcon sx={{ fontSize: 60 }} />
                </Avatar>
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
                    onChange={(e) => handleFileChange(e, 'logo')}
                  />
                </Button>
                {logoPreview && (
                  <IconButton
                    color="error"
                    onClick={() => {
                      setLogo(null);
                      setLogoPreview('');
                    }}
                    sx={{ ml: 1 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Cover Image */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('admin.churches.fields.cover', 'Cover Image')}
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ textAlign: 'center' }}>
                {coverPreview ? (
                  <Box
                    component="img"
                    src={coverPreview}
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
                    <Typography color="text.secondary">
                      {t('admin.churches.noCover', 'No cover image')}
                    </Typography>
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
                    onChange={(e) => handleFileChange(e, 'cover')}
                  />
                </Button>
                {coverPreview && (
                  <IconButton
                    color="error"
                    onClick={() => {
                      setCover(null);
                      setCoverPreview('');
                    }}
                    sx={{ ml: 1 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('admin.churches.sections.schedule', 'Service Schedule')}
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <TextField
                fullWidth
                label={t('admin.churches.fields.sundayService', 'Sunday Service')}
                name="schedule.sunday"
                value={formData.schedule.sunday}
                onChange={handleChange}
                placeholder="10:00 AM"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label={t('admin.churches.fields.wednesdayService', 'Wednesday Service')}
                name="schedule.wednesday"
                value={formData.schedule.wednesday}
                onChange={handleChange}
                placeholder="7:00 PM"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Submit Button */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={() => navigate('/admin/churches')} disabled={saving}>
          {t('common.cancel', 'Cancel')}
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={saving}
          startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
        >
          {saving
            ? t('common.saving', 'Saving...')
            : t('common.save', 'Save')}
        </Button>
      </Box>
    </Box>
  );
};

export default ChurchForm;
