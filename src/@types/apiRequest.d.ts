interface IParamLogin {
  username: string;
  password: string;
}

interface IParamSignup {
  username: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

interface IParamRefreshToken {
  refreshToken: string;
}

interface IParamGetListClasses {
  title: string;
  currentUser?: string;
  startAt: number;
  maxResults: number;
  sortColumn: string;
}
interface IParamCreateClasses {
  className: string;
  section: string;
  room: string;
  title: string;
  subject: string;
  room: string;
  currentUser?: string;
}

interface IUserProfileInfo {
  phoneNumber: string;
  firstName: string;
  middleName: string;
  lastName: string;
  personalEmail: string;
  personalPhoneNumber?: string;
  studentID?: string;
  disabledStudentId?: boolean;
}

interface IParamChangePassword {
  oldPassword?: string;
  newPassword?: string;
  rePassword?: string;
}

interface IParamGetClassDetail {
  classId: number;
  currentUser?: string;
}

interface IParamGetMemberClass {
  classId: number;
}

interface IParamInviteMemberClassClient {
  personReceives: string[];
  courseId: number;
  classCode: string;
  role: number;
}

interface IParamInviteMemberClass {
  mailPersonReceive: string;
  courseId: number;
  classCode: string;
  role: number;
}

interface IParamAddStudent {
  token: string;
  role: number;
  currentUser?: string;
  invitee: string;
}

interface IParamGetClassAssignment {
  courseId: number;
  currentUser?: string;
  SortColumn: '+Order' | '-Order';
}

interface IParamAddClassAssignment {
  courseId: number;
  name: string;
  description: string;
  maxGrade: number;
  currentUser?: string;
}

interface IParamUpdateClassAssignment {
  courseId: number;
  assignmentsId: number;
  name: string;
  description: string;
  maxGrade: number;
  currentUser?: string;
}

interface IParamDeleteClassAssignment {
  courseId: number;
  assignmentsId: number;
  currentUser?: string;
}

interface IGetGradeReviewCommentsRequest {
  CourseId: number;
  GradeId: number;
  CurrentUser: string;
  GradeReviewId: number;
}

interface ICreateGradeReviewRequest {
  courseId: number;
  gradeId: number;
  gradeExpect: number;
  reason: string;
  currentUser?: string | null;
}

interface IApproveGradeReviewRequest {
  courseId: number;
  gradeId: number;
  gradeReviewId: number;
  approvalStatus: GradeReviewStatus;
  currentUser?: string;
}

interface IUpdateGradeReviewRequest {
  courseId: number;
  gradeId: number;
  gradeReviewId: number;
  gradeExpect: number;
  reason: string;
  currentUser?: string;
}

interface IDeleteGradeReviewRequest {
  courseId: number;
  gradeId: number;
  gradeReviewId: number;
  currentUser?: string;
}

interface ITeacherCommentRequest {
  message: string;
  courseId: number;
  gradeId: number;
  gradeReviewId: number;
  currentUser?: string;
  teacherId: number;
}

interface ITeacherUpdateCommentRequest {
  courseId: number;
  gradeId: number;
  gradeReviewId: number;
  reviewCommentId: number;
  message: string;
  currentUser?: string;
}

interface ITeacherDeleteCommentRequest {
  courseId: number;
  gradeId: number;
  gradeReviewId: number;
  reviewCommentId: number;
  message: string;
  currentUser?: string;
}

interface IStudentCommentRequest {
  message: string;
  courseId: number;
  gradeId: number;
  gradeReviewId: number;
  currentUser?: string;
  studentId: number;
}

interface IStudentUpdateCommentRequest {
  courseId: number;
  gradeId: number;
  gradeReviewId: number;
  reviewCommentId: number;
  message: string;
  currentUser?: string;
}

interface IStudentDeleteCommentRequest {
  courseId: number;
  gradeId: number;
  gradeReviewId: number;
  reviewCommentId: number;
  message: string;
  currentUser?: string;
}

interface IGetGradeReviewRequest {
  courseId: number;
  gradeId: number;
  gradeReviewId: number;
}

interface IGetStudentGradeRequest {
  courseId: number | null;
  currentUser?: string | null;
}

interface IUpdateMarkSeenNotificationRequest {
  id: number;
  currentUser: string | null;
}

interface INotificationRequest {
  currentUser: string | null;
  StartAt: number;
  MaxResults: number;
}
