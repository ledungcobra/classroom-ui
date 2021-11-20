import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setToken, setRefreshToken } from '../../../utils/common';
import { doLogin, doSignup } from '../../asyncThunk/authAction';

interface TInitialState {
  email: string;
  token: string;
  message: string;
  isLoading: boolean;
}

const initialState = {
  email: '',
  token: '',
  message: '',
  isLoading: false,
} as TInitialState;

const authSlice = createSlice({
  name: 'login',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //LOGIN
    builder.addCase(doLogin.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(doLogin.fulfilled, (state, action: PayloadAction<IResLogin>) => {
      let payload = action.payload;
      if (payload.token !== '') {
        setToken(payload.token);
        setRefreshToken(payload.refreshToken);
      } else {
        state.message = 'ERR';
      }
      state.isLoading = false;
    });
    builder.addCase(doLogin.rejected, (state) => {
      state.isLoading = false;
    });

    //SIGNUP
    builder.addCase(doSignup.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(doSignup.fulfilled, (state, action: PayloadAction<IResLogin>) => {
      let payload = action.payload;
      if (payload.token !== '') {
        setToken(payload.token);
        setRefreshToken(payload.refreshToken);
      } else {
        state.message = 'ERR';
      }
      state.isLoading = false;
    });
    builder.addCase(doSignup.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const loginReducer = authSlice.reducer;

//export const {} = authSlice.actions;
