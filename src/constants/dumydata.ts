export const detailData: IResClassDetailData = {
  classCode: '12345',
  infor: {
    id: 0,
    classCode: '1234',
    room: 'Phòng 1',
    theme: 'Testing',
    className: 'Phát triển web',
  },
  classDeadline: [
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

export const classList: IResClassInfo[] = [
  { id: 0, classCode: '1234', room: 'Phòng 1', theme: 'Testing', className: 'Class 1' },
  { id: 1, classCode: '1234', room: 'Phòng 1', theme: 'Testing', className: 'Class 2' },
  { id: 2, classCode: '1234', room: 'Phòng 1', theme: 'Testing', className: 'Class 3' },
  { id: 3, classCode: '1234', room: 'Phòng 1', theme: 'Testing', className: 'Class 4' },
  { id: 4, classCode: '1234', room: 'Phòng 1', theme: 'Testing', className: 'Class 5' },
  { id: 5, classCode: '1234', room: 'Phòng 1', theme: 'Testing', className: 'Class 6' },
  { id: 6, classCode: '1234', room: 'Phòng 1', theme: 'Testing', className: 'Class 7' },
];

export const studentList: IResStudent[] = [
  { id: 0, displayName: 'Tất cả học viên' },
  {
    id: 1,

    displayName: 'Quốc Dũng Lê',
  },
];
