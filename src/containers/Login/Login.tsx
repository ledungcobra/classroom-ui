import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { doLogin } from '../../redux/asyncThunk/loginAction';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch } from '../../redux';
import { setToken, setRefreshToken } from '../../utils/common';
import { setMainToken } from '../../redux/slices/appSlices/authSlice';
import { useNavigate } from 'react-router-dom';

import './Login.scss';

type FormValues = {
  email: string;
  password: string;
};

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onSubmit = (data: FormValues) => {
    dispatch(
      doLogin({
        email: data.email,
        password: data.password,
      } as IParamLogin),
    )
      .then(unwrapResult)
      .then((res: { content: IResLogin }) => {
        let token = res.content.token;
        let refreshToken = res.content.refreshToken;
        setToken(token);
        setRefreshToken(refreshToken);
        dispatch(setMainToken(token));
        window.location.replace('/');
      });
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="login-container__email">
          <input
            placeholder="Enter email"
            type="email"
            defaultValue="panhhuu@gmail.com"
            {...register('email')}
          />
        </div>
        <div className="login-container__email">
          <input
            placeholder="Enter password"
            type="password"
            defaultValue="123456789"
            {...register('password')}
          />
        </div>
        <div className="login-container__submit-btn">
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
};
