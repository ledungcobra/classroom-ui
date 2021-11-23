import { createSlice, PayloadAction } from '@reduxjs/toolkit';
//import { setToken } from '../../../utils/common';

interface TInitialState {
  randomUserAvt: any;
}

const initialState = {
  randomUserAvt: undefined,
} as TInitialState;

const utilsSlice = createSlice({
  name: 'utils',
  initialState: initialState,
  reducers: {
    setRandomAvt: (state, action: PayloadAction<any>) => {
      state.randomUserAvt = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const utilsReducer = utilsSlice.reducer;

export const { setRandomAvt } = utilsSlice.actions;
