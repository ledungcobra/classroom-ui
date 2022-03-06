// @ts-nocheck
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  TextField,
} from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { batch } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router';
import { PostComment } from '../../components';
import { GradeReviewStatus } from '../../constants';
import {
  setComment,
  setCurrentCommentId,
  setIsEditing,
  useAppContextApi,
  useAppDispatch,
  useAppSelector,
} from '../../redux';
import { doGetClassDetail } from '../../redux/asyncThunk/classAction';
import {
  doApprove,
  doCreateGradeReview,
  doGetGradeReview,
  doGetGradeReviewComments,
  doGetStudentGrade,
  doStudentComment,
  doStudentDeleteComment,
  doStudentUpdateComment,
  doTeacherComment,
  doTeacherDeleteComment,
  doTeacherUpdateComment,
  doUpdateGradeReview,
} from '../../redux/asyncThunk/gradeReviewAction';
import { setCurrentClassId } from '../../redux/slices/classContextSlides/classContextSlides';
import {
  Approve,
  DeleteComment,
  doAddNewComment,
  setError,
  UpdateComment,
} from '../../redux/slices/gradeReviewSlices/gradeReviewSlice';
import { parseParams } from '../../utils';
import { useSocket } from '../../utils/socketHook';
import { CommentItem, CommentState } from './CommentItem';

export const GradeReview = () => {
  const [showPostStatus, setShowPostStatus] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenuMore = Boolean(anchorEl);
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const selectedCommentId = useAppSelector((state) => state.editorReducer.currentCommentId);
  const currentClassId = useAppSelector((state) => state.classReducer.currentClassId);
  const gradeReviewState = useAppSelector((state) => state.gradeReviewReducer);
  const currentUserKey = 'classroom@current_user';
  const isTeacher = useAppSelector((state) => state.classReducer.isTeacher);
  const [selectedGradeId, setSelectedGradeId] = React.useState<number | null>(null);
  const [open, setOpen] = React.useState(false);
  const [selectedGrade, setSelectedGrade] = React.useState<IGrade | null | undefined>(null);
  const [inputExpectScore, setInputExpectScore] = React.useState<number | null>(null);
  const [inputReason, setInputReason] = React.useState<string | null>('');
  const query = parseParams(useLocation().search);
  const [editingGradeReview, setEditingGradeReview] = React.useState(false);
  const lastMessage = useSocket('Messages', process.env.REACT_APP_WEB_SOCKET_MESSAGES);

  React.useEffect(() => {
    const gradeId = query.gradeId;
    const gradeReviewId = query.gradeReviewId;

    if (gradeId && gradeReviewId) {
      batch(() => {
        setSelectedGradeId(gradeId);
        dispatch(
          doGetClassDetail({
            classId: +id!!,
            currentUser: localStorage.getItem(currentUserKey) ?? '',
          }),
        );
        dispatch(
          doGetGradeReview({
            courseId: +id!!,
            gradeId: +gradeId!!,
            gradeReviewId: +gradeReviewId!!,
          }),
        );
        dispatch(
          doGetGradeReviewComments({
            CourseId: +id!!,
            CurrentUser: localStorage.getItem(currentUserKey) ?? '',
            GradeId: gradeId!!,
            GradeReviewId: gradeReviewId!!,
          }),
        );
      });
    } else {
      batch(() => {
        dispatch(
          doGetStudentGrade({
            courseId: +id!!,
            currentUser: localStorage.getItem(currentUserKey) ?? '',
          }),
        );
        dispatch(
          doGetClassDetail({
            classId: +id!!,
            currentUser: localStorage.getItem(currentUserKey) ?? '',
          }),
        );
      });
    }
  }, []);

  // React.useEffect(() => {
  //   handleConnect();
  //   const disconnect = () => {
  //     if (client.current) {
  //       client.current.publish({
  //         destination: '/Messages',
  //         body: JSON.stringify({
  //           channel: 'DISCONNECT',
  //           data: {
  //             username: localStorage.getItem(currentUserKey),
  //           },
  //         } as IMessage<string>),
  //       });
  //       client.current.deactivate();
  //     }
  //   };
  //   window.addEventListener('beforeunload', disconnect);
  //   return () => {
  //     window.removeEventListener('beforeunload', disconnect);
  //   };
  // }, []);

  React.useEffect(() => {
    if (lastMessage === '') return;

    const msg = JSON.parse(lastMessage) as IMessage<ICommonResponse<any>>;

    switch (msg.channel) {
      case 'SUCCESS':
        break;
      case 'ADD_COMMENT':
        const comment = msg.data as IGradeReviewComment;
        if (comment.gradeReviewId !== gradeReviewState?.gradeReview?.id) {
          return;
        }
        dispatch(doAddNewComment(comment));
        break;
      case 'UPDATE_COMMENT':
        const data = msg.data as ICommonResponse<IGradeReviewComment>;
        dispatch(UpdateComment(data));
        break;
      case 'DELETE_COMMENT':
        {
          const data = msg.data as ICommonResponse<number>;
          dispatch(DeleteComment(data));
        }
        break;
      case 'APPROVAL':
        {
          let data = msg.data as ICommonResponse<ApproveResponse | string>;
          dispatch(Approve(data));
        }
        break;
      case 'ERROR':
        window.alert('Error');
    }
  }, [lastMessage]);

  // const handleConnect = () => {
  //   if (isConnecting) return;
  //   if (client.current) {
  //     client.current.unsubscribe('/user/Messages');
  //   }
  //   client.current = new Client({
  //     brokerURL: process.env.REACT_APP_WEB_SOCKET_MESSAGES,
  //     reconnectDelay: 5000,
  //     heartbeatIncoming: 4000,
  //     heartbeatOutgoing: 4000,
  //     onConnect: (frame) => {
  //       client.current.publish({
  //         destination: '/Messages',
  //         body: JSON.stringify({
  //           channel: 'JOIN',
  //           data: {
  //             username: localStorage.getItem(currentUserKey),
  //             sender: localStorage.getItem('user_id') ?? (0 as number),
  //           },
  //         } as IMessage<string>),
  //       });

  //       client.current?.subscribe('/user/Messages', (message) => {
  //         setLastMessage(message.body);
  //       });
  //       setConnecting(false);
  //     },
  //     debug: console.log,
  //     onStompError: console.error,
  //   });
  //   client.current.activate();
  //   setConnecting(true);
  // };

  const Context = useAppContextApi();
  React.useEffect(() => {
    if (gradeReviewState.isLoading) {
      Context?.showLoading();
    } else {
      Context?.hideLoading();
    }

    if (gradeReviewState.error) {
      Context?.openSnackBarError(gradeReviewState.errorMessage);
      dispatch(setError(false));
    }
  }, [gradeReviewState.isLoading, gradeReviewState.error]);

  const navigate = useNavigate();

  if (isNaN(+id!!)) return navigate('/');
  if (currentClassId !== +id!!) {
    dispatch(setCurrentClassId(+id!!));
  }

  const openMenu = (event: React.MouseEvent<HTMLElement>, id: number) => {
    setAnchorEl(event.currentTarget);
    dispatch(setCurrentCommentId(id));
  };

  const handleReviewButtonClicked = (
    courseId: number,
    gradeId?: number,
    gradeReviewId?: number,
  ) => {
    setSelectedGrade(
      gradeReviewState.studentGrade?.scores.grades.find((g) => g.gradeId === gradeId),
    );

    if (gradeReviewId === 0) {
      setOpen(true);
      setInputExpectScore(null);
      setInputReason(null);
    } else {
      setSelectedGradeId(gradeId ?? null);

      batch(() => {
        dispatch(
          doGetGradeReview({
            courseId: courseId,
            gradeId: gradeId!!,
            gradeReviewId: gradeReviewId!!,
          }),
        );
        dispatch(
          doGetGradeReviewComments({
            CourseId: courseId,
            CurrentUser: localStorage.getItem(currentUserKey) ?? '',
            GradeId: gradeId!!,
            GradeReviewId: gradeReviewId!!,
          }),
        );
      });
    }
  };

  const handleSubmitPostGradeReview = (gradeExpect: number, reason: string) => {
    if (gradeExpect > (selectedGrade?.maxGrade ?? 0) || gradeExpect < 0) {
      Context?.openSnackBarError(
        'Điểm mong muốn phải nằm trong khoảng ' + 0 + ' đến ' + selectedGrade?.maxGrade,
      );
      return;
    }

    if (reason === null || reason === '') {
      Context?.openSnackBarError('Lý do không được để trống');
      return;
    }
    if (selectedGrade) {
      if (editingGradeReview) {
        dispatch(
          doUpdateGradeReview({
            courseId: +id!!,
            gradeExpect: gradeExpect,
            gradeId: selectedGrade.gradeId,
            reason: reason,
            currentUser: localStorage.getItem(currentUserKey) ?? '',
            gradeReviewId: gradeReviewState.gradeReview?.id ?? 0,
          }),
        );
      } else {
        dispatch(
          doCreateGradeReview({
            courseId: +id!!,
            gradeExpect: gradeExpect,
            gradeId: selectedGrade.gradeId,
            reason: reason,
            currentUser: localStorage.getItem(currentUserKey),
          }),
        );
      }
      setEditingGradeReview(false);
      handleCloseDialog();
      setSelectedGrade(null);
      setInputReason(null);
      setInputExpectScore(null);
    } else {
      Context?.openSnackBarError('Có lỗi trong quá trình tạo grade review');
    }
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditingGradeReview(false);
  };
  const handlePostComment = (content: string) => {
    if (selectedGradeId === null) return;

    if (selectedCommentId !== null) {
      const body = {
        courseId: +id!!,
        currentUser: localStorage.getItem(currentUserKey) ?? '',
        gradeId: selectedGradeId!!,
        gradeReviewId: gradeReviewState.gradeReview?.id!!,
        message: content,
        reviewCommentId: selectedCommentId!!,
      };

      if (isTeacher) {
        dispatch(doTeacherUpdateComment(body));
      } else {
        dispatch(doStudentUpdateComment(body));
      }
      dispatch(setComment(''));
      dispatch(setCurrentCommentId(null));
    } else {
      const body = {
        courseId: +id!!,
        currentUser: localStorage.getItem(currentUserKey) ?? '',
        gradeId: selectedGradeId!!,
        teacherId: 0,
        gradeReviewId: gradeReviewState.gradeReview?.id!!,
        message: content,
      };

      if (isTeacher) {
        dispatch(doTeacherComment(body));
      } else {
        dispatch(doStudentComment({ ...body, studentId: 0 }));
      }
    }
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleDeleteComment = () => {
    const comment = gradeReviewState.comments.data.find((c) => c.id === selectedCommentId);

    if (!comment || !selectedGradeId) {
      Context?.openSnackBarError('Có lỗi trong quá trình xoá comment');
      return;
    }

    const params = {
      courseId: +id!!,
      currentUser: localStorage.getItem(currentUserKey) ?? '',
      gradeId: selectedGradeId!!,
      message: comment.message,
      gradeReviewId: comment.gradeReviewId,
      reviewCommentId: comment.id,
    };

    if (isTeacher) {
      dispatch(doTeacherDeleteComment(params));
    } else {
      dispatch(doStudentDeleteComment(params));
    }
    dispatch(setCurrentCommentId(null));
    handleCloseMenu();
  };

  const handleEditComment = () => {
    if (selectedCommentId === null) {
      Context?.openSnackBar('Có lỗi xẩy ra');
      return;
    }
    const comment = gradeReviewState.comments.data.find((c) => c.id === selectedCommentId);
    if (comment) {
      dispatch(setComment(comment.message));
      dispatch(setIsEditing(true));
    } else {
      Context?.openSnackBarError('Có lỗi trong quá trình edit comment');
    }
    handleCloseMenu();
  };

  const calculateAverage = (grades: IGrade[]) => {
    const total = grades.reduce((acc, current) => acc + current.maxGrade, 0);
    grades = grades.map((g) => {
      const gClone = { ...g };

      gClone.gradeScale = +((gClone.maxGrade * 100.0) / total).toFixed(2);
      return gClone;
    });
    return (
      grades.reduce((accum, current) => accum + current.grade * current.gradeScale, 0) / 100.0
    ).toFixed(2);
  };

  const handleApprove = (status: GradeReviewStatus) => {
    dispatch(
      doApprove({
        courseId: +id!!,
        approvalStatus: status,
        gradeId: gradeReviewState.gradeReview?.gradeId!!,
        gradeReviewId: gradeReviewState.gradeReview?.id!!,
        currentUser: localStorage.getItem(currentUserKey) ?? '',
      }),
    );
  };

  const handleEditingGradeReviewClicked = () => {
    setInputExpectScore(gradeReviewState.gradeReview?.gradeExpect ?? 0);
    setInputReason(gradeReviewState.gradeReview?.message ?? '');
    setEditingGradeReview(true);
  };

  return (
    <Container maxWidth={isTeacher ? 'md' : 'xl'} sx={{ marginBottom: '10px' }}>
      <Grid container spacing={3} sx={{ width: '100%', marginTop: '30px' }}>
        <Grid item md={isTeacher ? 12 : 7} xs={12}>
          {!isTeacher && (
            <Card sx={{ padding: '15px 10px', overflow: 'auto' }}>
              <CardContent>
                {gradeReviewState.studentGrade && (
                  <table className="grade-data-sheet">
                    <thead>
                      <tr>
                        <th>Tên bài tập</th>
                        <th>Điểm</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gradeReviewState?.studentGrade?.header?.map((h) => {
                        const gradeData = gradeReviewState?.studentGrade?.scores?.grades.find(
                          (g) => g.id === h.id,
                        );

                        return (
                          <tr key={h.id}>
                            <td>{h.name}</td>
                            <td>
                              {gradeData?.grade ?? 0}/<strong>{h.maxGrade ?? 0}</strong>
                              {!gradeData && ' Chưa có điểm'}
                            </td>
                            <td>
                              {gradeData && (
                                <Button
                                  variant="contained"
                                  color="success"
                                  sx={{ borderRadius: 0 }}
                                  onClick={() =>
                                    handleReviewButtonClicked(
                                      +id!!,
                                      gradeData?.gradeId,
                                      gradeData?.gradeReviewId,
                                    )
                                  }
                                >
                                  Phúc khảo
                                </Button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                      {gradeReviewState?.studentGrade.scores.grades.length ===
                        gradeReviewState?.studentGrade?.header?.length && (
                        <tr>
                          <td>Điểm trung bình</td>
                          <td>{calculateAverage(gradeReviewState?.studentGrade.scores.grades)}</td>
                          <td></td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </CardContent>
            </Card>
          )}
        </Grid>
        <Grid
          item
          md={isTeacher ? 12 : 5}
          xs={12}
          sx={{ padding: '0px 5px 0px', maxHeight: '200vh', overflow: 'auto' }}
        >
          {gradeReviewState?.gradeReview && (
            <Card sx={{ overflow: 'auto' }}>
              <CardContent sx={{ width: '100%' }}>
                {
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    sx={{ marginBottom: '20px', width: '100%' }}
                  >
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="flex-start"
                      sx={{ width: '100%' }}
                    >
                      <Card
                        sx={{
                          width: '100%',
                          marginBottom: '10px',
                        }}
                      >
                        <CardContent sx={{ width: '100%' }}>
                          <Box
                            display="flex"
                            flexDirection="column"
                            sx={{ width: '100%', backgroundColor: 'rgba(green,0.4)' }}
                            alignItems="flex-start"
                          >
                            <Box
                              display="flex"
                              alignItems="center"
                              sx={{ width: '100%' }}
                              justifyContent="space-between"
                            >
                              <p>
                                <strong>Điểm mong muốn </strong>
                                <i style={{ color: 'red' }}>
                                  <u>
                                    <span
                                      style={{
                                        borderRadius: '50%',
                                      }}
                                    >
                                      {gradeReviewState?.gradeReview?.gradeExpect}
                                    </span>
                                  </u>
                                </i>
                              </p>
                              {!isTeacher &&
                                gradeReviewState.gradeReview.status ===
                                  GradeReviewStatus.Pending && (
                                  <Box display="flex" flexDirection="column">
                                    <IconButton onClick={handleEditingGradeReviewClicked}>
                                      <EditIcon />
                                    </IconButton>
                                  </Box>
                                )}
                            </Box>
                            <p>
                              <strong>Môn </strong>
                              <i style={{ color: 'red' }}>
                                <u>
                                  <span
                                    style={{
                                      borderRadius: '50%',
                                    }}
                                  >
                                    {gradeReviewState?.gradeReview?.exerciseName}
                                  </span>
                                </u>
                              </i>
                            </p>

                            <p>
                              <strong>Điểm hiện tại </strong>
                              <i>
                                <u>
                                  <span
                                    style={{
                                      borderRadius: '50%',
                                    }}
                                  >
                                    {gradeReviewState?.gradeReview?.grade?.grade}/
                                    {gradeReviewState?.gradeReview?.grade?.maxGrade}
                                  </span>
                                </u>
                              </i>
                            </p>
                          </Box>
                        </CardContent>
                      </Card>
                      <Card sx={{ marginBottom: '20px', width: '100%' }}>
                        <CardContent sx={{ width: '100%' }}>
                          <Box
                            display="flex"
                            alignItems="flex-start"
                            flexDirection="column"
                            sx={{ width: '100%' }}
                          >
                            <Box
                              display="flex"
                              alignItems="center"
                              justifyContent="space-between"
                              gap="8px"
                              sx={{ width: '100%' }}
                            >
                              <Box
                                display="flex"
                                alignItems="center"
                                gap="8px"
                                sx={{ width: '100%' }}
                              >
                                <Avatar />
                                <Divider orientation="vertical" sx={{ height: '100%' }} />
                                <h5>{gradeReviewState?.gradeReview?.student.fullName}</h5>
                              </Box>
                              <Box display="flex" alignItems="center" gap="10px">
                                {isTeacher && (
                                  <Box
                                    display="flex"
                                    gap="5px"
                                    alignItems="center"
                                    sx={{ marginTop: '5px' }}
                                  >
                                    <Button
                                      variant="outlined"
                                      sx={{ borderRadius: '0' }}
                                      color="success"
                                      onClick={() => {
                                        handleApprove(GradeReviewStatus.Approve);
                                      }}
                                    >
                                      Chấp nhận
                                    </Button>
                                    <Button
                                      variant="outlined"
                                      sx={{ borderRadius: '0' }}
                                      color="error"
                                      onClick={() => handleApprove(GradeReviewStatus.Reject)}
                                    >
                                      Từ chối
                                    </Button>
                                  </Box>
                                )}

                                <Box>
                                  {gradeReviewState?.gradeReview?.status ===
                                  GradeReviewStatus.Approve ? (
                                    <CheckCircleIcon sx={{ color: 'green' }} />
                                  ) : gradeReviewState?.gradeReview?.status ===
                                    GradeReviewStatus.Pending ? (
                                    <PendingActionsIcon sx={{ color: 'green' }} />
                                  ) : gradeReviewState?.gradeReview.status ===
                                    GradeReviewStatus.Reject ? (
                                    <ThumbDownIcon sx={{ color: 'red' }} />
                                  ) : (
                                    gradeReviewState?.gradeReview?.status ===
                                      GradeReviewStatus.None && null
                                  )}
                                </Box>
                              </Box>
                            </Box>

                            <div>
                              <p style={{ textAlign: 'left' }}>
                                {gradeReviewState?.gradeReview?.message}
                              </p>
                            </div>
                          </Box>
                        </CardContent>
                      </Card>

                      {gradeReviewState?.comments?.data?.map((cmt) => {
                        return (
                          <CommentItem
                            key={cmt.id}
                            handleClickMore={(event) => openMenu(event, cmt.id!!)}
                            state={CommentState.Posted}
                            {...cmt}
                          />
                        );
                      })}
                    </Box>
                  </Box>
                }

                <PostComment
                  onCancel={() => setShowPostStatus(false)}
                  onPost={(content) => {
                    handlePostComment(content);
                  }}
                />
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      <Menu
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={openMenuMore}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={handleEditComment}>
          <EditIcon sx={{ color: 'green' }} />
        </MenuItem>
        <MenuItem sx={{ color: 'red' }} onClick={handleDeleteComment}>
          <DeleteIcon />
        </MenuItem>
      </Menu>
      <Dialog open={open || editingGradeReview} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>Nhập điểm phúc khảo</DialogTitle>
        <DialogContent sx={{ minWidth: '100%' }}>
          <TextField
            fullWidth
            type="number"
            placeholder="Nhập vào điểm muốn phúc khảo"
            inputProps={{
              min: 0,
              max: selectedGrade?.maxGrade,
            }}
            error={
              (inputExpectScore ?? 0) < 0 ||
              (inputExpectScore ?? 0) > (selectedGrade?.maxGrade ?? 0)
            }
            value={inputExpectScore}
            onChange={(e) => setInputExpectScore(parseFloat(e.target.value))}
            sx={{ marginBottom: '10px' }}
          />
          <TextField
            fullWidth
            type="text"
            placeholder="Lý do"
            value={inputReason}
            onChange={(e) => setInputReason(e.target.value)}
            sx={{ marginBottom: '10px' }}
          />
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={() => handleSubmitPostGradeReview(inputExpectScore!!, inputReason ?? '')}
            >
              {editingGradeReview ? 'Cập nhật' : 'Gửi'}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
};
