import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TInitialState {
  comment: string;
  currentCommentId: number | null;
  isEditing: boolean;
  exerciseName?: string;
  maxGrade?: number;
}

const initialState = {
  comment: '',
  isEditing: false,
  currentCommentId: null,
  exerciseName: undefined,
  maxGrade: undefined,
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
    setExerciseName: (state, action: PayloadAction<string | undefined>) => {
      state.exerciseName = action.payload;
    },
    setMaxGrade: (state, action: PayloadAction<number | undefined>) => {
      state.maxGrade = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const editorReducer = editorSlice.reducer;

export const { setComment, setCurrentCommentId, setIsEditing, setExerciseName, setMaxGrade } =
  editorSlice.actions;
