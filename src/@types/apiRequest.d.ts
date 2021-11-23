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
