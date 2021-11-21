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
  classCode: string;
  theme: string;
  room: string;
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

interface IStudent {
  id: number;
  displayName: string;
  avatar?: string;
}
