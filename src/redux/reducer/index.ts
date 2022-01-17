import { gradeReviewReducer } from './../slices/gradeReviewSlices/gradeReviewSlice';
import { classReducer } from './../slices/classContextSlides/classContextSlides';
import { editorReducer } from './../slices/editorSlides/editorSlice';
import { combineReducers } from '@reduxjs/toolkit';
import { loginReducer } from '../slices/apiSlices/authSlice';
import classesSlice from '../slices/apiSlices/classesSlice';
import { authReducer } from '../slices/appSlices/authSlice';
import { utilsReducer } from '../slices/appSlices/utilsSlice';

const rootReducer = combineReducers({
  loginReducer,
  authReducer,
  classesSlice,
  utilsReducer,
  editorReducer,
  classReducer,
  gradeReviewReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
