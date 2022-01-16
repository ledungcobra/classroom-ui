import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { PostComment } from '../../components';
import {
  setComment,
  setCurrentCommentId,
  setIsEditing,
  useAppContextApi,
  useAppDispatch,
  useAppSelector,
} from '../../redux';
import { setCurrentClassId } from '../../redux/slices/classContextSlides/classContextSlides';
import { gradeReviewResponse, GradeReviewStatus, response } from './Data';

interface ICommentProps extends IComment {
  handleClickMore: (event: React.MouseEvent<HTMLElement>, id: number) => void;
}

enum CommentState {
  Draft,
  Posted,
}

interface IComment {
  message: string;
  id?: number;
  studentId?: number;
  teacherId?: number;
  username: string;
  gradeReviewId?: number;
  state: CommentState;
}

interface IEditorContext {
  message: string;
  setMessage: (m: string) => void;
}
export const EditorContext = React.createContext<IEditorContext | null>(null);

export const GradeReview = () => {
  const [showPostStatus, setShowPostStatus] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenuMore = Boolean(anchorEl);
  const comment = useAppSelector((state) => state.editorReducer.comment);
  const dispatch = useAppDispatch();

  const { id } = useParams();
  const currentUser = useAppSelector((state) => state.authReducer.currentUser);
  const selectedCommentId = useAppSelector((state) => state.editorReducer.currentCommentId);
  const currentClassId = useAppSelector((state) => state.classReducer.currentClassId);
  const isTeacher = useAppSelector(state=> state.classReducer.isTeacher)
  
  React.useEffect(() => {
    if (selectedCommentId !== null && comment !== '') {
    }
  }, [comment, selectedCommentId]);

  const updateComment = (id: number, data: any) => {
    setComments((old) => {
      const i = old.findIndex((c) => c.id === selectedCommentId);
      if (i < 0) return old;
      return [
        ...old.slice(0, i),
        {
          ...old[i],
          message: comment,
        },
        ...old.slice(i + 1),
      ];
    });
  };

  const [comments, setComments] = React.useState<IComment[]>([
    {
      id: 0,
      username: 'tanhank2k',
      message: 'Hello world',
      state: CommentState.Posted,
    },
  ]);
  const Context = useAppContextApi();
  const navigate = useNavigate();

  if (isNaN(+id!!)) return navigate('/');
  if (currentClassId !== +id!!) {
    dispatch(setCurrentClassId(+id!!));
  }

  const openMenu = (event: React.MouseEvent<HTMLElement>, id: number) => {
    setAnchorEl(event.currentTarget);
    dispatch(setCurrentCommentId(id));
  };

  const handleReviewButtonClicked = (myGradeId: number) => {};
  const handlePostComment = (content: string) => {
    if (selectedCommentId !== null) {
      updateComment(selectedCommentId, { message: content });
      dispatch(setComment(''));
      dispatch(setCurrentCommentId(null));
    } else {
      setComments([
        ...comments,
        { message: content, id: 1, username: currentUser, state: CommentState.Posted },
      ]);
    }
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleDeleteComment = () => {
    setComments((cmts) => cmts.filter((cmt) => cmt.id !== selectedCommentId));
    handleCloseMenu();
    dispatch(setCurrentCommentId(null));
  };

  const handleEditComment = () => {
    if (selectedCommentId === null) {
      Context?.openSnackBar('Có lỗi xẩy ra');
      return;
    }
    const foundCmt = comments.find((cmt) => cmt.id === selectedCommentId);
    dispatch(setComment(foundCmt?.message ?? ''));
    handleCloseMenu();
    dispatch(setIsEditing(true));
  };

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3} sx={{ width: '100%', marginTop: '30px' }}>
        <Grid item md={7} xs={12}>
          <Card sx={{ padding: '15px 10px', overflow: 'auto' }}>
            <CardContent>
              <table className="grade-data-sheet">
                <thead>
                  <tr>
                    <th>Tên bài tập</th>
                    <th>Điểm</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {response?.content?.header?.map((h) => {
                    const gradeData = response.content.score.grades.find((g) => g.id === h.id);
                    return (
                      <tr key={h.id}>
                        <td>{h.name}</td>
                        <td>
                          {gradeData?.grade ?? 0}/<strong>{gradeData?.maxGrade ?? 0}</strong>
                        </td>
                        <td>
                          <Button
                            variant="contained"
                            color="success"
                            sx={{ borderRadius: 0 }}
                            onClick={() => handleReviewButtonClicked(h.id)}
                          >
                            Phúc khảo
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </Grid>
        <Grid
          item
          md={5}
          xs={12}
          sx={{ padding: '0px 5px 0px', maxHeight: '200vh', overflow: 'auto' }}
        >
          <Card sx={{ overflow: 'auto' }}>
            <CardContent>
              {
                <Box display="flex" justifyContent="space-between" sx={{ marginBottom: '20px' }}>
                  <Box display="flex" flexDirection="column" alignItems="flex-start">
                    <p>
                      <strong>Điểm mong muốn </strong>
                      <i style={{ color: 'red' }}>
                        <u>
                          <span
                            style={{
                              borderRadius: '50%',
                            }}
                          >
                            {gradeReviewResponse.content.gradeExpect}
                          </span>
                        </u>
                      </i>
                    </p>
                    <Card sx={{ marginBottom: '20px' }}>
                      <CardContent>
                        <Box display="flex" alignItems="flex-start" flexDirection="column">
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
                              <h5>{gradeReviewResponse.content.mssv}</h5>
                            </Box>
                            {isTeacher &&
                              gradeReviewResponse.content.status === GradeReviewStatus.Pending && (
                                <Box
                                  display="flex"
                                  gap="5px"
                                  alignItems="center"
                                  alignSelf="flex-start"
                                  sx={{ maxHeight: '5px' }}
                                >
                                  <Button
                                    variant="outlined"
                                    sx={{ borderRadius: '0' }}
                                    color="success"
                                  >
                                    Chấp nhận
                                  </Button>
                                  <Button
                                    variant="outlined"
                                    sx={{ borderRadius: '0' }}
                                    color="error"
                                  >
                                    Từ chối
                                  </Button>
                                </Box>
                              )}

                            {gradeReviewResponse.content.status === GradeReviewStatus.Approve ? (
                              <CheckCircleIcon sx={{ color: 'green' }} />
                            ) : (
                              <ThumbDownIcon sx={{ color: 'red' }} />
                            )}
                          </Box>
                          <div>
                            <p style={{ textAlign: 'left' }}>
                              {gradeReviewResponse.content.message}
                            </p>
                          </div>
                        </Box>
                      </CardContent>
                    </Card>
                    {comments.map((cmt) => {
                      return (
                        <CommentItem
                          key={cmt.id}
                          handleClickMore={(event) => openMenu(event, cmt.id!!)}
                          username={cmt.username}
                          message={cmt.message}
                          state={cmt.state}
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
    </Container>
  );
};

const CommentItem: React.FC<ICommentProps> = (props) => {
  return (
    <Card sx={{ width: '100%', marginBottom: '8px' }}>
      <CardContent>
        <Box display="flex" flexDirection="column" alignItems="flex-start">
          <Box display="flex" justifyContent="space-between" sx={{ width: '100%' }}>
            <Box display="flex" alignItems="center" gap="10px" sx={{ marginBottom: '10px' }}>
              <Avatar />
              <Divider orientation="vertical" sx={{ height: '100%' }} />
              <h5>{props.username}</h5>
            </Box>
            <IconButton onClick={(event) => props.handleClickMore(event, props.id!!)}>
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>
        <Divider sx={{ borderBottom: '10px', width: '100%' }} />
        <div style={{ textAlign: 'left' }}>
          <span
            dangerouslySetInnerHTML={{
              __html: props.message,
            }}
          />
          {props.state === CommentState.Draft && <DriveFileRenameOutlineIcon />}
        </div>
      </CardContent>
    </Card>
  );
};
