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
  personalPhoneNumber?: string;
  studentID?: string;
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
  classCode: string;
  role: number;
}

interface IParamInviteMemberClass {
  mailPersonReceive: string;
  courseId: number;
  classCode: string;
  role: number;
}

interface IParamAddStudent {
  token: string;
  role: number;
  currentUser: string;
  invitee: string;
}

interface IParamGetClassAssignment {
  courseId: number;
  currentUser: string;
  SortColumn: '+Order' | '-Order';
}

interface IParamAddClassAssignment {
  courseId: number;
  name: string;
  description: string;
  maxGrade: number;
  currentUser: string;
}

interface IParamUpdateClassAssignment {
  courseId: number;
  assignmentsId: number;
  name: string;
  description: string;
  maxGrade: number;
  currentUser: string;
}

interface IParamDeleteClassAssignment {
  courseId: number;
  assignmentsId: number;
  currentUser: string;
}
