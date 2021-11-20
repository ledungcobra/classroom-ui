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
  fullName: string;
  phone: string;
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
      return "Retype password doesn't match!";
    }
    if (!isValidPhone(data.phone)) {
      return "Phone number isn't valid!";
    }

    return '';
  };

  const onSubmit = (data: FormValues) => {
    setIsSingupLoading(true);
    var err = getErrValidInput(data);

    if (err !== '') {
      setIsSingupLoading(false);
      setError('*' + err);
    } else {
      dispatch(
        doSignup({
          fullName: data.email,
          email: data.email,
          password: data.password,
          phone: data.phone,
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
          setError('*Sorry something went wrong. Please try again!');
        });
    }
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
              <h2>Sign Up to your account</h2>
            </div>
            <p className="right-side__form__error">{error ?? error}</p>
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
                {...register('fullName')}
                required
                className="right-side__form__signup-info__text-field"
                id="outlined-basic"
                label="Full name"
                variant="outlined"
              />
            </div>
            <div className="right-side__form__signup-info">
              <TextField
                {...register('phone')}
                required
                className="right-side__form__signup-info__text-field"
                id="outlined-basic"
                label="Phone number"
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
                label="Password"
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
                label="Reptype Password"
                variant="outlined"
              />
            </div>
            <LoadingButton
              type="submit"
              loading={isSingupLoading}
              className="right-side__form__signup-btn"
              variant="contained"
            >
              Register
            </LoadingButton>
            <p className="right-side__form__question">
              Do you have an account? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
