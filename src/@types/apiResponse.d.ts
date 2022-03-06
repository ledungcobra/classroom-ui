interface IResLogin {
  _id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  token: string;
  id: number;
  timeExpired: string;
  refreshToken: string;
  refreshTokenTimeExpired: string;
}

interface IResGetListClasses {
  id: string;
  name: string;
  title: string;
  description: string;
  classBackground: any;
  section: string;
  room: string;
  owner: string;
  iconColor: string;
  createUsername: string;
}

interface IResClassDetailData {
  className: string;
  classCode: string;
  classDeadline: IResClassDeadline[];
  classStatus: IResClassStatus[];
  infor: IResClassInfo;
}

interface IResClassInfo {
  id: number;
  classCode: string;
  theme: string;
  // room: string;
  className: string;
}
interface IResClassDeadline {
  id: number;
  name: string;
  day: string;
  hour: string;
}

interface IResClassStatus {
  authorName: string;
  time: string;
  status: string;
  comments: IResClassStatusComment[];
}

interface IResClassStatusComment {
  author: string;
  content: string;
  time: string;
}

type Role = 'ROLE_STUDENT' | 'ROLE_TEACHER';
interface IUser {
  id: number;
  username: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: Role;
  profileImageUrl: string | undefined | null;
  studentID: string;
}

type TStatus = 'INVITED' | 'JOINED';

interface IResMember extends IUser {
  status?: 'INVITED';
}
interface IResMembers {
  students: IResMember[];
  teachers: IResMember[];
  owner: string;
}

interface IUserProfileInfo {
  phoneNumber: string;
  firstName: string;
  middleName: string;
  lastName: string;
  personalEmail: string;
  studentId?: string;
  personalPhoneNumber?: string;
}

interface IErrorResponse {
  status: number;
  result: number;
  message: string;
  content: string;
}

interface IClassDetailRes {
  data?: IResClassDetailData;
  error?: IErrorResponse;
}

interface IUserInfoData {
  id: number;
  username: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: number;
  email: string;
  profileImageUrl: string | null | undefined;
  personalEmail: string;
  studentID: string | null | undefined;
  phoneNumber: string;
  personalPhoneNumber: string;
  userStatus: number;
}
interface IUserInfo {
  status: number;
  result: number;
  message: string;
  content: IUserInfoData | any;
}

interface IResClassAssignment {
  id: number;
  courseId: number;
  name: string;
  description: string;
  maxGrade: number;
  order: number;
}

interface ICommonResponse<T> {
  status: number;
  result: number;
  message: string | null;
  content: T;
}
interface IGradeReviewContent {
  id: number;
  gradeExpect: number;
  message: string;
  studentId: number;
  gradeId: number;
  mssv: string;
  status: GradeReviewStatus;
  student: IStudent;
  grade: IGrade;
  exerciseName: string;
}

interface IStudent {
  id: number;
  studentID: string | null;
  fullName: string | null;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  dateOfBird: string;
  userId: number;
  phone: string | null;
}

interface IHeaderExercise {
  id: number;
  name: string;
  maxGrade: number;
  gradeScale: number;
}

interface IStudentScore {
  id: number;
  mssv: string;
  name: string;
  grades: IGrade[];
}

interface IGrade {
  id: number;
  gradeId: number;
  grade: number;
  maxGrade: number;
  gradeReviewId: number;
  gradeScale: number;
}

interface IStudentGradeContent {
  header: IHeaderExercise[];
  scores: IStudentScore;
  total: number;
}

interface IGradeReviewCommentContent {
  hasMore: boolean;
  total: number;
  data: IGradeReviewComment[];
}

interface IGradeReviewComment {
  id: number;
  message: string;
  studentId: number;
  teacherId: number;
  gradeReviewId: number;
  student: IUserCommentInfo | null;
  teacher: IUserCommentInfo | null;
}

interface IUserCommentInfo {
  id: number;
  username: string;
  fullName: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: number;
  email: string;
  profileImageUrl: string | null;
  personalEmail: string;
  studentID: string;
  phoneNumber: string;
  personalPhoneNumber: string;
  userStatus: number;
}

interface INotificationContent {
  total: number;
  hasMore: boolean;
  data: INotifications | null;
}

interface INotifications {
  amountUnseen: number;
  notifications: INotification[];
}

enum ETypeNotification {
  STUDENT = 1,
  TEACHER = 2,
}
interface INotification {
  id: number;
  userId: number;
  isSeen: boolean;
  senderName: string;
  typeNotification: ETypeNotification;
  message: string;
  createBy: string;
  createOn: string;
  updateBy: string;
  updateOn: string;
  gradeReviewId?: number;
  courseId?: number;
  gradeId?: number;
  gradeReviewId?: number;
}

interface ApproveResponse {
  gradeReviewId: number;
  status: GradeReviewStatus;
}

interface IMessageResponse<T> {
  channel: string;
  data: Map<string, T>;
}
