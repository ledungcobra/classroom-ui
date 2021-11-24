import axiosMain from '../axios/axiosMain';

//const basicUrl = 'classes/';
const basicUrlWithoutSlash = 'course';

export const apiClass = {
  getClassDetail: async (params: IParamGetClassDetail) => {
    const url = basicUrlWithoutSlash + '/' + params.classId + `?currentUser=${params.currentUser}`;
    return (await axiosMain.get(url)).data;
  },
  getClassMember: async (params: IParamGetMemberClass) => {
    const url = basicUrlWithoutSlash + '/' + params.classId + '/everyone';
    return (await axiosMain.get(url)).data;
  },

  postInviteMemberToClass: async (body: IParamInviteMemberClassClient) => {
    const url = basicUrlWithoutSlash + '/' + 'send-mail';
    return Promise.all(
      body.personReceives.map((email) =>
        axiosMain.post(url, {
          courseId: body.courseId,
          mailPersonReceive: email,
          classCode: body.classCode,
          role: body.role,
        } as IParamInviteMemberClass),
      ),
    );
  },

  postAddMember: async (body: IParamAddStudent) => {
    const url = basicUrlWithoutSlash + '/add-student/invite-link';
    return (await axiosMain.post(url, body)).data;
  },
};
