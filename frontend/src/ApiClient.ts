import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async config => {
    if (localStorage.getItem('user-info')) {
      config.headers.Authorization = `Bearer ${localStorage.getItem(
        'user-token'
      )}`;
    }
    return config;
  },
  error => {
    Promise.reject(error);
  }
);

export default apiClient;
