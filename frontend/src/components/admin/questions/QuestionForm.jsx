import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Chip,
  Box,
  IconButton,
  Typography,
  Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { FormDialog } from '../common';
import { adminQuestionsApi } from '../../../services/adminApi';

// Question types
const QUESTION_TYPES = [
  { value: 'text', label: 'Short Text' },
  { value: 'textarea', label: 'Long Text' },
  { value: 'select', label: 'Dropdown Select' },
  { value: 'multiselect', label: 'Multi-Select' },
  { value: 'radio', label: 'Radio Buttons' },
  { value: 'checkbox', label: 'Checkboxes' },
  { value: 'date', label: 'Date' },
  { value: 'number', label: 'Number' },
];

// User types
const USER_TYPES = ['new_believer', 'transfer', 'returning', 'visitor'];

/**
 * Question Form dialog for create/edit
 */
const QuestionForm = ({ open, question, categories, onClose, onSave }) => {
  const { t } = useTranslation();
  const isEdit = Boolean(question);

  const [formData, setFormData] = useState({
    text: '',
    type: 'text',
    category: '',
    helpText: '',
    required: false,
    order: 0,
    options: [],
    appliesTo: USER_TYPES,
    validation: {
      minLength: '',
      maxLength: '',
      pattern: '',
    },
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [newOption, setNewOption] = useState('');

  // Initialize form with question data
  useEffect(() => {
    if (question) {
      setFormData({
        text: question.text || '',
        type: question.type || 'text',
        category: question.category?._id || question.category || '',
        helpText: question.helpText || '',
        required: question.required || false,
        order: question.order || 0,
        options: question.options || [],
        appliesTo: question.appliesTo || USER_TYPES,
        validation: {
          minLength: question.validation?.minLength || '',
          maxLength: question.validation?.maxLength || '',
          pattern: question.validation?.pattern || '',
        },
      });
    } else {
      setFormData({
        text: '',
        type: 'text',
        category: '',
        helpText: '',
        required: false,
        order: 0,
        options: [],
        appliesTo: USER_TYPES,
        validation: {
          minLength: '',
          maxLength: '',
          pattern: '',
        },
      });
    }
    setError(null);
  }, [question, open]);

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

  // Handle options
  const handleAddOption = () => {
    if (!newOption.trim()) return;
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, newOption.trim()],
    }));
    setNewOption('');
  };

  const handleRemoveOption = (index) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  // Handle user types
  const handleUserTypeToggle = (userType) => {
    setFormData((prev) => {
      const current = prev.appliesTo || [];
      if (current.includes(userType)) {
        return { ...prev, appliesTo: current.filter((t) => t !== userType) };
      }
      return { ...prev, appliesTo: [...current, userType] };
    });
  };

  // Check if question type needs options
  const needsOptions = ['select', 'multiselect', 'radio', 'checkbox'].includes(formData.type);

  // Handle submit
  const handleSubmit = async () => {
    setError(null);

    // Validation
    if (!formData.text.trim()) {
      setError(t('admin.questions.errors.textRequired', 'Question text is required'));
      return;
    }

    if (needsOptions && formData.options.length < 2) {
      setError(t('admin.questions.errors.optionsRequired', 'At least 2 options are required'));
      return;
    }

    try {
      setSaving(true);

      const data = {
        ...formData,
        validation: formData.validation.minLength || formData.validation.maxLength || formData.validation.pattern
          ? formData.validation
          : undefined,
      };

      if (isEdit) {
        await adminQuestionsApi.update(question._id, data);
      } else {
        await adminQuestionsApi.create(data);
      }

      onSave?.();
    } catch (err) {
      console.error('Error saving question:', err);
      setError(err.response?.data?.message || t('admin.questions.saveError', 'Failed to save question'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={isEdit ? t('admin.questions.editTitle', 'Edit Question') : t('admin.questions.createTitle', 'Add Question')}
      loading={saving}
      maxWidth="md"
    >
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Grid container spacing={2}>
        {/* Question Text */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label={t('admin.questions.fields.text', 'Question Text')}
            name="text"
            value={formData.text}
            onChange={handleChange}
            required
          />
        </Grid>

        {/* Type & Category */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>{t('admin.questions.fields.type', 'Question Type')}</InputLabel>
            <Select
              name="type"
              value={formData.type}
              onChange={handleChange}
              label={t('admin.questions.fields.type', 'Question Type')}
            >
              {QUESTION_TYPES.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>{t('admin.questions.fields.category', 'Category')}</InputLabel>
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              label={t('admin.questions.fields.category', 'Category')}
            >
              <MenuItem value="">{t('common.none', 'None')}</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Help Text */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label={t('admin.questions.fields.helpText', 'Help Text')}
            name="helpText"
            value={formData.helpText}
            onChange={handleChange}
            placeholder={t('admin.questions.fields.helpTextPlaceholder', 'Additional instructions for the user')}
          />
        </Grid>

        {/* Options (for select/radio/checkbox types) */}
        {needsOptions && (
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {t('admin.questions.fields.options', 'Options')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                size="small"
                placeholder={t('admin.questions.fields.addOption', 'Add option...')}
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddOption())}
                sx={{ flex: 1 }}
              />
              <Button variant="outlined" onClick={handleAddOption} startIcon={<AddIcon />}>
                {t('common.add', 'Add')}
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {formData.options.map((option, index) => (
                <Chip
                  key={index}
                  label={option}
                  onDelete={() => handleRemoveOption(index)}
                  size="small"
                />
              ))}
            </Box>
          </Grid>
        )}

        {/* Required & Order */}
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                name="required"
                checked={formData.required}
                onChange={handleChange}
              />
            }
            label={t('admin.questions.fields.required', 'Required')}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={t('admin.questions.fields.order', 'Display Order')}
            name="order"
            type="number"
            value={formData.order}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />
        </Grid>

        {/* Applies To (User Types) */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            {t('admin.questions.fields.appliesTo', 'Show question to')}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {USER_TYPES.map((userType) => (
              <Chip
                key={userType}
                label={t(`admin.questions.userTypes.${userType}`, userType)}
                onClick={() => handleUserTypeToggle(userType)}
                color={formData.appliesTo?.includes(userType) ? 'primary' : 'default'}
                variant={formData.appliesTo?.includes(userType) ? 'filled' : 'outlined'}
              />
            ))}
          </Box>
        </Grid>
      </Grid>
    </FormDialog>
  );
};

QuestionForm.propTypes = {
  open: PropTypes.bool.isRequired,
  question: PropTypes.object,
  categories: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func,
};

export default QuestionForm;
