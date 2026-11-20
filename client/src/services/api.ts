import axios from 'axios';
import {
  Lead,
  LeadStats,
  LeadQueryParams,
  PaginationMeta,
  User,
  AuthResponse,
} from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('leadflow_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercept 401 Unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('leadflow_token');
      localStorage.removeItem('leadflow_user');
      // If unauthorized and not on auth endpoints, reload or dispatch
      if (!window.location.pathname.includes('/login')) {
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await api.post('/auth/login', { email, password });
    return res.data.data;
  },
  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const res = await api.post('/auth/register', { name, email, password });
    return res.data.data;
  },
  getMe: async (): Promise<User> => {
    const res = await api.get('/auth/me');
    return res.data.data;
  },
};

export const leadApi = {
  getLeads: async (params?: LeadQueryParams): Promise<{ leads: Lead[]; pagination: PaginationMeta }> => {
    const res = await api.get('/leads', { params });
    return res.data.data;
  },
  getStats: async (): Promise<LeadStats> => {
    const res = await api.get('/leads/stats');
    return res.data.data;
  },
  getLead: async (id: string): Promise<Lead> => {
    const res = await api.get(`/leads/${id}`);
    return res.data.data;
  },
  createLead: async (data: Partial<Lead>): Promise<Lead> => {
    const res = await api.post('/leads', data);
    return res.data.data;
  },
  updateLead: async (id: string, data: Partial<Lead>): Promise<Lead> => {
    const res = await api.put(`/leads/${id}`, data);
    return res.data.data;
  },
  deleteLead: async (id: string): Promise<{ id: string }> => {
    const res = await api.delete(`/leads/${id}`);
    return res.data.data;
  },
};

export default api;
