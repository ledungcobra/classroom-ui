import { MoreVertOutlined } from '@mui/icons-material';
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
import { useLocation, useNavigate, useParams } from 'react-router-dom';
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
  const navigate = useNavigate();
  const currentUser = useAppSelector((state) => state.authReducer.currentUser);

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
  const [addMemberVariant, setAddMemberVariant] = useState<AddMemberVariant | null>(null);
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
            {currentUser === members.owner && (
              <IconButton
                onClick={() => {
                  setAddMemberVariant('teacher');
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
                      {t.email}
                    </Typography>
                  </Box>
                  {currentUser !== members.owner && (
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
              {members.owner === currentUser && (
                <IconButton onClick={() => setAddMemberVariant('student')}>
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
                open={isOpenMenu}
              >
                <MenuItem
                  onClick={() => {
                    console.log('MUTIPLE' + JSON.stringify(moreButtonEventData));

                    // TODO handle ẩn
                    if (moreButtonEventData.type === TypeMoreButton.StudentSingle) {
                      setMembers((members) => {
                        members.students = members!!.students.filter(
                          (m) => m.id !== moreButtonEventData.data.id,
                        );
                        return { ...members };
                      });
                    } else if (moreButtonEventData.type === TypeMoreButton.StudentMultiple) {
                      setMembers((members) => {
                        members!!.students = members!!.students.filter(
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
                    Context?.showLoading();
                    if (moreButtonEventData.type === TypeMoreButton.StudentSingle) {
                      apiClass
                        .postDeleteMember({
                          currentUser,
                          userId: moreButtonEventData.data.id,
                          courseId: parseInt(classId!!),
                        })
                        .then(() => {
                          Context?.openSnackBar('Xoá thành công');
                          setMembers((members) => {
                            members.students = members!!.students.filter(
                              (m) => m.id !== moreButtonEventData.data.id,
                            );

                            setCheckStudents(
                              members.students.map((s) => ({ id: s.id, checked: false })),
                            );
                            return { ...members };
                          });
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
                        .then(() => {
                          Context?.openSnackBar('Xoá thành công');
                          setMembers((members) => {
                            const students = members.students.filter(
                              (_, index) => !checkStudents[index].checked,
                            );
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
                        {s.email}
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
          onCancel={() => setAddMemberVariant(null)}
          variant={addMemberVariant}
          referenceLink={addMemberVariant === 'student' ? generateReferenceLink(classCode, 2) : ''}
        />
      )}
    </Container>
  );
};

export default ClassMembers;
