import React, { useEffect } from 'react';
import { ETokenKey } from '../constants';
import { logout, isExistToken, clearAllToken } from '../utils';
import { useAppDispatch, useAppSelector, setLogined } from '../redux';

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

  const dispatch = useAppDispatch();
  const isLogined = useAppSelector((state) => state.authReducer.isLogined);

  if (!isExistToken(refeshToken as string) && !isExistToken(token as string)) {
    clearAllToken();
    logout();
  } else {
    dispatch(setLogined(true));
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
