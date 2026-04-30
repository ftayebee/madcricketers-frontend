import apiClient from './client';
import endpoints from './endpoints';

const TOKEN_KEY = 'player_auth_token';
const PROFILE_KEY = 'player_profile';

export const getPlayerToken = () => localStorage.getItem(TOKEN_KEY);
export const isPlayerAuthenticated = () => Boolean(getPlayerToken());

export const getStoredPlayerProfile = () => {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null');
  } catch {
    return null;
  }
};

export const storePlayerSession = ({ token, data }) => {
  localStorage.setItem(TOKEN_KEY, token);
  if (data) localStorage.setItem(PROFILE_KEY, JSON.stringify(data));
};

export const clearPlayerSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(PROFILE_KEY);
};

export const playerLogin = async (login, password) => {
  const response = await apiClient.post(endpoints.playerAuth.login, {
    login,
    password,
    device_name: 'madcricketers-web',
  });
  storePlayerSession(response.data);
  return response.data;
};

export const playerLogout = async () => {
  try {
    await apiClient.post(endpoints.playerAuth.logout);
  } finally {
    clearPlayerSession();
  }
};

export const fetchPlayerProfile = async () => {
  const response = await apiClient.get(endpoints.playerAuth.profile);
  if (response.data?.data) localStorage.setItem(PROFILE_KEY, JSON.stringify(response.data.data));
  return response.data;
};

export const updatePlayerProfile = async (payload) => {
  const response = await apiClient.post(endpoints.playerAuth.profile, payload, {
    headers: payload instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
  });
  if (response.data?.data) localStorage.setItem(PROFILE_KEY, JSON.stringify(response.data.data));
  return response.data;
};

export const fetchPlayerStatsSummary = async () => (await apiClient.get(endpoints.playerAuth.summary)).data;
export const fetchPlayerMatchStats = async () => (await apiClient.get(endpoints.playerAuth.matches)).data;
export const fetchPlayerTournamentStats = async () => (await apiClient.get(endpoints.playerAuth.tournaments)).data;
