import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SyncManager from '../services/sync';

const API_BASE_URL = 'https://your-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  async (error) => {
    if (!error.response && error.message === 'Network Error') {
      // Offline: queue request
      const { config } = error;
      const operation = {
        method: config.method,
        url: config.url,
        data: config.data,
        headers: config.headers,
      };
      await SyncManager.queueOperation('api_request', 'create', operation);
    }
    return Promise.reject(error);
  }
);

export default api;
