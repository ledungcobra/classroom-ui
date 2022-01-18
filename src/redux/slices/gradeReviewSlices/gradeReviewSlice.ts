import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  GradeReviewStatus as EGradeReviewStatus,
  GradeReviewStatus,
} from '../../../containers/GradeReview/Data';
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
  approve: EGradeReviewStatus;
  errorMessage: string;
  gradeReview: IGradeReviewContent | null;
  error: boolean;
  comments: {
    data: IGradeReviewComment[];
    hasMore: boolean;
  };
  pendingCommentId: number;
  studentGrade: IStudentGradeContent | null;
  pendingAproveStatus: GradeReviewStatus;
}

const initialState = {
  isLoading: false,
  errorMessage: '',
  approve: EGradeReviewStatus.None,
  error: false,
  gradeReview: null,
  comments: {
    data: [] as IGradeReviewComment[],
    hasMore: false,
  },
  studentGrade: null,
  pendingAproveStatus: GradeReviewStatus.None,
} as TInitialState;

const gradeReviewSlice = createSlice({
  name: 'gradeReview',
  initialState: initialState,
  reducers: {
    setError: (state, action: PayloadAction<boolean>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(doApprove.pending, (state, action) => {
      state.isLoading = true;
      state.pendingAproveStatus = action.meta.arg.approvalStatus;
    });
    builder.addCase(
      doApprove.fulfilled,
      (state, action: PayloadAction<ICommonResponse<string>>) => {
        state.isLoading = false;
        if (action.payload.status === 400) {
          state.errorMessage = action.payload.content;
          state.pendingAproveStatus = GradeReviewStatus.None;
          return;
        }

        if (state.gradeReview) {
          state.gradeReview.status = state.pendingAproveStatus;
        }
      },
    );

    builder.addCase(doCreateGradeReview.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      doCreateGradeReview.fulfilled,
      (state, action: PayloadAction<ICommonResponse<IGradeReviewContent | string>>) => {
        state.isLoading = false;
        const resp = action.payload;
        if (resp.status === 400) {
          state.errorMessage = resp.message ?? '';
          state.error = true;
        } else {
          state.gradeReview = action.payload.content as IGradeReviewContent;
        }
      },
    );

    builder.addCase(doDeleteGradeReview.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      doDeleteGradeReview.fulfilled,
      (state, action: PayloadAction<ICommonResponse<string>>) => {
        state.isLoading = false;
        state.gradeReview = null;
      },
    );

    builder.addCase(doGetGradeReviewComments.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      doGetGradeReviewComments.fulfilled,
      (state, action: PayloadAction<ICommonResponse<IGradeReviewCommentContent>>) => {
        state.isLoading = false;
        if (action.payload.status === 400) {
          state.error = true;
          state.errorMessage = action.payload.message ?? '';
        } else {
          state.comments = action.payload.content;
        }
      },
    );

    builder.addCase(doStudentComment.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      doStudentComment.fulfilled,
      (state, action: PayloadAction<ICommonResponse<IGradeReviewComment>>) => {
        state.isLoading = false;

        if (action.payload.status === 400) {
          state.error = true;
          state.errorMessage = action.payload.message ?? '';
        } else {
          state.comments.data = [...state.comments.data, action.payload.content];
        }
      },
    );

    builder.addCase(doStudentDeleteComment.pending, (state, action) => {
      state.isLoading = true;
      state.pendingCommentId = action.meta.arg.reviewCommentId;
    });
    builder.addCase(doStudentDeleteComment.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false;

      if (action.payload.status === 400) {
        state.error = true;
        state.errorMessage = action.payload.message ?? '';
        return;
      }
      const index = state.comments.data.findIndex((c) => c.id === state.pendingCommentId);
      if (index < 0) return;

      state.comments.data = [
        ...state.comments.data.slice(0, index),
        ...state.comments.data.slice(index + 1),
      ];
    });

    builder.addCase(doStudentUpdateComment.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(
      doStudentUpdateComment.fulfilled,
      (state, action: PayloadAction<ICommonResponse<IGradeReviewComment>>) => {
        state.isLoading = false;
        if (action.payload.status === 400) {
          state.error = true;
          state.errorMessage = action.payload.message ?? '';
          return;
        }
        const index = state.comments.data.findIndex((c) => c.id === action.payload.content.id);
        state.comments.data = [
          ...state.comments.data.slice(0, index),
          action.payload.content,
          ...state.comments.data.slice(index + 1),
        ];
      },
    );

    builder.addCase(doTeacherComment.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      doTeacherComment.fulfilled,
      (state, action: PayloadAction<ICommonResponse<IGradeReviewComment>>) => {
        state.isLoading = false;
        if (action.payload.status === 400) {
          state.error = true;
          state.errorMessage = action.payload.message ?? '';
          return;
        }

        state.comments.data = [...state.comments.data, action.payload.content];
      },
    );

    builder.addCase(doTeacherDeleteComment.pending, (state, action) => {
      state.isLoading = true;
      state.pendingCommentId = action.meta.arg.reviewCommentId;
    });
    builder.addCase(doTeacherDeleteComment.fulfilled, (state, action: PayloadAction<any>) => {
      state.isLoading = false;

      if (action.payload.status === 400) {
        state.error = true;
        state.errorMessage = action.payload.message ?? '';
        return;
      }
      const index = state.comments.data.findIndex((c) => c.id === state.pendingCommentId);
      if (index < 0) return;

      state.comments.data = [
        ...state.comments.data.slice(0, index),
        ...state.comments.data.slice(index + 1),
      ];
      state.pendingCommentId = 0;
    });

    builder.addCase(doTeacherUpdateComment.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      doTeacherUpdateComment.fulfilled,
      (state, action: PayloadAction<ICommonResponse<IGradeReviewComment>>) => {
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
      },
    );

    builder.addCase(doUpdateGradeReview.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      doUpdateGradeReview.fulfilled,
      (state, action: PayloadAction<ICommonResponse<IGradeReviewContent>>) => {
        state.isLoading = false;
        if (action.payload.status === 400) {
          state.error = true;
          state.errorMessage = action.payload.message ?? '';
          return;
        }

        state.gradeReview = action.payload.content;
      },
    );

    builder.addCase(doGetGradeReview.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      doGetGradeReview.fulfilled,
      (state, action: PayloadAction<ICommonResponse<IGradeReviewContent>>) => {
        state.isLoading = false;
        if (action.payload.status === 400) {
          state.error = true;
          state.errorMessage = action.payload.message ?? '';
          return;
        }

        state.gradeReview = action.payload.content;
      },
    );

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
export const { setError } = gradeReviewSlice.actions;
