import { combineReducers } from '@reduxjs/toolkit';
import { loginReducer } from '../slices/apiSlices/loginSlice';
import { authReducer } from '../slices/appSlices/authSlice';

const rootReducer = combineReducers({
  loginReducer,
  authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
