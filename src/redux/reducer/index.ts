import { combineReducers } from '@reduxjs/toolkit';
import { loginReducer } from '../slices/apiSlices/authSlice';
import classesSlice from '../slices/apiSlices/classesSlice';
import { authReducer } from '../slices/appSlices/authSlice';

const rootReducer = combineReducers({
  loginReducer,
  authReducer,
  classesSlice,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
