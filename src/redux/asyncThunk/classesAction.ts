import { apiClasses } from './../../services/apis/apiClasses';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const doGetListClasses = createAsyncThunk(
  'classes/doGetListClasses',
  async (params: IParamGetListClasses) => {
    const response = await apiClasses.getListClasses(params);
    return response.data;
  },
);
