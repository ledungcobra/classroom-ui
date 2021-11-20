import { makeStyles, createStyles } from '@mui/styles';

export const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: '8px',
      color: 'black',
    },
    title: {
      fontSize: '1.38rem',
      color: '#5f6368',
      marginLeft: '15px !important',
      cursor: 'pointer',
    },
    appBar: {
      backgroundColor: 'white !important',
      color: 'black !important',
      boxShadow: 'none !important',
    },
    toolbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerWrapper: {
      display: 'flex',
      alignItems: 'center',
    },
    header__wrapper__right: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    icon: {
      marginRight: '15px',
      color: '#5f6368',
      cursor: 'pointer',
    },
  }),
);
