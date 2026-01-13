import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DynamicQuestion from './DynamicQuestion';
import { questionsApi } from '../../../services/api';

const QuestionnaireForm = ({
  churchId = null,
  userType = 'all',
  onComplete,
  showStepper = true,
}) => {
  const { t, i18n } = useTranslation('questionnaire');

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [validationErrors, setValidationErrors] = useState({});

  // Fetch questions on mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await questionsApi.getRegistrationQuestions(churchId, userType);
        setCategories(response.data || []);
      } catch (err) {
        setError(err.response?.data?.message || t('loadError'));
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [churchId, userType, i18n.language, t]);

  // Get current category's questions
  const currentCategory = categories[activeStep];

  // Filter questions based on conditional display
  const visibleQuestions = useMemo(() => {
    if (!currentCategory?.questions) return [];

    return currentCategory.questions.filter((question) => {
      if (!question.conditionalDisplay?.dependsOn) return true;

      const dependentValue = answers[question.conditionalDisplay.dependsOn];
      return dependentValue === question.conditionalDisplay.showWhenValue;
    });
  }, [currentCategory, answers]);

  // Handle answer change
  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    // Clear validation error when answer changes
    if (validationErrors[questionId]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  // Validate current step
  const validateStep = () => {
    const errors = {};

    visibleQuestions.forEach((question) => {
      const value = answers[question.id];
      const validation = question.validation;

      if (validation?.isRequired) {
        if (value === undefined || value === null || value === '' ||
            (Array.isArray(value) && value.length === 0)) {
          errors[question.id] = t('validation.required');
        }
      }

      if (value && validation?.minLength && value.length < validation.minLength) {
        errors[question.id] = t('validation.minLength', { min: validation.minLength });
      }

      if (value && validation?.maxLength && value.length > validation.maxLength) {
        errors[question.id] = t('validation.maxLength', { max: validation.maxLength });
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prev) => prev + 1);
    }
  };

  // Handle previous step
  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateStep()) return;

    try {
      setSubmitting(true);
      setError(null);

      // Format answers for API
      const formattedAnswers = Object.entries(answers)
        .filter(([, value]) => value !== undefined && value !== null && value !== '')
        .map(([questionId, answer]) => ({
          questionId,
          answer,
        }));

      await questionsApi.submitAnswers(formattedAnswers, churchId);

      setSubmitted(true);

      if (onComplete) {
        onComplete();
      }
    } catch (err) {
      setError(err.response?.data?.message || t('submitError'));
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error && categories.length === 0) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  // No questions available
  if (categories.length === 0) {
    return (
      <Alert severity="info" sx={{ my: 2 }}>
        {t('noQuestions')}
      </Alert>
    );
  }

  // Success state
  if (submitted) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          {t('submitSuccess.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('submitSuccess.message')}
        </Typography>
      </Paper>
    );
  }

  const isLastStep = activeStep === categories.length - 1;

  return (
    <Paper sx={{ p: 3 }}>
      {/* Stepper */}
      {showStepper && categories.length > 1 && (
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {categories.map((category) => (
            <Step key={category.category.id || 'uncategorized'}>
              <StepLabel>{category.category.name}</StepLabel>
            </Step>
          ))}
        </Stepper>
      )}

      {/* Category Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          {currentCategory?.category?.name}
        </Typography>
        {currentCategory?.category?.description && (
          <Typography variant="body2" color="text.secondary">
            {currentCategory.category.description}
          </Typography>
        )}
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Questions */}
      <Box>
        {visibleQuestions.map((question) => (
          <DynamicQuestion
            key={question.id}
            question={question}
            value={answers[question.id]}
            onChange={handleAnswerChange}
            error={validationErrors[question.id]}
            disabled={submitting}
          />
        ))}
      </Box>

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          disabled={activeStep === 0 || submitting}
          onClick={handleBack}
          startIcon={<NavigateBeforeIcon />}
        >
          {t('back')}
        </Button>

        {isLastStep ? (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting}
            endIcon={submitting ? <CircularProgress size={20} /> : <SendIcon />}
          >
            {t('submit')}
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleNext}
            endIcon={<NavigateNextIcon />}
          >
            {t('next')}
          </Button>
        )}
      </Box>
    </Paper>
  );
};

QuestionnaireForm.propTypes = {
  churchId: PropTypes.string,
  userType: PropTypes.oneOf(['all', 'new_visitors', 'returning', 'members']),
  onComplete: PropTypes.func,
  showStepper: PropTypes.bool,
};

export default QuestionnaireForm;
