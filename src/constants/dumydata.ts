import { ClassDetailData } from '../@types/apiResponse';
import { Student } from './../@types/apiResponse.d';

export const detailData: ClassDetailData = {
  classCode: '12345',
  infor: {
    classCode: '1234',
    room: 'Phòng 1',
    theme: 'Testing',
  },
  classDeadLine: [
    {
      id: 1,
      name: 'Bai tập web',
      day: 'Thứ Tư',
      hour: '22:00',
    },
    {
      id: 2,
      name: 'Bai tập web',
      day: 'Thứ Tư',
      hour: '22:00',
    },
  ],
  className: 'Web nâng cao',
  classStatus: [
    {
      authorName: 'Thầy ',
      time: '10:10',
      comments: [
        {
          author: 'ABC',
          content: 'Bài này dễ',
          time: '10:00',
        },
      ],
      status: 'Hello các e <b>HEll oworld</b>',
    },
    {
      authorName: 'Thầy ',
      time: '10:10',
      comments: [
        {
          author: 'ABC',
          content: 'Bài này dễ',
          time: '10:00',
        },
      ],
      status: 'Hello các e',
    },
  ],
};

const classList: string[] = [
  'Lớp học 1',
  'Lớp học 2',
  'Lớp học 3',
  'Lớp học 4',
  'Lớp học 5',
  'Lớp học 6',
  'Lớp học 7',
];

const studentList: Student[] = [
  { id: 0, displayName: 'Tất cả học viên' },
  {
    id: 1,

    displayName: 'Quốc Dũng Lê',
  },
];
