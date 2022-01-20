import MoreVertOutlined from '@mui/icons-material/MoreVertOutlined';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
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
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import AddMember from '../../components/AddMember/AddMember';
import { DEFAULT_USER_AVATAR, GREEN_COLOR } from '../../constants';
import { useAppContextApi, useAppSelector } from '../../redux';
import { apiClass } from '../../services/apis/apiClass';
import { convertClassDetailResponse, generateReferenceLink } from '../../utils';
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

const convertResponse = (data: any): IResMembers => {
  return {
    students: (data?.content?.students ?? []) as IResMember[],
    teachers: (data?.content?.teachers ?? []) as IResMember[],
    owner: data.content.owner,
  };
};

interface CheckStatus {
  id: number;
  checked: boolean;
}
const ClassMembers = (props: ClassMemberProps) => {
  const currentUser = useAppSelector((state) => state.authReducer.currentUser);
  const isTeacher = useAppSelector((state) => state.classReducer.isTeacher);

  const [members, setMembers] = React.useState<IResMembers>({
    students: [],
    teachers: [],
    owner: '',
  });

  const code = useLocation().state?.classCode;
  const [classCode, setClassCode] = React.useState(code);

  const Context = useAppContextApi();
  let { id: classId } = useParams();

  useEffect(() => {
    if (!classCode && classId) {
      apiClass
        .getClassDetail({
          classId: parseInt(classId!!),
          currentUser: currentUser,
        })
        .then((data) => {
          const parsedData = convertClassDetailResponse(data);

          if (parsedData.error) {
            Context?.openSnackBarError('Không thể lấy được mã lớp');
          } else {
            setClassCode(parsedData.data?.classCode);
          }
        });
    }
  }, []);

  const [checkStudents, setCheckStudents] = useState<CheckStatus[]>(
    members?.students.map((s) => ({ id: s.id, checked: false })) ?? [],
  );
  useEffect(() => {
    if (classId) {
      Context?.showLoading();
      apiClass
        .getClassMember({
          classId: +classId,
        })
        .then((data) => {
          Context?.hideLoading();
          const members = convertResponse(data);
          setMembers(members);
        })
        .catch((e) => {
          Context?.hideLoading();
        });
    }
  }, [classId]);

  useEffect(() => {
    if (members?.students?.length > 0) {
      setCheckStudents(members?.students.map((s) => ({ id: s.id, checked: false })) ?? []);
    }
  }, [members]);
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
  const [addMemberVariant, setAddMemberPopupVariant] = useState<AddMemberVariant | null>(null);
  const handleAddMember = (emails: string[]) => {
    apiClass
      .postInviteMemberToClass({
        classCode,
        courseId: parseInt(classId!!),
        personReceives: emails,
        role: addMemberVariant === 'student' ? 2 : 1,
      })
      .then(() => {
        Context?.openSnackBar('Gửi thành công');
      })
      .catch((e) => {
        Context?.openSnackBarError('Gửi yêu cầu thất bại');
      });
  };

  const handleHide = () => {
    if (moreButtonEventData.type === TypeMoreButton.StudentSingle) {
      setMembers((members) => {
        members.students = members!!.students.filter((m) => m.id !== moreButtonEventData.data.id);
        return { ...members };
      });
    } else if (moreButtonEventData.type === TypeMoreButton.StudentMultiple) {
      setMembers((members) => {
        members!!.students = members!!.students.filter((_, index) => !checkStudents[index].checked);
        return { ...members };
      });
    }
    setIsOpenMenu(false);
  };

  const handleDelete = () => {
    Context?.showLoading();
    if (
      moreButtonEventData.type === TypeMoreButton.StudentSingle ||
      moreButtonEventData.type === TypeMoreButton.TeacherSingle
    ) {
      const userId = moreButtonEventData.data.id;
      apiClass
        .postDeleteMember({
          currentUser,
          userId,
          courseId: parseInt(classId!!),
        })
        .then((response) => {
          if (response.status === 200) {
            Context?.openSnackBar('Xoá thành công');
            if (moreButtonEventData.type === TypeMoreButton.TeacherSingle) {
              setMembers((members) => {
                members.teachers = members.teachers.filter((t) => t.id !== userId);
                return { ...members };
              });
            } else {
              setMembers((members) => {
                members.students = members!!.students.filter((m) => m.id !== userId);
                setCheckStudents(members.students.map((s) => ({ id: s.id, checked: false })));
                return { ...members };
              });
            }
          } else if (response.status === 400) {
            Context?.openSnackBar(response.message);
          }
        })
        .finally(() => {
          Context?.hideLoading();
        });
    } else if (moreButtonEventData.type === TypeMoreButton.StudentMultiple) {
      Promise.all(
        checkStudents
          .filter((s) => s.checked)
          .map((s) => {
            return apiClass.postDeleteMember({
              courseId: parseInt(classId!!),
              currentUser,
              userId: s.id,
            });
          }),
      )
        .then((responses) => {
          Context?.openSnackBar('Xoá thành công');
          setMembers((members) => {
            const students = members.students.filter((_, index) => !checkStudents[index].checked);
            setCheckStudents(students.map((s) => ({ id: s.id, checked: false })));
            return {
              ...members,
              teachers: members.teachers,
              students,
            };
          });
        })
        .finally(() => {
          Context?.hideLoading();
        });
    }
    setIsOpenMenu(false);
  };

  const [studentReverse, setStudentReverse] = useState(false);
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
            {isTeacher && (
              <IconButton
                onClick={() => {
                  setAddMemberPopupVariant('teacher');
                }}
              >
                <PersonAddIcon sx={{ color: GREEN_COLOR }} />
              </IconButton>
            )}
          </Box>
          <Divider sx={{ bgcolor: GREEN_COLOR, height: 2, marginBottom: '20px' }} />
          <Box display="flex" flexDirection="column" gap="14px" marginBottom="10px">
            {members.teachers.map((t, index) => (
              <Box key={t.id} display="flex" flexDirection="column" gap="5px">
                <Box display="flex" justifyContent="space-between">
                  <Box display="flex" gap="10px" alignItems="center">
                    <Avatar
                      alt={t.email + 'avatar'}
                      src={t.profileImageUrl ?? DEFAULT_USER_AVATAR}
                    />
                    <Typography
                      variant="body1"
                      fontSize="15px"
                      color={t.status === 'INVITED' ? 'gray' : 'black'}
                    >
                      {t.email ?? t.username}
                    </Typography>
                  </Box>
                  {currentUser === members.owner && t.username !== members.owner && (
                    <IconButton
                      onClick={(e) => {
                        openMenu(e, TypeMoreButton.TeacherSingle, {
                          index,
                          id: t.id,
                        });
                      }}
                    >
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
              {isTeacher && (
                <IconButton onClick={() => setAddMemberPopupVariant('student')}>
                  <PersonAddIcon sx={{ color: GREEN_COLOR }} />
                </IconButton>
              )}
            </Box>
          </Box>
          <Divider sx={{ bgcolor: GREEN_COLOR, height: 2, marginBottom: '20px' }} />

          <Box display="flex" justifyContent="space-between">
            <Box display="flex" gap="10px">
              <Checkbox
                checked={selectAll}
                value={selectAll}
                onChange={() => {
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
              {isTeacher && (
                <Menu
                  anchorEl={anchorEl}
                  onClose={() => {
                    setIsOpenMenu(false);
                  }}
                  open={isOpenMenu}
                >
                  <MenuItem onClick={handleHide}>Ẩn</MenuItem>
                  <MenuItem onClick={handleDelete}>Xoá</MenuItem>
                  <MenuItem
                    onClick={() => {
                      setIsOpenMenu(false);
                    }}
                  >
                    Không làm gì cả
                  </MenuItem>
                </Menu>
              )}
            </Box>
            <IconButton onClick={() => setStudentReverse(!studentReverse)}>
              <SortByAlphaIcon />
            </IconButton>
          </Box>
          <Box
            display="flex"
            flexDirection={studentReverse ? 'column-reverse' : 'column'}
            gap="14px"
            marginBottom="10px"
          >
            {checkStudents.length === members?.students?.length &&
              members.students.map((s, index) => (
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
                      <Avatar
                        alt={s.email + 'avatar'}
                        src={s.profileImageUrl ?? DEFAULT_USER_AVATAR}
                      />
                      <Typography
                        variant="body1"
                        fontSize="15px"
                        color={s.status === 'INVITED' ? 'gray' : 'black'}
                      >
                        {s.email ?? s.username}
                      </Typography>
                    </Box>
                    {isTeacher && (
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
                    )}
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
          onCancel={() => setAddMemberPopupVariant(null)}
          variant={addMemberVariant}
          referenceLink={addMemberVariant === 'student' ? generateReferenceLink(classCode, 2) : ''}
        />
      )}
    </Container>
  );
};

export default ClassMembers;
