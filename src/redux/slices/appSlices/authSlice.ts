import { createSlice, PayloadAction } from '@reduxjs/toolkit';
//import { setToken } from '../../../utils/common';

interface TInitialState {
  mainToken: string;
  isLoading: boolean;
  isLogined: boolean;
  currentUser: string;
  email: string;
  fullName: string;
}

const initialState = {
  mainToken: '',
  currentUser: '',
  email: '',
  fullName: '',
  isLoading: false,
  isLogined: false,
} as TInitialState;

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setMainToken: (state, action: PayloadAction<string>) => {
      state.mainToken = action.payload;
    },
    setLogined: (state, action: PayloadAction<boolean>) => {
      state.isLogined = action.payload;
    },
    setCurrentUser: (state, action: PayloadAction<string>) => {
      state.currentUser = action.payload;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setFullName: (state, action: PayloadAction<string>) => {
      state.fullName = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const authReducer = authSlice.reducer;

export const { setMainToken, setLogined, setCurrentUser, setEmail, setFullName } =
  authSlice.actions;
