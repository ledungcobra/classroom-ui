import ContentCopyOutlinedIcon from '@mui/icons-material/ControlCameraOutlined';
import InfoIcon from '@mui/icons-material/Info';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import PublishedWithChangesOutlinedIcon from '@mui/icons-material/PublishedWithChangesOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import {
  Avatar,
  Card,
  CardContent,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Box } from '@mui/system';
import copy from 'copy-to-clipboard';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PostStatus } from '../../components';
import {
  BOX_SHADOW_STYLE,
  DEFAULT_USER_AVATAR,
  GREEN_COLOR,
  MAIN_COLOR,
  SUB_COLOR,
} from '../../constants';
// import { classList, detailData } from '../../constants/dumydata';
import { useAppContextApi, useAppSelector } from '../../redux';
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
  const { id } = useParams<any>();
  const [classDetailData, setDetailData] = React.useState<IResClassDetailData | null>(null);
  const [classList, setClassList] = React.useState([]);
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
            Context?.setRoleTeacher(data.content.role);
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
          Context?.setCurrentClassId(parseInt(id));
        });
    }
  }, [currentUser, id]);

  const [infoClicked, setInfoClicked] = useState<boolean>(false);
  const [postStatusClicked, setPostStatusClicked] = useState(false);

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

  // Event handle
  const handlePostComment = () => {};

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
                <div className="classDetail__body__leftPart__bottom">
                  <Card sx={{ borderRadius: '7px', padding: '5px' }}>
                    <CardContent>
                      <Box display="flex" flexDirection="column" alignItems="flex-start">
                        <Typography variant="h6" color="black" textAlign="left" fontWeight="bold">
                          Sắp đến hạn
                        </Typography>
                        <Box
                          display="flex"
                          flexDirection="column"
                          gap="10px"
                          className="classDetail__body__leftPart__bottom__deadlines"
                        >
                          {classDetailData.classDeadline.map((dl, index) => (
                            <div
                              key={index}
                              className="classDetail__body__leftPart__bottom__deadlines__item"
                            >
                              <Typography variant="h6" color="lightgray" textAlign="left">
                                Đến hạn {dl.day}
                              </Typography>
                              <Link to={`/details/${dl.id}`} className="myCustomLink">
                                <Typography variant="h6" color={SUB_COLOR} textAlign="left">
                                  {dl.hour} - {dl.name}
                                </Typography>
                              </Link>
                            </div>
                          ))}
                        </Box>
                        <Link
                          to="/deadlines"
                          className="myCustomLink myCustomLink--light-blue"
                          style={{ display: 'block', width: '100%' }}
                        >
                          <Typography
                            variant="h6"
                            color="#137333"
                            fontWeight="600"
                            textAlign="right"
                          >
                            Xem tất cả
                          </Typography>
                        </Link>
                      </Box>
                    </CardContent>
                  </Card>
                </div>
              </Grid>
              {/* Right Part */}
              <Grid item xs={12} md={9} className="classDetail__body__rightPart">
                {/* Up status section */}
                <div className="classDetail__body__rightPart__up-status-section">
                  {!postStatusClicked ? (
                    <Card
                      variant="outlined"
                      sx={BOX_SHADOW_STYLE}
                      onClick={() => {
                        setPostStatusClicked((prev) => !prev);
                      }}
                    >
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Avatar alt="status-avatar" src={DEFAULT_USER_AVATAR} />
                          <Typography variant="subtitle1" color={SUB_COLOR} className="status-text">
                            Thông báo nội dụng nào đó cho lớp học của bạn
                          </Typography>
                          <IconButton>
                            <PublishedWithChangesOutlinedIcon />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  ) : (
                    <PostStatus
                      classList={classList}
                      onCancel={() => setPostStatusClicked(false)}
                      onPost={(content) => {
                        //TODO: do post
                      }}
                    />
                  )}
                </div>
                <div className="classDetail__body__rightPart__statuses">
                  {classDetailData.classStatus.map((stt, index) => (
                    <Card
                      key={index}
                      variant="outlined"
                      sx={{ ...BOX_SHADOW_STYLE, marginBottom: '20px' }}
                    >
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Box display="flex" gap="10px" alignItems="center">
                            <Avatar alt="status-avatar" src={DEFAULT_USER_AVATAR} />
                            <Box display="flex" flexDirection="column">
                              <Typography
                                variant="body1"
                                color="black"
                                className="status-text"
                                fontWeight="600"
                              >
                                {stt.authorName}
                              </Typography>
                              <Typography variant="subtitle1" fontWeight="bold" color={SUB_COLOR}>
                                {stt.time}
                              </Typography>
                            </Box>
                          </Box>
                          <IconButton
                            onClick={(e) =>
                              openMenu(e, TypeMoreButton.Status, {
                                status: stt,
                              })
                            }
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </Box>
                        <div className="classDetail__body__rightPart__status">
                          <Typography
                            variant="body1"
                            color="#363636"
                            textAlign="left"
                            dangerouslySetInnerHTML={{ __html: stt.status }}
                          />
                        </div>
                      </CardContent>
                      <Divider></Divider>
                      <CardContent className="comments">
                        <Box display="flex" gap="8px" marginBottom="10px">
                          <PeopleAltOutlinedIcon />
                          <Typography variant="body1" color={MAIN_COLOR} fontWeight="600">
                            {stt.comments.length} bình luận về lớp học
                          </Typography>
                        </Box>
                        {stt.comments.map((c, index) => (
                          <div key={index} className="comments__item">
                            <Box display="flex" justifyContent="space-between">
                              <Box display="flex" gap="10px">
                                <Avatar alt={'avatar' + index} src={DEFAULT_USER_AVATAR} />
                                <div>
                                  <Typography
                                    variant="body1"
                                    color={MAIN_COLOR}
                                    fontWeight="500"
                                    display="inline"
                                  >
                                    {c.author + ' '}
                                    <Typography
                                      variant="subtitle1"
                                      color={SUB_COLOR}
                                      display="inline"
                                    >
                                      {c.time}
                                    </Typography>
                                  </Typography>
                                  <Typography variant="body2" color={MAIN_COLOR}>
                                    {c.content}
                                  </Typography>
                                </div>
                              </Box>
                              <IconButton
                                className="comments__item__option-button comment_more-btn"
                                onClick={(e) => {
                                  openMenu(e, TypeMoreButton.Comment, {
                                    comment: c,
                                  });
                                }}
                              >
                                <MoreVertIcon />
                              </IconButton>
                            </Box>
                          </div>
                        ))}
                      </CardContent>
                      <Divider />
                      <CardContent>
                        <Box
                          className="input-field"
                          display="flex"
                          gap="13px"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Avatar alt="author-post-avt" src={DEFAULT_USER_AVATAR} />
                          <TextField
                            fullWidth
                            className="input-field__comment-input"
                            variant="outlined"
                            defaultValue=""
                            placeholder="Thêm nhận xét trong lớp học"
                            InputProps={{
                              endAdornment: (
                                <IconButton onClick={handlePostComment}>
                                  <SendOutlinedIcon />
                                </IconButton>
                              ),
                            }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </div>
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
                  // TODO:
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
                  // TODO:
                  handleCopy(Context?.openSnackBar, classDetailData.classCode);
                }}
              >
                Sao chép mã lớp
              </MenuItem>
              {/* <MenuItem
                onClick={() => {
                  // TODO : dat lai ma lop
                }}
              >
                Đặt lại mã lớp
              </MenuItem> */}
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
              <MenuItem
                onClick={() => {
                  // TODO: chuyen len dau
                }}
              >
                Chuyển lên đầu
              </MenuItem>
              <MenuItem
                onClick={() => {
                  // TODO: Chinh sua
                }}
              >
                Chinh sửa
              </MenuItem>
              <MenuItem
                onClick={() => {
                  // TODO : handle xoá
                }}
              >
                Xoá
              </MenuItem>
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
                  // TODO : handle xoá
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
