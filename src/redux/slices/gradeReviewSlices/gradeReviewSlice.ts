import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GradeReviewStatus } from '../../../constants';
import {
  doCreateGradeReview,
  doDeleteGradeReview,
  doGetGradeReviewComments,
  doStudentComment,
  doStudentDeleteComment,
  doStudentUpdateComment,
  doTeacherComment,
  doTeacherDeleteComment,
  doTeacherUpdateComment,
  doUpdateGradeReview,
} from '../../asyncThunk/gradeReviewAction';
import {
  doApprove,
  doGetGradeReview,
  doGetStudentGrade,
} from './../../asyncThunk/gradeReviewAction';
interface TInitialState {
  isLoading: boolean;
  approve: GradeReviewStatus;
  errorMessage: string;
  gradeReview: IGradeReviewContent | null;
  error: boolean;
  comments: {
    data: IGradeReviewComment[];
    hasMore: boolean;
  };
  studentGrade: IStudentGradeContent | null;
}

const initialState = {
  isLoading: false,
  errorMessage: '',
  approve: GradeReviewStatus.None,
  error: false,
  gradeReview: null,
  comments: {
    data: [] as IGradeReviewComment[],
    hasMore: false,
  },
  studentGrade: null,
  pendingAproveStatus: GradeReviewStatus.None,
} as TInitialState;

const updateComment = (
  state: TInitialState,
  action: PayloadAction<ICommonResponse<IGradeReviewComment>>,
) => {
  state.isLoading = false;

  if (action.payload.status === 400) {
    state.error = true;
    state.errorMessage = action.payload.message ?? '';
    return;
  }

  const index = state.comments.data.findIndex((c) => c.id === action.payload.content.id);
  if (index < 0) return;
  state.comments.data = [
    ...state.comments.data.slice(0, index),
    action.payload.content,
    ...state.comments.data.slice(index + 1),
  ];
};

const updateGradeReview = (
  state: TInitialState,
  action: PayloadAction<ICommonResponse<IGradeReviewContent>>,
) => {
  state.isLoading = false;
  if (action.payload.status === 400) {
    state.error = true;
    state.errorMessage = action.payload.message ?? '';
    return;
  }

  state.gradeReview = action.payload.content;
};

const approve = (
  state: TInitialState,
  action: PayloadAction<ICommonResponse<string | ApproveResponse>>,
) => {
  state.isLoading = false;
  if (action.payload.status === 400) {
    state.errorMessage = action.payload.content as string;
    return;
  }

  if (state.gradeReview) {
    if ((action.payload.content as ApproveResponse).gradeReviewId === state.gradeReview?.id) {
      state.gradeReview.status = (action.payload.content as ApproveResponse).status;

      if (state.gradeReview.status === GradeReviewStatus.Approve) {
        state.gradeReview.grade.grade = state.gradeReview.gradeExpect;
      }
    }
  }
};

const createGradeReview = (
  state: TInitialState,
  action: PayloadAction<ICommonResponse<IGradeReviewContent | string>>,
) => {
  state.isLoading = false;
  const resp = action.payload;
  if (resp.status === 400) {
    state.errorMessage = resp.message ?? '';
    state.error = true;
  } else {
    state.gradeReview = action.payload.content as IGradeReviewContent;
  }
};

const deleteGradeReview = (
  state: TInitialState,
  action: PayloadAction<ICommonResponse<string>>,
) => {
  state.isLoading = false;
  state.gradeReview = null;
};

const getGradeReviewComments = (
  state: TInitialState,
  action: PayloadAction<ICommonResponse<IGradeReviewCommentContent>>,
) => {
  state.isLoading = false;
  if (action.payload.status === 400) {
    state.error = true;
    state.errorMessage = action.payload.message ?? '';
  } else {
    state.comments = action.payload.content;
  }
};

const deleteComment = (state: TInitialState, action: PayloadAction<ICommonResponse<number>>) => {
  state.isLoading = false;

  if (action.payload.status === 400) {
    state.error = true;
    state.errorMessage = action.payload.message ?? '';
    return;
  }
  const index = state.comments.data.findIndex((c) => c.id === action.payload.content);
  if (index < 0) return;

  state.comments.data = [
    ...state.comments.data.slice(0, index),
    ...state.comments.data.slice(index + 1),
  ];
};

const comment = (
  state: TInitialState,
  action: PayloadAction<ICommonResponse<IGradeReviewComment>>,
) => {
  state.isLoading = false;
  if (action.payload.status === 400) {
    state.error = true;
    state.errorMessage = action.payload.message ?? '';
    return;
  }

  state.comments.data = [...state.comments.data, action.payload.content];
};

const getGradeReview = (
  state: TInitialState,
  action: PayloadAction<ICommonResponse<IGradeReviewContent>>,
) => {
  state.isLoading = false;
  if (action.payload.status === 400) {
    state.error = true;
    state.errorMessage = action.payload.message ?? '';
    return;
  }

  state.gradeReview = action.payload.content;
};

const gradeReviewSlice = createSlice({
  name: 'gradeReview',
  initialState: initialState,
  reducers: {
    setError: (state, action: PayloadAction<boolean>) => {
      state.error = action.payload;
    },
    clearGradeReview: (state) => {
      state.gradeReview = null;
    },

    doAddNewComment: (state, action: PayloadAction<IGradeReviewComment>) => {
      if (state.comments && state.comments.data) {
        state.comments.data = [...state.comments.data, action.payload];
      } else {
        state.comments.data = [action.payload];
      }
    },

    UpdateComment: updateComment,
    DeleteComment: deleteComment,
    Approve: approve,
    UpdateGradeReview: updateGradeReview,
  },
  extraReducers: (builder) => {
    builder.addCase(doApprove.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(doApprove.fulfilled, approve);

    builder.addCase(doCreateGradeReview.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(doCreateGradeReview.fulfilled, createGradeReview);

    builder.addCase(doDeleteGradeReview.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(doDeleteGradeReview.fulfilled, deleteGradeReview);

    builder.addCase(doGetGradeReviewComments.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(doGetGradeReviewComments.fulfilled, getGradeReviewComments);

    builder.addCase(doStudentComment.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(doStudentComment.fulfilled, comment);

    builder.addCase(doStudentDeleteComment.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(doStudentDeleteComment.fulfilled, deleteComment);

    builder.addCase(doStudentUpdateComment.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(doStudentUpdateComment.fulfilled, updateComment);

    builder.addCase(doTeacherComment.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(doTeacherComment.fulfilled, comment);

    builder.addCase(doTeacherDeleteComment.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(doTeacherDeleteComment.fulfilled, deleteComment);

    builder.addCase(doTeacherUpdateComment.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(doTeacherUpdateComment.fulfilled, updateComment);

    builder.addCase(doUpdateGradeReview.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(doUpdateGradeReview.fulfilled, updateGradeReview);

    builder.addCase(doGetGradeReview.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(doGetGradeReview.fulfilled, getGradeReview);

    builder.addCase(doGetStudentGrade.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(
      doGetStudentGrade.fulfilled,
      (state, action: PayloadAction<ICommonResponse<IStudentGradeContent>>) => {
        state.isLoading = false;
        if (action.payload.status === 400) {
          state.error = true;
          state.errorMessage = action.payload.message ?? '';
          return;
        }
        state.studentGrade = action.payload.content;
      },
    );
  },
});

export const gradeReviewReducer = gradeReviewSlice.reducer;
export const {
  setError,
  clearGradeReview,
  doAddNewComment,
  UpdateComment,
  DeleteComment,
  Approve,
  UpdateGradeReview,
} = gradeReviewSlice.actions;
