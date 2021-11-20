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

export interface ClassDetailData {
  className: string;
  classCode: string;
  classDeadLine: ClassDeadLine[];
  classStatus: ClassStatus[];
  infor: ClassInfo;
}

export interface ClassInfo {
  classCode: string;
  theme: string;
  room: string;
}
export interface ClassDeadLine {
  id: number;
  name: string;
  day: string;
  hour: string;
}

export interface ClassStatus {
  authorName: string;
  status: string;
  comments: Comment[];
}

export interface Comment {
  author: string;
  content: string;
  time: string;
}
