// Central API Client for MessMate Frontend
// In production, dynamically reads VITE_API_URL if configured.
// In development (or when unset), safely defaults to '/api' (proxied by Vite).
const rawApiUrl = import.meta.env.VITE_API_URL;
let BASE_URL = '/api';
if (rawApiUrl && typeof rawApiUrl === 'string') {
  const trimmed = rawApiUrl.trim().replace(/\/+$/, '');
  BASE_URL = trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
}

export const getAuthToken = () => {
  return localStorage.getItem('messmate_token');
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('messmate_token', token);
  } else {
    localStorage.removeItem('messmate_token');
  }
};

const request = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  try {
    const res = await fetch(`${BASE_URL}${cleanEndpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        status: res.status,
        message: data.message || `Request failed with status ${res.status}`,
        data,
      };
    }

    return {
      success: true,
      status: res.status,
      ...data,
    };
  } catch (err) {
    console.error(`API Error on [${options.method || 'GET'}] ${endpoint}:`, err);
    return {
      success: false,
      message: 'Network error or backend server unreachable. Please verify server connectivity.',
      error: err.message,
    };
  }
};

export const api = {
  get: (endpoint, query = {}) => {
    const qStr = new URLSearchParams(query).toString();
    const url = qStr ? `${endpoint}?${qStr}` : endpoint;
    return request(url, { method: 'GET' });
  },
  post: (endpoint, body = {}) => {
    return request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },
  put: (endpoint, body = {}) => {
    return request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },
  delete: (endpoint) => {
    return request(endpoint, { method: 'DELETE' });
  },
};

export default api;
