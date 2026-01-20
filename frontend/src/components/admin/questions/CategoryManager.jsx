import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Box,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { adminQuestionsApi } from '../../../services/adminApi';

/**
 * Category Manager dialog for managing question categories
 */
const CategoryManager = ({ open, categories, onClose, onUpdate }) => {
  const { t } = useTranslation();

  const [localCategories, setLocalCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync with props
  useEffect(() => {
    setLocalCategories(categories || []);
    setError(null);
  }, [categories, open]);

  // Add category
  const handleAdd = async () => {
    if (!newCategoryName.trim()) return;

    try {
      setLoading(true);
      setError(null);
      await adminQuestionsApi.createCategory({
        name: newCategoryName.trim(),
        order: localCategories.length,
      });
      setNewCategoryName('');
      onUpdate?.();
    } catch (err) {
      console.error('Error adding category:', err);
      setError(err.response?.data?.message || t('admin.questions.categoryError', 'Failed to save category'));
    } finally {
      setLoading(false);
    }
  };

  // Start editing
  const handleStartEdit = (category) => {
    setEditingId(category._id);
    setEditingName(category.name);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  // Save edit
  const handleSaveEdit = async () => {
    if (!editingName.trim()) return;

    try {
      setLoading(true);
      setError(null);
      await adminQuestionsApi.updateCategory(editingId, {
        name: editingName.trim(),
      });
      handleCancelEdit();
      onUpdate?.();
    } catch (err) {
      console.error('Error updating category:', err);
      setError(err.response?.data?.message || t('admin.questions.categoryError', 'Failed to save category'));
    } finally {
      setLoading(false);
    }
  };

  // Delete category
  const handleDelete = async (categoryId) => {
    if (!window.confirm(t('admin.questions.confirmDeleteCategory', 'Delete this category? Questions in this category will become uncategorized.'))) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await adminQuestionsApi.deleteCategory(categoryId);
      onUpdate?.();
    } catch (err) {
      console.error('Error deleting category:', err);
      setError(err.response?.data?.message || t('admin.questions.categoryError', 'Failed to delete category'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {t('admin.questions.manageCategories', 'Manage Categories')}
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Add new category */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            size="small"
            fullWidth
            placeholder={t('admin.questions.newCategoryPlaceholder', 'New category name...')}
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
            disabled={loading}
          />
          <Button
            variant="contained"
            onClick={handleAdd}
            disabled={loading || !newCategoryName.trim()}
            startIcon={loading ? <CircularProgress size={16} /> : <AddIcon />}
          >
            {t('common.add', 'Add')}
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Categories list */}
        {localCategories.length === 0 ? (
          <Typography color="text.secondary" textAlign="center" sx={{ py: 3 }}>
            {t('admin.questions.noCategories', 'No categories yet')}
          </Typography>
        ) : (
          <List>
            {localCategories.map((category) => (
              <ListItem key={category._id} divider>
                {editingId === category._id ? (
                  <Box sx={{ display: 'flex', gap: 1, flex: 1, alignItems: 'center' }}>
                    <TextField
                      size="small"
                      fullWidth
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                      autoFocus
                      disabled={loading}
                    />
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={handleSaveEdit}
                      disabled={loading}
                    >
                      <SaveIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={handleCancelEdit}
                      disabled={loading}
                    >
                      <CancelIcon />
                    </IconButton>
                  </Box>
                ) : (
                  <>
                    <ListItemText
                      primary={category.name}
                      secondary={t('admin.questions.questionsCount', '{{count}} questions', {
                        count: category.questionCount || 0,
                      })}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        size="small"
                        onClick={() => handleStartEdit(category)}
                        disabled={loading}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(category._id)}
                        disabled={loading}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </>
                )}
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          {t('common.close', 'Close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

CategoryManager.propTypes = {
  open: PropTypes.bool.isRequired,
  categories: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func,
};

export default CategoryManager;
