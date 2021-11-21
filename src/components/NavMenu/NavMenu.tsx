import * as React from 'react';
import {
  Box,
  Drawer,
  List,
  Divider,
  ListItem,
  Typography,
  ListItemText,
  ListItemIcon,
} from '@mui/material';

import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

import './NavMenu.scss';

interface INavMenuProps {
  anchor: 'top' | 'left' | 'bottom' | 'right' | undefined;
  open: boolean;
  toggle: any;
}

export const NavMenu: React.FC<INavMenuProps> = ({ anchor, open, toggle }) => {
  return (
    <div className="nav-menu">
      <Drawer anchor={anchor} open={open} onClose={toggle(false)}>
        <Box
          sx={{
            width: 250,
          }}
          role="presentation"
          onClick={toggle(false)}
          onKeyDown={toggle(false)}
        >
          <List>
            <Typography variant="h6" className="nav-menu__title">
              Teaching
            </Typography>
            {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <Typography variant="h6" className="nav-menu__title">
              Enrolled
            </Typography>
            {['All mail', 'Trash', 'Spam'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </div>
  );
};
