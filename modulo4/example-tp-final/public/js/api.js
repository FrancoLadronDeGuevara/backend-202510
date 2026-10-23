// ─────────────────────────────────────────────────────────────
// api.js — Capa de comunicación con el backend
// ─────────────────────────────────────────────────────────────

const BASE_URL = '/api';

// Obtener token del localStorage
const getToken = () => localStorage.getItem('shop_token');

// Headers con autorización
const authHeaders = () => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

// Función genérica de fetch con manejo de errores
const request = async (url, options = {}) => {
  try {
    const res = await fetch(BASE_URL + url, {
      headers: authHeaders(),
      ...options,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
    return data;
  } catch (err) {
    throw err;
  }
};

// ── Auth ──────────────────────────────────────────────────────
const Auth = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/auth/me'),
};

// ── Products ──────────────────────────────────────────────────
const Products = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/products${qs ? '?' + qs : ''}`);
  },
  getById: (id) => request(`/products/${id}`),
  create: (body) => request('/products', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => request(`/products/${id}`, { method: 'DELETE' }),
};

// ── Categories ────────────────────────────────────────────────
const Categories = {
  getAll: () => request('/categories'),
  getById: (id) => request(`/categories/${id}`),
  create: (body) => request('/categories', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => request(`/categories/${id}`, { method: 'DELETE' }),
};

// ── Orders ────────────────────────────────────────────────────
const Orders = {
  create: (body) => request('/orders', { method: 'POST', body: JSON.stringify(body) }),
  getMyOrders: () => request('/orders/my-orders'),
  getById: (id) => request(`/orders/${id}`),
  cancel: (id) => request(`/orders/${id}`, { method: 'DELETE' }),
};
