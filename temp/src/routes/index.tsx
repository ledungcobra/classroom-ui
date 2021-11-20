import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Footer, Header } from '../components';
import { Home, Login, Classes } from '../containers';
import { WithUnAuthRouter } from './WithUnAuthRouter';
import { BlankLayout, HeaderFooterLayout } from '../layouts';
import { WithAuthRouter } from './WithAuthRouter';

export const Routers = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/*----------------------------- AUTH ROUTE ----------------------------*/}
        <Route
          path="/"
          element={
            <WithAuthRouter
              component={Home}
              layout={HeaderFooterLayout}
              isHasHeader={true}
              header={Header}
              isHasFooter={true}
              footer={Footer}
            />
          }
        />
        <Route
          path="/classes"
          element={
            <WithAuthRouter
              component={Classes}
              layout={HeaderFooterLayout}
              isHasHeader={true}
              header={Header}
              isHasFooter={true}
              footer={Footer}
            />
          }
        />

        {/*----------------------------- UNAUTH ROUTE ----------------------------*/}

        <Route
          path="/login"
          element={
            <WithUnAuthRouter
              component={Login}
              layout={BlankLayout}
              isHasHeader={true}
              header={Header}
              isHasFooter={true}
              footer={Footer}
              isAuthPage={true}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
