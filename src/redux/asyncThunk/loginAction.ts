import { apiAuth } from './../../services/apis/apiAuth';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const doLogin = createAsyncThunk('auth/doLogin', async (params: IParamLogin) => {
  const response = await apiAuth.login(params);
  return response.data;
});
