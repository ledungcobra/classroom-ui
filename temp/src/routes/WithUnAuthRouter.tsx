import React from 'react';
import { ETokenKey } from '../constants';
import { isExistToken } from '../utils';

export const WithUnAuthRouter: React.FC<IWithUnAuthRouter> = ({
  component: Compnent,
  pageProps,
  layout: Layout,
  header: Header,
  footer: Footer,
  isHasFooter,
  isHasHeader,
  backgroundColor,
  isAuthPage,
}) => {
  const token = localStorage.getItem(ETokenKey.ACCESS_TOKEN);

  if (isExistToken(token as string) && isAuthPage) {
    window.location.replace('/');
  }

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
