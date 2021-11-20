import React, { useEffect } from 'react';
import { ETokenKey } from '../constants';
import { logout, isExistToken, clearAllToken } from '../utils';

import { useAppDispatch, useAppSelector } from '../redux/hooks';
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

  if (!isExistToken(refeshToken as string) && !isExistToken(token as string)) {
    clearAllToken();
    logout();
  }

  useEffect(() => {
    batch(() => {});
  }, []);

  return (
    <Layout
      header={isHasHeader ? <Header backgroundColor={backgroundColor} /> : <></>}
      footer={isHasFooter ? <Footer /> : <></>}
      backgroundColor={backgroundColor}
    >
      <Compnent {...pageProps} />
    </Layout>
  );
};
