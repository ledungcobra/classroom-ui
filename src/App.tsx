import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Snackbar } from '@mui/material';
import React, { useEffect } from 'react';
import Favicon from 'react-favicon';
import './App.scss';
import ImageFavicon from './assets/icons/favicon.ico';
import { SUB_COLOR } from './constants';
import { Routers } from './routes';

import { useAppDispatch } from './redux';
import { setRandomAvt } from './redux';
import { getRandomUInt } from './utils/common';

import { avatars } from './utils/img';

export interface IAppContext {
  openSnackBar: (message: string) => void;
  showLoading: () => void;
  hideLoading: () => void;
  loading: boolean;
  setCurrentClassId: (classId: number | null) => void;
  currentClassId: number | null;
  openSnackBarError: (message: string) => void;
}

export const AppContext = React.createContext<IAppContext | null>(null);

export default function App() {
  const dispatch = useAppDispatch();

  // Snack bar
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [isError, setIsError] = React.useState(false);

  const [classId, setClassId] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(false);

  const showLoading = () => {
    setLoading(true);
  };

  const hideLoading = () => {
    setLoading(false);
  };
  const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const openSnackBar = (message: string) => {
    setMessage(message);
    setOpen(true);
    setIsError(false);
  };

  const showSnackBarError = (message: string) => {
    setMessage(message);
    setOpen(true);
    setIsError(true);
  };

  useEffect(() => {
    var randIndex = getRandomUInt(avatars.length);
    dispatch(setRandomAvt(avatars[randIndex]));
  }, []);

  return (
    <AppContext.Provider
      value={{
        openSnackBar,
        showLoading,
        hideLoading,
        loading,
        currentClassId: classId,
        setCurrentClassId: setClassId,
        openSnackBarError: showSnackBarError,
      }}
    >
      <div className="app">
        <Favicon url={ImageFavicon} />
        <Routers />
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          message={message}
          ContentProps={{
            sx: {
              background: isError ? 'red' : 'white',
              color: isError ? 'white' : SUB_COLOR,
            },
          }}
          action={
            <>
              <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </>
          }
        />
      </div>
    </AppContext.Provider>
  );
}
