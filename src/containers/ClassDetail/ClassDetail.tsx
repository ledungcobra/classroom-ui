import ContentCopyOutlinedIcon from '@mui/icons-material/ControlCameraOutlined';
import InfoIcon from '@mui/icons-material/Info';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Avatar, Card, CardContent, IconButton, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DEFAULT_USER_AVATAR } from '../../constants';
import { detailData } from '../../constants/dumydata';
import './ClassDetail.scss';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

interface CopyState {
  clicked: boolean;
  content: string;
}
export const ClassDetail = () => {
  const [infoClicked, setInfoClicked] = useState<boolean>(true);

  const [copyClicked, setCopyClick] = useState<CopyState>({
    clicked: false,
    content: '',
  });

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
              <IconButton>
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
        spacing={0}
        sx={{ width: '100%', marginTop: '10px' }}
      >
        {/* Left Part */}
        <Grid
          item
          xs={3}
          className="classDetail__body__leftPart"
          sx={{ justifyContent: 'space-between', marginRight: '10px' }}
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
                <IconButton aria-label="settings">
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
                    {detailData.IResClassDeadline.map((dl) => (
                      <div className="classDetail__body__leftPart__bottom__deadlines__item">
                        <Typography variant="h6" color="lightgray" textAlign="left">
                          Đến hạn {dl.day}
                        </Typography>
                        <Link to={`/details/${dl.id}`} className="myCustomLink">
                          <Typography variant="h6" color="black" textAlign="left">
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
        <Grid item className="classDetail__body__rightPart">
          {/* Up status section */}
          <div className="classDetail__body__rightPart__up-status-section">
            <Avatar alt="status-avatar" src={DEFAULT_USER_AVATAR}></Avatar>
          </div>
          <div className="classDetail__body__rightPart__statuses"></div>
        </Grid>
      </Grid>
    </div>
  );
};
