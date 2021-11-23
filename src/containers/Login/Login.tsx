import { useForm } from 'react-hook-form';
import { doLogin } from '../../redux/asyncThunk/authAction';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch } from '../../redux';
import { setToken, setRefreshToken, setCurrentUser } from '../../utils/common';
import { setMainToken } from '../../redux/slices/appSlices/authSlice';
import { TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import FaviIcon from '../../assets/icons/favicon.ico';
import GIcon from '../../assets/icons/login/g-logo.png';

import './Login.scss';
import { useState } from 'react';
import { Link } from 'react-router-dom';

type FormValues = {
  username: string;
  password: string;
};

export const Login = () => {
  const { register, handleSubmit } = useForm();

  const [isLoging, setIsLoging] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useAppDispatch();

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
        // let refreshToken = res.content.refreshToken;
        setToken(token);
        setRefreshToken(token);
        setCurrentUser(currentUser);
        dispatch(setMainToken(token));
        window.location.replace('/');
      })
      .catch((err) => {
        setIsLoging(false);
        setError('*Email or password is not valid!');
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
              <h2>Log In to your account</h2>
            </div>
            <p className="right-side__form__error">{error ?? +error}</p>
            <div className="right-side__form__login-info">
              <TextField
                {...register('username')}
                required
                className="right-side__form__login-info__text-field"
                id="outlined-basic"
                type="text"
                label="Username"
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
                label="Password"
                variant="outlined"
              />
            </div>
            <LoadingButton
              type="submit"
              loading={isLoging}
              className="right-side__form__login-btn"
              variant="contained"
            >
              Login
            </LoadingButton>
            <p className="right-side__form__btn-separate">OR</p>
            <LoadingButton
              variant="outlined"
              className="right-side__form__login-btn"
              startIcon={<img alt="g-icon" src={GIcon} width="25" height="25" />}
            >
              Continue with Google
            </LoadingButton>
            <p className="right-side__form__question">
              Do not have an account? <Link to="/signup">Signup</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
