import axios from 'axios';
import { API_BASE_URL, HEADERS } from './config';

console.log(API_BASE_URL)
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: HEADERS,
});

export default apiClient;
