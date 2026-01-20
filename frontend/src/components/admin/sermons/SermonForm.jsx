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
  Chip,
  Autocomplete,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import { adminSermonsApi, adminChurchesApi } from '../../../services/adminApi';

/**
 * Sermon Form component for create/edit
 */
const SermonForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    speaker: '',
    date: '',
    church: '',
    series: '',
    tags: [],
    videoUrl: '',
    audioUrl: '',
    scripture: '',
    visibility: 'church_only',
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');

  // Loading states
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Data for dropdowns
  const [churches, setChurches] = useState([]);
  const [seriesList, setSeriesList] = useState([]);
  const [tagsList, setTagsList] = useState([]);

  // Fetch dropdown data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [churchesRes, seriesRes, tagsRes] = await Promise.all([
          adminChurchesApi.getAll({ limit: 100 }),
          adminSermonsApi.getSeries().catch(() => ({ data: [] })),
          adminSermonsApi.getTags().catch(() => ({ data: [] })),
        ]);
        setChurches(churchesRes.data || []);
        setSeriesList(seriesRes.data || []);
        setTagsList(tagsRes.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  // Fetch sermon data if editing
  useEffect(() => {
    if (!isEdit) return;

    const fetchSermon = async () => {
      try {
        setLoading(true);
        const response = await adminSermonsApi.getById(id);
        const sermon = response.data;

        setFormData({
          title: sermon.title || '',
          description: sermon.description || '',
          speaker: sermon.speaker || '',
          date: sermon.date ? new Date(sermon.date).toISOString().split('T')[0] : '',
          church: sermon.church?._id || sermon.church || '',
          series: sermon.series || '',
          tags: sermon.tags || [],
          videoUrl: sermon.videoUrl || '',
          audioUrl: sermon.audioUrl || '',
          scripture: sermon.scripture || '',
          visibility: sermon.visibility || 'church_only',
        });

        if (sermon.thumbnail) setThumbnailPreview(sermon.thumbnail);
      } catch (err) {
        console.error('Error fetching sermon:', err);
        setError(t('admin.sermons.fetchError', 'Failed to load sermon'));
      } finally {
        setLoading(false);
      }
    };

    fetchSermon();
  }, [id, isEdit, t]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setThumbnail(file);
      setThumbnailPreview(reader.result);
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

      let sermonId = id;

      if (isEdit) {
        await adminSermonsApi.update(id, formData);
      } else {
        const response = await adminSermonsApi.create(formData);
        sermonId = response.data._id;
      }

      if (thumbnail) {
        const formData = new FormData();
        formData.append('thumbnail', thumbnail);
        await adminSermonsApi.uploadThumbnail(sermonId, formData);
      }

      setSuccess(true);
      setTimeout(() => navigate('/admin/sermons'), 1500);
    } catch (err) {
      console.error('Error saving sermon:', err);
      setError(err.response?.data?.message || t('admin.sermons.saveError', 'Failed to save sermon'));
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
        <IconButton onClick={() => navigate('/admin/sermons')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight={600}>
          {isEdit ? t('admin.sermons.editTitle', 'Edit Sermon') : t('admin.sermons.createTitle', 'Add Sermon')}
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>{t('admin.sermons.saveSuccess', 'Sermon saved successfully!')}</Alert>}

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('admin.sermons.sections.basic', 'Sermon Details')}
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('admin.sermons.fields.title', 'Title')}
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('admin.sermons.fields.speaker', 'Speaker')}
                    name="speaker"
                    value={formData.speaker}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('admin.sermons.fields.date', 'Date')}
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label={t('admin.sermons.fields.description', 'Description')}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('admin.sermons.fields.scripture', 'Scripture Reference')}
                    name="scripture"
                    value={formData.scripture}
                    onChange={handleChange}
                    placeholder="John 3:16"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Media */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('admin.sermons.sections.media', 'Media')}
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('admin.sermons.fields.videoUrl', 'Video URL (YouTube/Vimeo)')}
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleChange}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('admin.sermons.fields.audioUrl', 'Audio URL')}
                    name="audioUrl"
                    value={formData.audioUrl}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Thumbnail */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('admin.sermons.fields.thumbnail', 'Thumbnail')}
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ textAlign: 'center' }}>
                {thumbnailPreview ? (
                  <Box
                    component="img"
                    src={thumbnailPreview}
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
                    <VideoLibraryIcon sx={{ fontSize: 60, color: 'grey.400' }} />
                  </Box>
                )}
                <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />}>
                  {t('common.upload', 'Upload')}
                  <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                </Button>
                {thumbnailPreview && (
                  <IconButton color="error" onClick={() => { setThumbnail(null); setThumbnailPreview(''); }} sx={{ ml: 1 }}>
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* Series & Tags */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('admin.sermons.sections.organization', 'Organization')}
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>{t('admin.sermons.fields.church', 'Church')}</InputLabel>
                <Select name="church" value={formData.church} onChange={handleChange} label={t('admin.sermons.fields.church', 'Church')}>
                  <MenuItem value="">{t('common.none', 'None')}</MenuItem>
                  {churches.map((church) => (
                    <MenuItem key={church._id} value={church._id}>{church.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Autocomplete
                freeSolo
                options={seriesList}
                value={formData.series}
                onChange={(_, newValue) => setFormData((prev) => ({ ...prev, series: newValue || '' }))}
                onInputChange={(_, newValue) => setFormData((prev) => ({ ...prev, series: newValue }))}
                renderInput={(params) => (
                  <TextField {...params} label={t('admin.sermons.fields.series', 'Series')} sx={{ mb: 2 }} />
                )}
              />

              <Autocomplete
                multiple
                freeSolo
                options={tagsList}
                value={formData.tags}
                onChange={(_, newValue) => setFormData((prev) => ({ ...prev, tags: newValue }))}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip size="small" label={option} {...getTagProps({ index })} key={option} />
                  ))
                }
                renderInput={(params) => (
                  <TextField {...params} label={t('admin.sermons.fields.tags', 'Tags')} />
                )}
              />
            </CardContent>
          </Card>

          {/* Visibility */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('admin.sermons.sections.visibility', 'Visibility')}
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <FormControl fullWidth>
                <InputLabel>{t('admin.sermons.fields.visibility', 'Visibility')}</InputLabel>
                <Select name="visibility" value={formData.visibility} onChange={handleChange} label={t('admin.sermons.fields.visibility', 'Visibility')}>
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
        <Button onClick={() => navigate('/admin/sermons')} disabled={saving}>
          {t('common.cancel', 'Cancel')}
        </Button>
        <Button type="submit" variant="contained" disabled={saving} startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}>
          {saving ? t('common.saving', 'Saving...') : t('common.save', 'Save')}
        </Button>
      </Box>
    </Box>
  );
};

export default SermonForm;
