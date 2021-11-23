import { createSlice, PayloadAction } from '@reduxjs/toolkit';
//import { setToken } from '../../../utils/common';

interface TInitialState {
  mainToken: string;
  isLoading: boolean;
  isLogined: boolean;
  currentUser: string;
}

const initialState = {
  mainToken: '',
  currentUser: '',
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
  },
  extraReducers: (builder) => {},
});

export const authReducer = authSlice.reducer;

export const { setMainToken, setLogined, setCurrentUser } = authSlice.actions;
