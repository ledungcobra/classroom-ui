import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TInitialState {
  comment: string;
  currentCommentId: number | null;
  isEditing: boolean;
}

const initialState = {
  comment: '',
  isEditing: false,
  currentCommentId: null,
} as TInitialState;

const editorSlice = createSlice({
  name: 'editor',
  initialState: initialState,
  reducers: {
    setComment: (state, action: PayloadAction<string>) => {
      state.comment = action.payload;
    },
    setCurrentCommentId: (state, action: PayloadAction<number | null>) => {
      state.currentCommentId = action.payload;
    },
    setIsEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const editorReducer = editorSlice.reducer;

export const { setComment, setCurrentCommentId, setIsEditing } = editorSlice.actions;
