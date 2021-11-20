import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Footer, Header } from '../components';
import { Home, Login, Classes, Singup } from '../containers';
import { WithUnAuthRouter } from './WithUnAuthRouter';
import { BlankLayout, HeaderFooterLayout, OnlyHeaderLayout } from '../layouts';
import { WithAuthRouter } from './WithAuthRouter';

export const Routers = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="*"
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

        {/*----------------------------- AUTH ROUTE ----------------------------*/}
        <Route
          path="/"
          element={
            <WithAuthRouter
              component={Home}
              layout={OnlyHeaderLayout}
              isHasHeader={true}
              header={Header}
              isHasFooter={false}
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
          path="/signup"
          element={
            <WithUnAuthRouter
              component={Singup}
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
