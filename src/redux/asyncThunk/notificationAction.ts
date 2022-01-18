import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosMain from '../../services/axios/axiosMain';

export const getAllNotifcation = createAsyncThunk(
  'notification/getAllNotifcation',
  async (currentUser: string) => {
    return (await axiosMain.get(`/notification?CurrentUser=${currentUser}`)).data;
  },
);

export const doUpdateSeenANotification = createAsyncThunk(
  'notification/doUpdateSeenANotification',
  async (params: IUpdateMarkSeenNotificationRequest) => {
    return (
      await axiosMain.put(`/notification/mark-seen/${params.id}?currentUser=${params.currentUser}`)
    ).data;
  },
);

export const doUpdateSeeneAllNotification = createAsyncThunk(
  'notification/doUpdateSeenAllNotification',
  async (currentUser: string | null) => {
    return (await axiosMain.put(`/notification/mark-seen?currentUser=${currentUser}`)).data;
  },
);
