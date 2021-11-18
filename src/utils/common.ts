import { ETokenKey } from '../constants';

export const AUTHENTICATION_HEADER_NAME = '';

export const logout = () => {
  window.location.replace('/login');
  localStorage.removeItem(ETokenKey.ACCESS_TOKEN);
};

export const clearAllToken = () => {
  localStorage.removeItem(ETokenKey.ACCESS_TOKEN);
  localStorage.removeItem(ETokenKey.REFRESH_TOKEN);
};

export const setToken = (value: string) => {
  localStorage.setItem(ETokenKey.ACCESS_TOKEN, value);
};

export const setRefreshToken = (value: string) => {
  localStorage.setItem(ETokenKey.REFRESH_TOKEN, value);
};
