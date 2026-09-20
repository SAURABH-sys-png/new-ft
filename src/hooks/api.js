const rawBase = import.meta.env?.VITE_API_BASE_URL ?? 'http://localhost:8080';
const API_BASE = rawBase ? rawBase.replace(/\/api\/?$/, '').replace(/\/+$/, '') : '';

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

// Calculate exact age in years & decimal months against target cut-off date (e.g. 2026-07-01)
export function calculateExactAge(dobString, targetDateStr = '2026-07-01') {
  const dob = new Date(dobString);
  const targetDate = new Date(targetDateStr);
  if (isNaN(dob.getTime())) return 0;

  let years = targetDate.getFullYear() - dob.getFullYear();
  let months = targetDate.getMonth() - dob.getMonth();
  let days = targetDate.getDate() - dob.getDate();

  if (days < 0) {
    months -= 1;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return parseFloat((years + months / 12).toFixed(2));
}

export const SCHEMES_CATALOG = [
  { id: 'nda-army', name: 'NDA Army Wing', group: 'NDA', type: '10+2', minAge: 15.5, maxAge: 18.5, requirements: ['12th pass (any stream)', 'Unmarried'] },
  { id: 'nda-navy-af', name: 'NDA Navy & Air Force', group: 'NDA', type: '10+2', minAge: 15.5, maxAge: 19.5, requirements: ['12th pass with Physics & Maths (PCM)', 'Unmarried'] },
  { id: 'tes-army', name: 'TES Army (10+2 Technical Entry)', group: 'Technical', type: '10+2', minAge: 16.5, maxAge: 19.5, requirements: ['10+2 PCM min 60%', 'JEE Main Rank Mandate', 'Male Only'] },
  { id: 'btech-navy', name: '10+2 B.Tech Cadet Entry Scheme (Navy)', group: 'Technical', type: '10+2', minAge: 16.5, maxAge: 19.5, requirements: ['10+2 PCM min 70%', 'JEE Main Rank Mandate', 'Male Only'] },
  { id: 'cds-ima', name: 'CDS IMA (Indian Military Academy)', group: 'CDS', type: 'Graduate', minAge: 19, maxAge: 24, requirements: ['Degree from recognized university', 'Male Only'] },
  { id: 'cds-ina', name: 'CDS INA (Naval Academy)', group: 'CDS', type: 'Graduate', minAge: 19, maxAge: 24, requirements: ['Engineering degree (B.Tech/B.E.)', 'Male Only'] },
  { id: 'cds-afa', name: 'CDS AFA (Air Force Academy)', group: 'CDS', type: 'Graduate', minAge: 20, maxAge: 24, requirements: ['Degree with Physics & Maths at 10+2 OR B.Tech'] },
  { id: 'cds-ota', name: 'CDS OTA (Officer Training Academy)', group: 'CDS', type: 'Graduate', minAge: 19, maxAge: 25, requirements: ['Graduate from recognized university', 'Male & Female'] },
  { id: 'afcat-flying', name: 'AFCAT Flying Branch', group: 'AFCAT', type: 'Graduate', minAge: 20, maxAge: 24, requirements: ['Graduate min 60% with PCM in 10+2 OR B.Tech min 60%'] },
  { id: 'afcat-tech', name: 'AFCAT Ground Duty (Technical)', group: 'AFCAT', type: 'Graduate', minAge: 20, maxAge: 26, requirements: ['Four year degree in Engineering/Technology'] },
  { id: 'afcat-nontech', name: 'AFCAT Ground Duty (Non-Technical)', group: 'AFCAT', type: 'Graduate', minAge: 20, maxAge: 26, requirements: ['Graduate min 60% in any discipline'] },
  { id: 'tgc-army', name: 'TGC (Technical Graduate Course - Army)', group: 'Technical', type: 'Graduate', minAge: 20, maxAge: 27, requirements: ['Engineering Degree (B.Tech/B.E.)', 'Male Only'] },
  { id: 'ssc-tech', name: 'SSC Tech (Army)', group: 'Technical', type: 'Graduate', minAge: 20, maxAge: 27, requirements: ['Engineering Degree in notified streams'] },
  { id: 'ncc-special', name: 'NCC Special Entry Scheme', group: 'Special Entry', type: 'Graduate', minAge: 19, maxAge: 25, requirements: ['Graduate min 50%', 'NCC C Certificate with A/B grade'] },
  { id: 'jag-entry', name: 'JAG (Judge Advocate General)', group: 'Special Entry', type: 'Graduate', minAge: 21, maxAge: 27, requirements: ['LLB Degree min 55%', 'CLAT PG Score'] },
];

export function checkEligibilityClient(input) {
  const age = calculateExactAge(input.dob);

  const results = SCHEMES_CATALOG.map((scheme) => {
    let eligible = true;
    const reasons = [];

    if (age < scheme.minAge) {
      eligible = false;
      reasons.push(`Minimum age is ${scheme.minAge} years (your calculated age: ${age}).`);
    } else if (age > scheme.maxAge) {
      eligible = false;
      reasons.push(`Upper age limit is ${scheme.maxAge} years (your calculated age: ${age}).`);
    }

    if (['nda-army', 'nda-navy-af', 'tes-army', 'btech-navy', 'cds-ima', 'cds-ina', 'tgc-army'].includes(scheme.id) && input.gender === 'Female') {
      eligible = false;
      reasons.push('This entry is reserved for male candidates in current notifications.');
    }

    if (['nda-navy-af', 'tes-army', 'btech-navy', 'afcat-flying'].includes(scheme.id) && input.stream !== 'PCM') {
      eligible = false;
      reasons.push('Requires Physics & Mathematics (PCM) at 10+2 level.');
    }

    if (['tes-army', 'btech-navy'].includes(scheme.id) && !input.hasJEE) {
      eligible = false;
      reasons.push('Mandatory JEE Main rank required for shortlisting.');
    }

    if (scheme.type === 'Graduate') {
      if (input.degreeStatus === 'None') {
        eligible = false;
        reasons.push('Requires graduation or final year student status.');
      }

      if (['cds-ina', 'afcat-tech', 'tgc-army', 'ssc-tech'].includes(scheme.id) && input.degreeType !== 'B.Tech/B.E.') {
        eligible = false;
        reasons.push('Requires an eligible Engineering degree (B.Tech / B.E.).');
      }

      if (scheme.id === 'jag-entry' && input.degreeType !== 'LLB') {
        eligible = false;
        reasons.push('Requires an LLB degree (min 55% aggregate).');
      }

      if (scheme.id === 'ncc-special' && !input.hasNCC) {
        eligible = false;
        reasons.push("Requires an NCC 'C' Certificate with minimum 'B' Grade.");
      }
    }

    const remainingAttempts = Math.max(0, Math.ceil((scheme.maxAge - age) * 2));

    return {
      ...scheme,
      calculatedAge: age,
      eligible: eligible && remainingAttempts > 0,
      attemptsRemaining: eligible ? remainingAttempts : 0,
      reason: reasons.length > 0 ? reasons.join(' ') : 'Meets all age, academic, and entry criteria!',
    };
  });

  return {
    calculatedAge: age,
    dob: input.dob,
    results,
  };
}

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

// Test session routes (routes2.md spec)
export const createTestSession = (testId) =>
  apiFetch('/api/users/test-sessions', {
    method: 'POST',
    body: JSON.stringify({ testId }),
  });

export const getTestSession = (sessionId) =>
  apiFetch(`/api/users/test-sessions/${sessionId}`);

export const saveAnswer = (sessionId, { questionId, selectedOption, timeSpentSeconds }) =>
  apiFetch(`/api/users/test-sessions/${sessionId}/answers`, {
    method: 'PATCH',
    body: JSON.stringify({ questionId, selectedOption, timeSpentSeconds }),
  });

export const submitTestSession = (sessionId, lastAnswer = null) =>
  apiFetch(`/api/users/test-sessions/${sessionId}/submit`, {
    method: 'POST',
    body: JSON.stringify(lastAnswer || {}),
  });

export const getTestResult = (sessionId) =>
  apiFetch(`/api/users/test-sessions/${sessionId}/result`);

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
export const publishTest = (uuid) => apiFetch(`/api/admin/tests/${uuid}/publish`, { method: 'PATCH' });
export const unpublishTest = (uuid) => apiFetch(`/api/admin/tests/${uuid}/unpublish`, { method: 'PATCH' });

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
export const getUser = (uuid) => apiFetch(`/api/admin/users/${uuid}`);
export const updateUserRole = (uuid, role) => apiFetch(`/api/admin/users/${uuid}/role`, { method: 'PUT', body: JSON.stringify({ role }) });
export const updateUserActiveStatus = (uuid, isActive) => apiFetch(`/api/admin/users/${uuid}/active`, { method: 'PATCH', body: JSON.stringify({ isActive }) });
export const deleteUser = (uuid) => apiFetch(`/api/admin/users/${uuid}`, { method: 'DELETE' });
export const updateUserVerification = (uuid, data) => apiFetch(`/api/admin/users/${uuid}/verification`, { method: 'PATCH', body: JSON.stringify(data) });
export const grantTestSeriesAccess = (uuid, data) => apiFetch(`/api/admin/users/${uuid}/test-series-access`, { method: 'POST', body: JSON.stringify(data) });
export const revokeTestSeriesAccess = (uuid, testSeriesUuid) => apiFetch(`/api/admin/users/${uuid}/test-series-access/${testSeriesUuid}/revoke`, { method: 'PATCH' });

// User Analytics
export const getMyAnalytics = () => apiFetch('/api/users/analytics');

// Admin - Analytics
export const getPlatformAnalytics = () => apiFetch('/api/admin/analytics/platform');
export const getUserAnalytics = (uuid) => apiFetch(`/api/admin/analytics/user/${uuid}`);
