import axios, { AxiosError, AxiosResponse } from 'axios';
import { ETokenKey } from '../../constants';
import { logout, clearAllToken } from '../../utils';

import { apiAuth } from '../apis/apiAuth';

const baseURL = process.env.BASE_API;

const token = localStorage.getItem(ETokenKey.ACCESS_TOKEN);

const axiosMain = axios.create({
  baseURL: baseURL + 'api/',
  headers: {
    'content-type': 'application/json',
    'x-hdh-classroom-client-access-token': token ?? '',
  },
});

axiosMain.interceptors.response.use(
  (res: AxiosResponse) => {
    return res;
  },
  async (err: AxiosError) => {
    if (err.response?.status === 401) {
      await apiAuth
        .refreshToken({
          refreshToken: localStorage.getItem(ETokenKey.REFRESH_TOKEN),
        } as IParamRefreshToken)
        .then((res: AxiosResponse<{ content: IResLogin }>) => {
          let result = res.data.content;

          localStorage.setItem(ETokenKey.ACCESS_TOKEN, result.token);
          //localStorage.setItem(ETokenKey.REFRESH_TOKEN, result.refreshToken);

          window.location.reload();
        })
        .catch((err: AxiosError) => {
          clearAllToken();
          logout();
        });
    } else {
      throw err;
    }
  },
);
export default axiosMain;
