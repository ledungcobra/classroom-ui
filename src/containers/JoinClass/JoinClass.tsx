import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContextApi, useAppSelector } from '../../redux';
import { apiClass } from '../../services/apis/apiClass';
import { parseParams } from '../../utils';

interface Props {}

export const JoinClass = (props: Props) => {
  let query = parseParams(useLocation().search);
  let myEmail = useAppSelector((state) => state.authReducer.email);
  let currentUser = useAppSelector((state) => state.authReducer.currentUser);
  const navigate = useNavigate();
  const Context = useAppContextApi();

  React.useEffect(() => {
    if (currentUser === '' || !currentUser) {
      currentUser = localStorage.getItem('classroom@current_user') ?? '';
    }
    if (myEmail === '' || !myEmail) {
      myEmail = localStorage.getItem('classroom@current_email') ?? '';
    }
    Context?.showLoading();
    let { classToken, role, email: hashedEmail } = query;

    if (!hashedEmail) {
      role = 2;
    }

    
    apiClass
      .postAddMember({
        currentUser,
        invitee: hashedEmail ? currentUser : '',
        role: +role,
        token: classToken,
      })
      .then(() => {
        Context?.openSnackBar('Gia nhập lớp thành công');
        navigate('/');
      })
      .catch((e) => {
        Context?.openSnackBarError('Gia nhập lớp thất bại');
        console.log(e);
      })
      .finally(() => {
        Context?.hideLoading();
      });
  }, [currentUser]);
  return <div></div>;
};
