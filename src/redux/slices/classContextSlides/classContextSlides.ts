import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HeaderSelect } from '../../../components';
import { doGetClassDetail } from '../../asyncThunk/classAction';

interface TInitialState {
  currentClassId: number | null;
  isTeacher: boolean;
  headerSelect: HeaderSelect;
}

const initialState = {
  isTeacher: false,
  currentClassId: null,
  headerSelect: HeaderSelect.OtherPage,
} as TInitialState;

const classContextSlide = createSlice({
  name: 'classContext',
  initialState: initialState,
  reducers: {
    setCurrentClassId: (state, action: PayloadAction<number | null>) => {
      state.currentClassId = action.payload;
    },
    setIsTeacher: (state, action: PayloadAction<boolean>) => {
      state.isTeacher = action.payload;
    },

    setHeaderSelect: (state, action: PayloadAction<HeaderSelect>) => {
      state.headerSelect = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      doGetClassDetail.fulfilled,
      (state, action: PayloadAction<ICommonResponse<{ course: any; role: number }>>) => {
        state.isTeacher = action.payload.content.role === 1;
      },
    );
  },
});

export const classReducer = classContextSlide.reducer;

export const { setCurrentClassId, setIsTeacher, setHeaderSelect } = classContextSlide.actions;
