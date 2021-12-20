import { MoreVert } from '@mui/icons-material';
import { Button, Container, IconButton, Menu, MenuItem } from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';
import React from 'react';
import './Grades.scss';

const dummyData = {
  header: [
    {
      id: 1,
      name: 'Test 1 ',
      maxGrade: 20,
      gradeScale: 30,
    },
    {
      id: 2,
      name: 'Test 2',
      maxGrade: 20,
      gradeScale: 30,
    },
    {
      id: 3,
      name: 'Test 1 ',
      maxGrade: 20,
      gradeScale: 30,
    },
  ],
  scores: [
    {
      id: 1,

      mssv: '18120331',
      name: 'nguyen vẵn test',
      grades: [
        {
          id: 1,
          grade: -1,
          maxGrade: 20,
        },
        {
          id: 2,
          grade: -1,
          maxGrade: 20,
        },
        {
          id: 3,
          grade: -1,
          maxGrade: 20,
        },
      ],
    },
  ],
};

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
  return rows.map((s) => {
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
  });
};

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
  const [moreVertEventData, setMoreButtonEventData] = React.useState<MoreButtonEventData>({
    type: TypeMoreButton.NONE,
    data: null,
  });

  const uploadRef = React.useRef();
  const header = transformTableHeader(dummyData.header);
  let [scoreData, setScores] = React.useState(transformRows(dummyData.scores));

  // Menu more
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenuMore = Boolean(anchorEl);

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleReturnGradeToAll = () => {
    const exerciseId = moreVertEventData.data;
    // TODO: HANDLE SAVE AND NOTIFY TO ALL STUDENTS GRADE OF THIS EXERCISE
  };

  const handleReturnGradeToOneStudent = () => {
    const studentId = moreVertEventData.data.studentId;
    const exerciseId = moreVertEventData.data.exerciseId;
    // TODO: HANDLE SAVE AND NOTIFY TO THE STUDENT
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
    openMenu(event, TypeMoreButton.ONE_STUDENT, exerciseId);
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

  const handleUploadScores = () => {
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

    // TODO: CHANGE URL
    uploadFile('http://localhost/UploadFile', formData);
  };

  const uploadFile = (baseUrl: string, formData: FormData) => {
    axios
      .post(baseUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log('Success ' + response);
      })
      .catch((error) => console.log(error));
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
  return (
    <Container maxWidth="lg" sx={{ marginTop: '40px' }} className="grades-container">
      <Box sx={{ marginBottom: '20px' }} display="flex" gap="10px" justifyContent="flex-end">
        <Button variant="outlined" color="primary" onClick={handleUploadScores}>
          Upload Bảng điểm
          <input
            // @ts-ignore
            ref={uploadRef}
            type="file"
            style={{ display: 'none' }}
            accept=".csv"
            // @ts-ignore
            onChange={handleChangeChooseFile}
          />
        </Button>
        <Button color="primary" variant="outlined" onClick={handleDownloadScoreTemplate}>
          Download Mẫu
        </Button>

        <Button color="primary" onClick={handleDownloadTotalScore}>
          Download Bảng điểm tổng kết
        </Button>
      </Box>
      <table className="grade-data-sheet">
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
        <tbody>
          {scoreData.map((studentScore) => {
            return (
              <tr key={studentScore.mssv}>
                {header.map((h) => {
                  var td = null;

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
      value={state}
      defaultValue={state}
      onChange={(e) => setState(e.target.value)}
    />
  );
};

export default Grades;
