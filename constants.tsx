import { Student } from './types';

export const SUBJECTS_BY_CLASS: Record<string, string[]> = {
  '1A2': [
    'Tiếng Việt',
    'Toán',
    'Đạo đức',
    'Tự nhiên và Xã hội',
    'Âm nhạc',
    'Mỹ thuật',
    'Giáo dục thể chất',
    'Hoạt động trải nghiệm'
  ],
  '5A2': [
    'Tiếng Việt',
    'Toán',
    'Ngoại ngữ 1',
    'Lịch sử và Địa lý',
    'Khoa học',
    'Tin học và Công nghệ',
    'Đạo đức',
    'Giáo dục thể chất',
    'Nghệ thuật (Âm nhạc, Mỹ thuật)',
    'Hoạt động trải nghiệm'
  ]
};

export const STUDENTS_DATA: Student[] = [
    // Class 1A2
    { stt: 1, id: '079219001740', name: 'Huỳnh Gia An', className: '1A2', dob: '01/09/2017', parent: 'T', status: 'Ngoan, đủ phẩm' },
    { stt: 2, id: '060519006820', name: 'Lưu Nhã An', className: '1A2', dob: '15/10/2017', parent: 'T', status: '' },
    { stt: 3, id: '079219031964', name: 'Vương Quốc Bảo', className: '1A2', dob: '22/08/2017', parent: 'T', status: 'Cần nhanh dạn hơn.' },
    { stt: 4, id: '083319008170', name: 'Nguyễn Hồ Tâm Châu', className: '1A2', dob: '05/01/2018', parent: 'T', status: '' },
    { stt: 5, id: '060519000233', name: 'Nguyễn Thái Linh Đan', className: '1A2', dob: '12/12/2017', parent: 'T', status: '' },
    
    // Class 5A2
    { stt: 1, id: '123456789012', name: 'Trần Minh Quân', className: '5A2', dob: '10/05/2013', parent: 'T', status: 'Học tốt các môn.' },
    { stt: 2, id: '987654321098', name: 'Lê Phương Thảo', className: '5A2', dob: '22/11/2013', parent: 'T', status: 'Chăm chỉ, lễ phép.' },
    { stt: 3, id: '456789123456', name: 'Phạm Anh Khoa', className: '5A2', dob: '05/02/2013', parent: 'H', status: 'Cần cố gắng môn Toán.' },
    { stt: 4, id: '321654987321', name: 'Ngô Mỹ Linh', className: '5A2', dob: '18/07/2013', parent: 'T', status: 'Năng nổ tham gia hoạt động.' },
    { stt: 5, id: '789123456789', name: 'Vũ Quốc Khánh', className: '5A2', dob: '30/03/2013', parent: 'T', status: '' },
];