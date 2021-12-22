// @ts-nocheck
import { MoreVert } from '@mui/icons-material';
import { Button, Container, IconButton, Menu, MenuItem } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { useParams } from 'react-router';
import { useAppContextApi, useAppSelector } from '../../redux';
import axiosMain from '../../services/axios/axiosMain';
import './Grades.scss';

enum TypeMoreButton {
  NONE,
  ALL_STUDENT,
  ONE_STUDENT,
}

interface MoreButtonEventData {
  type: TypeMoreButton;
  data: any | null;
}

const Grades = () => {
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

  const [moreVertEventData, setMoreButtonEventData] = React.useState<MoreButtonEventData>({
    type: TypeMoreButton.NONE,
    data: null,
  });

  const uploadRef = React.useRef();
  const [header, setHeader] = React.useState<any[]>([]);
  let [scores, setScores] = React.useState<any[]>([]);
  const Context = useAppContextApi();

  const { id } = useParams<any>();
  let currentUser = useAppSelector((state) => state.authReducer.currentUser);
  const loadGradeData = () => {};
  React.useEffect(() => {
    axiosMain
      .get(`/course/${id}/all-grades?currentUser=${currentUser}`)
      .then(({ data }) => {
        if (data.status === 200) {
          const content = data.content;
          setHeader(transformTableHeader(content.header));
          setScores(transformRows(content.scores));
        } else {
          Context?.openSnackBar('Preload bảng điểm thất bại');
        }
      })
      .catch((e) => {
        Context?.openSnackBar('Preload bảng điểm thất bại');
        console.log(e);
      });
  }, []);

  // Menu more
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenuMore = Boolean(anchorEl);

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

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
        scores: studentGrade,
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
    const grade = scores.filter((s) => s.id === +studentId)[0][exerciseId + 'grade'];
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

  const handleUpdateGradesState = (studentId: number, exerciseId: number, newValue: number) => {
    setScores((oldScores) => {
      const newScores: any[] = [];
      for (let studentScore of oldScores) {
        if (studentScore.id === studentId) {
          console.log('Found student');

          const score = {
            ...studentScore,
            [exerciseId + 'grade']: newValue,
          };
          newScores.push(score);
        } else {
          newScores.push(studentScore);
        }
      }
      console.log(newScores);
      return newScores;
    });
  };

  const handleOpenUploadDialog = () => {
    if (uploadRef.current) {
      (uploadRef.current as any).click();
    }
  };

  const handleDownloadScoreTemplate = () => {
    // TODO: CHANGE URL
    const newWindow = window.open(
      'http://localhost/download/DDGame.jar',
      '_blank',
      'noopener,noreferrer',
    );
    if (newWindow) newWindow.opener = null;
  };

  const handleChangeChooseFile = (event: any) => {
    const fileObject = event.target.files[0];
    if (!fileObject) return;
    console.log(fileObject);
    let formData = new FormData();
    formData.append('file', fileObject);
    formData.append('CurrentUser', currentUser);

    const exerciseId = moreVertEventData.data;
    // TODO: CHANGE URL
    uploadFile(`/course/${id}/assignments/${exerciseId}/update-grade`, formData);
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

        window.location.reload();

        // axiosMain
        //   .get(`/course/${id}/all-grades?currentUser=${currentUser}`)
        //   .then(({ data }) => {
        //     if (data.status === 200) {
        //       const content = data.content;
        //       setHeader((prev) => transformTableHeader(content.header));
        //       setScores((prev) => transformRows(content.scores));

        //     } else {
        //       Context?.openSnackBar('Preload bảng điểm thất bại');
        //     }
        //   })
        //   .catch((e) => {
        //     Context?.openSnackBar('Preload bảng điểm thất bại');
        //     console.log(e);
        //   });

        // Context?.openSnackBar('Upload điểm cho ' + moreVertEventData.data + ' thành công');
      })
      .catch((error) => console.log(error))
      .finally(handleCloseMenu);
  };

  const handleDownloadTotalScore = () => {
    // TODO: CHANGE URL
    const newWindow = window.open(
      'http://localhost/download/DDGame.jar',
      '_blank',
      'noopener,noreferrer',
    );
    if (newWindow) newWindow.opener = null;
  };
  console.log('RERENDER');

  return (
    <Container maxWidth="lg" sx={{ marginTop: '40px' }} className="grades-container">
      <Box sx={{ marginBottom: '20px' }} display="flex" gap="10px" justifyContent="flex-end">
        <Button variant="outlined" color="primary" onClick={handleOpenUploadDialog}>
          Upload Danh sách SV
        </Button>
        <Button color="primary" variant="outlined" onClick={handleDownloadScoreTemplate}>
          Bảng điểm mẫu
        </Button>

        <Button color="primary" onClick={handleDownloadTotalScore}>
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
          </tr>
        </thead>
        <tbody>
          {scores.map((studentScore) => {
            return (
              <tr key={studentScore.mssv}>
                {header.map((h) => {
                  if (h.key === 'mssv' || h.key === 'name') {
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
                        {console.log(
                          studentScore[h.key + 'grade'] + '/' + studentScore[h.key + 'max'],
                        )}
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
                            openMoreVertOneGradeOneStudent(
                              e,
                              parseInt(studentScore.id),
                              parseInt(h.id),
                            );
                          }}
                        >
                          <MoreVert />
                        </IconButton>
                      </Box>
                    </td>
                  );
                })}
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
              handleOpenUploadDialog();
            }}
          >
            Upload điểm
            <input
              // @ts-ignore
              ref={uploadRef}
              type="file"
              style={{ display: 'none' }}
              accept=".csv, .xls, .xlsx"
              // @ts-ignore
              onChange={handleChangeChooseFile}
            />
          </MenuItem>
        )}
      </Menu>
    </Container>
  );
};

// @ts-ignore
const GradeEditable = ({ value, studentId, exerciseId, handleUpdateGradesState }) => {
  const [state, setState] = React.useState(value);
  const onLeaveInput = () => {
    console.log('On leave input');
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
