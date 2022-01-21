// @ts-ignore
import sha256 from 'sha256';
import { ETokenKey } from '../constants';

export const AUTHENTICATION_HEADER_NAME = '';

export const logout = (redirectUrl: string | undefined = undefined) => {
  console.log(redirectUrl);

  localStorage.removeItem(ETokenKey.ACCESS_TOKEN);
  localStorage.removeItem(ETokenKey.CURRENT_USER);
  localStorage.removeItem(ETokenKey.CURRENT_FULLNAME);
  localStorage.removeItem(ETokenKey.CURRENT_EMAIL);
  localStorage.removeItem(ETokenKey.STORE);
  window.location.replace(
    '/login' + (redirectUrl && redirectUrl !== '/' ? '?redirect=' + redirectUrl : ''),
  );
};

export const clearAllToken = () => {
  localStorage.removeItem(ETokenKey.ACCESS_TOKEN);
  localStorage.removeItem(ETokenKey.REFRESH_TOKEN);
  localStorage.removeItem(ETokenKey.CURRENT_USER);
  localStorage.removeItem(ETokenKey.CURRENT_FULLNAME);
  localStorage.removeItem(ETokenKey.CURRENT_EMAIL);
};

export const setToken = (value: string) => {
  localStorage.setItem(ETokenKey.ACCESS_TOKEN, value);
};

export const setRefreshToken = (value: string) => {
  localStorage.setItem(ETokenKey.REFRESH_TOKEN, value);
};

export const setCurrentUser = (value: string) => {
  localStorage.setItem(ETokenKey.CURRENT_USER, value);
};

export const setFullName = (value: string) => {
  localStorage.setItem(ETokenKey.CURRENT_FULLNAME, value);
};

export const setEmail = (value: string) => {
  localStorage.setItem(ETokenKey.CURRENT_EMAIL, value);
};

export const setUserId = (value: number | null) =>
  localStorage.setItem(ETokenKey.USER_ID, value + '');

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
  return /^0[0-9]{9,}$/g.test(phone);
};
const REACT_CLIENT_BASE_URL = process.env.REACT_APP_CLIENT_BASE_URL;
export const generateReferenceLink = (classCode: string, role: number) =>
  `${REACT_CLIENT_BASE_URL}/class-join?classToken=${sha256(classCode || '')}&role=${role}`;

export const isValidEmail = (email: string | undefined): boolean => {
  if (!email) return false;

  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
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

export const getRandomUInt = (max: number) => {
  return Math.floor(Math.random() * max);
};

export const getRandomRGBColorCSSFunction = (maxR: number, maxG: number, maxB: number) => {
  return `rgb(${Math.random() * maxR}, ${Math.random() * maxG}, ${Math.random() * maxB})`;
};

export const convertClassDetailResponse = (data: any): IClassDetailRes => {
  if (data.status === 200) {
    const content = data.content.course;

    return {
      data: {
        classCode: content.classCode ?? 'null',
        classDeadline: [],
        className: content.title,
        classStatus: [],
        infor: {
          classCode: content.classCode ?? '',
          className: content.className ?? '',
          id: content.id,
          theme: content.description,
        },
      },
    };
  } else {
    return { error: data as IErrorResponse };
  }
};

export const parseParams = (params = '') => {
  const rawParams = params.replace('?', '').split('&');
  const extractedParams: any | string[] = {};
  rawParams.forEach((item: any | string[]) => {
    item = item.split('=');
    extractedParams[item[0]] = item[1];
  });
  return extractedParams;
};
