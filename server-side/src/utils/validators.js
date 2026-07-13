/**
 * Input validation helpers for server-side enforcement.
 */

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validateDescription = (text) => {
  if (!text || typeof text !== 'string') return false;
  const trimmed = text.trim();
  return trimmed.length >= 20 && trimmed.length <= 2000;
};

export const validatePassword = (password) => {
  // Minimum 6 characters
  return typeof password === 'string' && password.length >= 6;
};

/**
 * Valid ticket status transitions.
 * Key = current status, Value = array of allowed next statuses.
 */
export const VALID_TRANSITIONS = {
  open: ['in_progress', 'escalated'],
  in_progress: ['resolved', 'escalated'],
  resolved: ['closed', 'reopened'],
  reopened: ['in_progress', 'escalated'],
  escalated: ['in_progress'],
  closed: [] // terminal state
};

export const isValidTransition = (currentStatus, newStatus) => {
  const allowed = VALID_TRANSITIONS[currentStatus];
  if (!allowed) return false;
  return allowed.includes(newStatus);
};
