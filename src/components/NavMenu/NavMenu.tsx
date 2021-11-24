import CreateIcon from '@mui/icons-material/Create';
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { doGetListClasses, useAppDispatch, useAppSelector } from '../../redux';
import './NavMenu.scss';

interface INavMenuProps {
  anchor: 'top' | 'left' | 'bottom' | 'right' | undefined;
  open: boolean;
  toggle: any;
}

export const NavMenu: React.FC<INavMenuProps> = ({ anchor, open, toggle }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.authReducer.currentUser);

  const classess = useAppSelector((state) => state.classesSlice.classes);
  React.useEffect(() => {
    if (!classess || classess.length === 0) {
      dispatch(
        doGetListClasses({
          currentUser: currentUser,
          title: '',
          sortColumn: '',
          startAt: 0,
          maxResults: 10,
        } as IParamGetListClasses),
      );
    }
  }, []);
  return (
    <div className="nav-menu">
      <Drawer anchor={anchor} open={open} onClose={toggle(false)}>
        <Box
          sx={{
            width: 250,
            height: '100%',
          }}
          display="flex"
          flexDirection="column"
          // justifyContent="center"
          // alignItems="flex-start"
          role="presentation"
          onClick={toggle(false)}
          onKeyDown={toggle(false)}
        >
          <List>
            <Typography variant="h6" className="nav-menu__title">
              Teaching
            </Typography>
            <ListItem button>
              <ListItemIcon>
                <CreateIcon />
              </ListItemIcon>
              <ListItemText
                primary={'Lớp học của tôi'}
                onClick={() => {
                  navigate('/classes');
                }}
              />
            </ListItem>
          </List>
          <Divider />
          <List>
            <Typography variant="h6" className="nav-menu__title">
              Lớp học đã tham gia
            </Typography>
            {classess.map((c, index) => (
              <Link key={index} className="nav-menu__custom-link" to={`/class-detail/${c.id}`}>
                <ListItem button sx={{ width: '100%' }}>
                  <ListItemIcon>
                    <div
                      className="nav-menu__character-icon"
                      style={{ backgroundColor: c.iconColor }}
                    >
                      {c.title.charAt(0)}
                    </div>
                  </ListItemIcon>
                  <ListItemText primary={c.title} />
                </ListItem>
              </Link>
            ))}
          </List>
        </Box>
      </Drawer>
    </div>
  );
};
