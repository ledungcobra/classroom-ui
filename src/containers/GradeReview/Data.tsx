export enum GradeReviewStatus {
  None = 0,
  Pending = 1,
  Approve = 2,
  Reject = 3,
}
// export const response: ICommonResponse<IStudentGradeContent> = {
//   status: 200,
//   result: 1,
//   message: 'Get grade review success',
//   content: {
//     header: [
//       {
//         id: 1,
//         name: 'Bài tập tuần 1 đã sửa',
//         maxGrade: 10000,
//         gradeScale: 0.3,
//       },
//       {
//         id: 2,
//         name: 'Bài tập tuần 2 đã sửa',
//         maxGrade: 110,
//         gradeScale: 0.3,
//       },
//       {
//         id: 3,
//         name: 'Bài tập tuần 3',
//         maxGrade: 100,
//         gradeScale: 0,
//       },
//       {
//         id: 5,
//         name: 'Bài 4',
//         maxGrade: 1000,
//         gradeScale: 0,
//       },
//     ],
//     scores: {
//       id: 1,
//       mssv: '1',
//       name: 'Bùi Tấn Hạnh',
//       grades: [
//         {
//           id: 1,
//           gradeId: 1,
//           grade: 1,
//           maxGrade: 10000,
//           gradeReviewId: 2,
//         },
//         {
//           id: 2,
//           gradeId: 1,
//           grade: 1,
//           maxGrade: 110,
//           gradeReviewId: 2,
//         },
//         {
//           id: 3,
//           grade: 30,
//           gradeId: 1,
//           maxGrade: 100,
//           gradeReviewId: 3,
//         },
//       ],
//     },
//   },
// };

// export const gradeReviewResponse: ICommonResponse<IGradeReviewContent> = {
//   status: 200,
//   result: 1,
//   content: {
//     id: 0,
//     gradeExpect: 10,
//     message: 'Điểm kia hơi thấp ạ thầy cho xin ít điểm để em qua môn rồi ra trường ạ',
//     studentId: 1,
//     gradeId: 1,
//     mssv: '18120331',
//     status: GradeReviewStatus.Approve,
//     student: {
//       id: 1,
//       studentID: '1',
//       fullName: 'Bùi Tấn Hạnh',
//       firstName: null,
//       middleName: null,
//       lastName: null,
//       dateOfBird: '0001-01-01T00:00:00',
//       userId: 0,
//       phone: null,
//     },
//   },
//   message: 'Create new comment review sucessfull',
// };
