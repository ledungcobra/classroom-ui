interface IResLogin {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  token: string;
  timeExpired: string;
  refreshToken: string;
  refreshTokenTimeExpired: string;
}

interface IResGetListClasses {
  _id: string;
  name: string;
  section: string;
  room: string;
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
  room: string;
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
  displayName: string;
  avatar?: string;
  id: number;
  role?: Role;
}

type TStatus = 'INVITED' | 'JOINED';

interface IResMember extends IUser {
  status?: TStatus;
}
interface IResMembers {
  students: IResMember[];
  teachers: IResMember[];
}
