import { Student, UserConfig } from './types';

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

// MOCK DATA FOR COMMENT BANK MODULE
export const MOCK_USERS_DB: Record<string, UserConfig> = {
  'admin': {
    id: 'admin',
    name: 'Administrator',
    role: 'admin',
    avatarColor: 'from-blue-500 to-indigo-600',
    assignments: {
        'Khối 01': ['Toán', 'Tiếng Việt', 'Đạo đức'],
        'Khối 02': ['Toán', 'Tiếng Việt'],
        'Khối 03': ['Toán', 'Tiếng Việt', 'Tiếng Anh'],
        'Khối 04': ['Toán', 'Tiếng Việt', 'Tiếng Anh', 'Khoa học'],
        'Khối 05': ['Toán', 'Tiếng Việt', 'Tiếng Anh', 'Khoa học']
    }
  },
  'user_a': {
    id: 'user_a',
    name: 'Cô Nguyễn Thị Anh (GV Bộ môn)',
    role: 'subject_teacher',
    avatarColor: 'from-pink-500 to-rose-600',
    assignments: {
      'Khối 01': ['Tiếng Anh'],
      'Khối 05': ['Tiếng Anh']
    }
  },
  'user_b': {
    id: 'user_b',
    name: 'Thầy Trần Văn Toán (GV Chủ nhiệm)',
    role: 'homeroom_teacher',
    avatarColor: 'from-emerald-500 to-teal-600',
    assignments: {
      'Khối 01': ['Toán', 'Tiếng Việt', 'Tự nhiên và Xã hội', 'Đạo đức']
    }
  }
};

export const STUDENTS_DATA: Student[] = [
    // Class 1A2
    { stt: 1, id: '079219001740', name: 'Huỳnh Gia An', className: '1A2', dob: '01/09/2017', parent: 'T', status: 'Ngoan, đủ phẩm' },
    { stt: 2, id: '060519006820', name: 'Lưu Nhã An', className: '1A2', dob: '15/10/2017', parent: 'T', status: '' },
    { stt: 3, id: '079219031964', name: 'Vương Quốc Bảo', className: '1A2', dob: '22/08/2017', parent: 'T', status: 'Cần nhanh dạn hơn.' },
    { stt: 4, id: '083319008170', name: 'Nguyễn Hồ Tâm Châu', className: '1A2', dob: '05/01/2018', parent: 'T', status: '' },
    { stt: 5, id: '060519000233', name: 'Nguyễn Thái Linh Đan', className: '1A2', dob: '12/12/2017', parent: 'T', status: '' },
    { stt: 6, id: '079219004512', name: 'Lê Thị Mai Anh', className: '1A2', dob: '10/10/2017', parent: 'T', status: 'Chăm ngoan' },
    { stt: 7, id: '079219009876', name: 'Phạm Đức Duy', className: '1A2', dob: '05/05/2017', parent: 'H', status: 'Cần tập trung hơn' },
    { stt: 8, id: '079219003321', name: 'Trần Ngọc Hân', className: '1A2', dob: '12/08/2017', parent: 'T', status: '' },
    { stt: 9, id: '079219007744', name: 'Nguyễn Văn Hùng', className: '1A2', dob: '20/02/2018', parent: 'T', status: 'Sôi nổi phát biểu' },
    { stt: 10, id: '079219002255', name: 'Hoàng Thùy Linh', className: '1A2', dob: '01/11/2017', parent: 'T', status: '' },
    
    // Class 5A2
    { stt: 1, id: '123456789012', name: 'Trần Minh Quân', className: '5A2', dob: '10/05/2013', parent: 'T', status: 'Học tốt các môn.' },
    { stt: 2, id: '987654321098', name: 'Lê Phương Thảo', className: '5A2', dob: '22/11/2013', parent: 'T', status: 'Chăm chỉ, lễ phép.' },
    { stt: 3, id: '456789123456', name: 'Phạm Anh Khoa', className: '5A2', dob: '05/02/2013', parent: 'H', status: 'Cần cố gắng môn Toán.' },
    { stt: 4, id: '321654987321', name: 'Ngô Mỹ Linh', className: '5A2', dob: '18/07/2013', parent: 'T', status: 'Năng nổ tham gia hoạt động.' },
    { stt: 5, id: '789123456789', name: 'Vũ Quốc Khánh', className: '5A2', dob: '30/03/2013', parent: 'T', status: '' },
    { stt: 6, id: '112233445566', name: 'Đặng Văn Nam', className: '5A2', dob: '15/06/2013', parent: 'T', status: 'Có tiến bộ' },
    { stt: 7, id: '665544332211', name: 'Bùi Thị Lan', className: '5A2', dob: '28/09/2013', parent: 'T', status: '' },
    { stt: 8, id: '998877665544', name: 'Đỗ Minh Triết', className: '5A2', dob: '02/01/2013', parent: 'H', status: 'Cần rèn chữ viết' },
    { stt: 9, id: '445566778899', name: 'Hồ Thu Trang', className: '5A2', dob: '14/12/2013', parent: 'T', status: 'Học đều các môn' },
    { stt: 10, id: '223344556677', name: 'Lý Gia Huy', className: '5A2', dob: '30/04/2013', parent: 'T', status: '' },
];