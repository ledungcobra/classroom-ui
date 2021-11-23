import { createSlice, PayloadAction } from '@reduxjs/toolkit';
//import { setToken, setRefreshToken } from '../../../utils/common';
import { doGetListClasses } from '../../asyncThunk/classesAction';

interface TInitialState {
  isLoading: boolean;
  classes: Array<IResGetListClasses>;
}

const initialState = {
  classes: [],
  isLoading: false,
} as TInitialState;

export const classesSlice = createSlice({
  name: 'login',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(doGetListClasses.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      doGetListClasses.fulfilled,
      (state, action: PayloadAction<{ content: { data: Array<IResGetListClasses> } }>) => {
        let payload = action.payload;
        state.classes = payload.content.data;
      },
    );
    builder.addCase(doGetListClasses.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

//export const {} = classesSlice.actions;
export default classesSlice.reducer;
