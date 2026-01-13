import PropTypes from 'prop-types';
import {
  TextField,
  FormControl,
  FormLabel,
  FormHelperText,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  Select,
  MenuItem,
  InputLabel,
  Box,
} from '@mui/material';

const DynamicQuestion = ({
  question,
  value,
  onChange,
  error,
  disabled = false,
}) => {
  const handleChange = (newValue) => {
    onChange(question.id, newValue);
  };

  const renderQuestion = () => {
    switch (question.questionType) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <TextField
            fullWidth
            type={question.questionType === 'email' ? 'email' : 'text'}
            label={question.questionText}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={question.placeholder}
            helperText={error || question.helpText}
            error={!!error}
            required={question.validation?.isRequired}
            disabled={disabled}
            inputProps={{
              minLength: question.validation?.minLength,
              maxLength: question.validation?.maxLength,
            }}
          />
        );

      case 'textarea':
        return (
          <TextField
            fullWidth
            multiline
            rows={4}
            label={question.questionText}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={question.placeholder}
            helperText={error || question.helpText}
            error={!!error}
            required={question.validation?.isRequired}
            disabled={disabled}
            inputProps={{
              minLength: question.validation?.minLength,
              maxLength: question.validation?.maxLength,
            }}
          />
        );

      case 'number':
        return (
          <TextField
            fullWidth
            type="number"
            label={question.questionText}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value ? Number(e.target.value) : '')}
            placeholder={question.placeholder}
            helperText={error || question.helpText}
            error={!!error}
            required={question.validation?.isRequired}
            disabled={disabled}
            inputProps={{
              min: question.validation?.min,
              max: question.validation?.max,
            }}
          />
        );

      case 'date':
        return (
          <TextField
            fullWidth
            type="date"
            label={question.questionText}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            helperText={error || question.helpText}
            error={!!error}
            required={question.validation?.isRequired}
            disabled={disabled}
            InputLabelProps={{ shrink: true }}
          />
        );

      case 'select':
        return (
          <FormControl fullWidth error={!!error} required={question.validation?.isRequired}>
            <InputLabel>{question.questionText}</InputLabel>
            <Select
              value={value || ''}
              onChange={(e) => handleChange(e.target.value)}
              label={question.questionText}
              disabled={disabled}
            >
              {question.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {(error || question.helpText) && (
              <FormHelperText>{error || question.helpText}</FormHelperText>
            )}
          </FormControl>
        );

      case 'radio':
        return (
          <FormControl component="fieldset" error={!!error} required={question.validation?.isRequired}>
            <FormLabel component="legend">{question.questionText}</FormLabel>
            <RadioGroup
              value={value || ''}
              onChange={(e) => handleChange(e.target.value)}
            >
              {question.options?.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio disabled={disabled} />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
            {(error || question.helpText) && (
              <FormHelperText>{error || question.helpText}</FormHelperText>
            )}
          </FormControl>
        );

      case 'checkbox':
      case 'multiselect':
        const selectedValues = Array.isArray(value) ? value : [];

        const handleMultiChange = (optionValue, checked) => {
          const newValues = checked
            ? [...selectedValues, optionValue]
            : selectedValues.filter((v) => v !== optionValue);
          handleChange(newValues);
        };

        return (
          <FormControl component="fieldset" error={!!error} required={question.validation?.isRequired}>
            <FormLabel component="legend">{question.questionText}</FormLabel>
            <FormGroup>
              {question.options?.map((option) => (
                <FormControlLabel
                  key={option.value}
                  control={
                    <Checkbox
                      checked={selectedValues.includes(option.value)}
                      onChange={(e) => handleMultiChange(option.value, e.target.checked)}
                      disabled={disabled}
                    />
                  }
                  label={option.label}
                />
              ))}
            </FormGroup>
            {(error || question.helpText) && (
              <FormHelperText>{error || question.helpText}</FormHelperText>
            )}
          </FormControl>
        );

      default:
        return (
          <TextField
            fullWidth
            label={question.questionText}
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={question.placeholder}
            helperText={error || question.helpText}
            error={!!error}
            disabled={disabled}
          />
        );
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      {renderQuestion()}
    </Box>
  );
};

DynamicQuestion.propTypes = {
  question: PropTypes.shape({
    id: PropTypes.string.isRequired,
    questionText: PropTypes.string.isRequired,
    questionType: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    helpText: PropTypes.string,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
      })
    ),
    validation: PropTypes.shape({
      isRequired: PropTypes.bool,
      minLength: PropTypes.number,
      maxLength: PropTypes.number,
      min: PropTypes.number,
      max: PropTypes.number,
    }),
    conditionalDisplay: PropTypes.shape({
      dependsOn: PropTypes.string,
      showWhenValue: PropTypes.any,
    }),
  }).isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  disabled: PropTypes.bool,
};

export default DynamicQuestion;
