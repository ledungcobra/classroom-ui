import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAllNotifcation } from '../../asyncThunk/notificationAction';
import {
  doUpdateSeenANotification,
  doUpdateSeeneAllNotification,
} from './../../asyncThunk/notificationAction';

interface TInitialState {
  loading: boolean;
  error: boolean;
  notificationContent: INotificationContent | null;
  errorMessage: string;
  pendingId: number | null;
}

const initialState = {
  loading: false,
  error: false,
  notificationContent: null,
  errorMessage: '',
  pendingId: null,
} as TInitialState;

const notificationSlice = createSlice({
  name: 'notification',
  initialState: initialState,
  reducers: {
    addNewNotification: (state, action: PayloadAction<INotification>) => {
      if (
        state.notificationContent &&
        state.notificationContent.data &&
        state.notificationContent.data.notifications
      ) {
        if (!state.notificationContent.data.notifications.find((n) => n.id === action.payload.id))
          state.notificationContent.data.notifications = [
            action.payload,
            ...state.notificationContent.data.notifications,
          ];
        state.notificationContent.data.amountUnseen =
          state.notificationContent.data.notifications.filter((n) => !n.isSeen).length;
      } else {
        state.notificationContent = {
          data: {
            amountUnseen: 1,
            notifications: [action.payload],
          },
          hasMore: false,
          total: 1,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllNotifcation.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(
      getAllNotifcation.fulfilled,
      (state, action: PayloadAction<ICommonResponse<INotificationContent>>) => {
        const response = action.payload;
        state.loading = false;

        if (response.status === 400) {
          state.error = true;
          state.errorMessage = response.message ?? '';
          return;
        }

        const notifications = action.payload.content.data?.notifications;
        if (!notifications) return;
        if (state.notificationContent) {
          const nots = [] as INotification[];

          for (let not of notifications) {
            if (state.notificationContent.data?.notifications.find((n) => n.id === not.id)) {
              continue;
            }
            nots?.push(not);
          }
          if (state.notificationContent.data) {
            state.notificationContent.data.notifications = [
              ...state.notificationContent.data.notifications,
              ...nots,
            ];
          }
        } else {
          state.notificationContent = response.content;
        }

        state.notificationContent.hasMore = response.content.hasMore;

        state.notificationContent.data?.notifications.sort((n) => (n.isSeen ? 1 : -1));
        if (state.notificationContent.data) {
          state.notificationContent.data.amountUnseen =
            state.notificationContent.data?.notifications.filter((n) => !n.isSeen).length;
        }
      },
    );

    builder.addCase(doUpdateSeenANotification.pending, (state, action) => {
      state.loading = true;
      state.pendingId = action.meta.arg.id;
    });

    builder.addCase(
      doUpdateSeenANotification.fulfilled,
      (state, action: PayloadAction<ICommonResponse<string>>) => {
        const response = action.payload;
        state.loading = false;

        if (response.status === 400) {
          state.error = true;
          state.errorMessage = response.message ?? '';
          return;
        }
        if (state.notificationContent && state.notificationContent.data) {
          const index = state.notificationContent.data?.notifications.findIndex(
            (n) => state.pendingId === n.id,
          );
          state.notificationContent.data.notifications = [
            ...state.notificationContent.data?.notifications.slice(0, index),
            {
              ...state.notificationContent.data?.notifications[index],
              isSeen: true,
            },
            ...state.notificationContent.data?.notifications.slice(index + 1),
          ];

          state.notificationContent.data.amountUnseen =
            state.notificationContent.data.notifications.filter((n) => !n.isSeen).length;
        }
      },
    );

    builder.addCase(doUpdateSeeneAllNotification.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(
      doUpdateSeeneAllNotification.fulfilled,
      (state, action: PayloadAction<ICommonResponse<string>>) => {
        const response = action.payload;
        state.loading = false;

        if (response.status === 400) {
          state.error = true;
          state.errorMessage = response.message ?? '';
          return;
        }

        if (state.notificationContent && state.notificationContent.data) {
          state.notificationContent.data.amountUnseen = 0;
          state.notificationContent.data.notifications =
            state.notificationContent.data.notifications.map((not) => {
              not.isSeen = true;
              return not;
            });

          state.notificationContent.data.notifications =
            state.notificationContent.data.notifications.sort((not) => (not.isSeen ? 1 : -1));
          state.notificationContent.data.amountUnseen = 0;
        }
      },
    );
  },
});

export const notificationReducer = notificationSlice.reducer;
export const { addNewNotification } = notificationSlice.actions;
