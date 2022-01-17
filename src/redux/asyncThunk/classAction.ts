import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClass } from './../../services/apis/apiClass';

export const doGetClassDetail = createAsyncThunk(
  'class/doGetClassDetail',
  async (params: IParamGetClassDetail) => {
    const response = await apiClass.getClassDetail(params);
    return response;
  },
);

export const doGetClassMember = createAsyncThunk(
  'class/doGetMemberClass',
  async (params: IParamGetMemberClass) => {
    const response = await apiClass.getClassMember(params);
    return response.data;
  },
);

export const doPostInviteMemberToClass = createAsyncThunk(
  'class/doPostInviteMemberToClass',
  async (body: IParamInviteMemberClassClient) => {
    const responses = await apiClass.postInviteMemberToClass(body);
    return responses.map((res) => res.data);
  },
);

export const doPostAddStudent = createAsyncThunk(
  'class/doPostAddStudent',
  async (body: IParamAddStudent) => {
    const response = await apiClass.postAddMember(body);
    return response.data;
  },
);
