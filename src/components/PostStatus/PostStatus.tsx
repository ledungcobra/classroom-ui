import {
  Box,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import React from 'react';
import { MAIN_COLOR } from '../../constants';
import './PostStatus.scss';
export interface IPostStatus {
  classList: IResClassInfo[];
  studentList: IResStudent[];
}

export const PostStatus: React.FC<IPostStatus> = ({ classList, studentList }) => {
  const [selectedClass, setSelectedClass] = React.useState<IResClassInfo | string>('');
  const [selectedStudent, setSelectedStudent] = React.useState<IResStudent[]>([]);
  const selectedStudentList = selectedStudent.map((s) => s.displayName);

  const handleSelectStudentChange = (event: SelectChangeEvent) => {
    console.log(event.target.value);

    setSelectedStudent(
      studentList.filter((s) =>
        (typeof event.target.value === 'string'
          ? event.target.value.split(',')
          : event.target.value
        )
          .filter((s1) => typeof s1 !== 'string')
          .map((s1) => parseInt(s1))
          .includes(s.id),
      ),
    );
  };
  const handleSelectClassChange = (event: SelectChangeEvent) => {
    const foundClass = classList.find((c: any) => c.id === +event.target.value);
    if (foundClass) {
      setSelectedClass(foundClass);
    }
  };
  return (
    <Card className="post-status" variant="outlined">
      <CardContent>
        <Box width="100%" display="flex" gap="10px" flexDirection="column" alignItems="flex-start">
          <Typography variant="body1" color={MAIN_COLOR} textAlign="left">
            Dành cho
          </Typography>
          <Box display="flex" gap="10px">
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel id="label-class-select">Chọn lớp</InputLabel>
              <Select
                labelId="label-class-select"
                placeholder="Chọn lớp"
                required
                autoWidth
                label="Chọn lớp"
                value={typeof selectedClass === 'string' ? selectedClass : selectedClass.className}
                onChange={handleSelectClassChange}
              >
                {classList.map((c, index) => (
                  <MenuItem key={index} value={c.id}>
                    {c.className}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel id="student-select">Chọn học sinh</InputLabel>

              <Select
                labelId="student-select"
                autoWidth
                label="Chọn học sinh"
                required
                multiple
                // @ts-ignore
                value={selectedStudentList}
                placeholder="Chọn học sinh"
                onChange={handleSelectStudentChange}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 48 * 4.5 + 8,
                      width: 250,
                    },
                  },
                }}
              >
                {studentList.map((s, index) => (
                  <MenuItem key={index} value={s.id}>
                    <Checkbox checked={selectedStudent.filter((s1) => s1.id === s.id).length > 0} />
                    <ListItemText primary={s.displayName}></ListItemText>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
