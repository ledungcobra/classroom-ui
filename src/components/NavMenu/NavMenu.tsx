import MailIcon from '@mui/icons-material/Mail';
import InboxIcon from '@mui/icons-material/MoveToInbox';
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

  const classess = useAppSelector((state) => state.classesSlice.classes);
  React.useEffect(() => {
    if (!classess || classess.length === 0) {
      dispatch(
        doGetListClasses({
          currentUser: 'tanhank2k',
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
          justifyContent="center"
          alignItems="flex-start"
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
                <MailIcon />
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
              <ListItem button key={index} sx={{ width: '100%' }}>
                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                <ListItemText
                  primary={
                    <Link className="nav-menu__custom-link" to={`/class-detail/${c.id}`}>
                      {c.title}
                    </Link>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </div>
  );
};
