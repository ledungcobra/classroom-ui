import { AppBar, Avatar, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import { Add, Apps } from '@mui/icons-material';
import React from 'react';
import { Divider, IconButton } from '@mui/material';
import { useStyles } from './styles';
import { useState } from 'react';
import { logout } from '../../utils/common';
import MenuIcon from '@mui/icons-material/Menu';
import { NavMenu } from '..';
import FaviIcon from '../../assets/icons/favicon.ico';

interface IHeader {}

export const Header: React.FC<IHeader> = () => {
  const classes = useStyles();

  const navAnchor: 'top' | 'left' | 'bottom' | 'right' | undefined = 'left';

  const [leftNavOpenStatus, setLeftNavOpenStatus] = useState(false);

  const toggleNav = (open: boolean) => (event: any) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setLeftNavOpenStatus(open);
  };

  const [anchorElAdd, setAnchorElAdd] = useState(null);
  const [anchorElAvt, setAnchorElAvt] = useState(null);

  const handleClickAdd = (event: any) => setAnchorElAdd(event.currentTarget);
  const handleCloseAdd = () => setAnchorElAdd(null);

  const handleClickAvt = (event: any) => setAnchorElAvt(event.currentTarget);
  const handleCloseAvt = () => setAnchorElAvt(null);

  const handleCreate = () => {};

  const handleJoin = () => {};

  const handleLogout = () => {
    logout();
  };

  return (
    <div>
      <div className={classes.root}>
        <AppBar className={classes.appBar} position="static">
          <Toolbar className={classes.toolbar}>
            <div className={classes.headerWrapper}>
              <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleNav(true)}>
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                HDH - Classroom <img src={FaviIcon} alt="icon" width="30" height="30" />
              </Typography>
            </div>

            <div className={classes.header__wrapper__right}>
              <Add onClick={handleClickAdd} className={classes.icon} />
              {/* <Apps className={classes.icon} /> */}
              <Menu
                id="add-menu"
                anchorEl={anchorElAdd}
                keepMounted
                open={Boolean(anchorElAdd)}
                onClose={handleCloseAdd}
              >
                <MenuItem onClick={handleJoin}>Join Class</MenuItem>
                <MenuItem onClick={handleCreate}>Create Class</MenuItem>
              </Menu>
              <div>
                <Avatar onClick={handleClickAvt} className={classes.icon} />
                <Menu
                  id="avt-menu"
                  anchorEl={anchorElAvt}
                  keepMounted
                  open={Boolean(anchorElAvt)}
                  onClose={handleCloseAvt}
                >
                  <MenuItem onClick={handleLogout}>Log out</MenuItem>
                </Menu>
              </div>
            </div>
          </Toolbar>
        </AppBar>
        <Divider />
      </div>
      <NavMenu anchor={navAnchor} open={leftNavOpenStatus} toggle={toggleNav} />
    </div>
  );
};

export default Header;
