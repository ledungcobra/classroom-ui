import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Footer, Header } from '../components';
import { Home } from '../containers';
import { WithUnAuthRouter } from './WithUnAuthRouter';
import { HeaderFooterLayout } from '../layouts';
import { WithAuthRouter } from './WithAuthRouter';

export const Routers = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <WithUnAuthRouter
              layout={HeaderFooterLayout}
              isHasHeader={true}
              header={Header}
              isHasFooter={true}
              footer={Footer}
            >
              <Home></Home>
            </WithUnAuthRouter>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
