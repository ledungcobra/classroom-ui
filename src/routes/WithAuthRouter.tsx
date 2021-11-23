import React, { useEffect } from 'react';
import { ETokenKey } from '../constants';
import { logout, isExistToken, clearAllToken } from '../utils';
import { useAppDispatch, useAppSelector, setLogined, setCurrentUser } from '../redux';

import { batch } from 'react-redux';

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

  const dispatch = useAppDispatch();
  const isLogined = useAppSelector((state) => state.authReducer.isLogined);
  const currentUser = useAppSelector((state) => state.authReducer.currentUser);

  if (
    !isExistToken(refeshToken as string) &&
    !isExistToken(token as string) &&
    !!currentUserLocalStorage
  ) {
    clearAllToken();
    logout();
  } else {
    dispatch(setLogined(true));
    dispatch(setCurrentUser(currentUserLocalStorage as string));
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
