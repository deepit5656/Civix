/**
 * Civix API Service
 * Centralized API calls for the frontend
 */

const BASE_URL = process.env.REACT_APP_API_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api');

// Get stored token
const getToken = () => localStorage.getItem('civix_token');

// Base fetch with auth headers
const apiFetch = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.message || `Request failed: ${response.status}`);
  }

  return data;
};

// ─── AUTH ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  sendOTP: (data) => apiFetch('/auth/send-otp', { method: 'POST', body: JSON.stringify(data) }),
  verifyOTP: (data) => apiFetch('/auth/verify-otp', { method: 'POST', body: JSON.stringify(data) }),
  signup: (data) => apiFetch('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => apiFetch('/auth/logout', { method: 'POST' }),
  getMe: () => apiFetch('/auth/me'),
  changePassword: (data) => apiFetch('/auth/change-password', { method: 'PUT', body: JSON.stringify(data) }),
};

// ─── ISSUES ────────────────────────────────────────────────────────────────────
export const issuesAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/issues${query ? `?${query}` : ''}`);
  },
  getById: (id) => apiFetch(`/issues/${id}`),
  getStats: () => apiFetch('/issues/stats'),
  getMyIssues: () => apiFetch('/issues/user/my'),
  create: (formData) => apiFetch('/issues', { method: 'POST', body: formData }),
  update: (id, formData) => apiFetch(`/issues/${id}`, { method: 'PATCH', body: formData }),
  updateStatus: (id, data) => apiFetch(`/issues/${id}/status`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id) => apiFetch(`/issues/${id}`, { method: 'DELETE' }),
};

// ─── PROFILE ───────────────────────────────────────────────────────────────────
export const profileAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/profile${query ? `?${query}` : ''}`);
  },
  getMe: () => apiFetch('/profile/me'),
  updateMe: (data) => apiFetch('/profile/me', { method: 'PUT', body: JSON.stringify(data) }),
  uploadProfilePicture: (formData) => apiFetch('/profile/me/profile-picture', { method: 'POST', body: formData }),
  // Clerk integration
  getByClerkId: (clerkId) => apiFetch(`/profile/clerk/${clerkId}`),
  updateByClerkId: (clerkId, data) => apiFetch(`/profile/clerk/${clerkId}`, { method: 'PUT', body: JSON.stringify(data) }),
  createOrUpdate: (data) => apiFetch('/profile/create-or-update', { method: 'POST', body: JSON.stringify(data) }),
  uploadClerkProfilePicture: (clerkId, formData) => apiFetch(`/profile/clerk/${clerkId}/profile-picture`, { method: 'POST', body: formData }),
};

// ─── POLLS ─────────────────────────────────────────────────────────────────────
export const pollsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/polls${query ? `?${query}` : ''}`);
  },
  getById: (id) => apiFetch(`/polls/${id}`),
  create: (data) => apiFetch('/polls', { method: 'POST', body: JSON.stringify(data) }),
  vote: (id, optionIndex) => apiFetch(`/polls/${id}/vote`, { method: 'POST', body: JSON.stringify({ optionIndex }) }),
  close: (id) => apiFetch(`/polls/${id}/close`, { method: 'PATCH' }),
  delete: (id) => apiFetch(`/polls/${id}`, { method: 'DELETE' }),
};

// ─── FEEDBACK ──────────────────────────────────────────────────────────────────
export const feedbackAPI = {
  submit: (data) => apiFetch('/feedback', { method: 'POST', body: JSON.stringify(data) }),
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/feedback${query ? `?${query}` : ''}`);
  },
  updateStatus: (id, status) => apiFetch(`/feedback/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
};

// ─── CONTRIBUTORS ──────────────────────────────────────────────────────────────
export const contributorsAPI = {
  getAll: () => apiFetch('/contributors'),
};

// ─── AUTH HELPERS ──────────────────────────────────────────────────────────────
export const saveAuthData = (token, user) => {
  localStorage.setItem('civix_token', token);
  localStorage.setItem('civix_user', JSON.stringify(user));
  const isComplete = Boolean(
    user?.isProfileComplete ||
    (user?.name && user?.email && user?.location)
  );
  localStorage.setItem('profileComplete', String(isComplete));
};

export const clearAuthData = () => {
  localStorage.removeItem('civix_token');
  localStorage.removeItem('civix_user');
  localStorage.removeItem('profileComplete');
};

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('civix_user') || 'null');
  } catch {
    return null;
  }
};

export const isAuthenticated = () => !!getToken();
