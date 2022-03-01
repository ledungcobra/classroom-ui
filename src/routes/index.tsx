import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Footer, Header } from '../components';
import {
  Classes,
  EditProfile,
  ExerciseManager,
  GradeReview,
  Home,
  Login,
  Singup,
} from '../containers';
import { ClassDetail } from '../containers/ClassDetail/ClassDetail';
import ClassMembers from '../containers/ClassMembers/ClassMembers';
import Grades from '../containers/Grades/Grades';
import { JoinClass } from '../containers/JoinClass/JoinClass';
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
              component={Classes}
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
              component={Classes}
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
        <Route
          path="/members/:id"
          element={
            <WithAuthRouter
              component={ClassMembers}
              layout={HeaderFooterLayout}
              isHasHeader={true}
              header={Header}
              isHasFooter={true}
              footer={Footer}
            />
          }
        />

        <Route
          path="/class-detail/:id"
          element={
            <WithAuthRouter
              component={ClassDetail}
              layout={HeaderFooterLayout}
              isHasHeader={true}
              header={Header}
              isHasFooter={true}
              footer={Footer}
            />
          }
        />

        <Route
          path="/edit-profile"
          element={
            <WithAuthRouter
              component={EditProfile}
              layout={OnlyHeaderLayout}
              isHasHeader={true}
              header={Header}
              isHasFooter={true}
            />
          }
        />
        <Route
          path="/class-detail/:id/exercise-manager"
          element={
            <WithAuthRouter
              component={ExerciseManager}
              layout={OnlyHeaderLayout}
              isHasHeader={true}
              header={Header}
              isHasFooter={true}
            />
          }
        />

        <Route
          path="/class-detail/:id/grades"
          element={
            <WithAuthRouter
              component={Grades}
              layout={OnlyHeaderLayout}
              isHasHeader={true}
              header={Header}
              isHasFooter={true}
            />
          }
        />

        <Route
          path="/class-detail/:id/grade-review"
          caseSensitive
          element={
            <WithUnAuthRouter
              component={GradeReview}
              layout={OnlyHeaderLayout}
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
          path="/confirm-mail"
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
          path="/class-join"
          caseSensitive
          element={
            <WithUnAuthRouter
              component={JoinClass}
              layout={BlankLayout}
              isHasHeader={true}
              header={Header}
              isHasFooter={true}
              footer={Footer}
            />
          }
        />

        <Route
          path="/home"
          caseSensitive
          element={
            <WithUnAuthRouter
              component={Home}
              layout={BlankLayout}
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
