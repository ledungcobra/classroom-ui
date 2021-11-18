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
