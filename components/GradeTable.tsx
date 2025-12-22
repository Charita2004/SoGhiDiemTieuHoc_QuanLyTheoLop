import React from 'react';
import { STUDENTS_DATA, SUBJECTS_BY_CLASS } from '../constants';
import { ViewFilter } from '../types';
import CommentInput from './CommentInput';

interface GradeTableProps {
  viewFilter: ViewFilter;
  term: string;
  selectedClass: string;
}

interface ColumnDef {
  name: string;
  group: 'subjects' | 'qualities' | 'skills';
  subgroup: 'common' | 'specific' | null;
  isComment?: boolean;
}

const GradeTable: React.FC<GradeTableProps> = ({ viewFilter, term, selectedClass }) => {
  const filteredStudents = STUDENTS_DATA.filter(s => s.className === selectedClass);
  const classSubjects = SUBJECTS_BY_CLASS[selectedClass] || SUBJECTS_BY_CLASS['1A2'];

  // Determine split subjects based on class and term
  const getSplitSubjects = () => {
    if (selectedClass === '1A2' && term === 'Cuối kỳ 1') {
      return ['Tiếng Việt', 'Toán'];
    }
    if (selectedClass === '5A2') {
      if (term === 'Giữa kỳ 1') return ['Tiếng Việt', 'Toán'];
      if (term === 'Cuối kỳ 1') return [
        'Tiếng Việt', 
        'Toán', 
        'Ngoại ngữ 1', 
        'Lịch sử và Địa lý', 
        'Khoa học', 
        'Tin học và Công nghệ'
      ];
    }
    return [];
  };

  const splitSubjects = getSplitSubjects();
  const isSplitActive = splitSubjects.length > 0;

  const commonSkills: ColumnDef[] = [
    { name: 'Tự chủ và tự học', group: 'skills', subgroup: 'common' },
    { name: 'Giao tiếp và hợp tác', group: 'skills', subgroup: 'common' },
    { name: 'Giải quyết vấn đề và sáng tạo', group: 'skills', subgroup: 'common' },
  ];

  const specificSkills: ColumnDef[] = [
    { name: 'Ngôn ngữ', group: 'skills', subgroup: 'specific' },
    { name: 'Tính toán', group: 'skills', subgroup: 'specific' },
    { name: 'Khoa học', group: 'skills', subgroup: 'specific' },
    ...(selectedClass === '5A2' ? [
      { name: 'Công nghệ', group: 'skills', subgroup: 'specific' } as ColumnDef,
      { name: 'Tin học', group: 'skills', subgroup: 'specific' } as ColumnDef,
    ] : []),
    { name: 'Thẩm mỹ', group: 'skills', subgroup: 'specific' },
    { name: 'Thể chất', group: 'skills', subgroup: 'specific' }
  ];

  const columnSets: Record<ViewFilter, ColumnDef[]> = {
    all: [
      ...classSubjects.map(name => ({ name, group: 'subjects', subgroup: null } as ColumnDef)),
      { name: 'Yêu nước', group: 'qualities', subgroup: null },
      { name: 'Nhân ái', group: 'qualities', subgroup: null },
      { name: 'Chăm chỉ', group: 'qualities', subgroup: null },
      { name: 'Trung thực', group: 'qualities', subgroup: null },
      { name: 'Trách nhiệm', group: 'qualities', subgroup: null },
      ...commonSkills,
      ...specificSkills
    ],
    subjects: [
      ...classSubjects.map(name => ({ name, group: 'subjects', subgroup: null } as ColumnDef))
    ],
    skills: [
      { name: 'Tự chủ và tự học', group: 'skills', subgroup: 'common' },
      { name: 'Giao tiếp và hợp tác', group: 'skills', subgroup: 'common' },
      { name: 'Giải quyết vấn đề và sáng tạo', group: 'skills', subgroup: 'common' },
      { name: 'Nhận xét', group: 'skills', subgroup: 'common', isComment: true },
      ...specificSkills,
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
  const isEndOfYearAll = viewFilter === 'all' && term === 'Cuối năm';

  const getCommentColumnHeader = () => {
    if (viewFilter === 'qualities') return 'Nhận xét';
    return term === 'Cuối năm' ? 'Nhận xét in học bạ' : 'Nhận xét';
  };

  const RewardCell = () => (
    <div className="w-[120px] h-[60px] border border-gray-300 rounded mx-auto p-1 flex flex-col justify-between bg-white cursor-pointer hover:border-blue-400 transition-colors">
      <div className="text-gray-400 text-xs text-center mt-1">Bấm vào đây</div>
      <div className="text-gray-400 text-[10px] text-right">0 / 200</div>
    </div>
  );

  const subjectCount = classSubjects.length;
  // Dynamic colspan calculation based on number of split subjects
  const effectiveSubjectColSpan = subjectCount + splitSubjects.length;
  
  const specificSkillCount = specificSkills.length;
  const coreSkillCount = commonSkills.length + specificSkillCount;

  return (
    <div className="bg-white rounded-t-2xl shadow-lg overflow-hidden border border-gray-200 flex-1 flex flex-col min-h-0">
      <div className="overflow-auto custom-scrollbar flex-1 pb-40">
        <table className="w-full min-w-max border-separate border-spacing-0">
          <thead className="bg-white sticky top-0 z-20">
            <tr className="border-b border-gray-300">
              <th rowSpan={3} className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky left-0 bg-white z-20 border-r border-b border-gray-300">STT</th>
              <th rowSpan={3} className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky left-[50px] bg-white z-20 border-r border-b border-gray-300">Mã HS</th>
              <th rowSpan={3} className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky left-[150px] bg-white z-20 min-w-[180px] border-r border-b border-gray-300 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] z-30">Họ và tên</th>
              
              {(viewFilter === 'all' || viewFilter === 'subjects') && (
                <th colSpan={effectiveSubjectColSpan} className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider bg-white border-r border-b border-gray-300">
                  Môn học và hoạt động giáo dục
                </th>
              )}
              
              {viewFilter === 'all' && (
                <>
                  <th colSpan={5} className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider bg-white border-r border-b border-gray-300">
                    Phẩm chất chủ yếu
                  </th>
                  <th colSpan={coreSkillCount} className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider bg-white border-r border-b border-gray-300">
                    Năng lực cốt lõi
                  </th>
                </>
              )}

              {isEndOfYearAll && (
                <>
                   <th rowSpan={3} className="px-2 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider bg-white border-r border-b border-gray-300 min-w-[80px]">
                      Đánh giá KQGD
                   </th>
                   <th colSpan={2} className="px-2 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider bg-white border-r border-b border-gray-300">
                      Khen thưởng
                   </th>
                   <th rowSpan={3} className="px-2 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider bg-white border-r border-b border-gray-300 min-w-[80px]">
                      Chưa được lên lớp
                   </th>
                </>
              )}
              
              {viewFilter === 'qualities' && (
                <th colSpan={5} className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider bg-white border-r border-b border-gray-300">
                  Phẩm chất chủ yếu
                </th>
              )}
              
              {viewFilter === 'skills' && (
                <th colSpan={coreSkillCount + 2} className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider bg-white border-r border-b border-gray-300">
                  Năng lực cốt lõi
                </th>
              )}
              
              {viewFilter !== 'skills' && (
                <th rowSpan={3} className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[240px] bg-white border-l border-b border-gray-300">
                  {getCommentColumnHeader()}
                </th>
              )}
            </tr>
            
            <tr className="border-b border-gray-300">
              {(viewFilter === 'all' || viewFilter === 'subjects') && (
                <>
                  {classSubjects.map((name, idx) => {
                    const isSplit = splitSubjects.includes(name);
                    return (
                      <th 
                        key={`subject-head-${idx}`}
                        rowSpan={isSplit ? 1 : 2}
                        colSpan={isSplit ? 2 : 1}
                        className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider min-w-[90px] bg-white border-r border-b border-gray-300 align-middle text-blue-700"
                      >
                        <div className="leading-tight">{name}</div>
                        {!isSplit && <div className="text-[10px] text-gray-500 font-normal mt-1 normal-case">Mức</div>}
                      </th>
                    );
                  })}
                  {viewFilter === 'all' && (
                    <>
                      {currentColumns.slice(subjectCount, subjectCount + 5).map((col, idx) => (
                        <th 
                          key={`quality-head-${idx}`}
                          rowSpan={2}
                          className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wider min-w-[90px] bg-white border-r border-b border-gray-300 align-middle text-emerald-700"
                        >
                          <div className="leading-tight">{col.name}</div>
                          <div className="text-[10px] text-gray-500 font-normal mt-1 normal-case">Mức</div>
                        </th>
                      ))}
                      <th colSpan={3} className="px-4 py-2 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider bg-white border-r border-b border-gray-300">
                        Năng lực chung
                      </th>
                      <th colSpan={specificSkillCount} className="px-4 py-2 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider bg-white border-r border-b border-gray-300">
                        Năng lực đặc thù
                      </th>
                    </>
                  )}
                  {isEndOfYearAll && (
                    <>
                       <th rowSpan={2} className="px-2 py-2 text-center text-xs font-bold text-gray-700 uppercase tracking-wider bg-white border-r border-b border-gray-300 min-w-[140px]">
                          Cuối năm
                       </th>
                       <th rowSpan={2} className="px-2 py-2 text-center text-xs font-bold text-gray-700 uppercase tracking-wider bg-white border-r border-b border-gray-300 min-w-[140px]">
                          Đột xuất
                       </th>
                    </>
                  )}
                </>
              )}
              
              {viewFilter === 'qualities' && (
                currentColumns.map((col, idx) => (
                  <th 
                    key={`quality-only-${idx}`}
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
                  <th colSpan={specificSkillCount + 1} className="px-4 py-2 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider bg-white border-r border-b border-gray-300">
                    Năng lực đặc thù
                  </th>
                </>
              )}
            </tr>
            
            <tr className="border-b-2 border-gray-400">
              {/* Row 3 for Split Headers */}
              {((viewFilter === 'all' || viewFilter === 'subjects') && isSplitActive) && (
                 classSubjects.map((name, idx) => {
                   if (splitSubjects.includes(name)) {
                     return (
                       <React.Fragment key={`sub-header-split-${idx}`}>
                         <th className="px-1 py-2 text-center text-[10px] font-bold text-gray-700 bg-white border-r border-b border-gray-300 min-w-[60px] leading-tight">Mức đạt được</th>
                         <th className="px-1 py-2 text-center text-[10px] font-bold text-gray-700 bg-white border-r border-b border-gray-300 min-w-[60px] leading-tight">Điểm KTĐK</th>
                       </React.Fragment>
                     );
                   }
                   return null;
                 })
              )}
              
              {(viewFilter === 'all' || viewFilter === 'skills') && (
                <>
                  {(viewFilter === 'all' ? currentColumns.slice(subjectCount + 5) : currentColumns).map((col, idx) => (
                    <th 
                      key={`label-${idx}`} 
                      className={`px-3 py-3 text-center text-xs font-bold uppercase tracking-wider ${col.isComment ? 'min-w-[220px]' : 'min-w-[90px]'} bg-white border-r border-b border-gray-300 text-amber-700`}
                    >
                      <div className="leading-tight">{col.name}</div>
                      {!col.isComment && <div className="text-[10px] text-gray-500 font-normal mt-1 normal-case">Mức</div>}
                    </th>
                  ))}
                </>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.map((student, studentIndex) => (
              <tr key={student.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-4 py-4 text-sm font-medium text-gray-900 sticky left-0 bg-white group-hover:bg-blue-50/30 transition-colors z-10 border-r border-gray-300 align-middle">{student.stt}</td>
                <td className="px-4 py-4 text-sm text-gray-700 sticky left-[50px] bg-white group-hover:bg-blue-50/30 transition-colors z-10 border-r border-gray-300 align-middle">{student.id}</td>
                <td className="px-4 py-4 text-sm font-semibold text-gray-900 sticky left-[150px] bg-white group-hover:bg-blue-50/30 transition-colors z-10 border-r border-gray-300 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] align-middle">{student.name}</td>
                
                {/* Subject Body Cells Mapping */}
                {(viewFilter === 'all' || viewFilter === 'subjects') && classSubjects.map((name, idx) => {
                  const isSplit = splitSubjects.includes(name);
                  
                  if (isSplit) {
                    const levels = ['T', 'H', 'C'];
                    const randomLevel = levels[Math.floor(Math.random() * levels.length)];
                    const randomScore = (Math.random() * 5 + 5).toFixed(1);

                    return (
                      <React.Fragment key={`body-split-${idx}`}>
                        <td className="px-1 py-3 text-center text-sm font-medium text-gray-700 border-r border-gray-300 align-middle">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded border border-gray-200 bg-gray-50">{randomLevel}</span>
                        </td>
                        <td className="px-1 py-3 text-center text-sm font-bold text-blue-600 border-r border-gray-300 align-middle">
                          {randomScore}
                        </td>
                      </React.Fragment>
                    );
                  } else {
                    return (
                      <td key={`body-normal-${idx}`} className="px-2 py-3 text-center text-sm font-medium text-gray-700 border-r border-gray-300 align-middle">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 border border-gray-200">
                          {student.parent === 'T' ? 'T' : 'H'}
                        </span>
                      </td>
                    );
                  }
                })}

                {/* Qualities & Skills mapping in 'all' view */}
                {viewFilter === 'all' && currentColumns.slice(subjectCount).map((col, idx) => (
                  <td key={`all-view-extra-${idx}`} className={`px-2 py-3 text-center text-sm font-medium text-gray-700 border-r border-gray-300 ${col.isComment ? 'align-top' : 'align-middle'}`}>
                      {col.isComment ? (
                        <CommentInput placeholder="Nhận xét..." />
                      ) : (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 border border-gray-200">
                          Đ
                        </span>
                      )}
                  </td>
                ))}

                {/* Qualities or Skills mapping in specific views */}
                {(viewFilter === 'qualities' || viewFilter === 'skills') && currentColumns.map((col, idx) => (
                   <td key={`spec-view-cell-${idx}`} className={`px-2 py-3 text-center text-sm font-medium text-gray-700 border-r border-gray-300 ${col.isComment ? 'align-top' : 'align-middle'}`}>
                      {col.isComment ? (
                        <CommentInput placeholder="Nhận xét..." />
                      ) : (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 border border-gray-200">
                          Đ
                        </span>
                      )}
                  </td>
                ))}

                {isEndOfYearAll && (
                  <>
                    <td className="px-2 py-3 text-center border-r border-gray-300 align-middle">
                      <span className="text-red-500 font-bold text-sm">
                        {['X', 'T', 'H', 'C', 'H'][studentIndex % 5]}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-center border-r border-gray-300 align-middle">
                      <RewardCell />
                    </td>
                    <td className="px-2 py-3 text-center border-r border-gray-300 align-middle">
                      <RewardCell />
                    </td>
                    <td className="px-2 py-3 text-center border-r border-gray-300 align-middle">
                      <div className="flex justify-center">
                         <input 
                            type="checkbox" 
                            className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer" 
                          />
                      </div>
                    </td>
                  </>
                )}

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