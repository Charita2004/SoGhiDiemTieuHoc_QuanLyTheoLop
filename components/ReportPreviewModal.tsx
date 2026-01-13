import React, { useState, useEffect, useMemo } from 'react';
import { X, Printer, CheckSquare, Square } from 'lucide-react';
import { SUBJECTS_BY_CLASS, STUDENTS_DATA } from '../constants';
import { Student } from '../types';

interface ReportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStudents?: Student[];
  currentTerm?: string;
  initialColumns?: string[];
}

const CORE_COMPETENCIES = [
  'Tự chủ và tự học',
  'Giao tiếp và hợp tác',
  'Giải quyết vấn đề và sáng tạo'
];

const KEY_QUALITIES = [
  'Yêu nước',
  'Nhân ái',
  'Chăm chỉ',
  'Trung thực',
  'Trách nhiệm'
];

const COL_DEFINITIONS = [
    { key: 'gk1', label: 'Giữa HK 1', bg: 'bg-gray-50' },
    { key: 'ck1', label: 'Cuối HK 1', bg: 'bg-gray-100' },
    { key: 'gk2', label: 'Giữa HK 2', bg: 'bg-gray-50' },
    { key: 'cn', label: 'Cuối Năm', bg: 'bg-gray-100' },
];

const ReportPreviewModal: React.FC<ReportPreviewModalProps> = ({ 
  isOpen, 
  onClose, 
  selectedStudents = [], 
  currentTerm = 'Cuối kỳ 1',
  initialColumns = []
}) => {
  // State to track which columns are selected for printing
  const [selectedColKeys, setSelectedColKeys] = useState<string[]>([]);

  // EFFECT: Apply Logic constraints based on currentTerm, but respect initialColumns if provided
  useEffect(() => {
    // If initialColumns are passed (from Select Modal), use them and skip default logic
    if (initialColumns && initialColumns.length > 0) {
        setSelectedColKeys(initialColumns);
        return;
    }

    // Default Fallback Logic if no columns were passed
    switch (currentTerm) {
        case 'Giữa kỳ 1':
            setSelectedColKeys(['gk1']);
            break;
        case 'Cuối kỳ 1':
            setSelectedColKeys(['gk1', 'ck1']);
            break;
        case 'Giữa kỳ 2':
            setSelectedColKeys(['gk2']);
            break;
        case 'Cuối năm':
            setSelectedColKeys(['gk1', 'ck1', 'gk2', 'cn']);
            break;
        default:
            setSelectedColKeys(['gk1', 'ck1']);
    }
  }, [currentTerm, initialColumns]);

  // Determine if a checkbox should be disabled based on Term Logic
  // Updated: When manual columns are passed, we allow more flexibility or just stick to basic rules
  const isColDisabled = (key: string) => {
      // If we have manual initial columns, we might want to allow full toggling inside the preview too
      // But let's keep some semantic sense:
      if (currentTerm === 'Giữa kỳ 1' && key !== 'gk1') return true; 
      // For other terms, generally let user toggle if they want, or keep previous logic
      return false;
  };

  const toggleColumn = (key: string) => {
      // Allow user to toggle freely inside preview if they want to adjust
      setSelectedColKeys(prev => {
          if (prev.includes(key)) {
              if (prev.length === 1) return prev; 
              return prev.filter(k => k !== key);
          } else {
              const newKeys = [...prev, key];
              return COL_DEFINITIONS
                  .filter(def => newKeys.includes(def.key))
                  .map(def => def.key);
          }
      });
  };

  // Derive active columns for rendering based on selection
  const activeColumns = useMemo(() => {
      return COL_DEFINITIONS.filter(col => selectedColKeys.includes(col.key));
  }, [selectedColKeys]);


  if (!isOpen) return null;

  const displayStudents = selectedStudents.length > 0 ? selectedStudents : [STUDENTS_DATA[0]];
  const isYearEnd = currentTerm === 'Cuối năm';

  const getSpecificCompetencies = (className: string) => {
    const basic = ['Ngôn ngữ', 'Tính toán', 'Khoa học', 'Thẩm mỹ', 'Thể chất'];
    if (className === '5A2') {
       return ['Ngôn ngữ', 'Tính toán', 'Khoa học', 'Công nghệ', 'Tin học', 'Thẩm mỹ', 'Thể chất'];
    }
    return basic;
  };

  const getDeterministicValue = (seed: string, offset: number, range: number) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash + offset) % range;
  };

  const hasScoreForPeriod = (className: string, subject: string, period: string) => {
    if (className === '1A2') {
        if (!['Toán', 'Tiếng Việt'].includes(subject)) return false;
        return period.includes('Cuối'); 
    }
    if (className === '5A2') {
        if (['Toán', 'Tiếng Việt'].includes(subject)) return true; 
        if (['Khoa học', 'Lịch sử và Địa lý', 'Ngoại ngữ 1', 'Tin học và Công nghệ'].includes(subject)) {
            return period.includes('Cuối');
        }
        return false;
    }
    return false;
  };

  const generateGradeData = (student: Student, subjName: string) => {
    const seed = `${student.id}-${subjName}`;
    const levels = ['T', 'H'];
    
    // Generate full data regardless of view
    const data: any = {};
    COL_DEFINITIONS.forEach((col, idx) => {
        const hasScore = hasScoreForPeriod(student.className, subjName, col.label);
        data[col.key] = {
            m: levels[getDeterministicValue(seed, (idx + 1) * 10, 2)],
            d: hasScore ? (7 + getDeterministicValue(seed, (idx + 1) * 15, 30) / 10).toFixed(0) : ''
        };
    });

    data.kqgd = ['T', 'H'][getDeterministicValue(seed, 90, 2)];
    return data;
  };

  const generateCompetencyData = (student: Student, name: string) => {
    const seed = `${student.id}-${name}`;
    const levels = ['T', 'Đ', 'T']; 
    
    const gk1 = levels[getDeterministicValue(seed, 10, 3)];
    const ck1 = levels[getDeterministicValue(seed, 20, 3)];
    const gk2 = levels[getDeterministicValue(seed, 30, 3)];
    const cn = levels[getDeterministicValue(seed, 40, 3)];
    
    return { gk1, ck1, gk2, cn };
  };

  const getGroupComment = (student: Student, groupTitle: string) => {
      const seed = `${student.id}-${groupTitle}`;
      const goodComments = [
        "Hoàn thành tốt nhiệm vụ.",
        "Có ý thức tự giác, tích cực.",
        "Thực hiện tốt các yêu cầu.",
        "Năng nổ, chủ động trong học tập."
      ];
      const avgComments = [
        "Hoàn thành nhiệm vụ.",
        "Cần mạnh dạn hơn.",
        "Có cố gắng trong học tập.",
        "Thực hiện đầy đủ yêu cầu."
      ];
      
      const isGood = getDeterministicValue(seed, 25, 10) > 3;
      const pool = isGood ? goodComments : avgComments;
      
      return pool[getDeterministicValue(seed, 42, pool.length)];
  };

  const getOverallAssessment = (student: Student) => {
    const seed = student.id; 
    const val = getDeterministicValue(seed, 99, 10); 

    if (val >= 3) {
        return {
            khenThuong: "Học sinh Xuất sắc",
            kqgd: "Hoàn thành Xuất sắc",
            nhanXet: "Con ngoan, lễ phép, tiếp thu bài nhanh. Hoàn thành xuất sắc các nội dung học tập và rèn luyện.",
            trangThai: "Được lên lớp"
        };
    } else if (val >= 1) {
        return {
            khenThuong: "Học sinh Tiêu biểu",
            kqgd: "Hoàn thành Tốt",
            nhanXet: "Con chăm chỉ, có ý thức học tập tốt. Cần phát huy hơn nữa trong năm học tới.",
            trangThai: "Được lên lớp"
        };
    } else {
        return {
            khenThuong: "",
            kqgd: "Hoàn thành",
            nhanXet: "Con cần cố gắng rèn chữ viết và tính toán cẩn thận hơn.",
            trangThai: val === 0 ? "Rèn luyện lại trong hè" : "Được lên lớp"
        };
    }
  };

  const renderStudentReport = (student: Student, index: number) => {
    const className = student.className;
    const classSubjects = SUBJECTS_BY_CLASS[className] || SUBJECTS_BY_CLASS['1A2'];
    const specificCompetencies = getSpecificCompetencies(className);
    const overall = getOverallAssessment(student);
    
    const subjects = classSubjects.map((name, idx) => {
      const grades = generateGradeData(student, name);
      // Determine note from the LAST available column data or default to 'T' logic
      const lastColKey = activeColumns.length > 0 ? activeColumns[activeColumns.length - 1].key : 'cn';
      const lastGrade = grades[lastColKey]?.m || 'T';

      return {
        stt: idx + 1,
        name: name,
        ...grades, 
        note: lastGrade === 'T' ? 'Nắm vững kiến thức.' : 'Hoàn thành yêu cầu.'
      };
    });

    const groups = [
      { title: 'Năng lực chung', items: CORE_COMPETENCIES, startIdx: 1 },
      { title: 'Năng lực đặc thù', items: specificCompetencies, startIdx: 2 },
      { title: 'Phẩm chất chủ yếu', items: KEY_QUALITIES, startIdx: 3 }
    ];

    return (
      <div key={student.id} className={`flex flex-col items-center w-full ${index > 0 ? 'print:break-before-page mt-12 pt-12 border-t-2 border-dashed border-gray-300 print:border-none print:mt-0 print:pt-0' : ''}`}>
        <div className="w-full max-w-[900px] bg-white shadow-2xl p-8 md:p-12 min-h-[1100px] text-gray-900 font-serif leading-relaxed print:shadow-none print:p-0">
          <div className="text-center mb-6">
            <h2 className="text-[13px] font-bold uppercase tracking-wide mb-1 leading-none">SỞ GIÁO DỤC VÀ ĐÀO TẠO TP.HCM</h2>
            <h2 className="text-[13px] font-bold uppercase tracking-wide border-b border-black inline-block px-4 pb-1 mb-4 leading-none">TRƯỜNG TIỂU HỌC LAM SƠN</h2>
            
            <h1 className="text-xl md:text-2xl font-bold uppercase tracking-normal mb-1 text-[#1e293b]">PHIẾU BÁO KẾT QUẢ HỌC TẬP VÀ RÈN LUYỆN</h1>
            <p className="text-[14px] font-bold text-[#1e293b]">Năm học: 2025 - 2026</p>
            <p className="text-[14px] font-semibold italic text-blue-700">({isYearEnd ? 'Cuối năm học' : currentTerm})</p>
          </div>

          <div className="mb-4 text-[14px] font-serif">
            <div className="flex items-end mb-2">
              <span className="font-bold whitespace-nowrap mr-2">Họ và tên học sinh:</span>
              <span className="font-bold flex-1 border-b border-dotted border-gray-400 pb-0.5">{student.name}</span>
            </div>
            <div className="flex items-end gap-8">
                <div className="flex items-end w-[35%]">
                    <span className="font-bold whitespace-nowrap mr-2">Lớp:</span>
                    <span className="flex-1 border-b border-dotted border-gray-400 pb-0.5 pl-2">{className}</span>
                </div>
                <div className="flex items-end flex-1">
                    <span className="font-bold whitespace-nowrap mr-2">Ngày sinh:</span>
                    <span className="flex-1 border-b border-dotted border-gray-400 pb-0.5 pl-2">{student.dob}</span>
                </div>
            </div>
          </div>

          <h3 className="font-bold text-sm mb-4 font-sans uppercase text-blue-800">I. Các môn học và hoạt động giáo dục</h3>

          <table className="w-full border-collapse border border-gray-800 text-[12px] font-sans mb-6" style={{ tableLayout: 'fixed' }}>
            <colgroup>
                {/* 1. STT */}
                <col style={{ width: '35px' }} />
                {/* 2. Subject Name */}
                <col style={{ width: '160px' }} />
                {/* 3. Dynamic Score Columns (Fixed 32px each) */}
                {activeColumns.map(col => (
                    <React.Fragment key={col.key}>
                        <col style={{ width: '32px' }} /> {/* Mức */}
                        <col style={{ width: '32px' }} /> {/* Điểm */}
                    </React.Fragment>
                ))}
                {/* 4. Comment Column (Auto expand) */}
                <col style={{ width: 'auto' }} />
            </colgroup>
            <thead>
              <tr className="bg-gray-100/50">
                <th rowSpan={2} className="border border-gray-800 p-1 text-center">STT</th>
                <th rowSpan={2} className="border border-gray-800 p-1 text-left">Môn học và hoạt động giáo dục</th>
                
                {/* Dynamic Header Row 1: Periods */}
                {activeColumns.map(col => (
                    <th key={col.key} colSpan={2} className={`border border-gray-800 p-1 text-center ${col.bg}`}>
                        {col.label}
                    </th>
                ))}
                
                <th rowSpan={2} className="border border-gray-800 p-1 text-center">Nhận xét</th>
              </tr>
              <tr className="bg-gray-100/50">
                 {/* Sub-columns for Mức/Điểm */}
                 {activeColumns.map(col => (
                    <React.Fragment key={`${col.key}-sub`}>
                        <th className="border border-gray-800 px-0 py-0.5 text-center text-[10px]">Mức</th>
                        <th className="border border-gray-800 px-0 py-0.5 text-center text-[10px]">Điểm</th>
                    </React.Fragment>
                 ))}
              </tr>
            </thead>
            <tbody>
              {subjects.map((sub) => {
                  return (
                    <tr key={sub.stt} className="hover:bg-gray-50/50">
                        <td className="border border-gray-800 p-1 text-center">{sub.stt}</td>
                        <td className="border border-gray-800 p-1 font-medium truncate text-left px-2">{sub.name}</td>
                        
                        {/* Dynamic Body Cells */}
                        {activeColumns.map(col => {
                            const data = (sub as any)[col.key]; // Access dynamic key like sub.gk1
                            return (
                                <React.Fragment key={`${col.key}-${sub.stt}`}>
                                    <td className={`border border-gray-800 p-0 text-center font-semibold text-[11px] align-middle overflow-hidden ${col.bg}`}>
                                        {data?.m}
                                    </td>
                                    <td className={`border border-gray-800 p-0 text-center font-bold text-blue-700 text-[11px] align-middle overflow-hidden ${col.bg}`}>
                                        {data?.d}
                                    </td>
                                </React.Fragment>
                            );
                        })}

                        {/* Comment Cell */}
                        <td className="border border-gray-800 p-1 pl-[10px] text-[11px] align-middle italic text-gray-700 leading-tight text-left break-words whitespace-normal">
                            {sub.note}
                        </td>
                    </tr>
                  )
              })}
            </tbody>
          </table>

          <div className="text-[11px] italic mb-8 font-sans flex flex-wrap gap-6 text-gray-600">
            <div><b>Mức đạt được:</b> T: Hoàn thành tốt, H: Hoàn thành, C: Chưa hoàn thành.</div>
            <div><b>KQGD:</b> Kết quả giáo dục (T/H/C).</div>
          </div>

          <div className="mb-4 font-sans print:break-before-page">
             <h3 className="font-bold text-sm mb-3 uppercase text-blue-800 pt-4 print:pt-8">II. Đánh giá phẩm chất và năng lực</h3>
             
             <table className="w-full border-collapse border border-gray-800 text-[12px] font-sans table-fixed">
              <colgroup>
                  <col style={{ width: '35px' }} /> {/* STT */}
                  <col style={{ width: '80px' }} /> {/* Group */}
                  <col style={{ width: '160px' }} /> {/* Criteria */}
                  {activeColumns.map(col => (
                      <col key={col.key} style={{ width: '32px' }} /> // 1 col per period (Mức only)
                  ))}
                  <col style={{ width: 'auto' }} /> {/* Comment */}
              </colgroup>
              <thead>
                <tr className="bg-gray-100/50">
                  <th rowSpan={2} className="border border-gray-800 p-1 text-center">STT</th>
                  <th rowSpan={2} className="border border-gray-800 p-1 text-center">Nhóm năng lực</th>
                  <th rowSpan={2} className="border border-gray-800 p-1 text-left">Tiêu chí đánh giá</th>
                  
                  {activeColumns.map(col => (
                      <th key={col.key} className={`border border-gray-800 p-1 text-center ${col.bg}`}>
                          {col.label}
                      </th>
                  ))}
                  
                  <th rowSpan={2} className="border border-gray-800 p-1 text-center">Nhận xét</th>
                </tr>
                <tr className="bg-gray-100/50">
                  {activeColumns.map(col => (
                      <th key={`${col.key}-sub`} className="border border-gray-800 px-0 py-0.5 text-center font-bold text-[10px]">Mức</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                  {groups.map((group) => {
                     const groupComment = getGroupComment(student, group.title);
                     
                     return group.items.map((item, itemIdx) => {
                        const scores: any = generateCompetencyData(student, item); 
                        const isFirst = itemIdx === 0;
                        const rowSpan = group.items.length;

                        return (
                            <tr key={`${group.title}-${item}`} className="hover:bg-gray-50/50">
                                {isFirst && (
                                    <>
                                        <td rowSpan={rowSpan} className="border border-gray-800 p-1 text-center align-middle font-bold">{group.startIdx}</td>
                                        <td rowSpan={rowSpan} className="border border-gray-800 p-2 align-middle">
                                            <div className="font-bold uppercase text-[10px] text-blue-800">{group.title}</div>
                                        </td>
                                    </>
                                )}
                                
                                <td className="border border-gray-800 p-1 align-middle pl-2 text-[11px] text-left">
                                   - {item}
                                </td>
                                
                                {activeColumns.map(col => (
                                    <td key={col.key} className={`border border-gray-800 p-0 text-center align-middle text-[11px] font-semibold ${col.bg}`}>
                                        {scores[col.key]}
                                    </td>
                                ))}
                                
                                {isFirst && (
                                    <td rowSpan={rowSpan} className="border border-gray-800 p-1 pl-[10px] text-[11px] italic text-gray-700 align-middle text-left break-words whitespace-normal">
                                        {groupComment}
                                    </td>
                                )}
                            </tr>
                        );
                     });
                  })}
              </tbody>
            </table>
          </div>

          {isYearEnd && (
             <div className="mb-6 text-[13px] font-sans px-1">
                <div className="grid grid-cols-2 gap-x-12 gap-y-3">
                    <div className="flex items-end gap-2">
                       <span className="font-bold whitespace-nowrap min-w-[80px]">Khen thưởng:</span>
                       <span className="flex-1 border-b border-dotted border-gray-500 pb-0.5 text-gray-800 font-medium">
                         {overall.khenThuong}
                       </span>
                    </div>
                    <div className="flex items-end gap-2">
                       <span className="font-bold whitespace-nowrap min-w-[80px]">Trạng thái:</span>
                       <span className="flex-1 border-b border-dotted border-gray-500 pb-0.5 text-gray-800 font-bold">
                         {overall.trangThai}
                       </span>
                    </div>

                    <div className="flex items-end gap-2">
                       <span className="font-bold whitespace-nowrap min-w-[80px]">Đánh giá KQGD:</span>
                       <span className="flex-1 border-b border-dotted border-gray-500 pb-0.5 text-gray-800 font-bold uppercase">
                         {overall.kqgd}
                       </span>
                    </div>
                    <div className="flex items-end gap-2">
                       <span className="font-bold whitespace-nowrap min-w-[80px]">Nhận xét:</span>
                       <span className="flex-1 border-b border-dotted border-gray-500 pb-0.5 text-gray-800 italic truncate">
                         {overall.nhanXet}
                       </span>
                    </div>
                </div>
             </div>
          )}

          <div className="grid grid-cols-2 gap-10 mt-10 text-center text-sm font-sans">
            <div className="flex flex-col items-center">
              <p className="italic mb-2 text-gray-500">.........., ngày ..... tháng ..... năm 2026</p>
              <p className="font-bold uppercase text-gray-800">PHỤ HUYNH HỌC SINH</p>
              <div className="h-24"></div>
              <p className="font-semibold text-gray-400 italic">(Ký và ghi rõ họ tên)</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="italic mb-2 text-gray-500">TP.HCM, ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}</p>
              <p className="font-bold uppercase text-gray-800">GIÁO VIÊN CHỦ NHIỆM</p>
              <div className="h-24"></div>
              <p className="font-bold text-gray-900 border-b border-gray-900 inline-block px-4">Nguyễn Thị Anh</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-gray-500/40 backdrop-blur-sm overflow-hidden animate-in fade-in duration-200">
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-md sticky top-0 z-10 print:hidden">
        <div className="flex flex-col gap-1">
            <h2 className="text-gray-800 font-bold text-lg">Xem trước {displayStudents.length} Phiếu điểm - <span className="text-blue-600">{currentTerm}</span></h2>
            
            {/* COLUMN CONFIGURATION CHECKBOXES */}
            <div className="flex items-center gap-4 text-sm mt-1">
                <span className="font-semibold text-gray-600 text-xs uppercase tracking-wide">Cấu hình cột in:</span>
                {COL_DEFINITIONS.map(col => {
                    // In Preview mode, we don't disable based on strict rules anymore, allowing user flexibility
                    const isChecked = selectedColKeys.includes(col.key);
                    
                    return (
                        <div 
                            key={col.key} 
                            className={`flex items-center gap-1.5 cursor-pointer select-none hover:text-blue-600`}
                            onClick={() => toggleColumn(col.key)}
                        >
                            {isChecked ? (
                                <CheckSquare size={16} className={`text-blue-600`} />
                            ) : (
                                <Square size={16} className="text-gray-400" />
                            )}
                            <span className={`${isChecked ? 'font-medium text-gray-800' : 'text-gray-500'}`}>{col.label}</span>
                        </div>
                    );
                })}
            </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2 bg-[#2563eb] text-white rounded-md font-semibold hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Printer size={18} />
            In Phiếu Điểm ({displayStudents.length})
          </button>
          <button 
            onClick={onClose}
            className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-10 flex flex-col items-center bg-gray-200/50 custom-scrollbar">
        {displayStudents.map((student, index) => renderStudentReport(student, index))}
      </div>
    </div>
  );
};

export default ReportPreviewModal;