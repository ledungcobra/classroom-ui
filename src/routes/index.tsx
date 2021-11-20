import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Footer, Header } from '../components';
import { Classes, Home, Login } from '../containers';
import { ClassDetail } from '../containers/ClassDetail/ClassDetail';
import { BlankLayout, HeaderFooterLayout } from '../layouts';
import { WithAuthRouter } from './WithAuthRouter';
import { WithUnAuthRouter } from './WithUnAuthRouter';

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
        <Route
          path="/class-detail"
          element={
            <WithUnAuthRouter
              component={ClassDetail}
              layout={HeaderFooterLayout}
              isHasHeader={true}
              header={Header}
              isHasFooter={true}
              footer={Footer}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
