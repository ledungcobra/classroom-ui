import { Add } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Avatar,
  Divider,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreateClass, JoinClass, NavMenu } from '..';
import FaviIcon from '../../assets/icons/favicon.ico';
import { useAppContextApi, useAppDispatch, useAppSelector } from '../../redux';
import { setHeaderSelect } from '../../redux/slices/classContextSlides/classContextSlides';
import { logout } from '../../utils/common';
import { UserNotification } from '../Notification/UserNotification';
import './Header.scss';

interface IHeaderProps {}
export enum HeaderSelect {
  NewsFeed,
  Members,
  Exercise,
  Grades,
  GradeReview,
  OtherPage,
}

export const Header: React.FC<IHeaderProps> = () => {
  const navAnchor: 'top' | 'left' | 'bottom' | 'right' | undefined = 'left';
  const [createClassDialogStatus, setCreateClassDialogStatus] = useState(false);
  const [joinClassDialogStatus, setJoinClassDialogStatus] = useState(false);
  const [leftNavOpenStatus, setLeftNavOpenStatus] = useState(false);
  const [anchorElAdd, setAnchorElAdd] = useState(null);
  const [anchorElAvt, setAnchorElAvt] = useState(null);
  const currentClassId = useAppSelector((state) => state.classReducer.currentClassId);
  const isTeacher = useAppSelector((state) => state.classReducer.isTeacher);
  const headerSelect = useAppSelector((state) => state.classReducer.headerSelect);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const Context = useAppContextApi();
  const avatarRand = useAppSelector((state) => state.utilsReducer.randomUserAvt);

  const toggleNav = (open: boolean) => (event: any) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setLeftNavOpenStatus(open);
  };

  const handleLogout = () => {
    logout();
  };

  //Add menu handle
  const handleOpenAddMenu = (event: any) => setAnchorElAdd(event.currentTarget);
  const handleCloseAddMenu = () => setAnchorElAdd(null);

  //Avatar handle
  const handleOpenProfileMenu = (event: any) => setAnchorElAvt(event.currentTarget);
  const handleCloseProfileMenu = () => setAnchorElAvt(null);

  //Create class dialog handle
  const handleOpenCreateClassDialog = () => {
    setCreateClassDialogStatus(true);
  };

  const hadleCloseCreateClassDialog = () => {
    setCreateClassDialogStatus(false);
  };

  //Join class dialog handle
  const handleOpenJoinClassDialog = () => {
    setJoinClassDialogStatus(true);
  };
  const handleCloseJoinClassDialog = () => {
    setJoinClassDialogStatus(false);
  };

  const showEditProfile = () => {
    navigate('/edit-profile');
  };

  const createHeaderItem = (selection: HeaderSelect, navigateLink: string, headerName: string) => {
    return (
      <div
        className={`header__center-container__item ${
          headerSelect === selection ? 'header__center-container__item--selected' : ''
        }`}
        onClick={() => {
          dispatch(setHeaderSelect(selection));
          navigate(navigateLink, {
            replace: true,
            state: selection,
          });
        }}
      >
        <Typography variant="h6" fontWeight="500">
          {headerName}
        </Typography>
      </div>
    );
  };

  return (
    <div>
      <div className="header">
        <AppBar className="header__app-bar" position="static">
          <Toolbar className="header__tool-bar">
            <div className="header__left-container">
              <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleNav(true)}>
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" className="header__title">
                <Link to="/">
                  HDH - Classroom <img src={FaviIcon} alt="icon" width="30" height="30" />
                </Link>
              </Typography>
            </div>
            {currentClassId && (
              <div className="header__center-container">
                {createHeaderItem(
                  HeaderSelect.NewsFeed,
                  '/class-detail/' + currentClassId,
                  'Bảng tin',
                )}

                {createHeaderItem(HeaderSelect.Members, '/members/' + currentClassId, 'Mọi người')}
                {isTeacher &&
                  createHeaderItem(
                    HeaderSelect.Exercise,
                    '/class-detail/' + currentClassId + '/exercise-manager',
                    ' Bài tập',
                  )}
                {isTeacher &&
                  createHeaderItem(
                    HeaderSelect.Grades,
                    '/class-detail/' + currentClassId + '/grades',
                    'Điểm',
                  )}

                {!isTeacher &&
                  createHeaderItem(
                    HeaderSelect.GradeReview,
                    '/class-detail/' + currentClassId + '/grade-review',
                    'Xem điểm',
                  )}
              </div>
            )}
            <div className="header__right-container">
              <Add onClick={handleOpenAddMenu} className="header__icon" />
              <Menu
                id="add-menu"
                anchorEl={anchorElAdd}
                keepMounted
                open={Boolean(anchorElAdd)}
                onClose={handleCloseAddMenu}
              >
                <MenuItem onClick={handleOpenJoinClassDialog}>Tham gia lớp học</MenuItem>
                <MenuItem onClick={handleOpenCreateClassDialog}>Tạo mới lớp học</MenuItem>
              </Menu>

              <UserNotification />
              <div>
                <Avatar src={avatarRand} onClick={handleOpenProfileMenu} className="header__icon" />
                <Menu
                  id="avt-menu"
                  anchorEl={anchorElAvt}
                  keepMounted
                  open={Boolean(anchorElAvt)}
                  onClose={handleCloseProfileMenu}
                >
                  <MenuItem onClick={showEditProfile}>Cập nhật thông tin</MenuItem>
                  <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
                </Menu>
              </div>
            </div>
          </Toolbar>
        </AppBar>
        <Divider sx={{ marginBottom: '10px' }} />
        {Context?.loading && <LinearProgress color="success" />}
        <CreateClass
          openStatus={createClassDialogStatus}
          handleCloseDialog={hadleCloseCreateClassDialog}
        />
        <JoinClass
          openStatus={joinClassDialogStatus}
          handleCloseDialog={handleCloseJoinClassDialog}
        />
      </div>
      <NavMenu anchor={navAnchor} open={leftNavOpenStatus} toggle={toggleNav} />
    </div>
  );
};
