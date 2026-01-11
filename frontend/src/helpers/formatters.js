import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

/**
 * Format date to readable string
 */
export const formatDate = (date, format = 'MMMM D, YYYY') => {
  if (!date) return '';
  return dayjs(date).format(format);
};

/**
 * Format date with time
 */
export const formatDateTime = (date, format = 'MMMM D, YYYY h:mm A') => {
  if (!date) return '';
  return dayjs(date).format(format);
};

/**
 * Format time only
 */
export const formatTime = (date, format = 'h:mm A') => {
  if (!date) return '';
  return dayjs(date).format(format);
};

/**
 * Get relative time (e.g., "2 days ago")
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';
  return dayjs(date).fromNow();
};

/**
 * Format duration in minutes to readable string
 */
export const formatDuration = (minutes) => {
  if (!minutes) return '';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours} hr`;
  return `${hours} hr ${mins} min`;
};

/**
 * Format currency
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Format phone number
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

/**
 * Capitalize first letter
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Format name (First Last)
 */
export const formatName = (firstName, lastName) => {
  return [firstName, lastName].filter(Boolean).join(' ');
};
