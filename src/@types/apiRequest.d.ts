interface IParamLogin {
  email: string;
  password: string;
}

interface IParamSignup {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

interface IParamRefreshToken {
  refreshToken: string;
}

interface IParamGetListClasses {
  status: string;
}
