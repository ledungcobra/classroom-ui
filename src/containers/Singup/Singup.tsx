import { useForm } from 'react-hook-form';
import { doSignup } from '../../redux/asyncThunk/authAction';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch } from '../../redux';
import { setToken, setRefreshToken, isValidPhone } from '../../utils/common';
import { setMainToken } from '../../redux/slices/appSlices/authSlice';
import { TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import FaviIcon from '../../assets/icons/favicon.ico';

import './Singup.scss';
import { useState } from 'react';
import { Link } from 'react-router-dom';

type FormValues = {
  username: string;
  firstName: string;
  middleName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  repeatPassword: string;
};

export const Singup = () => {
  const { register, handleSubmit } = useForm();

  const [isSingupLoading, setIsSingupLoading] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useAppDispatch();

  const getErrValidInput = (data: FormValues) => {
    if (data.password !== data.repeatPassword) {
      return 'Nhập lại mật khẩu không khớp!';
    }
    // if (!isValidPhone(data.phoneNumber)) {
    //   return "Phone number isn't valid!";
    // }

    return '';
  };

  const onSubmit = (data: FormValues) => {
    console.log(data);

    setIsSingupLoading(true);
    var err = getErrValidInput(data);

    if (err !== '') {
      setIsSingupLoading(false);
      setError('*' + err);
    } else {
      dispatch(
        doSignup({
          username: data.username,
          firstName: data.firstName,
          middleName: data.middleName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          phoneNumber: data.phoneNumber,
        } as IParamSignup),
      )
        .then(unwrapResult)
        .then((res: { content: IResLogin }) => {
          setIsSingupLoading(false);
          let token = res.content.token;
          let refreshToken = res.content.refreshToken;
          setToken(token);
          setRefreshToken(refreshToken);
          dispatch(setMainToken(token));
          window.location.replace('/');
        })
        .catch((err) => {
          setIsSingupLoading(false);
          setError('*Đã có lỗi xảy ra, vui lòng thử lại!');
        });
    }
  };

  return (
    <div className="signup-container">
      <div className="left-side">
        <div className="left-side__intro">
          <h1>HDH - Classroom</h1>
          <h2>Join to learning</h2>
        </div>
      </div>
      <div className="right-side">
        <div className="right-side__brand">
          <img src={FaviIcon} alt="icon" />
          <span>HDH - Classroom</span>
        </div>
        <div className="right-side__form">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="right-side__form__title">
              <h2>Đăng ký tài khoản</h2>
            </div>
            <p className="right-side__form__error">{error ?? error}</p>
            <div className="right-side__form__signup-info">
              <TextField
                {...register('username')}
                required
                className="right-side__form__signup-info__text-field"
                id="outlined-basic"
                label="Tên đăng nhập"
                type="text"
                variant="outlined"
              />
            </div>
            <div className="right-side__form__signup-info">
              <TextField
                {...register('email')}
                required
                className="right-side__form__signup-info__text-field"
                id="outlined-basic"
                label="Email"
                type="email"
                variant="outlined"
              />
            </div>
            <div className="right-side__form__signup-info">
              <TextField
                {...register('firstName')}
                required
                className="right-side__form__signup-info__text-field"
                id="outlined-basic"
                label="Họ"
                variant="outlined"
              />
            </div>
            <div className="right-side__form__signup-info">
              <TextField
                {...register('middleName')}
                required
                className="right-side__form__signup-info__text-field"
                id="outlined-basic"
                label="Tên lót"
                variant="outlined"
              />
            </div>
            <div className="right-side__form__signup-info">
              <TextField
                {...register('lastName')}
                required
                className="right-side__form__signup-info__text-field"
                id="outlined-basic"
                label="Tên"
                variant="outlined"
              />
            </div>
            <div className="right-side__form__signup-info">
              <TextField
                {...register('phoneNumber')}
                required
                className="right-side__form__signup-info__text-field"
                id="outlined-basic"
                label="Số điện thoại"
                variant="outlined"
              />
            </div>
            <div className="right-side__form__signup-info">
              <TextField
                {...register('password')}
                required
                className="right-side__form__signup-info__text-field"
                type="password"
                id="outlined-basic"
                label="Mật khẩu"
                variant="outlined"
              />
            </div>
            <div className="right-side__form__signup-info">
              <TextField
                {...register('repeatPassword')}
                required
                className="right-side__form__signup-info__text-field"
                type="password"
                id="outlined-basic"
                label="Nhập lại mật khẩu"
                variant="outlined"
              />
            </div>
            <LoadingButton
              type="submit"
              loading={isSingupLoading}
              className="right-side__form__signup-btn"
              variant="contained"
            >
              Đăng ký
            </LoadingButton>
            <p className="right-side__form__question">
              Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
