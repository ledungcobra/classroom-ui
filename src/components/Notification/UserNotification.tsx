import CheckIcon from '@mui/icons-material/Check';
import FullNotificationsIcon from '@mui/icons-material/Notifications';
import EmptyNotificationsIcon from '@mui/icons-material/NotificationsNone';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import { Avatar, Badge, Button, Card, Divider, IconButton, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { Box } from '@mui/system';
import React from 'react';
import { Link } from 'react-router-dom';
import { GREEN_COLOR } from '../../constants';
import { useAppSelector } from '../../redux';
import {
  doUpdateSeenANotification,
  getAllNotifcation,
} from '../../redux/asyncThunk/notificationAction';
import { useAppDispatch } from '../../redux/hooks';
import './UserNotification.scss';

export const UserNotification = () => {
  const notification = useAppSelector((state) => state.notificationReducer);
  const isLoading = notification.loading;

  const dispatch = useAppDispatch();
  const isFullNotification =
    (notification.notificationContent?.data?.notifications?.length ?? 0) > 0;

  React.useEffect(() => {
    dispatch(
      getAllNotifcation({
        currentUser: localStorage.getItem('classroom@current_user') ?? '',
        StartAt: 0,
        MaxResults: 20,
      }),
    );
  }, []);

  const [isShowNotification, setIsShowNotification] = React.useState(false);
  const handleLoadMore = () => {
    dispatch(
      getAllNotifcation({
        MaxResults: 3,
        StartAt: notification.notificationContent?.data?.notifications.length ?? 0,
        currentUser: localStorage.getItem('classroom@current_user') ?? '',
      }),
    );
  };
  return (
    <div className="notification">
      <IconButton onClick={() => setIsShowNotification(!isShowNotification)}>
        {notification && (
          <Badge
            badgeContent={notification.notificationContent?.data?.notifications.length}
            color="error"
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            {isFullNotification ? <FullNotificationsIcon /> : <EmptyNotificationsIcon />}
          </Badge>
        )}
      </IconButton>

      {isShowNotification && (
        <Card variant="outlined" className="notification__body">
          <Box
            display="flex"
            justifyContent="flex-end"
            sx={{ padding: '10px', height: '30px', width: '100%' }}
          >
            {isLoading && <CircularProgress sx={{ alignSelf: 'flex-end' }} color="success" />}
          </Box>

          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            sx={{ width: '100%', padding: '5px', backgroundColor: 'rgba(green,1)' }}
          >
            <Typography variant="h5">
              <strong>Thông báo</strong>
            </Typography>
            <Divider sx={{ borderColor: 'green', width: '80%', marginTop: '10px' }} light={true} />
          </Box>

          <div className="notification__body__content">
            {(notification?.notificationContent?.data?.notifications?.length ?? 0) > 0 ? (
              <>
                {notification?.notificationContent?.data?.notifications?.map((not, index) => {
                  return <NotificationItem key={index} {...not} />;
                })}
                {notification?.notificationContent?.hasMore && (
                  <Button
                    color="success"
                    variant="contained"
                    sx={{ borderRadius: '0' }}
                    onClick={handleLoadMore}
                  >
                    Tải thêm
                  </Button>
                )}
              </>
            ) : (
              <Typography variant="h6" color="initial">
                Bạn không có thông báo nào
              </Typography>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

const NotificationItem: React.FC<INotification> = ({
  id,
  createBy,
  createOn,
  isSeen,
  senderName,
  typeNotification,
  updateBy,
  updateOn,
  userId,
  message,
  courseId,
  gradeId,
  gradeReviewId,
}) => {
  const avatarRand = useAppSelector((state) => state.utilsReducer.randomUserAvt);
  const dispatch = useAppDispatch();

  const markSeenNotification = (id: number) => {
    dispatch(
      doUpdateSeenANotification({
        id,
        currentUser: localStorage.getItem('classroom@current_user') ?? '',
      }),
    );
  };
  return (
    <Link
      className="notification__item__wrapper"
      to={`/class-detail/${courseId}/grade-review?gradeId=${gradeId}&gradeReviewId=${gradeReviewId}`}
    >
      <div className="notification__item">
        <Divider sx={{ width: '90%', marginBottom: '8px' }} />
        <Box display="flex" justifyContent="space-between">
          <Box
            display="flex"
            justifyContent="flex-start"
            alignItems="center"
            gap="8px"
            sx={{ margin: '20px' }}
          >
            <Avatar src={avatarRand} />
            <Divider orientation="vertical" sx={{ height: '100%' }} />
            <Box display="flex" flexDirection="column">
              <h6>{senderName}</h6>
              <span>{message}</span>
            </Box>
          </Box>

          <Box display="flex" sx={{ height: '100%' }}>
            {isSeen ? (
              <CheckIcon sx={{ color: GREEN_COLOR }} />
            ) : (
              <IconButton onClick={() => markSeenNotification(id)}>
                <RadioButtonCheckedIcon sx={{ color: 'rgba(red,0.8)' }} />
              </IconButton>
            )}
          </Box>
        </Box>
      </div>
    </Link>
  );
};
