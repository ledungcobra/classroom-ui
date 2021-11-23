import { createSlice, PayloadAction } from '@reduxjs/toolkit';
//import { setToken, setRefreshToken } from '../../../utils/common';
import { doGetListClasses } from '../../asyncThunk/classesAction';
import { classBackgrounds } from '../../../utils/img';
import { getRandomRGBColorCSSFunction } from '../../../utils/common';
import { ETokenKey } from '../../../constants';

interface TInitialState {
  isLoading: boolean;
  classes: Array<IResGetListClasses>;
}

const initialState = {
  classes: [],
  isLoading: false,
} as TInitialState;

const currentUser = localStorage.getItem(ETokenKey.CURRENT_USER);

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

        let classes = payload.content.data;

        if (!!classes && classes.length > 0) {
          classes.forEach((c) => {
            let classBgRandIndex = Number(c.id) % classBackgrounds.length;

            c.classBackground = classBackgrounds[classBgRandIndex];
            c.iconColor = getRandomRGBColorCSSFunction(150, 150, 150);
          });
        }

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
