import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosMain from '../../services/axios/axiosMain';

export const doGetGradeReviewComments = createAsyncThunk(
  'gradeReview/doGetGradeReviewComments',
  async (params: IGetGradeReviewCommentsRequest) => {
    return (
      await axiosMain.get(
        `/grade-review/comments?CourseId=${params.CourseId}&GradeId=${params.GradeId}&CurrentUser=${params.CurrentUser}&GradeReviewId=${params.GradeReviewId}`,
      )
    ).data;
  },
);

export const doCreateGradeReview = createAsyncThunk(
  'gradeReview/doCreateGradeReview',
  async (params: ICreateGradeReviewRequest) => {
    return (await axiosMain.post(`/grade-review`, params)).data;
  },
);

export const doApprove = createAsyncThunk(
  'gradeReview/doApprove',
  async (params: IApproveGradeReviewRequest) => {
    return (await axiosMain.post(`/grade-review/approval`, params)).data;
  },
);

export const doUpdateGradeReview = createAsyncThunk(
  'gradeReview/doUpdateGradeReview',
  async (params: IUpdateGradeReviewRequest) => {
    return (await axiosMain.put(`/grade-review/update`, params)).data;
  },
);

export const doDeleteGradeReview = createAsyncThunk(
  'gradeReview/doDeleteGradeReview',
  async (params: IDeleteGradeReviewRequest) => {
    return (
      await axiosMain.delete(`/grade-review/delete`, {
        data: params,
      })
    ).data;
  },
);

export const doTeacherComment = createAsyncThunk(
  'gradeReview/doTeacherComment',
  async (params: ITeacherCommentRequest) =>
    (await axiosMain.post(`grade-review/teacher-comment`, params)).data,
);

export const doTeacherUpdateComment = createAsyncThunk(
  'gradeReview/doTeacherUpdateComment',
  async (params: ITeacherUpdateCommentRequest) =>
    (await axiosMain.put(`grade-review/teacher-comment/update`, params)).data,
);

export const doTeacherDeleteComment = createAsyncThunk(
  'gradeReview/doTeacherDeleteComment',
  async (params: ITeacherDeleteCommentRequest) => {
    console.log('');

    return (await axiosMain.delete(`grade-review/teacher-comment/delete`, { data: params })).data;
  },
);

export const doStudentComment = createAsyncThunk(
  'gradeReview/doStudentComment',
  async (params: IStudentCommentRequest) =>
    (await axiosMain.post(`grade-review/student-comment`, params)).data,
);

export const doStudentUpdateComment = createAsyncThunk(
  'gradeReview/doStudentUpdateComment',
  async (params: IStudentUpdateCommentRequest) =>
    (await axiosMain.put(`grade-review/student-comment/update`, params)).data,
);

export const doStudentDeleteComment = createAsyncThunk(
  'gradeReview/doStudentDeleteComment',
  async (params: IStudentDeleteCommentRequest) =>
    (await axiosMain.delete(`grade-review/student-comment/delete`, { data: params })).data,
);

export const doGetGradeReview = createAsyncThunk(
  'gradeReview/doGetGradeReview',
  async (params: IGetGradeReviewRequest) => {
    const req = `/grade-review?CourseId=${params.courseId}&GradeId=${
      params.gradeId
    }&gradeReviewId=${params.gradeReviewId}&CurrentUser=${localStorage.getItem(
      'classroom@current_user',
    )}`;
    return (await axiosMain.get(req)).data;
  },
);

// TODO
export const doGetStudentGrade = createAsyncThunk(
  'gradeReview/doGetStudentGrade',
  async (params: IGetStudentGradeRequest) => {
    return (
      await axiosMain.get(
        `/course/${params.courseId}/all-grades/student?currentUser=${params.currentUser}`,
      )
    ).data;
  },
);
