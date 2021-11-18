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

export const isExistToken = (token: string) => {
  if (
    !token ||
    token === '' ||
    token === null ||
    token === 'null' ||
    token === undefined ||
    token === 'undefined'
  ) {
    return false;
  }
  return true;
};

export const objToQuery = (obj: any): string => {
  if (!obj) return '';

  var query = [];

  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      query.push(encodeURIComponent(prop) + '=' + encodeURIComponent(obj[prop]));
    }
  }

  return '?' + query.join('&');
};
