const API_BASE = 'http://localhost:8080';

export const apiFetch = async (path, options = {}) => {
  const token = localStorage.getItem('dr_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    localStorage.removeItem('dr_token');
    localStorage.removeItem('dr_user');
    window.location.href = '/login';
    throw new Error('Session expired');
  }

  if (res.status === 204) {
    return null;
  }

  const data = await res.json();

  if (!res.ok) {
    const err = new Error(data.message || 'Something went wrong');
    err.status = res.status;
    throw err;
  }

  return data;
};

// Auth
export const authSignup = (body) =>
  apiFetch('/api/auth/signup', { method: 'POST', body: JSON.stringify(body) });

export const authLogin = (body) =>
  apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify(body) });

export const authLogout = () =>
  apiFetch('/api/auth/logout', { method: 'POST', body: JSON.stringify({}) });

export const authForgotPassword = (email) =>
  apiFetch('/api/auth/forget-password', { method: 'POST', body: JSON.stringify({ email }) });

export const authResetPassword = (uuid, token, newPassword) =>
  apiFetch('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ uuid, token, newPassword }),
  });

// User routes
export const getExams = () => apiFetch('/api/users/exams');

export const getTests = () => apiFetch('/api/users/tests');

export const getQuestion = (qsId) => apiFetch(`/api/users/questions/${qsId}`);

// Test session routes
export const startTest = (testId) =>
  apiFetch('/api/users/tests/start', {
    method: 'POST',
    body: JSON.stringify({ testId }),
  });

export const endTest = (sessionId) =>
  apiFetch('/api/users/tests/end', {
    method: 'POST',
    body: JSON.stringify({ sessionId }),
  });

export const updateTestProgress = (sessionId, updatedArr) =>
  apiFetch('/api/users/tests/update', {
    method: 'POST',
    body: JSON.stringify({ sessionId, updatedArr }),
  });

// Admin - Exams
export const getAdminExams = () => apiFetch('/api/admin/exams');
export const createExam = (body) => apiFetch('/api/admin/exams', { method: 'POST', body: JSON.stringify(body) });
export const updateExam = (uuid, body) => apiFetch(`/api/admin/exams/${uuid}`, { method: 'PUT', body: JSON.stringify(body) });
export const deleteExam = (uuid) => apiFetch(`/api/admin/exams/${uuid}`, { method: 'DELETE' });

// Admin - Tests
export const getAdminTests = () => apiFetch('/api/admin/tests');
export const createTest = (body) => apiFetch('/api/admin/tests', { method: 'POST', body: JSON.stringify(body) });
export const updateTest = (uuid, body) => apiFetch(`/api/admin/tests/${uuid}`, { method: 'PUT', body: JSON.stringify(body) });
export const deleteTest = (uuid) => apiFetch(`/api/admin/tests/${uuid}`, { method: 'DELETE' });

// Admin - Questions
export const getAdminQuestions = () => apiFetch('/api/admin/questions');
export const createQuestion = (body) => apiFetch('/api/admin/questions', { method: 'POST', body: JSON.stringify(body) });
export const updateQuestion = (uuid, body) => apiFetch(`/api/admin/questions/${uuid}`, { method: 'PUT', body: JSON.stringify(body) });
export const deleteQuestion = (uuid) => apiFetch(`/api/admin/questions/${uuid}`, { method: 'DELETE' });

// Admin - Users
export const getUsers = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiFetch(`/api/admin/users${query ? `?${query}` : ''}`);
};
export const updateUserRole = (uuid, role) => apiFetch(`/api/admin/users/${uuid}/role`, { method: 'PUT', body: JSON.stringify({ role }) });
export const updateUserActiveStatus = (uuid, isActive) => apiFetch(`/api/admin/users/${uuid}/active`, { method: 'PATCH', body: JSON.stringify({ isActive }) });
export const deleteUser = (uuid) => apiFetch(`/api/admin/users/${uuid}`, { method: 'DELETE' });

// Admin - Analytics
export const getPlatformAnalytics = () => apiFetch('/api/admin/analytics/platform');
