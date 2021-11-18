import React, { useEffect } from 'react';
import { Route, useLocation } from 'react-router-dom';
import { ETokenKey } from '../constants';
import { logout } from '../utils';

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { batch } from 'react-redux';

export const WithAuthRouter: React.FC<IWithAuthRouter> = ({
  element: Element,
  children: Children,
  layout: Layout,
  header: Header,
  footer: Footer,
  isHasFooter,
  isHasHeader,
  backgroundColor,
}) => {
  const dispatch = useAppDispatch();
  const token = localStorage.getItem(ETokenKey.ACCESS_TOKEN);
  const refeshToken = localStorage.getItem(ETokenKey.REFRESH_TOKEN);

  if (!refeshToken) {
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
      {Element}
      {Children}
    </Layout>
  );
};
