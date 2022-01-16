import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HeaderSelect } from '../../../components';

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
  extraReducers: (builder) => {},
});

export const classReducer = classContextSlide.reducer;

export const { setCurrentClassId, setIsTeacher, setHeaderSelect } = classContextSlide.actions;
