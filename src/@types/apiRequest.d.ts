interface IParamLogin {
  username: string;
  password: string;
}

interface IParamSignup {
  username: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

interface IParamRefreshToken {
  refreshToken: string;
}

interface IParamGetListClasses {
  title: string;
  currentUser: string;
  startAt: number;
  maxResults: number;
  sortColumn: string;
}
interface IParamCreateClasses {
  className: string;
  section: string;
  room: string;
  title: string;
  subject: string;
  room: string;
  currentUser: string;
}

interface IUserProfileInfo {
  phoneNumber: string;
  firstName: string;
  middleName: string;
  lastName: string;
  personalEmail: string;
  studentId?: string;
  personalPhoneNumber?: string;
}

interface IParamChangePassword {
  oldPassword?: string;
  newPassword?: string;
  rePassword?: string;
}

interface IParamGetClassDetail {
  classId: number;
  currentUser: string;
}

interface IParamGetMemberClass {
  classId: number;
}

interface IParamInviteMemberClassClient {
  personReceives: string[];
  courseId: number;
}

interface IParamInviteMemberClass {
  personReceive: string;
  courseId: number;
}

interface IParamAddStudent {
  courseId: number;
  currentUser: string;
}
