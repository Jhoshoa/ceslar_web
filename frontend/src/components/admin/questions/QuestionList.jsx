import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Chip,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import QuizIcon from '@mui/icons-material/Quiz';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { DataTable, ConfirmDialog, FormDialog } from '../common';
import { adminQuestionsApi } from '../../../services/adminApi';
import QuestionForm from './QuestionForm';
import CategoryManager from './CategoryManager';

// Question type labels
const QUESTION_TYPES = {
  text: 'Text',
  textarea: 'Long Text',
  select: 'Select',
  multiselect: 'Multi-Select',
  radio: 'Radio',
  checkbox: 'Checkbox',
  date: 'Date',
  number: 'Number',
};

/**
 * Question List component for admin panel (System Admin only)
 */
const QuestionList = () => {
  const { t } = useTranslation();

  // State
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('');

  // Dialogs
  const [formOpen, setFormOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [categoryManagerOpen, setCategoryManagerOpen] = useState(false);

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [questionsRes, categoriesRes] = await Promise.all([
        adminQuestionsApi.getAll({ category: categoryFilter || undefined }),
        adminQuestionsApi.getCategories(),
      ]);

      setQuestions(questionsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError(t('admin.questions.fetchError', 'Failed to load questions'));
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle add/edit
  const handleAdd = () => {
    setSelectedQuestion(null);
    setFormOpen(true);
  };

  const handleEdit = (question) => {
    setSelectedQuestion(question);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedQuestion(null);
  };

  const handleFormSave = async () => {
    handleFormClose();
    fetchData();
  };

  // Handle delete
  const handleDeleteClick = (question) => {
    setQuestionToDelete(question);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!questionToDelete) return;

    try {
      setDeleting(true);
      await adminQuestionsApi.delete(questionToDelete._id);
      setDeleteDialogOpen(false);
      setQuestionToDelete(null);
      fetchData();
    } catch (err) {
      console.error('Error deleting question:', err);
      setError(t('admin.questions.deleteError', 'Failed to delete question'));
    } finally {
      setDeleting(false);
    }
  };

  // Table columns
  const columns = [
    {
      id: 'text',
      label: t('admin.questions.columns.question', 'Question'),
      minWidth: 300,
      render: (row) => (
        <Box>
          <Typography variant="body2" fontWeight={600}>
            {row.text}
          </Typography>
          {row.helpText && (
            <Typography variant="caption" color="text.secondary">
              {row.helpText}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      id: 'type',
      label: t('admin.questions.columns.type', 'Type'),
      minWidth: 120,
      render: (row) => (
        <Chip
          size="small"
          label={QUESTION_TYPES[row.type] || row.type}
          variant="outlined"
        />
      ),
    },
    {
      id: 'category',
      label: t('admin.questions.columns.category', 'Category'),
      minWidth: 150,
      accessor: (row) => row.category?.name || '-',
    },
    {
      id: 'required',
      label: t('admin.questions.columns.required', 'Required'),
      minWidth: 80,
      align: 'center',
      render: (row) => (
        <Chip
          size="small"
          label={row.required ? t('common.yes', 'Yes') : t('common.no', 'No')}
          color={row.required ? 'primary' : 'default'}
        />
      ),
    },
    {
      id: 'order',
      label: t('admin.questions.columns.order', 'Order'),
      minWidth: 80,
      align: 'center',
      accessor: 'order',
    },
  ];

  // Filter toolbar
  const filterToolbar = (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>{t('admin.questions.filters.category', 'Category')}</InputLabel>
        <Select
          value={categoryFilter}
          label={t('admin.questions.filters.category', 'Category')}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <MenuItem value="">{t('common.all', 'All')}</MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat._id} value={cat._id}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="outlined"
        size="small"
        onClick={() => setCategoryManagerOpen(true)}
      >
        {t('admin.questions.manageCategories', 'Manage Categories')}
      </Button>
    </Box>
  );

  return (
    <Box>
      <DataTable
        columns={columns}
        data={questions}
        loading={loading}
        error={error}
        title={t('admin.questions.title', 'Registration Questions')}
        searchable={false}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onRefresh={fetchData}
        toolbar={filterToolbar}
        emptyMessage={t('admin.questions.empty', 'No questions found')}
      />

      {/* Question Form Dialog */}
      <QuestionForm
        open={formOpen}
        question={selectedQuestion}
        categories={categories}
        onClose={handleFormClose}
        onSave={handleFormSave}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title={t('admin.questions.deleteTitle', 'Delete Question')}
        message={t('admin.questions.deleteMessage', 'Are you sure you want to delete this question? User answers will be preserved.')}
        confirmLabel={t('common.delete', 'Delete')}
        type="danger"
        loading={deleting}
      />

      {/* Category Manager Dialog */}
      <CategoryManager
        open={categoryManagerOpen}
        categories={categories}
        onClose={() => setCategoryManagerOpen(false)}
        onUpdate={fetchData}
      />
    </Box>
  );
};

export default QuestionList;
