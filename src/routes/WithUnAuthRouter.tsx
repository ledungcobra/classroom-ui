import React from 'react';
import { Route } from 'react-router-dom';

export const WithUnAuthRouter: React.FC<IWithUnAuthRouter> = ({
  element: Element,
  children: Children,
  layout: Layout,
  header: Header,
  footer: Footer,
  isHasFooter,
  isHasHeader,
  backgroundColor,
}) => {
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
