import LoadingButton from '@mui/lab/LoadingButton';
import { Alert, Button, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { unwrapResult } from '@reduxjs/toolkit';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation } from 'react-router-dom';
import FaviIcon from '../../assets/icons/favicon.ico';
import GIcon from '../../assets/icons/login/g-logo.png';
import { useAppContextApi, useAppDispatch } from '../../redux';
import { doLogin } from '../../redux/asyncThunk/authAction';
import { setMainToken } from '../../redux/slices/appSlices/authSlice';
import axiosMain from '../../services/axios/axiosMain';
import { isValidEmail } from '../../utils';
import {
  parseParams,
  setCurrentUser,
  setEmail,
  setFullName,
  setRefreshToken,
  setToken
} from '../../utils/common';
import './Login.scss';

type FormValues = {
  username: string;
  password: string;
};

enum DialogState {
  NONE,
  INPUT_EMAIL,
  NOTIFY_SUCCESS,
  NOTIFY_FAIL,
  INPUT_NEW_PASSWORD,
  ERROR,
  EMAIL_CONFIRM,
}

export const Login = () => {
  const { register, handleSubmit } = useForm();
  let query = parseParams(useLocation().search);
  const [isLogging, setIsLogging] = useState(false);
  const [error, setError] = useState('');
  const [resetEmail, setResetEmail] = React.useState('');
  const [newPass, setNewPass] = React.useState('');
  const [reNewPass, setReNewPass] = React.useState('');
  const [restorePasswordToken, setRestorePasswordToken] = React.useState('');
  const Context = useAppContextApi();
  const [dialogState, setDialogState] = React.useState<DialogState>(DialogState.NONE);
  const [dialogMessage, setDialogMessage] = React.useState<string>('');

  const dispatch = useAppDispatch();
  useEffect(() => {
    if (query['reset-password']) {
      const email = query['email'];
      const token = query['token'];
      axiosMain.get(`/Email/reset-password?token=${token}&email=${email}`).then(({ data }) => {
        if (data !== 'Error') {
          setDialogState(DialogState.NOTIFY_SUCCESS);
          setDialogMessage('Mật khẩu mới của bạn là: ' + data);
        } else {
          setDialogState(DialogState.NOTIFY_FAIL);
          setDialogMessage('Có lỗi trong quá trình khôi phục mật khẩu');
        }
      });
      return;
    }

    if (query['error']) {
      setDialogState(DialogState.ERROR);
      return;
    }

    if (query['email-confirm']) {
      setDialogState(DialogState.EMAIL_CONFIRM);
      return;
    }
    if (Object.keys(query).length > 1) {
      setIsLogging(false);
      let token = query.token;
      let refreshToken = '';
      setToken(token);
      setRefreshToken(query.refreshToken);
      setCurrentUser(query.username);
      setEmail(query.email);
      setFullName(query.currentFullName);
      dispatch(setMainToken(token));

      window.location.replace('/');
    }
  }, []);

  const onSubmit = (data: FormValues) => {
    setIsLogging(true);
    dispatch(
      doLogin({
        username: data.username,
        password: data.password,
      } as IParamLogin),
    )
      .then(unwrapResult)
      .then((res: { content: IResLogin }) => {
        setIsLogging(false);
        let token = res.content.token;
        let currentUser = res.content.username;
        let currentEmail = res.content.email;
        let currentFullName = res.content.fullName;

        setToken(token);
        setRefreshToken(res.content.refreshToken);
        setCurrentUser(currentUser);
        setEmail(currentEmail);
        setFullName(currentFullName);
        dispatch(setMainToken(token));

        window.location.replace('/');
      })
      .catch((err) => {
        setIsLogging(false);
        setError('*Tên đăng nhập hoặc mật khẩu không chính xác!');
      });
  };

  const handleRestoreAccountByEmail = (email: string) => {
    if (email) {
      axiosMain
        .post('/users/reset-password', {
          email: email,
        })
        .then(({ data }) => {
          if (data.status === 400) {
            Context?.openSnackBarError('Có lỗi xẩy ra');
          } else {
            setDialogState(DialogState.NOTIFY_SUCCESS);
            setDialogMessage('Bạn vui lòng check mail vừa nhập để khôi phục mật khẩu');
          }
        });
    } else {
      Context?.openSnackBarError('Email điền vào rỗng vui lòng check lại');
    }
  };

  const handleProcessRestorePassword = (token: string) => {
    // if (token !== '') {
    // } else {
    // }
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
              loading={isLogging}
              className="right-side__form__login-btn"
              variant="contained"
            >
              Đăng nhập
            </LoadingButton>
            <p className="right-side__form__btn-separate">HOẶC</p>
            <LoadingButton
              href={`${process.env.REACT_APP_BASE_API}users/login/google`}
              variant="outlined"
              className="right-side__form__login-btn"
              startIcon={<img alt="g-icon" src={GIcon} width="25" height="25" />}
            >
              Tiếp tục với Google
            </LoadingButton>
            <p className="right-side__form__question">
              Bạn chưa có tài khoản? <Link to="/signup">Đăng ký</Link>
              <br />
              Quên mật khẩu ?{' '}
              <span
                onClick={() => {
                  setDialogState(DialogState.INPUT_EMAIL);
                }}
                className="restore-password"
              >
                Khôi phục mật khẩu
              </span>
            </p>
          </form>
        </div>
      </div>

      <Dialog
        fullWidth
        open={dialogState !== DialogState.NONE}
        onClose={() => setDialogState(DialogState.NONE)}
        maxWidth="sm"
      >
        {dialogState === DialogState.INPUT_EMAIL && (
          <>
            <DialogTitle>Khôi phục mật khẩu</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                type="email"
                placeholder="Nhập vào email liên kết tài khoản"
                value={resetEmail}
                error={!isValidEmail(resetEmail)}
                color="success"
                onChange={(e) => setResetEmail(e.target.value)}
                sx={{ marginBottom: '15px' }}
              />
              <Box display="flex" justifyContent="flex-end">
                <Button
                  onClick={() => handleRestoreAccountByEmail(resetEmail)}
                  variant="contained"
                  sx={{ borderRadius: 0 }}
                  color="warning"
                >
                  Khôi phục
                </Button>
              </Box>
            </DialogContent>
          </>
        )}
        {(dialogState === DialogState.NOTIFY_SUCCESS ||
          dialogState === DialogState.NOTIFY_FAIL) && (
          <>
            <DialogTitle>Thông báo</DialogTitle>
            <DialogContent>
              <Alert
                severity={dialogState === DialogState.NOTIFY_SUCCESS ? 'success' : 'error'}
                sx={{ marginBottom: '10px' }}
              >
                {dialogMessage}
              </Alert>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  onClick={() => setDialogState(DialogState.NONE)}
                  variant="contained"
                  sx={{ borderRadius: 0 }}
                  color={dialogState === DialogState.NOTIFY_SUCCESS ? 'success' : 'warning'}
                >
                  Đóng
                </Button>
              </Box>
            </DialogContent>
          </>
        )}
        {dialogState === DialogState.INPUT_NEW_PASSWORD && (
          <>
            <DialogTitle>Nhập mật khẩu mới để khôi phục</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                type="password"
                placeholder="Nhập mật khẩu mới"
                value={newPass}
                color="success"
                onChange={(e) => setNewPass(e.target.value)}
                sx={{ marginBottom: '15px' }}
              />
              <TextField
                fullWidth
                type="password"
                placeholder="Xác nhận mật khẩu"
                value={reNewPass}
                color="success"
                onChange={(e) => setReNewPass(e.target.value)}
                sx={{ marginBottom: '15px' }}
              />
              <Box display="flex" justifyContent="flex-end">
                <Button
                  onClick={() => handleProcessRestorePassword(restorePasswordToken)}
                  variant="contained"
                  sx={{ borderRadius: 0 }}
                  color="success"
                >
                  Khôi phục
                </Button>
              </Box>
            </DialogContent>
          </>
        )}
        {dialogState === DialogState.ERROR && (
          <>
            <DialogTitle>Có lỗi xẩy ra trong quá trình kích hoạt tài khoản</DialogTitle>
            <DialogContent>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  onClick={() => setDialogState(DialogState.NONE)}
                  variant="contained"
                  sx={{ borderRadius: 0 }}
                  color="success"
                >
                  Đóng
                </Button>
              </Box>
            </DialogContent>
          </>
        )}

        {dialogState === DialogState.EMAIL_CONFIRM && (
          <>
            <DialogTitle>Kích hoạt tài khoản thành công</DialogTitle>
            <DialogContent>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  onClick={() => setDialogState(DialogState.NONE)}
                  variant="contained"
                  sx={{ borderRadius: 0 }}
                  color="success"
                >
                  Đóng
                </Button>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </div>
  );
};
