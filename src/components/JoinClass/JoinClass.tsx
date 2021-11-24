import React, { ReactElement, useState } from 'react';
import { Avatar, Button, Dialog, Slide, TextField } from '@mui/material';
import { Close } from '@mui/icons-material';
import './JoinClass.scss';
import { TransitionProps } from '@mui/material/transitions';
import { useAppSelector } from '../../redux';
import { clearAllToken, logout } from '../../utils';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface IJoinClassProps {
  openStatus: boolean;
  handleCloseDialog: any;
}

export const JoinClass: React.FC<IJoinClassProps> = ({ openStatus, handleCloseDialog }) => {
  const [classCode, setClassCode] = useState('');
  const [email, setemail] = useState('');
  const [error, setError] = useState();
  const currentUser = useAppSelector((state) => state.authReducer.currentUser);
  const currentEmail = useAppSelector((state) => state.authReducer.email);
  const currentFullName = useAppSelector((state) => state.authReducer.fullName);

  const handleLogout = () => {
    clearAllToken();
    logout();
  };

  const handleSubmit = (e: any) => {};
  return (
    <div>
      <Dialog
        fullScreen
        open={openStatus}
        onClose={handleCloseDialog}
        TransitionComponent={Transition}
      >
        <div className="join-class-dialog">
          <div className="join-class-dialog__container">
            <div className="join-class-dialog__container__top-head">
              <Close
                className="join-class-dialog__container__top-head__close-icon"
                onClick={handleCloseDialog}
              />
              <div className="join-class-dialog__container__top-head__title">Tham gia lớp học</div>
            </div>
            <Button
              className="join-class-dialog__btn"
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Join
            </Button>
          </div>
          <div className="join-class-dialog__form">
            <p className="join-class-dialog__form-text">
              Bạn đang đăng nhập với tên @{currentUser}
            </p>
            <div className="join-class-dialog__login-info">
              <div className="join-class-dialog__class-left">
                <Avatar />
                <div className="join-class-dialog__login-text">
                  <div className="join-class-dialog__login-name">{currentFullName}</div>
                  <div className="join-class-dialog__login-email">{currentEmail}</div>
                </div>
              </div>
              <Button variant="outlined" color="primary" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
          <div className="join-class-dialog__form">
            <div
              style={{ fontSize: '1.25rem', color: '#3c4043' }}
              className="join-class-dialog__form-text"
            >
              Tham gia
            </div>
            <div
              style={{ color: '#3c4043', marginTop: '-5px' }}
              className="join-class-dialog__form-text"
            >
              Nhập link vào lớp học dưới đây.
            </div>
            <div className="join-class-dialog__login-info">
              <TextField
                id="outlined-basic"
                label="Link"
                variant="outlined"
                value={classCode}
                onChange={(e) => setClassCode(e.target.value)}
                error={error}
                helperText={error && 'No class was found'}
              />
              {/* <TextField
                id="outlined-basic"
                label="Owner's email"
                variant="outlined"
                value={email}
                onChange={(e) => setemail(e.target.value)}
              /> */}
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
