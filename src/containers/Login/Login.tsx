import { useForm } from 'react-hook-form';
import { doLogin } from '../../redux/asyncThunk/authAction';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch } from '../../redux';
import {
  setToken,
  setRefreshToken,
  setCurrentUser,
  setEmail,
  setFullName,
  parseParams,
} from '../../utils/common';
import { setMainToken } from '../../redux/slices/appSlices/authSlice';
import { TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import FaviIcon from '../../assets/icons/favicon.ico';
import GIcon from '../../assets/icons/login/g-logo.png';
import { apiAuth } from './../../services/apis/apiAuth';

import { useLocation } from 'react-router-dom';

import './Login.scss';
import { useEffect, useState } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';

type FormValues = {
  username: string;
  password: string;
};

export const Login = () => {
  const { register, handleSubmit } = useForm();
  let query = parseParams(useLocation().search);

  const [isLoging, setIsLoging] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log(Object.keys(query).length);
    if (Object.keys(query).length > 1) {
      setIsLoging(false);
      let token = query.token;
      let refreshToken = '';
      setToken(token);
      setRefreshToken(refreshToken);
      setCurrentUser(query.username);
      setEmail(query.email);
      setFullName(query.currentFullName);
      dispatch(setMainToken(token));
      window.location.replace('/');
    }
  }, []);

  const onSubmit = (data: FormValues) => {
    setIsLoging(true);
    dispatch(
      doLogin({
        username: data.username,
        password: data.password,
      } as IParamLogin),
    )
      .then(unwrapResult)
      .then((res: { content: IResLogin }) => {
        setIsLoging(false);
        let token = res.content.token;
        let currentUser = res.content.username;
        let currentEmail = res.content.email;
        let currentFullName = res.content.fullName;

        setToken(token);
        setRefreshToken(token);
        setCurrentUser(currentUser);
        setEmail(currentEmail);
        setFullName(currentFullName);
        dispatch(setMainToken(token));

        window.location.replace('/');
      })
      .catch((err) => {
        setIsLoging(false);
        setError('*Tên đăng nhập hoặc mật khẩu không chính xác!');
      });
  };

  return (
    <div className="login-container">
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
              <h2>Đăng nhập</h2>
            </div>
            <p className="right-side__form__error">{error ?? +error}</p>
            <div className="right-side__form__login-info">
              <TextField
                {...register('username')}
                required
                className="right-side__form__login-info__text-field"
                id="outlined-basic"
                type="text"
                label="Tên đăng nhập"
                variant="outlined"
              />
            </div>
            <div className="right-side__form__login-info">
              <TextField
                {...register('password')}
                required
                className="right-side__form__login-info__text-field"
                type="password"
                id="outlined-basic"
                label="Mật khẩu"
                variant="outlined"
              />
            </div>
            <LoadingButton
              type="submit"
              loading={isLoging}
              className="right-side__form__login-btn"
              variant="contained"
            >
              Đăng nhập
            </LoadingButton>
            <p className="right-side__form__btn-separate">HOẶC</p>
            <LoadingButton
              href={`${process.env.REACT_APP_BASE_API}users/login`}
              variant="outlined"
              className="right-side__form__login-btn"
              startIcon={<img alt="g-icon" src={GIcon} width="25" height="25" />}
            >
              Tiếp tục với Google
            </LoadingButton>
            <p className="right-side__form__question">
              Bạn chưa có tài khoản? <Link to="/signup">Đăng ký</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
