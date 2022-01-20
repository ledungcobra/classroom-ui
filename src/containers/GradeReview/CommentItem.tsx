import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Avatar, Card, CardContent, Divider, IconButton } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { useAppSelector } from '../../redux';

export enum CommentState {
  Draft,
  Posted,
}
interface ICommentProps extends IGradeReviewComment {
  handleClickMore: (event: React.MouseEvent<HTMLElement>, id: number) => void;
  state: CommentState;
}

export const CommentItem: React.FC<ICommentProps> = (props) => {
  const user = props.teacher ? props.teacher : props.student;
  let displayName: string;
  const isTeacher = useAppSelector((state) => state.classReducer.isTeacher);

  if (props.teacher) {
    displayName = user?.firstName + ' ' + user?.middleName + ' ' + user?.lastName;
  } else {
    displayName = user?.fullName ?? '';
  }

  return (
    <Card sx={{ width: '100%', marginBottom: '8px' }}>
      <CardContent>
        <Box display="flex" flexDirection="column" alignItems="flex-start">
          <Box display="flex" justifyContent="space-between" sx={{ width: '100%' }}>
            <Box display="flex" alignItems="center" gap="10px" sx={{ marginBottom: '10px' }}>
              <Avatar />
              <Divider orientation="vertical" sx={{ height: '100%' }} />
              <h5>{displayName}</h5>
            </Box>
            {isTeacher && props.teacher ? (
              <IconButton onClick={(event) => props.handleClickMore(event, props.id!!)}>
                <MoreVertIcon />
              </IconButton>
            ) : !isTeacher && props.student ? (
              <IconButton onClick={(event) => props.handleClickMore(event, props.id!!)}>
                <MoreVertIcon />
              </IconButton>
            ) : null}
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
