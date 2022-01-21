import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setRefreshToken, setToken } from '../../../utils/common';
import { doLogin, doSignup } from '../../asyncThunk/authAction';
import { setUserId } from './../../../utils/common';

interface TInitialState {
  email: string;
  token: string;
  message: string;
  id: number | null;
  isLoading: boolean;
}

const initialState = {
  email: '',
  token: '',
  message: '',
  isLoading: false,
  id: null,
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
    builder.addCase(
      doLogin.fulfilled,
      (state, action: PayloadAction<ICommonResponse<IResLogin>>) => {
        let payload = action.payload.content;
        if (payload.token !== '') {
          setToken(payload.token);
          setRefreshToken(payload.refreshToken);
          setUserId(payload.id);
        } else {
          state.message = 'ERR';
        }
        state.isLoading = false;
      },
    );
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
        setUserId(payload.id);
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
