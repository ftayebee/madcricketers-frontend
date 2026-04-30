import axios from 'axios';
import { API_BASE_URL, HEADERS } from './config';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: HEADERS,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('player_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
