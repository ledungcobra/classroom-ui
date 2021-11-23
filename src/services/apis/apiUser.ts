import axiosMain from '../axios/axiosMain';

//const basicUrl = 'classes/';
const basicUrlWithoutSlash = 'users';

interface IParamUpdateAvatar {
  imageBase64: string;
}
export const apiUser = {
  postUpdatePassword: async (body: IParamChangePassword) => {
    return (await axiosMain.post(basicUrlWithoutSlash + '/profile', body)).data;
  },
  postUpdateProfile: async (body: IParamUpdateAvatar) => {
    return (await axiosMain.post(basicUrlWithoutSlash + '/password', body)).data;
  },
};
