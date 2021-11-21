import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Footer, Header } from '../components';
import { Classes, Home, Login, Singup } from '../containers';
import { ClassDetail } from '../containers/ClassDetail/ClassDetail';
import { BlankLayout, HeaderFooterLayout, OnlyHeaderLayout } from '../layouts';
import { WithAuthRouter } from './WithAuthRouter';
import { WithUnAuthRouter } from './WithUnAuthRouter';

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
            <WithUnAuthRouter
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
