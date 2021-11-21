import { MoreVertOutlined } from '@mui/icons-material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import {
  Avatar,
  Button,
  Checkbox,
  Container,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import { AddMemberVariant } from '../../@types/layouts';
import AddMember from '../../components/AddMember/AddMember';
import { DEFAULT_USER_AVATAR, GREEN_COLOR } from '../../constants';
import { members as myMembers } from '../../constants/dumydata';
import './ClassMembers.scss';

interface ClassMemberProps {}

enum TypeMoreButton {
  StudentMultiple,
  StudentSingle,
  TeacherSingle,
  None,
}

interface MoreButtonEventData {
  type: TypeMoreButton;
  data?: any;
}

const ClassMembers = (props: ClassMemberProps) => {
  const myTeacherId = 1;
  const [members, setMembers] = useState(myMembers);

  const [checkStudents, setCheckStudents] = useState(
    members.students.map((s) => ({ id: s.id, checked: false })),
  );
  const [selectAll, setSelectAll] = useState(false);

  // Menu things
  const [moreButtonEventData, setMoreButtonEventData] = useState<MoreButtonEventData>({
    type: TypeMoreButton.None,
  });
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isOpenMenu, setIsOpenMenu] = React.useState(false);
  const openMenu = (event: React.MouseEvent<HTMLElement>, type: TypeMoreButton, data?: any) => {
    setAnchorEl(event.currentTarget);
    setMoreButtonEventData({ type, data });
    setIsOpenMenu(true);
  };

  // Add Member
  const [addMemberVariant, setVariantAddMember] = useState<AddMemberVariant | null>('teacher');
  const handleAddMember = (data: any) => {
    console.log(data);
  };
  return (
    <Container maxWidth="md">
      <div className="class-members">
        {/* Teacher Role*/}

        <Box
          display="flex"
          gap="8px"
          flexDirection="column"
          marginBottom="30px"
          className="class-members__container"
        >
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h4" color={GREEN_COLOR}>
              &nbsp;Giáo viên
            </Typography>
            <IconButton
              onClick={() => {
                setVariantAddMember('teacher');
              }}
            >
              <PersonAddIcon sx={{ color: GREEN_COLOR }} />
            </IconButton>
          </Box>
          <Divider sx={{ bgcolor: GREEN_COLOR, height: 2, marginBottom: '20px' }} />
          <Box display="flex" flexDirection="column" gap="14px" marginBottom="10px">
            {members.teachers.map((t) => (
              <Box key={t.id} display="flex" flexDirection="column" gap="5px">
                <Box display="flex" justifyContent="space-between">
                  <Box display="flex" gap="10px" alignItems="center">
                    <Avatar alt={t.displayName + 'avatar'} src={t.avatar ?? DEFAULT_USER_AVATAR} />
                    <Typography variant="body1" fontSize="15px">
                      {t.displayName}
                    </Typography>
                  </Box>
                  {t.id !== myTeacherId && (
                    <IconButton>
                      <MoreVertOutlined />
                    </IconButton>
                  )}
                </Box>
                <Divider />
              </Box>
            ))}
          </Box>
        </Box>
        {/* User Role */}
        <Box display="flex" gap="5px" flexDirection="column" className="class-members__container">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" color={GREEN_COLOR}>
              &nbsp;Sinh viên
            </Typography>
            <Box display="flex" gap="5px" alignItems="center">
              <Typography variant="body1" color={GREEN_COLOR}>
                {members.students.length + ' ' + 'sinh viên  '}
              </Typography>
              <IconButton>
                <PersonAddIcon sx={{ color: GREEN_COLOR }} />
              </IconButton>
            </Box>
          </Box>
          <Divider sx={{ bgcolor: GREEN_COLOR, height: 2, marginBottom: '20px' }} />
          <Box display="flex" flexDirection="column" gap="14px" marginBottom="10px">
            <Box display="flex" justifyContent="space-between">
              <Box display="flex" gap="10px">
                <Checkbox
                  checked={selectAll}
                  value={selectAll}
                  onChange={() => {
                    console.log('CHANGE CHECK');
                    setSelectAll((prev) => {
                      setCheckStudents((students) =>
                        students.map((s) => {
                          s.checked = !prev;
                          return s;
                        }),
                      );
                      return !prev;
                    });
                  }}
                />

                <Button
                  color="success"
                  variant="text"
                  sx={{ fontWeight: '600' }}
                  onClick={(e) => {
                    openMenu(e, TypeMoreButton.StudentMultiple, null);
                  }}
                >
                  Tác vụ
                </Button>

                <Menu
                  anchorEl={anchorEl}
                  onClose={() => {
                    setIsOpenMenu(false);
                  }}
                  open={
                    isOpenMenu &&
                    (moreButtonEventData.type === TypeMoreButton.StudentSingle ||
                      moreButtonEventData.type === TypeMoreButton.StudentMultiple)
                  }
                >
                  <MenuItem
                    onClick={() => {
                      console.log('MUTIPLE' + JSON.stringify(moreButtonEventData));

                      // TODO handle ẩn
                      if (moreButtonEventData.type === TypeMoreButton.StudentSingle) {
                        setMembers((members) => {
                          members.students = members.students.filter(
                            (m) => m.id !== moreButtonEventData.data.id,
                          );
                          return { ...members };
                        });
                      } else if (moreButtonEventData.type === TypeMoreButton.StudentMultiple) {
                        setMembers((members) => {
                          members.students = members.students.filter(
                            (_, index) => !checkStudents[index].checked,
                          );
                          return { ...members };
                        });
                      }
                      setIsOpenMenu(false);
                    }}
                  >
                    Ẩn
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      // TODO xoá
                      console.log('MUTIPLE' + JSON.stringify(moreButtonEventData));

                      if (moreButtonEventData.type === TypeMoreButton.StudentSingle) {
                        setMembers((members) => {
                          members.students = members.students.filter(
                            (m) => m.id !== moreButtonEventData.data.id,
                          );

                          setCheckStudents(
                            members.students.map((s) => ({ id: s.id, checked: false })),
                          );

                          return { ...members };
                        });
                      } else if (moreButtonEventData.type === TypeMoreButton.StudentMultiple) {
                        setMembers((members) => {
                          const students = members.students.filter(
                            (_, index) => !checkStudents[index].checked,
                          );
                          setCheckStudents(students.map((s) => ({ id: s.id, checked: false })));
                          return {
                            teachers: members.teachers,
                            students,
                          };
                        });
                      }
                      setIsOpenMenu(false);
                    }}
                  >
                    Xoá
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setIsOpenMenu(false);
                    }}
                  >
                    Không làm gì cả
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
            {members.students.map((s, index) => (
              <Box key={index} display="flex" flexDirection="column" gap="5px">
                <Box display="flex" justifyContent="space-between">
                  <Box display="flex" gap="10px" alignItems="center">
                    <Checkbox
                      onChange={() => {
                        setCheckStudents((value) => {
                          value[index].checked = !value[index].checked;
                          return [...value];
                        });
                      }}
                      size="medium"
                      color="success"
                      value={checkStudents[index].checked}
                      checked={checkStudents[index].checked}
                    />
                    <Avatar alt={s.displayName + 'avatar'} src={s.avatar ?? DEFAULT_USER_AVATAR} />
                    <Typography variant="body1" fontSize="15px">
                      {s.displayName}
                    </Typography>
                  </Box>

                  <IconButton
                    onClick={(e) =>
                      openMenu(e, TypeMoreButton.StudentSingle, {
                        index,
                        id: s.id,
                      })
                    }
                  >
                    <MoreVertOutlined />
                  </IconButton>
                </Box>
                <Divider />
              </Box>
            ))}
          </Box>
        </Box>
      </div>
      {addMemberVariant && (
        <AddMember
          actionPerform={handleAddMember}
          footerText={
            addMemberVariant === 'student'
              ? ''
              : 'Giáo viên mà bạn thêm có thể làm mọi thứ bạn làm, trừ xóa lớp học.'
          }
          onCancel={() => setVariantAddMember(null)}
          variant={addMemberVariant}
        />
      )}
    </Container>
  );
};

export default ClassMembers;
