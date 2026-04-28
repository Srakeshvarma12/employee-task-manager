import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// Task API
export const taskAPI = {
  getAllTasks: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.dueDate) params.append('dueDate', filters.dueDate);
    if (filters.assignedTo) params.append('assignedTo', filters.assignedTo);
    return api.get(`/tasks?${params.toString()}`);
  },

  getTaskById: (id) => api.get(`/tasks/${id}`),

  createTask: (data) => api.post('/tasks', data),

  updateTask: (id, data) => api.put(`/tasks/${id}`, data),

  updateTaskStatus: (id, status) => api.patch(`/tasks/${id}/status`, { status }),

  deleteTask: (id) => api.delete(`/tasks/${id}`),

  getTaskSummary: () => api.get('/tasks/summary'),
};

export default api;