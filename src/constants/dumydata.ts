import { ClassDetailData } from '../@types/apiResponse';

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
