
import React from 'react';
import { STUDENTS_DATA } from '../constants';
import { ViewFilter } from '../types';
import CommentInput from './CommentInput';

interface GradeTableProps {
  viewFilter: ViewFilter;
}

interface ColumnDef {
  name: string;
  group: 'subjects' | 'qualities' | 'skills';
  subgroup: 'common' | 'specific' | null;
  isComment?: boolean;
}

const GradeTable: React.FC<GradeTableProps> = ({ viewFilter }) => {
  // Column definitions based on the provided design
  const columnSets: Record<ViewFilter, ColumnDef[]> = {
    all: [
      { name: 'Tiếng Việt', group: 'subjects', subgroup: null },
      { name: 'Toán', group: 'subjects', subgroup: null },
      { name: 'Đạo đức', group: 'subjects', subgroup: null },
      { name: 'Tự nhiên và xã hội', group: 'subjects', subgroup: null },
      { name: 'Âm nhạc', group: 'subjects', subgroup: null },
      { name: 'HĐTN', group: 'subjects', subgroup: null },
      { name: 'Ngoại ngữ', group: 'subjects', subgroup: null },
      { name: 'Tin học', group: 'subjects', subgroup: null },
      { name: 'Yêu nước', group: 'qualities', subgroup: null },
      { name: 'Nhân ái', group: 'qualities', subgroup: null },
      { name: 'Chăm chỉ', group: 'qualities', subgroup: null },
      { name: 'Trung thực', group: 'qualities', subgroup: null },
      { name: 'Trách nhiệm', group: 'qualities', subgroup: null },
      { name: 'Tự chủ và tự học', group: 'skills', subgroup: 'common' },
      { name: 'Giao tiếp và hợp tác', group: 'skills', subgroup: 'common' },
      { name: 'Giải quyết vấn đề và sáng tạo', group: 'skills', subgroup: 'common' },
      { name: 'Ngôn ngữ', group: 'skills', subgroup: 'specific' },
      { name: 'Tính toán', group: 'skills', subgroup: 'specific' },
      { name: 'Khoa học', group: 'skills', subgroup: 'specific' },
      { name: 'Thẩm mỹ', group: 'skills', subgroup: 'specific' },
      { name: 'Thể chất', group: 'skills', subgroup: 'specific' }
    ],
    subjects: [
      { name: 'Tiếng Việt', group: 'subjects', subgroup: null },
      { name: 'Toán', group: 'subjects', subgroup: null },
      { name: 'Đạo đức', group: 'subjects', subgroup: null },
      { name: 'Tự nhiên và xã hội', group: 'subjects', subgroup: null },
      { name: 'Âm nhạc', group: 'subjects', subgroup: null },
      { name: 'HĐTN', group: 'subjects', subgroup: null },
      { name: 'Ngoại ngữ', group: 'subjects', subgroup: null },
      { name: 'Tin học', group: 'subjects', subgroup: null }
    ],
    skills: [
      { name: 'Tự chủ và tự học', group: 'skills', subgroup: 'common' },
      { name: 'Giao tiếp và hợp tác', group: 'skills', subgroup: 'common' },
      { name: 'Giải quyết vấn đề và sáng tạo', group: 'skills', subgroup: 'common' },
      { name: 'Nhận xét', group: 'skills', subgroup: 'common', isComment: true },
      { name: 'Ngôn ngữ', group: 'skills', subgroup: 'specific' },
      { name: 'Tính toán', group: 'skills', subgroup: 'specific' },
      { name: 'Khoa học', group: 'skills', subgroup: 'specific' },
      { name: 'Thẩm mỹ', group: 'skills', subgroup: 'specific' },
      { name: 'Thể chất', group: 'skills', subgroup: 'specific' },
      { name: 'Nhận xét', group: 'skills', subgroup: 'specific', isComment: true }
    ],
    qualities: [
      { name: 'Yêu nước', group: 'qualities', subgroup: null },
      { name: 'Nhân ái', group: 'qualities', subgroup: null },
      { name: 'Chăm chỉ', group: 'qualities', subgroup: null },
      { name: 'Trung thực', group: 'qualities', subgroup: null },
      { name: 'Trách nhiệm', group: 'qualities', subgroup: null }
    ],
  };

  const currentColumns = columnSets[viewFilter];

  return (
    <div className="bg-white rounded-t-2xl shadow-lg overflow-hidden border border-gray-200 flex-1 flex flex-col min-h-0">
      <div className="overflow-auto custom-scrollbar flex-1 pb-40"> {/* Add padding bottom for dropdowns */}
        <table className="w-full min-w-max border-separate border-spacing-0">
          <thead className="bg-white sticky top-0 z-20">
            {/* Header Row 1 - Main Groups */}
            <tr className="border-b border-gray-300">
              <th rowSpan={3} className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky left-0 bg-white z-20 border-r border-b border-gray-300">STT</th>
              <th rowSpan={3} className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky left-[50px] bg-white z-20 border-r border-b border-gray-300">Mã HS</th>
              <th rowSpan={3} className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky left-[150px] bg-white z-20 min-w-[180px] border-r border-b border-gray-300 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Họ và tên</th>
              
              {viewFilter === 'all' && (
                <>
                  <th colSpan={8} className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider bg-white border-r border-b border-gray-300">
                    Môn học và hoạt động giáo dục
                  </th>
                  <th colSpan={5} className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider bg-white border-r border-b border-gray-300">
                    Phẩm chất chủ yếu
                  </th>
                  <th colSpan={8} className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider bg-white border-r border-b border-gray-300">
                    Năng lực cốt lõi
                  </th>
                </>
              )}
              
              {viewFilter === 'subjects' && (
                <th colSpan={8} className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider bg-white border-r border-b border-gray-300">
                  Môn học và hoạt động giáo dục
                </th>
              )}
              
              {viewFilter === 'qualities' && (
                <th colSpan={5} className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider bg-white border-r border-b border-gray-300">
                  Phẩm chất chủ yếu
                </th>
              )}
              
              {viewFilter === 'skills' && (
                <th colSpan={10} className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider bg-white border-r border-b border-gray-300">
                  Năng lực cốt lõi
                </th>
              )}
              
              {viewFilter !== 'skills' && (
                <th rowSpan={3} className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[240px] bg-white border-l border-b border-gray-300">
                  {viewFilter === 'qualities' ? 'Nhận xét' : 'Nhận xét in học bạ'}
                </th>
              )}
            </tr>
            
            {/* Header Row 2 - Subgroups */}
            <tr className="border-b border-gray-300">
              {viewFilter === 'all' && (
                <>
                  {/* Môn học - merged with row below */}
                  {currentColumns.slice(0, 8).map((col, idx) => (
                    <th 
                      key={`subject-${idx}`}
                      rowSpan={2}
                      className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider min-w-[90px] bg-white border-r border-b border-gray-300 align-middle text-blue-700"
                    >
                      <div className="leading-tight">{col.name}</div>
                      <div className="text-[10px] text-gray-500 font-normal mt-1 normal-case">Mức</div>
                    </th>
                  ))}
                  {/* Phẩm chất - merged with row below */}
                  {currentColumns.slice(8, 13).map((col, idx) => (
                    <th 
                      key={`quality-${idx}`}
                      rowSpan={2}
                      className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider min-w-[90px] bg-white border-r border-b border-gray-300 align-middle text-emerald-700"
                    >
                      <div className="leading-tight">{col.name}</div>
                      <div className="text-[10px] text-gray-500 font-normal mt-1 normal-case">Mức</div>
                    </th>
                  ))}
                  {/* Năng lực */}
                  <th colSpan={3} className="px-4 py-2 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider bg-white border-r border-b border-gray-300">
                    Năng lực chung
                  </th>
                  <th colSpan={5} className="px-4 py-2 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider bg-white border-r border-b border-gray-300">
                    Năng lực đặc thù
                  </th>
                </>
              )}
              
              {viewFilter === 'subjects' && (
                currentColumns.map((col, idx) => (
                  <th 
                    key={`subject-${idx}`}
                    rowSpan={2}
                    className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider min-w-[90px] bg-white border-r border-b border-gray-300 align-middle text-blue-700"
                  >
                    <div className="leading-tight">{col.name}</div>
                    <div className="text-[10px] text-gray-500 font-normal mt-1 normal-case">Mức</div>
                  </th>
                ))
              )}
              
              {viewFilter === 'qualities' && (
                currentColumns.map((col, idx) => (
                  <th 
                    key={`quality-${idx}`}
                    rowSpan={2}
                    className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider min-w-[90px] bg-white border-r border-b border-gray-300 align-middle text-emerald-700"
                  >
                    <div className="leading-tight">{col.name}</div>
                    <div className="text-[10px] text-gray-500 font-normal mt-1 normal-case">Mức</div>
                  </th>
                ))
              )}
              
              {viewFilter === 'skills' && (
                <>
                  <th colSpan={4} className="px-4 py-2 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider bg-white border-r border-b border-gray-300">
                    Năng lực chung
                  </th>
                  <th colSpan={6} className="px-4 py-2 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider bg-white border-r border-b border-gray-300">
                    Năng lực đặc thù
                  </th>
                </>
              )}
            </tr>
            
            {/* Header Row 3 - Specific Columns */}
            <tr className="border-b-2 border-gray-400">
              {viewFilter === 'all' && (
                <>
                  {currentColumns.slice(13).map((col, idx) => (
                    <th 
                      key={idx} 
                      className={`px-3 py-3 text-center text-xs font-bold uppercase tracking-wider ${col.isComment ? 'min-w-[220px]' : 'min-w-[90px]'} bg-white border-r border-b border-gray-300 text-amber-700`}
                    >
                      <div className="leading-tight">{col.name}</div>
                      {!col.isComment && <div className="text-[10px] text-gray-500 font-normal mt-1 normal-case">Mức</div>}
                    </th>
                  ))}
                </>
              )}
              
              {viewFilter === 'skills' && (
                currentColumns.map((col, idx) => (
                  <th 
                    key={idx} 
                    className={`px-3 py-3 text-center text-xs font-bold uppercase tracking-wider ${col.isComment ? 'min-w-[220px]' : 'min-w-[90px]'} bg-white border-r border-b border-gray-300 text-amber-700`}
                  >
                    <div className="leading-tight">{col.name}</div>
                    {!col.isComment && <div className="text-[10px] text-gray-500 font-normal mt-1 normal-case">Mức</div>}
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {STUDENTS_DATA.map((student) => (
              <tr key={student.stt} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-4 py-4 text-sm font-medium text-gray-900 sticky left-0 bg-white group-hover:bg-blue-50/30 transition-colors z-10 border-r border-gray-300 align-middle">{student.stt}</td>
                <td className="px-4 py-4 text-sm text-gray-700 sticky left-[50px] bg-white group-hover:bg-blue-50/30 transition-colors z-10 border-r border-gray-300 align-middle">{student.id}</td>
                <td className="px-4 py-4 text-sm font-semibold text-gray-900 sticky left-[150px] bg-white group-hover:bg-blue-50/30 transition-colors z-10 border-r border-gray-300 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] align-middle">{student.name}</td>
                {currentColumns.map((col, idx) => {
                  const isSubject = ['Tiếng Việt', 'Toán', 'Đạo đức', 'Tự nhiên và xã hội', 'Âm nhạc', 'HĐTN', 'Ngoại ngữ', 'Tin học'].includes(col.name);
                  const isComment = col.isComment;
                  
                  return (
                    <td key={idx} className={`px-2 py-3 text-center text-sm font-medium text-gray-700 border-r border-gray-300 ${isComment ? 'align-top' : 'align-middle'}`}>
                      {isComment ? (
                        <CommentInput placeholder="Nhận xét..." />
                      ) : (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 border border-gray-200">
                          {isSubject ? (student.parent === 'T' ? 'T' : 'H') : 'Đ'}
                        </span>
                      )}
                    </td>
                  );
                })}
                {viewFilter !== 'skills' && (
                  <td className="px-2 py-3 border-l border-gray-300 align-top">
                    <CommentInput initialValue={student.status} placeholder="Nhập nhận xét..." />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GradeTable;
