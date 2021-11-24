import axiosMain from '../axios/axiosMain';
import axiosCore from '../axios/axiosCore';

const basicUrl = 'users/';

export const apiAuth = {
  refreshToken: (params: IParamRefreshToken) => {
    const url = basicUrl + 'refreshToken';
    return axiosCore.post(url, params);
  },

  login: (params: IParamLogin) => {
    const url = basicUrl + 'login';
    return axiosMain.post(url, params);
  },

  loginByGoogle: () =>{
    const url = basicUrl + 'login';
    return axiosMain.get(url);
  }, 

  register: (params: IParamSignup) => {
    const url = basicUrl + 'register';
    return axiosMain.post(url, params);
  },
};
