import CloseIcon from '@mui/icons-material/Close';
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
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Box } from '@mui/system';
import copy from 'copy-to-clipboard';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DEFAULT_USER_AVATAR } from '../../constants';
import { detailData } from '../../constants/dumydata';
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

interface ICopyState {
  clicked: boolean;
  content: string;
}

const subColor = '#6b6b6b';
const mainColor = '##363636';

export const ClassDetail = () => {
  const [infoClicked, setInfoClicked] = useState<boolean>(true);

  const [moreButtonEventData, setMoreButtonEventData] = useState<MoreButtonEventData>({
    type: TypeMoreButton.None,
  });

  const [copyClicked, setCopyClick] = useState<ICopyState>({
    clicked: false,
    content: '',
  });

  // Snack bar
  const [open, setOpen] = React.useState(false);
  const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  // Menu more
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenuMore = Boolean(anchorEl);
  const [openClassCodeOpt, setOpenClassCodeOpt] = React.useState(false);

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const openMenu = (event: React.MouseEvent<HTMLElement>, type: TypeMoreButton, data?: any) => {
    setAnchorEl(event.currentTarget);
    setMoreButtonEventData({ type, data });
  };

  // Event handle
  const handlePostComment = () => {};
  const handleCommentItemClick = () => {};
  const boxShadowStyle = { boxShadow: '5px 5px 20px 4px lightgrey', borderRadius: '7px' };

  return (
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
          <h3>{detailData.className}</h3>
          <div className="classDetail__top__classDetailBtn">
            <IconButton
              onClick={() => {
                setInfoClicked((prev) => !prev);
              }}
            >
              {infoClicked ? (
                <InfoIcon className="classDetail__top__classDetailBtn__icon" fontSize="large" />
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
            <Box sx={{ display: 'flex ', gap: '20px', alignItems: 'center', marginBottom: '0' }}>
              <h4>Mã lớp: {detailData.infor.classCode}</h4>
              <IconButton
                onClick={() => {
                  // TODO:
                  handleCopy(setOpen, 'Max lop');
                }}
              >
                <ContentCopyOutlinedIcon sx={{ color: 'black', width: '25px', height: '25px' }} />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex ', gap: '10px', alignItems: 'center', marginBottom: '0' }}>
              <h4>Chủ đề: {detailData.infor.theme}</h4>
            </Box>
            <Box sx={{ display: 'flex ', gap: '10px', alignItems: 'center', marginBottom: '0' }}>
              <h4>Phòng {detailData.infor.room}</h4>
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
                  aria-expanded={openClassCodeOpt ? 'true' : undefined}
                  onClick={(e) => openMenu(e, TypeMoreButton.ClassCode)}
                >
                  <MoreVertIcon />
                </IconButton>
              </Grid>
              <CardContent>
                <Box display="flex">
                  <Typography variant="h5" fontWeight="600" color="#137333">
                    {detailData.classCode}{' '}
                    <IconButton>
                      <ContentCopyOutlinedIcon />
                    </IconButton>
                  </Typography>
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
                    {detailData.classDeadline.map((dl) => (
                      <div className="classDetail__body__leftPart__bottom__deadlines__item">
                        <Typography variant="h6" color="lightgray" textAlign="left">
                          Đến hạn {dl.day}
                        </Typography>
                        <Link to={`/details/${dl.id}`} className="myCustomLink">
                          <Typography variant="h6" color={subColor} textAlign="left">
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
                    <Typography variant="h6" color="#137333" fontWeight="600" textAlign="right">
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
            <Card variant="outlined" sx={boxShadowStyle}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Avatar alt="status-avatar" src={DEFAULT_USER_AVATAR} />
                  <Typography variant="subtitle1" color={subColor} className="status-text">
                    Thông báo nội dụng nào đó cho lớp học của bạn
                  </Typography>
                  <IconButton>
                    <PublishedWithChangesOutlinedIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </div>
          <div className="classDetail__body__rightPart__statuses">
            {detailData.classStatus.map((stt, index) => (
              <Card key={index} variant="outlined" sx={{ ...boxShadowStyle, marginBottom: '20px' }}>
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
                        <Typography variant="subtitle1" fontWeight="bold" color={subColor}>
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
                    <Typography variant="body1" color={mainColor} fontWeight="600">
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
                              color={mainColor}
                              fontWeight="500"
                              display="inline"
                            >
                              {c.author + ' '}
                              <Typography variant="subtitle1" color={subColor} display="inline">
                                {c.time}
                              </Typography>
                            </Typography>
                            <Typography variant="body2" color={mainColor}>
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
            handleCopy(setOpen, 'Link thanh vien');
          }}
        >
          Sao chép đường liên kết mời thành viên
        </MenuItem>
        <MenuItem
          onClick={() => {
            // TODO:
            handleCopy(setOpen, 'Max lop');
          }}
        >
          Sao chép mã lớp
        </MenuItem>
        <MenuItem
          onClick={() => {
            // TODO : dat lai ma lop
          }}
        >
          Đặt lại mã lớp
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
            // TODO: handle copy
            handleCopy(setOpen, 'LINK');
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
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Copied"
        ContentProps={{
          sx: {
            background: 'white',
            color: subColor,
          },
        }}
        action={
          <>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        }
      />
    </div>
  );
};

function handleCopy(setOpen: React.Dispatch<React.SetStateAction<boolean>>, content: string) {
  copy(content);
  setOpen(true);
  setTimeout(() => {
    setOpen(false);
  }, 2000);
}
