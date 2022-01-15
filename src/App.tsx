import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import React, { useEffect } from 'react';
import Favicon from 'react-favicon';
import './App.scss';
import ImageFavicon from './assets/icons/favicon.ico';
import { HeaderSelect } from './components';
import { SUB_COLOR } from './constants';
import { setRandomAvt, useAppDispatch, useLocalStorage } from './redux';
import { Routers } from './routes';
import { getRandomUInt } from './utils/common';
import { avatars } from './utils/img';

export interface IAppContext {
  openSnackBar: (message: string) => void;
  showLoading: () => void;
  hideLoading: () => void;
  loading: boolean;
  setCurrentClassId: (classId: number | null) => void;
  currentClassId: number | null;
  isTeacher: boolean;
  setIsTeacher: (isAuthor: boolean) => void;
  openSnackBarError: (message: string) => void;
  headerSelect: HeaderSelect | null;
  setHeaderSelect: (value: HeaderSelect) => void;
}

interface IAppState {
  classId: number | null;
  isTeacher: boolean;
  selectedHeader: HeaderSelect | null;
}

export const AppContext = React.createContext<IAppContext | null>(null);

export default function App() {
  const dispatch = useAppDispatch();

  // Snack bar
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [isError, setIsError] = React.useState(false);
  const [state, setState] = useLocalStorage<IAppState>('appstate', {
    classId: null,
    isTeacher: false,
    selectedHeader: null,
  });

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
        currentClassId: state.classId,
        setCurrentClassId: (classId) => setState({ ...state, classId }),
        openSnackBarError: showSnackBarError,
        isTeacher: state.isTeacher,
        headerSelect: state.headerSelect,
        setHeaderSelect: (selection) => setState({ ...state, headerSelect: selection }),
        setIsTeacher: (isTeacher) => {
          setState({
            ...state,
            isTeacher,
          });
        },
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
