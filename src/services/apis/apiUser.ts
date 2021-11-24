import axiosMain from '../axios/axiosMain';

//const basicUrl = 'classes/';
const basicUrlWithoutSlash = 'users';

interface IParamUpdateProfile {}
export const apiUser = {
  postUpdatePassword: async (body: IParamChangePassword) => {
    return (await axiosMain.post(basicUrlWithoutSlash + '/profile', body)).data;
  },
  postUpdateProfile: async (
    body: IUserProfileInfo & {
      currentUser: string;
    },
  ) => {
    return (await axiosMain.post(basicUrlWithoutSlash + '/update', body)).data;
  },
  getUserInfo: async (body: { username: string }) => {
    return (await axiosMain.get(basicUrlWithoutSlash + '/profile?username=' + body.username))
      .data as IUserInfo;
  },
  postChangeUserPassword: async (body: {
    currentPassword: string;
    newPassword: string;
    currentUser: string;
  }) => {
    return (await axiosMain.post(basicUrlWithoutSlash + '/change-password', body)).data;
  },
};
