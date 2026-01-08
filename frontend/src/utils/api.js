const API_BASE = '/api';

async function fetchAPI(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || 'An error occurred');
  }
  
  return response.json();
}

// Auth
export const login = (email, password) =>
  fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const getMe = () => fetchAPI('/auth/me');

// Users
export const getUsers = () => fetchAPI('/users');
export const getUser = (id) => fetchAPI(`/users/${id}`);
export const createUser = (data) =>
  fetchAPI('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  });
export const updateUser = (id, data) =>
  fetchAPI(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
export const deleteUser = (id) =>
  fetchAPI(`/users/${id}`, {
    method: 'DELETE',
  });

// Sites
export const getSites = () => fetchAPI('/sites');
export const getSite = (id) => fetchAPI(`/sites/${id}`);
export const createSite = (data) =>
  fetchAPI('/sites', {
    method: 'POST',
    body: JSON.stringify(data),
  });
export const updateSite = (id, data) =>
  fetchAPI(`/sites/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
export const deleteSite = (id) =>
  fetchAPI(`/sites/${id}`, {
    method: 'DELETE',
  });

// Assets
export const getAssets = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return fetchAPI(`/assets${query ? `?${query}` : ''}`);
};
export const getAsset = (id) => fetchAPI(`/assets/${id}`);
export const getAssetByTag = (tagId) => fetchAPI(`/assets/tag/${tagId}`);
export const createAsset = (data) =>
  fetchAPI('/assets', {
    method: 'POST',
    body: JSON.stringify(data),
  });
export const updateAsset = (id, data) =>
  fetchAPI(`/assets/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
export const deleteAsset = (id) =>
  fetchAPI(`/assets/${id}`, {
    method: 'DELETE',
  });
export const getAssetHistory = (id) => fetchAPI(`/assets/${id}/history`);

// Custody
export const checkoutAsset = (data) =>
  fetchAPI('/custody/checkout', {
    method: 'POST',
    body: JSON.stringify(data),
  });
export const returnAsset = (data) =>
  fetchAPI('/custody/return', {
    method: 'POST',
    body: JSON.stringify(data),
  });
export const transferAsset = (data) =>
  fetchAPI('/custody/transfer', {
    method: 'POST',
    body: JSON.stringify(data),
  });
export const inventoryClose = (data) =>
  fetchAPI('/custody/inventory-close', {
    method: 'POST',
    body: JSON.stringify(data),
  });

// Approvals
export const getApprovals = (status) => {
  const query = status ? `?status_filter=${status}` : '';
  return fetchAPI(`/approvals${query}`);
};
export const getApproval = (id) => fetchAPI(`/approvals/${id}`);
export const processApproval = (id, data) =>
  fetchAPI(`/approvals/${id}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
export const approveRequest = (id, note) =>
  fetchAPI(`/approvals/${id}/approve`, {
    method: 'POST',
    body: JSON.stringify({ note }),
  });
export const rejectRequest = (id, note) =>
  fetchAPI(`/approvals/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify({ note }),
  });

// Audit
export const getAuditEvents = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return fetchAPI(`/audit/events${query ? `?${query}` : ''}`);
};
export const verifyAuditChain = () => fetchAPI('/audit/verify-chain');

// Dashboard
export const getDashboard = () => fetchAPI('/dashboard');
export const getDashboardStats = () => fetchAPI('/dashboard/stats');
