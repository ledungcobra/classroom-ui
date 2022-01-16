export enum GradeReviewStatus {
  None = 0,
  Pending = 1,
  Approve = 2,
  Reject = 3,
}
export const response = {
  status: 200,
  result: 1,
  message: 'Get grade review success',
  content: {
    header: [
      {
        id: 1,
        name: 'Bài tập tuần 1 đã sửa',
        maxGrade: 10000,
        gradeScale: 0.3,
      },
      {
        id: 2,
        name: 'Bài tập tuần 2 đã sửa',
        maxGrade: 110,
        gradeScale: 0.3,
      },
      {
        id: 3,
        name: 'Bài tập tuần 3',
        maxGrade: 100,
        gradeScale: 0,
      },
      {
        id: 5,
        name: 'Bài 4',
        maxGrade: 1000,
        gradeScale: 0,
      },
    ],
    score: {
      id: 1,
      mssv: '1',
      name: 'Bùi Tấn Hạnh',
      grades: [
        {
          id: 1,
          grade: 1,
          maxGrade: 10000,
          gradeReviewed: false,
        },
        {
          id: 2,
          grade: 1,
          maxGrade: 110,
          gradeReviewed: false,
        },
        {
          id: 3,
          grade: 30,
          maxGrade: 100,
          gradeReviewed: false,
        },
        {
          id: 5,
          grade: 110,
          maxGrade: 1000,
          gradeReviewed: false,
        },
      ],
    },
  },
};

export const gradeReviewResponse = {
  status: 200,
  result: 1,
  content: {
    id: 0,
    gradeExpect: 10,
    message: 'Điểm kia hơi thấp ạ thầy cho xin ít điểm để em qua môn rồi ra trường ạ',
    studentId: 1,
    gradeId: 1,
    mssv: 18120331,
    status: GradeReviewStatus.Approve,
  },
  message: 'Create new comment review sucessfull',
};
