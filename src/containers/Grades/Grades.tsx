// @ts-nocheck
import { DialogTitle } from '@material-ui/core';
import MoreVert from '@mui/icons-material/MoreVert';
import {
  Alert,
  Avatar,
  Button,
  Container,
  Dialog,
  DialogContent,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
} from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { useParams } from 'react-router';
import { useAppContextApi, useAppSelector } from '../../redux';
import { apiUser } from '../../services/apis/apiUser';
import axiosMain from '../../services/axios/axiosMain';
import './Grades.scss';

enum TypeMoreButton {
  NONE,
  ALL_STUDENT,
  ONE_STUDENT,
}

enum TypeUploadExcelFile {
  STUDENT_LIST,
  GRADE_LIST,
}

interface MoreButtonEventData {
  type: TypeMoreButton;
  data: any | null;
}

//#region Utils
/**
 *
 * @param row
 * @returns [{
 *  key, title, id
 * }]
 */
const transformTableHeader = (row: any) => {
  return [
    { key: 'name', title: 'Họ tên' },
    { key: 'mssv', title: 'MSSV' },
    ...row.map((h: any) => ({
      ...h,
      key: h.id + '',
      title: h.name,
    })),
  ];
};

/**
 *
 * @param rows
 * @returns [
 *  {
 * name, mssv, id, [exerciseId + 'grade']..., [exerciseId +'max']...
 * }
 * ]
 */

const transformRows = (rows: any[]) => {
  return [
    ...rows.map((s) => {
      return {
        name: s.name,
        mssv: s.mssv,
        username: s.username,
        id: s.id,
        ...s.grades.reduce((total: any, exercise: any) => {
          return {
            [exercise.id + 'grade']: exercise.grade,
            [exercise.id + 'max']: exercise.maxGrade,
            ...total,
          };
        }, {}),
      };
    }),
  ];
};

//#endregion

const Grades = () => {
  const [moreVertEventData, setMoreButtonEventData] = React.useState<MoreButtonEventData>({
    type: TypeMoreButton.NONE,
    data: null,
  });

  const [userInfo, setCurrentUserInfoData] = React.useState<IUserInfoData | undefined>();

  const uploadRef = React.useRef();
  const [header, setHeader] = React.useState<any[]>([]);
  const [typeUploadFile, setTypeUploadFile] = React.useState(null);
  let [scores, setScores] = React.useState<any[]>([]);
  const [open, setOpen] = React.useState(false);
  const Context = useAppContextApi();
  const { id } = useParams<any>();
  let currentUser = useAppSelector((state) => state.authReducer.currentUser);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    axiosMain
      .get(`/course/${id}/all-grades?currentUser=${currentUser}`)
      .then(({ data }) => {
        if (data.status === 200) {
          const content = data.content;

          const header = content.header;
          const scores = content.scores;

          const totalGrade = header.reduce((acc, current) => acc + current.maxGrade, 0);
          const headerConverted = header.map((header) => ({
            ...header,
            gradeScale: parseFloat((header.maxGrade * 100.0) / totalGrade).toFixed(2),
          }));

          const scoresConverted = scores.map((score) => {
            const grades = score.grades;
            score.grades = headerConverted.map((header) => {
              const foundGrades = grades.filter((g) => g.id === header.id);
              if (foundGrades.length > 0) {
                return foundGrades[0];
              } else {
                return {
                  id: header.id,
                  grade: null,
                  maxGrade: header.maxGrade,
                };
              }
            });
            return score;
          });
          setHeader(transformTableHeader(headerConverted));
          setScores(transformRows(scoresConverted));
        } else {
          console.log(data);

          Context?.openSnackBar('Preload bảng điểm thất bại');
        }
      })
      .catch((e) => {
        Context?.openSnackBar('Preload bảng điểm thất bại catch');
        console.log(e);
      });
  }, []);

  //#region MenuMore
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenuMore = Boolean(anchorEl);

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const openMenu = (event: React.MouseEvent<HTMLElement>, type: TypeMoreButton, data?: any) => {
    setAnchorEl(event.currentTarget);
    setMoreButtonEventData({ type, data });
  };

  const openMoreVertOneGradeOneStudent = (
    event: React.MouseEvent<HTMLElement>,
    studentId: number,
    exerciseId: number,
  ) => {
    openMenu(event, TypeMoreButton.ONE_STUDENT, {
      studentId,
      exerciseId,
    });
  };

  const openMoreVertOneGradeAllStudentStudent = (
    event: React.MouseEvent<HTMLElement>,
    exerciseId: number,
  ) => {
    openMenu(event, TypeMoreButton.ALL_STUDENT, exerciseId);
  };

  //#endregion

  //#region Handle

  const handleReturnGradeToAll = () => {
    const exerciseId = moreVertEventData.data;
    const studentGrade = scores.map((s) => ({
      mssv: s.mssv,
      grade: s[exerciseId + 'grade'],
      isFinalized: true,
    }));

    axiosMain
      .post(`/course/${id}/assignments/${exerciseId}/update-grade-normal`, {
        isFinalized: true,
        scores: studentGrade.map((s) => {
          if (!s.grade) {
            s.grade = 0;
          }
          return s;
        }),
        currentUser: currentUser,
      })
      .then(({ data }) => {
        if (data.status === 200) {
          Context?.openSnackBar('Trả tất cả bài thành công');
        }
      })
      .catch((e) => {
        Context?.openSnackBar('Trả tất cả bài thất bại');
      });
  };

  const handleReturnGradeToOneStudent = () => {
    const studentId = moreVertEventData.data.studentId;
    const exerciseId = moreVertEventData.data.exerciseId;
    const grade = scores.filter((s) => s.mssv === studentId)[0][exerciseId + 'grade'];
    axiosMain
      .post(`/course/${id}/assignments/${exerciseId}/update-grade-finalized`, {
        mssv: studentId.toString(),
        grade: grade,
        isFinalized: true,
        currentUser: currentUser,
      })
      .then(({ data }) => {
        if (data.status === 200) {
          Context?.openSnackBar('Trả bài thành công');
        }
      })
      .catch((e) => {
        Context?.openSnackBar('Trả bài thất bại');
      });
  };

  const handleUpdateGradesState = (studentId: number, exerciseId: number, newValue: number) => {
    setScores((oldScores) => {
      const newScores: any[] = [];
      for (let studentScore of oldScores) {
        if (studentScore.id === studentId) {
          const score = {
            ...studentScore,
            [exerciseId + 'grade']: newValue,
          };
          newScores.push(score);
        } else {
          newScores.push(studentScore);
        }
      }
      return newScores;
    });
  };

  const handleOpenUploadDialog = (type: TypeUploadExcelFile) => {
    if (uploadRef.current) {
      (uploadRef.current as any).click();
      setTypeUploadFile(type);
    }
  };

  const handleDownloadScoreTemplate = () => {
    const newWindow = window.open(
      process.env.REACT_APP_BASE_API + `course/download-template-update-grade`,
    );
    if (newWindow) newWindow.opener = null;
  };

  const handleDownloadStudentTemplate = () => {
    const newWindow = window.open(
      process.env.REACT_APP_BASE_API + `course/download-template-update-member`,
    );
    if (newWindow) newWindow.opener = null;
  };

  const handleDownloadTotalScore = () => {
    const newWindow = window.open(
      process.env.REACT_APP_BASE_API + `course/${id}/download-grade-board`,
    );
    if (newWindow) newWindow.opener = null;
  };

  const handleChangeChooseFile = (event: any) => {
    const fileObject = event.target.files[0];
    if (!fileObject) return;
    let formData = new FormData();
    formData.append('file', fileObject);
    formData.append('CurrentUser', currentUser);

    const exerciseId = moreVertEventData.data;

    if (typeUploadFile == TypeUploadExcelFile.GRADE_LIST) {
      uploadFile(`/course/${id}/assignments/${exerciseId}/update-grade`, formData);
    } else if (typeUploadFile == TypeUploadExcelFile.STUDENT_LIST) {
      uploadFile(`/course/${id}/update-student`, formData);
    }
  };

  const uploadFile = (baseUrl: string, formData: FormData) => {
    axiosMain
      .post(baseUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log(response);
        Context?.openSnackBar('Upload thành công');
        window.location.reload();
      })
      .catch((error) => Context?.openSnackBar('Upload file thất bại'))
      .finally(handleCloseMenu);
  };

  const handleOpenInfoDialog = (username: string) => {
    setOpen(true);
    if (!username) {
      setLoading(false);
      return setCurrentUserInfoData(null);
    }

    setLoading(true);
    apiUser
      .getUserInfo({
        username: username,
      })
      .then((data: IUserInfo) => {
        if (data.result === 1) {
          setCurrentUserInfoData(data.content);
        } else {
          Context?.openSnackBarError('Có lỗi xảy ra trong quá trình lấy thông tin user');
        }
      })
      .catch(() => {
        Context?.openSnackBarError('Có lỗi xảy ra trong quá trình lấy thông tin user');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  //#endregion

  const calculateAverage = (studentScore) => {
    const result = parseFloat(
      header.slice(2).reduce((acc, current) => {
        return acc + current.gradeScale * (+studentScore[current.id + 'grade'] ?? 0);
      }, 0) / 100.0,
    ).toFixed(2);
    return result;
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: '40px' }} className="grades-container">
      <Box sx={{ marginBottom: '20px' }} display="flex" gap="10px" justifyContent="flex-end">
        <Button variant="outlined" color="primary" onClick={handleDownloadStudentTemplate}>
          Template Danh sách SV
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            handleOpenUploadDialog(TypeUploadExcelFile.STUDENT_LIST);
          }}
        >
          Upload Danh sách SV
        </Button>
        <Button color="success" variant="outlined" onClick={handleDownloadScoreTemplate}>
          Template Bảng điểm
        </Button>

        <Button color="success" variant="outlined" onClick={handleDownloadTotalScore}>
          Bảng điểm tổng kết
        </Button>
      </Box>
      <table className="grade-data-sheet">
        <thead>
          <tr>
            {header.map((h, i) => (
              <th key={h.key + 'header'}>
                <Box
                  className="show-on-hover"
                  display={'flex'}
                  justifyContent={'space-around'}
                  alignItems="center"
                >
                  <div>
                    {h.key !== 'mssv' && h.key !== 'name' ? (
                      <>
                        {h.title}
                        <hr />
                        Phần trăm {h.gradeScale}%
                      </>
                    ) : (
                      h.title
                    )}
                  </div>
                  {i > 1 && (
                    <IconButton
                      className="more-button"
                      onClick={(e) => openMoreVertOneGradeAllStudentStudent(e, parseInt(h.key))}
                    >
                      <MoreVert />
                    </IconButton>
                  )}
                </Box>
              </th>
            ))}
            {header && header.length > 0 && <th>Trung bình</th>}
          </tr>
        </thead>
        <tbody>
          {scores.map((studentScore) => {
            return (
              <tr key={studentScore.mssv}>
                {header.map((h) => {
                  if (h.key === 'name') {
                    return (
                      <td key={studentScore.mssv + h.key}>
                        <span
                          className="username_clickable"
                          onClick={() => handleOpenInfoDialog(studentScore.username)}
                        >
                          {studentScore[h.key + '']}
                        </span>
                      </td>
                    );
                  } else if (h.key === 'mssv') {
                    return <td key={studentScore.mssv + h.key}>{studentScore[h.key + '']}</td>;
                  }
                  return (
                    <td key={studentScore.mssv + h.key}>
                      <Box
                        className="show-on-hover"
                        display="flex"
                        justifyContent="space-around"
                        alignItems="center"
                      >
                        <div>
                          <GradeEditable
                            value={studentScore[h.key + 'grade']}
                            exerciseId={parseInt(h.key)}
                            studentId={studentScore.id}
                            handleUpdateGradesState={handleUpdateGradesState}
                          />
                          <span>/{studentScore[h.key + 'max']}</span>
                        </div>
                        <IconButton
                          className="more-button"
                          onClick={(e) => {
                            openMoreVertOneGradeOneStudent(e, studentScore.mssv, parseInt(h.id));
                          }}
                        >
                          <MoreVert />
                        </IconButton>
                      </Box>
                    </td>
                  );
                })}
                <td>{calculateAverage(studentScore)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

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
        <MenuItem
          onClick={() => {
            if (moreVertEventData.type === TypeMoreButton.ALL_STUDENT) {
              handleReturnGradeToAll();
            } else if (moreVertEventData.type === TypeMoreButton.ONE_STUDENT) {
              handleReturnGradeToOneStudent();
            }
          }}
        >
          Trả bài
        </MenuItem>

        {moreVertEventData.type === TypeMoreButton.ALL_STUDENT && (
          <MenuItem
            onClick={() => {
              handleOpenUploadDialog(TypeUploadExcelFile.GRADE_LIST);
            }}
          >
            Upload điểm
          </MenuItem>
        )}
      </Menu>
      <input
        // @ts-ignore
        ref={uploadRef}
        type="file"
        style={{ display: 'none' }}
        accept=".csv, .xls, .xlsx"
        // @ts-ignore
        onChange={handleChangeChooseFile}
      />
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Thông tin sinh viên</DialogTitle>
        <DialogContent>
          {loading && <LinearProgress color="success" />}

          {!loading &&
            (userInfo !== null ? (
              <>
                <Box display="flex" justifyContent="flex-end">
                  <Avatar />
                </Box>

                <Box display="flex">
                  <strong>
                    <span>Email: &nbsp; </span>
                  </strong>
                  <span>{userInfo?.email}</span>
                </Box>
                <Box display="flex">
                  <strong>
                    <span>Tên:&nbsp; </span>
                  </strong>
                  <span>{userInfo?.firstName}</span>
                </Box>
                <Box display="flex">
                  <strong>
                    <span>Họ:&nbsp; </span>
                  </strong>
                  <span>{userInfo?.lastName}</span>
                </Box>
                <Box display="flex">
                  <strong>
                    <span>Mã số sinh viên:&nbsp; </span>
                  </strong>
                  <span>{userInfo?.studentID}</span>
                </Box>
              </>
            ) : (
              <Alert severity="info">
                Học sinh chưa liên kết tài khoản không thể xem thông tin
              </Alert>
            ))}
          <Box display="flex" justifyContent="flex-end">
            <Button onClick={handleCloseDialog}>Đóng</Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

// @ts-ignore
const GradeEditable = ({ value, studentId, exerciseId, handleUpdateGradesState }) => {
  const [state, setState] = React.useState(value);
  const onLeaveInput = () => {
    handleUpdateGradesState(studentId, exerciseId, +state);
  };

  return (
    <input
      className="grade-input"
      type="number"
      onBlur={onLeaveInput}
      style={{ display: 'inline' }}
      // value={state}
      defaultValue={state}
      onChange={(e) => setState(e.target.value)}
    />
  );
};

export default Grades;
