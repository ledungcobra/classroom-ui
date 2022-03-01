import ContentCopyOutlinedIcon from '@mui/icons-material/ControlCameraOutlined';
import InfoIcon from '@mui/icons-material/Info';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Avatar, Card, CardContent, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Box } from '@mui/system';
import copy from 'copy-to-clipboard';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IExercise } from '..';
import { BOX_SHADOW_STYLE, DEFAULT_USER_AVATAR, GREEN_COLOR, SUB_COLOR } from '../../constants';
// import { classList, detailData } from '../../constants/dumydata';
import { useAppContextApi, useAppDispatch, useAppSelector } from '../../redux';
import {
  setCurrentClassId,
  setIsTeacher,
} from '../../redux/slices/classContextSlides/classContextSlides';
import { apiClass } from '../../services/apis/apiClass';
import { convertClassDetailResponse, generateReferenceLink } from '../../utils';
import './ClassDetail.scss';
enum TypeMoreButton {
  ClassCode,
  Comment,
  Status,
  None,
}

interface MoreButtonEventData {
  type: TypeMoreButton;
  data?: any;
}

export const ClassDetail = () => {
  const Context = useAppContextApi();

  const exercisesList = useFetchExercises();
  if (exercisesList && exercisesList.length > 0) {
    console.log(exercisesList);
  }
  const classDetailData = useFetchClassDetail();
  const [infoClicked, setInfoClicked] = useState<boolean>(false);
  const [moreButtonEventData, setMoreButtonEventData] = useState<MoreButtonEventData>({
    type: TypeMoreButton.None,
  });

  // Menu more
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenuMore = Boolean(anchorEl);

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const openMenu = (event: React.MouseEvent<HTMLElement>, type: TypeMoreButton, data?: any) => {
    setAnchorEl(event.currentTarget);
    setMoreButtonEventData({ type, data });
  };

  return (
    <>
      {classDetailData && (
        <div className="classDetail-container">
          <div className="classDetail">
            {/* Top */}
            <Card
              className="classDetail__top"
              variant="outlined"
              sx={{ borderRadius: infoClicked ? '10px 10px 0px 0px' : '10px' }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  height: '100%',
                }}
              >
                <h3>{classDetailData.className}</h3>
                <div className="classDetail__top__classDetailBtn">
                  <IconButton
                    onClick={() => {
                      setInfoClicked((prev) => !prev);
                    }}
                  >
                    {infoClicked ? (
                      <InfoIcon
                        className="classDetail__top__classDetailBtn__icon"
                        fontSize="large"
                      />
                    ) : (
                      <InfoOutlinedIcon
                        fontSize="large"
                        className="classDetail__top__classDetailBtn__icon"
                      />
                    )}
                  </IconButton>
                </div>
              </Box>
            </Card>
            {/* Class Info */}
            {infoClicked && (
              <Card className="classDetail__infor" sx={{ width: '100%', padding: '10px 10px' }}>
                <CardContent sx={{ alignItems: 'flex-start' }}>
                  <Box
                    sx={{ display: 'flex ', gap: '20px', alignItems: 'center', marginBottom: '0' }}
                  >
                    <h4>Mã lớp: {classDetailData.infor.classCode}</h4>
                    <IconButton
                      onClick={() => {
                        handleCopy(Context?.openSnackBar, classDetailData.classCode);
                      }}
                    >
                      <ContentCopyOutlinedIcon
                        sx={{ color: 'black', width: '25px', height: '25px' }}
                      />
                    </IconButton>
                  </Box>
                  <Box
                    sx={{ display: 'flex ', gap: '10px', alignItems: 'center', marginBottom: '0' }}
                  >
                    <h4>Chủ đề: {classDetailData.infor.theme}</h4>
                  </Box>
                </CardContent>
              </Card>
            )}

            <Grid
              className="classDetail__body"
              container
              spacing={2}
              sx={{ width: '100%', marginTop: '10px' }}
            >
              {/* Left Part */}
              <Grid
                item
                xs={12}
                md={3}
                className="classDetail__body__leftPart"
                sx={{ justifyContent: 'space-between' }}
              >
                <div className="classDetail__body__leftPart__top">
                  <Card variant="outlined" sx={{ borderRadius: '7px' }}>
                    <Grid
                      container
                      sx={{
                        width: '100%',
                        justifyContent: 'space-between',
                        marginTop: '20px',
                        padding: '0 15px 5px',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="h6" color="black" fontWeight="bold" textAlign="left">
                        Mã lớp
                      </Typography>
                      <IconButton
                        aria-label="settings"
                        aria-haspopup="true"
                        onClick={(e) => openMenu(e, TypeMoreButton.ClassCode)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Grid>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography
                          variant="h6"
                          fontWeight="600"
                          color={GREEN_COLOR}
                          sx={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '90%',
                          }}
                        >
                          {classDetailData.classCode}{' '}
                        </Typography>
                        <IconButton
                          onClick={() => {
                            handleCopy(Context?.openSnackBar, classDetailData.classCode);
                          }}
                        >
                          <ContentCopyOutlinedIcon />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </div>
              </Grid>
              {/* Right Part */}
              <Grid item xs={12} md={9} className="classDetail__body__rightPart">
                <div className="classDetail__body__rightPart__up-status-section">
                  <Card variant="outlined" sx={BOX_SHADOW_STYLE}>
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={3}>
                        <Avatar alt="status-avatar" src={DEFAULT_USER_AVATAR} />
                        <Typography variant="h6" color={SUB_COLOR} className="status-text">
                          {exercisesList && exercisesList.length > 0
                            ? 'Cấu trúc điểm'
                            : 'Chưa có cấu trúc điểm'}
                        </Typography>
                      </Box>
                      {exercisesList && exercisesList.length > 0 && (
                        <table className="grade-data-sheet">
                          <thead>
                            <tr>
                              <th>Tên bài tập</th>
                              <th>Điểm tối đa</th>
                              <th>Phần trăm</th>
                            </tr>
                          </thead>
                          <tbody>
                            {exercisesList.map((e, index) => {
                              return (
                                <tr>
                                  <td>{e.name}</td>
                                  <td>{e.maxGrade}</td>
                                  <td>{e.gradeScale}%</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      )}
                    </CardContent>
                  </Card>
                </div>
                <div className="classDetail__body__rightPart__statuses"></div>
              </Grid>
            </Grid>

            {/* Menu section */}
            <Menu
              aria-labelledby="demo-positioned-button"
              anchorEl={anchorEl}
              open={openMenuMore && moreButtonEventData.type === TypeMoreButton.ClassCode}
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
              <MenuItem
                onClick={() => {
                  handleCopy(
                    Context?.openSnackBar,
                    generateReferenceLink(classDetailData.classCode, 2),
                  );
                }}
              >
                Sao chép đường liên kết mời thành viên
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleCopy(Context?.openSnackBar, classDetailData.classCode);
                }}
              >
                Sao chép mã lớp
              </MenuItem>

              <MenuItem onClick={handleCloseMenu}>Tắt</MenuItem>
            </Menu>

            {/* Menu status*/}
            <Menu
              aria-labelledby="demo-positioned-button"
              anchorEl={anchorEl}
              open={openMenuMore && moreButtonEventData.type === TypeMoreButton.Status}
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
              <MenuItem>Chuyển lên đầu</MenuItem>
              <MenuItem>Chinh sửa</MenuItem>
              <MenuItem>Xoá</MenuItem>
              <MenuItem
                onClick={() => {
                  handleCopy(
                    Context?.openSnackBar,
                    generateReferenceLink(classDetailData.classCode ?? '', 2),
                  );
                }}
              >
                Sao chép đường dẫn liên kết
              </MenuItem>
            </Menu>

            {/* Menu comment*/}
            <Menu
              aria-labelledby="demo-positioned-button"
              anchorEl={anchorEl}
              open={openMenuMore && moreButtonEventData.type === TypeMoreButton.Comment}
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
              <MenuItem
                onClick={() => {
                  // TODO: handle chinh sửa
                }}
              >
                Chỉnh sửa
              </MenuItem>

              <MenuItem
                onClick={() => {
                  // TODO: handle xoá
                }}
              >
                Xoá
              </MenuItem>
            </Menu>
          </div>
        </div>
      )}
    </>
  );
};

function handleCopy(openSnackBar: ((message: string) => void) | undefined, content: string) {
  if (openSnackBar === undefined) return;
  copy(content);
  openSnackBar('Copied');
}

/// HOOKS
const useFetchClassDetail = (): IResClassDetailData | null => {
  const [classDetailData, setDetailData] = React.useState<IResClassDetailData | null>(null);
  const Context = useAppContextApi();
  const dispatch = useAppDispatch();

  const { id } = useParams<any>();
  const currentUser = useAppSelector((state) => state.authReducer.currentUser);
  useEffect(() => {
    if (id && currentUser !== null) {
      Context?.showLoading();
      apiClass
        .getClassDetail({
          classId: parseInt(id),
          currentUser,
        })
        .then((data) => {
          if (data.status === 200) {
            dispatch(setIsTeacher(data.content.role === 1));
            Context?.hideLoading();
            const response = convertClassDetailResponse(data);
            if (!response.error) {
              setDetailData(response.data as IResClassDetailData);
              Context?.openSnackBar('Tải lớp học thành công');
            } else {
              Context?.openSnackBarError(
                response?.error?.message
                  ? 'Bạn chưa gia nhập lớp này'
                  : 'Có lỗi xảy ra trong quá trình tải',
              );
            }
          } else {
            Context?.openSnackBar(data.message);
          }
        })
        .catch((e) => {
          Context?.openSnackBarError('Không thể tải lớp học');
        })
        .finally(() => {
          Context?.hideLoading();
          dispatch(setCurrentClassId(parseInt(id)));
        });
    }
  }, [currentUser, id]);
  return classDetailData;
};

const useFetchExercises = () => {
  const { id } = useParams();
  const Context = useAppContextApi();
  const [exercisesState, setExercisesState] = React.useState(new Array<IExercise>());
  const currentUser = useAppSelector((state) => state.authReducer.currentUser);

  useEffect(() => {
    if (id && currentUser !== null) {
      Context?.showLoading();
      apiClass
        .getClassAssignments({
          courseId: parseInt(id),
          currentUser,
          SortColumn: '+Order',
        })
        .then((res) => {
          Context?.hideLoading();
          if (res?.result == 1) {
            const exercise = (res?.content.data as IExercise[]) ?? [];
            const sortedExercise = exercise.sort(
              (a: IExercise, b: IExercise) => a.order!! - b.order!!,
            );

            const total = sortedExercise.reduce((acc, curr) => acc + curr.maxGrade!!, 0);
            sortedExercise.map((e) => {
              e.gradeScale = +((e.maxGrade!! * 100.0) / total).toFixed(2);
              return e;
            });

            setExercisesState(sortedExercise);
            Context?.openSnackBar('Tải bài tập thành công');
          } else {
            Context?.openSnackBarError('Có lỗi xảy ra trong quá trình tải');
          }
        })
        .catch((e) => {
          Context?.hideLoading();
          Context?.openSnackBarError('Không thể tải bài tập');
        })
        .finally(Context?.hideLoading);
    }
  }, [id, currentUser]);
  return exercisesState;
};
