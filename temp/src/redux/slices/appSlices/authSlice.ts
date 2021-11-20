import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setToken } from '../../../utils/common';
import { doLogin } from '../../asyncThunk/loginAction';

interface TInitialState {
  mainToken: string;
  isLoading: boolean;
}

const initialState = {
  mainToken: '',
  isLoading: false,
} as TInitialState;

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setMainToken: (state, action: PayloadAction<string>) => {
      state.mainToken = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const authReducer = authSlice.reducer;

export const { setMainToken } = authSlice.actions;
