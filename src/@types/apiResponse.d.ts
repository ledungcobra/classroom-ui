interface IResLogin {
  _id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  token: string;
  timeExpired: string;
  refreshToken: string;
  refreshTokenTimeExpired: string;
}

interface IResGetListClasses {
  id: string;
  name: string;
  title: string;
  description: string;
  classBackground: any;
  section: string;
  room: string;
  owner: string;
  iconColor: string;
  createUsername: string;
}

interface IResClassDetailData {
  className: string;
  classCode: string;
  classDeadline: IResClassDeadline[];
  classStatus: IResClassStatus[];
  infor: IResClassInfo;
}

interface IResClassInfo {
  id: number;
  classCode: string;
  theme: string;
  // room: string;
  className: string;
}
interface IResClassDeadline {
  id: number;
  name: string;
  day: string;
  hour: string;
}

interface IResClassStatus {
  authorName: string;
  time: string;
  status: string;
  comments: IResClassStatusComment[];
}

interface IResClassStatusComment {
  author: string;
  content: string;
  time: string;
}

type Role = 'ROLE_STUDENT' | 'ROLE_TEACHER';
interface IUser {
  id: number;
  username: string;
  firstName: string;
  middleName: number;
  email: Role;
  profileImageUrl: string | undefined | null;
}

type TStatus = 'INVITED' | 'JOINED';

interface IResMember extends IUser {
  status?: 'INVITED';
}
interface IResMembers {
  students: IResMember[];
  teachers: IResMember[];
  owner: string;
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

interface IErrorResponse {
  status: number;
  result: number;
  message: string;
  content: string;
}

interface IClassDetailRes {
  data?: IResClassDetailData;
  error?: IErrorResponse;
}

interface IUserInfoData {
  id: number;
  username: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: number;
  email: string;
  profileImageUrl: string | null | undefined;
  personalEmail: string;
  studentID: string | null | undefined;
  phoneNumber: string;
  personalPhoneNumber: string;
  userStatus: number;
}
interface IUserInfo {
  status: number;
  result: number;
  message: string;
  content: IUserInfoData | any;
}

interface IResClassAssignment {
  id: number;
  courseId: number;
  name: string;
  description: string;
  maxGrade: number;
  order: number;
}
