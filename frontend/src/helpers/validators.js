/**
 * Email validation
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Phone validation
 */
export const isValidPhone = (phone) => {
  const regex = /^\+?[\d\s-()]{10,}$/;
  return regex.test(phone);
};

/**
 * Required field validation
 */
export const isRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

/**
 * Min length validation
 */
export const minLength = (value, min) => {
  if (!value) return false;
  return value.length >= min;
};

/**
 * Max length validation
 */
export const maxLength = (value, max) => {
  if (!value) return true;
  return value.length <= max;
};

/**
 * URL validation
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate form fields
 */
export const validateForm = (values, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const fieldRules = rules[field];
    const value = values[field];

    if (fieldRules.required && !isRequired(value)) {
      errors[field] = fieldRules.requiredMessage || 'This field is required';
      return;
    }

    if (fieldRules.email && value && !isValidEmail(value)) {
      errors[field] = fieldRules.emailMessage || 'Invalid email address';
      return;
    }

    if (fieldRules.phone && value && !isValidPhone(value)) {
      errors[field] = fieldRules.phoneMessage || 'Invalid phone number';
      return;
    }

    if (fieldRules.minLength && value && !minLength(value, fieldRules.minLength)) {
      errors[field] = fieldRules.minLengthMessage || `Must be at least ${fieldRules.minLength} characters`;
      return;
    }

    if (fieldRules.maxLength && value && !maxLength(value, fieldRules.maxLength)) {
      errors[field] = fieldRules.maxLengthMessage || `Must be less than ${fieldRules.maxLength} characters`;
      return;
    }

    if (fieldRules.custom && !fieldRules.custom(value, values)) {
      errors[field] = fieldRules.customMessage || 'Invalid value';
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
