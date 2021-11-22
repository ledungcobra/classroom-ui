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

export const isValidPhone = (phone: string | undefined) => {
  if (!phone) return false;
  if (phone.length < 10) return false;
  return /(([03+[2-9]|05+[6|8|9]|07+[0|6|7|8|9]|08+[1-9]|09+[1-4|6-9]]){3})+[0-9]{7}\b/g.test(
    phone,
  );
};

export const generateReferenceLink = (classCode: string) =>
  `https://google.com.vn/enterclass?code=${classCode}`;

export const isValidEmail = (email: string | undefined): boolean => {
  if (!email) return false;

  return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
    email,
  );
};

export function getCamelCaseArray(camel: string | undefined) {
  if (!camel) return '';
  var reg = /([a-z0-9])([A-Z])/g;
  const result = camel.replace(reg, '$1 $2');
  return result.charAt(0).toUpperCase() + result.slice(1);
}

export const readImageBlob = (file: Blob): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
