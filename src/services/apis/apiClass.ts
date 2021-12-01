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
    const url = basicUrlWithoutSlash + '/add-member/invite-link';
    return (await axiosMain.post(url, body)).data;
  },

  postDeleteMember: async (body: { courseId: number; userId: number; currentUser: string }) => {
    return (await axiosMain.post(basicUrlWithoutSlash + '/remove-member', body)).data;
  },

  getClassAssignments: async (params: IParamGetClassAssignment) => {
    const url =
      basicUrlWithoutSlash +
      '/' +
      params.courseId +
      `/assignments?CurrentUser=${params.currentUser}&SortColumn=${params.SortColumn}`;
    return (await axiosMain.get(url)).data;
  },

  postAddClassAssignment: async (body: IParamAddClassAssignment) => {
    const url = basicUrlWithoutSlash + '/' + body.courseId + '/assignments';
    return (await axiosMain.post(url, body)).data;
  },

  putUpdateClassAssignment: async (body: IParamUpdateClassAssignment) => {
    const url = basicUrlWithoutSlash + '/' + body.courseId + '/assignments/' + body.assignmentsId;
    return (await axiosMain.put(url, body)).data;
  },

  deleteClassAssignment: async (body: IParamDeleteClassAssignment) => {
    const url =
      basicUrlWithoutSlash +
      '/' +
      body.courseId +
      '/assignments/' +
      body.assignmentsId +
      `?CurrentUser=${body.currentUser}`;
    return (await axiosMain.delete(url)).data;
  },

  postSortClassAssignment: async (body: any) => {
    const url = basicUrlWithoutSlash + '/' + body.courseId + '/assignments-sort';
    return (await axiosMain.post(url, body)).data;
  },
};
