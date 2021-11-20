import axios, { AxiosError, AxiosResponse } from 'axios';
import { ETokenKey } from '../../constants';

const baseURL = process.env.REACT_APP_BASE_API;
const token = localStorage.getItem(ETokenKey.ACCESS_TOKEN);

const axiosCore = axios.create({
  baseURL: baseURL + 'api/',
  headers: {
    'content-type': 'application/json',
    'x-hdh-classroom-client-access-token': token ?? '',
  },
});

axiosCore.interceptors.response.use(
  (res: AxiosResponse) => {
    return res;
  },
  async (err: AxiosError) => {
    throw err;
  },
);
export default axiosCore;
