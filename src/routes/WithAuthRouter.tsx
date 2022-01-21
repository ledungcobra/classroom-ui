import React, { useEffect } from 'react';
import { batch } from 'react-redux';
import { useLocation } from 'react-router';
import { ETokenKey } from '../constants';
import {
  setCurrentUser,
  setEmail,
  setFullName,
  setLogined,
  setUserId,
  useAppDispatch,
  useAppSelector,
} from '../redux';
import { clearAllToken, isExistToken, logout } from '../utils';

export const WithAuthRouter: React.FC<IWithAuthRouter> = ({
  component: Compnent,
  pageProps,
  layout: Layout,
  header: Header,
  footer: Footer,
  isHasFooter,
  isHasHeader,
  backgroundColor,
}) => {
  // const dispatch = useAppDispatch();
  const refeshToken = localStorage.getItem(ETokenKey.REFRESH_TOKEN);
  const token = localStorage.getItem(ETokenKey.ACCESS_TOKEN);
  const currentUserLocalStorage = localStorage.getItem(ETokenKey.CURRENT_USER);
  const currentFullNameLocalStorage = localStorage.getItem(ETokenKey.CURRENT_FULLNAME);
  const currentEmailLocalStorage = localStorage.getItem(ETokenKey.CURRENT_EMAIL);
  const userId = localStorage.getItem(ETokenKey.USER_ID);
  const location = useLocation();

  const dispatch = useAppDispatch();
  const isLogined = useAppSelector((state) => state.authReducer.isLogined);

  if (
    (!isExistToken(refeshToken as string) && !isExistToken(token as string)) ||
    !currentUserLocalStorage ||
    !currentFullNameLocalStorage ||
    !currentEmailLocalStorage
  ) {
    clearAllToken();
    logout(location.pathname);
  } else {
    dispatch(setLogined(true));
    dispatch(setCurrentUser(currentUserLocalStorage as string));
    dispatch(setFullName(currentFullNameLocalStorage as string));
    dispatch(setEmail(currentEmailLocalStorage as string));
    if (userId) {
      dispatch(setUserId(+userId));
    }
  }

  useEffect(() => {
    batch(() => {});
  }, []);

  return isLogined ? (
    <Layout
      header={isHasHeader ? <Header backgroundColor={backgroundColor} /> : <></>}
      footer={isHasFooter ? <Footer /> : <></>}
      backgroundColor={backgroundColor}
    >
      <Compnent {...pageProps} />
    </Layout>
  ) : (
    <></>
  );
};
