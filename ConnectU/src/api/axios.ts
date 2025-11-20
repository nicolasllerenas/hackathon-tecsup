// Axios configuration - ConnectU
import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS, ERROR_MESSAGES } from '../utils/constants';
import * as SecureStore from 'expo-secure-store';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
          await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA);
          // You can dispatch a logout action here if using Redux/Zustand
          error.message = ERROR_MESSAGES.UNAUTHORIZED;
          break;

        case 400:
          error.message = data.message || data.error || 'Solicitud inválida';
          break;

        case 404:
          error.message = data.message || ERROR_MESSAGES.EMAIL_NOT_FOUND;
          break;

        case 429:
          error.message = 'Demasiados intentos. Por favor espera un momento.';
          break;

        case 500:
        case 502:
        case 503:
          error.message = ERROR_MESSAGES.SERVER_ERROR;
          break;

        default:
          error.message = data.message || data.error || 'Error desconocido';
      }
    } else if (error.request) {
      // Request was made but no response
      error.message = ERROR_MESSAGES.NETWORK_ERROR;
    } else {
      // Something else happened
      error.message = 'Error al procesar la solicitud';
    }

    return Promise.reject(error);
  }
);

export { apiClient };
