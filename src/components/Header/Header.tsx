import { Add } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Avatar,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreateClass, JoinClass, NavMenu } from '..';
import FaviIcon from '../../assets/icons/favicon.ico';
import { logout } from '../../utils/common';
import './Header.scss';

interface IHeaderProps {}
enum HeaderSelect {
  NewsFeed,
  Members,
  OtherPage,
}

export const Header: React.FC<IHeaderProps> = () => {
  const navAnchor: 'top' | 'left' | 'bottom' | 'right' | undefined = 'left';
  const [createClassDialogStatus, setCreateClassDialogStatus] = useState(false);
  const [joinClassDialogStatus, setJoinClassDialogStatus] = useState(false);
  const [leftNavOpenStatus, setLeftNavOpenStatus] = useState(false);
  const [anchorElAdd, setAnchorElAdd] = useState(null);
  const [anchorElAvt, setAnchorElAvt] = useState(null);
  const location = useLocation();
  const [headerSelect, setHeaderSelect] = useState(HeaderSelect.OtherPage);
  const navigate = useNavigate();

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
  useEffect(() => {
    if (location.pathname.includes('class-detail')) {
      setHeaderSelect(HeaderSelect.NewsFeed);
    } else if (location.pathname.includes('/members')) {
      setHeaderSelect(HeaderSelect.Members);
    } else {
      setHeaderSelect(HeaderSelect.OtherPage);
    }
  }, []);

  useEffect(() => {
    if (headerSelect === HeaderSelect.Members) {
      navigate('/members', {
        replace: true,
        state: headerSelect,
      });
    } else if (headerSelect === HeaderSelect.NewsFeed) {
      navigate('/class-detail', {
        replace: true,
        state: headerSelect,
      });
    }
  }, [headerSelect]);

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
                HDH - Classroom <img src={FaviIcon} alt="icon" width="30" height="30" />
              </Typography>
            </div>
            <div className="header__center-container">
              <div
                className={`header__center-container__item
              ${
                headerSelect === HeaderSelect.NewsFeed
                  ? 'header__center-container__item--selected'
                  : ''
              }`}
                onClick={() => {
                  if (headerSelect !== HeaderSelect.NewsFeed) {
                    setHeaderSelect(HeaderSelect.NewsFeed);
                  }
                }}
              >
                <Typography variant="h6" fontWeight="500">
                  Bảng tin
                </Typography>
              </div>
              <div
                className={`header__center-container__item  ${
                  headerSelect === HeaderSelect.Members
                    ? 'header__center-container__item--selected'
                    : ''
                }`}
                onClick={() => {
                  if (HeaderSelect.Members !== headerSelect) {
                    setHeaderSelect(HeaderSelect.Members);
                  }
                }}
              >
                <Typography variant="h6" fontWeight="500">
                  Mọi người
                </Typography>
              </div>
            </div>
            <div className="header__right-container">
              <Add onClick={handleOpenAddMenu} className="header__icon" />
              <Menu
                id="add-menu"
                anchorEl={anchorElAdd}
                keepMounted
                open={Boolean(anchorElAdd)}
                onClose={handleCloseAddMenu}
              >
                <MenuItem onClick={handleOpenJoinClassDialog}>Join Class</MenuItem>
                <MenuItem onClick={handleOpenCreateClassDialog}>Create Class</MenuItem>
              </Menu>
              <div>
                <Avatar onClick={handleOpenProfileMenu} className="header__icon" />
                <Menu
                  id="avt-menu"
                  anchorEl={anchorElAvt}
                  keepMounted
                  open={Boolean(anchorElAvt)}
                  onClose={handleCloseProfileMenu}
                >
                  <MenuItem onClick={handleLogout}>Log out</MenuItem>
                </Menu>
              </div>
            </div>
          </Toolbar>
        </AppBar>
        <Divider />
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
