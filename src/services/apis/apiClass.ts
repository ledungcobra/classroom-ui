import axiosMain from '../axios/axiosMain';

//const basicUrl = 'classes/';
const basicUrlWithoutSlash = 'course';

export const apiClass = {
  getClassDetail: (params: IParamGetClassDetail) => {
    const url = basicUrlWithoutSlash + '/' + params.classId;
    return axiosMain.get(url);
  },
  getClassMember: (params: IParamGetMemberClass) => {
    const url = basicUrlWithoutSlash + '/' + params.classId + '/everyone';
    return axiosMain.get(url);
  },

  postInviteMemberToClass: (body: IParamInviteMemberClassClient) => {
    const url = basicUrlWithoutSlash + '/' + 'send-mail';
    return Promise.all(
      body.personReceives.map((email) =>
        axiosMain.post(url, {
          courseId: body.courseId,
          personReceive: email,
        } as IParamInviteMemberClass),
      ),
    );
  },

  postAddStudent: (body: IParamAddStudent) => {
    const url = basicUrlWithoutSlash + '/add-student';
    return axiosMain.post(url, body);
  },
};
