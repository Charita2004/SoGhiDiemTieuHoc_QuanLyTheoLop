import React, { useState, useRef, useEffect } from 'react';
import { ViewFilter, Student } from '../types';
import { STUDENTS_DATA } from '../constants';
import { Printer, Lock, Unlock, AlertTriangle, Check, X, LockOpen, Info, ChevronUp, ChevronDown } from 'lucide-react';
import ReportPreviewModal from './ReportPreviewModal';
import StudentPrintSelectModal from './StudentPrintSelectModal';

interface FilterBarProps {
  viewFilter: ViewFilter;
  setViewFilter: (filter: ViewFilter) => void;
  term: string;
  setTerm: (term: string) => void;
  selectedClass: string;
  setSelectedClass: (className: string) => void;
  isLocked?: boolean;
  setIsLocked?: (locked: boolean) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  viewFilter, 
  setViewFilter, 
  term, 
  setTerm, 
  selectedClass, 
  setSelectedClass,
  isLocked = false,
  setIsLocked
}) => {
  const [showPrintDropdown, setShowPrintDropdown] = useState(false);
  const [isPrintSelectOpen, setIsPrintSelectOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [printColumns, setPrintColumns] = useState<string[]>([]); // New State for Columns
  const [isNoteExpanded, setIsNoteExpanded] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);
  
  // Modal states
  const [showLockModal, setShowLockModal] = useState(false);
  const [showRequestUnlockModal, setShowRequestUnlockModal] = useState(false);
  const [showUnlockSuccessModal, setShowUnlockSuccessModal] = useState(false);
  const [unlockReason, setUnlockReason] = useState('');
  const [showReasonError, setShowReasonError] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const tabs: { label: string; value: ViewFilter }[] = [
    { value: 'all', label: 'Tất cả thông tin' },
    { value: 'skills', label: 'Năng lực' },
    { value: 'qualities', label: 'Phẩm chất' },
  ];

  const filteredStudents = STUDENTS_DATA.filter(s => s.className === selectedClass);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowPrintDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleConfirmStudents = (students: Student[], columns: string[]) => {
    if (students.length > 0) {
      setSelectedStudents(students);
      setPrintColumns(columns);
      setIsPrintSelectOpen(false);
      setIsPreviewOpen(true);
    }
  };

  const handleLockClick = () => {
    setShowLockModal(true);
  };

  const confirmLock = () => {
    setIsLocked?.(true);
    setShowLockModal(false);
  };

  const handleUnlockClick = () => {
    setUnlockReason('');
    setShowReasonError(false);
    setShowRequestUnlockModal(true);
  };

  const handleSendUnlockRequest = () => {
    if (!unlockReason.trim()) {
      setShowReasonError(true);
      return;
    }
    setShowRequestUnlockModal(false);
    setTimeout(() => {
        setShowUnlockSuccessModal(true);
    }, 200);
  };

  const handleCloseSuccessModal = () => {
    setShowUnlockSuccessModal(false);
    setIsLocked?.(false);
  };

  return (
    <div className="flex flex-col gap-5 mb-2 relative">
       {/* ROW 1: Filters (Left) & Print Dropdown (Right) */}
       <div className="flex flex-wrap items-end justify-between gap-4">
          {/* Filters Group */}
          <div className="flex flex-wrap gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600">Năm học</label>
                <select className="px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-32 shadow-sm">
                   <option>2025-2026</option>
                   <option>2024-2025</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600">Học kỳ</label>
                <select 
                    className="px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-40 shadow-sm"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                >
                   <option>Giữa kỳ 1</option>
                   <option>Cuối kỳ 1</option>
                   <option>Giữa kỳ 2</option>
                   <option>Cuối năm</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600">Tên lớp</label>
                <select 
                    className="px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-24 shadow-sm"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                >
                   <option value="1A2">1A2</option>
                   <option value="5A2">5A2</option>
                </select>
              </div>
          </div>
          
          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* In Phieu Diem Button - Only visible in 'all' tab */}
            {viewFilter === 'all' && (
              <button 
                  onClick={() => setIsPrintSelectOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-all shadow-sm text-sm font-medium"
              >
                  <Printer size={18} />
                  <span>In phiếu điểm</span>
              </button>
            )}

            {/* Print Dropdown Button */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setShowPrintDropdown(!showPrintDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-white text-[#16a34a] border border-[#16a34a] rounded hover:bg-green-50 transition-all shadow-sm text-sm font-medium"
              >
                <Printer size={18} />
                <span>Xuất excel</span>
              </button>
     
            </div>
          </div>
       </div>

       {/* Important Note Section - Collapsible Banner Style */}
       <div className={`bg-blue-50 border border-blue-100 rounded-md ${isNoteExpanded ? 'py-2.5' : 'py-2'} px-3 flex items-start gap-3 shadow-sm relative transition-all duration-200`}>
             <div className="mt-0.5 shrink-0">
                <Info className="text-blue-500" size={18} />
             </div>
             <div className="text-[13px] text-slate-700 flex-1 pr-8 leading-relaxed">
                {isNoteExpanded ? (
                   <>
                      <span className="font-bold text-slate-900">Lưu ý quan trọng: </span>
                      Trước mỗi đợt nhập điểm, Thầy/Cô vui lòng yêu cầu <span className="font-bold text-red-600">Admin</span> nhà trường thực hiện đồng bộ dữ liệu để đảm bảo danh sách học sinh chính xác.
                   </>
                ) : (
                   <span className="font-bold text-slate-900 cursor-pointer select-none" onClick={() => setIsNoteExpanded(true)}>
                      Lưu ý quan trọng
                   </span>
                )}
             </div>
             <button 
               onClick={() => setIsNoteExpanded(!isNoteExpanded)}
               className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 hover:bg-blue-100 rounded-md p-0.5 transition-colors"
               title={isNoteExpanded ? "Thu gọn" : "Mở rộng"}
             >
               {isNoteExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
             </button>
       </div>

       {/* ROW 2: Tabs (Left) and Action Buttons (Right) */}
       <div className="flex flex-col md:flex-row justify-between items-end border-b border-gray-200">
          <div className="flex gap-6 overflow-x-auto no-scrollbar w-full md:w-auto -mb-[1px]">
            {tabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setViewFilter(tab.value)}
                  className={`
                    pb-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all
                    ${viewFilter === tab.value 
                      ? 'border-blue-600 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  `}
                >
                  {tab.label}
                </button>
            ))}
          </div>

          <div className="flex gap-2 mb-3 overflow-x-auto w-full md:w-auto justify-start md:justify-end pt-2 md:pt-0">
             {viewFilter === 'all' && (
                <>
                    <button 
                        className="px-4 py-2 bg-[#22c55e] text-white rounded font-medium hover:bg-green-600 transition-colors text-sm shadow-sm whitespace-nowrap"
                    >
                        Đồng bộ điểm
                    </button>
                    
                    {isLocked ? (
                      <button 
                          onClick={handleUnlockClick}
                          className="px-4 py-2 bg-amber-500 text-white rounded font-medium hover:bg-amber-600 transition-colors text-sm shadow-sm whitespace-nowrap flex items-center gap-2"
                      >
                          <Unlock size={16} />
                          Hủy chốt sổ
                      </button>
                    ) : (
                      <button 
                          onClick={handleLockClick}
                          className="px-4 py-2 bg-[#ef4444] text-white rounded font-medium hover:bg-red-600 transition-colors text-sm shadow-sm whitespace-nowrap flex items-center gap-2"
                      >
                          <Lock size={16} />
                          Chốt sổ
                      </button>
                    )}
                </>
             )}
             <button className="px-4 py-2 bg-[#6366f1] text-white rounded font-medium hover:bg-indigo-600 transition-colors text-sm shadow-sm whitespace-nowrap">
                Lịch sử chỉnh sửa
             </button>
             {!isLocked && (
               <button 
                  className="px-6 py-2 text-white bg-[#6366f1] hover:bg-indigo-600 rounded font-medium transition-colors text-sm shadow-sm whitespace-nowrap"
               >
                  Lưu
               </button>
             )}
          </div>
       </div>

       {/* ROW 3: Stats and Notes */}
       <div className="mt-2 text-sm flex justify-between items-start">
          <div className="flex flex-col gap-1">
             <div className="flex items-center gap-3">
               <div className="font-bold text-gray-800">Số học sinh: {filteredStudents.length}</div>
               <button 
                 onClick={() => setShowInstructions(!showInstructions)}
                 className="text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-0.5 rounded transition-colors flex items-center gap-1 border border-blue-200"
                 title={showInstructions ? "Ẩn hướng dẫn" : "Hiện hướng dẫn"}
               >
                 {showInstructions ? (
                   <>Thu gọn hướng dẫn <ChevronUp size={12} /></>
                 ) : (
                   <>Hướng dẫn nhập liệu <ChevronDown size={12} /></>
                 )}
               </button>
             </div>
             
             {showInstructions && (
               <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="text-red-500 text-xs italic">
                    ( Thầy Cô nhấn vào tab <span className="font-semibold">Năng lực</span> hoặc <span className="font-semibold">Phẩm chất</span> để nhập đánh giá và nhận xét)
                  </div>
                  <div className="text-red-500 text-xs italic">
                    ( Thầy Cô nhấn vào tab <span className="font-semibold">Tất cả thông tin</span> để nhập Nhận xét/ Nhận xét in học bạ và thực hiện Chốt sổ / Đồng bộ điểm )
                  </div>
               </div>
             )}
          </div>
          {isLocked && (
            <div className="px-3 py-1 bg-red-100 text-red-700 rounded border border-red-200 text-xs font-bold flex items-center gap-1">
              <Lock size={12} />
              Sổ đã chốt - Không thể chỉnh sửa
            </div>
          )}
       </div>

       {/* Selection Modal */}
       <StudentPrintSelectModal 
          isOpen={isPrintSelectOpen}
          onClose={() => setIsPrintSelectOpen(false)}
          selectedClass={selectedClass}
          onConfirm={handleConfirmStudents}
          term={term}
          onTermChange={setTerm}
       />

       {/* Preview Modal */}
       <ReportPreviewModal 
          isOpen={isPreviewOpen} 
          onClose={() => {
            setIsPreviewOpen(false);
            setIsPrintSelectOpen(true);
          }} 
          selectedStudents={selectedStudents}
          currentTerm={term}
          initialColumns={printColumns}
       />

        {/* Lock Confirmation Modal - Increased Size */}
        {showLockModal && (
           <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
             <div className="bg-white rounded-lg shadow-2xl w-full max-w-[550px] overflow-hidden transform transition-all scale-100">
               <div className="p-8 text-center">
                 <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                   <AlertTriangle className="text-red-600" size={32} />
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-2">Xác nhận chốt sổ</h3>
                 <p className="text-gray-600 text-base mb-8">
                   Bạn có chắc chắn muốn chốt sổ điểm này không? Sau khi chốt, bạn và các giáo viên khác sẽ <span className="font-bold text-red-600">không thể chỉnh sửa</span> dữ liệu cho đến khi mở khóa lại.
                 </p>
                 <div className="flex gap-4 justify-center">
                   <button 
                     onClick={() => setShowLockModal(false)}
                     className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm font-medium"
                   >
                     Hủy bỏ
                   </button>
                   <button 
                     onClick={confirmLock}
                     className="px-6 py-2.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-medium"
                   >
                     Đồng ý chốt sổ
                   </button>
                 </div>
               </div>
             </div>
           </div>
        )}

        {/* 1. Request Unlock Modal */}
        {showRequestUnlockModal && (
           <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
             <div className="bg-white rounded-xl shadow-2xl w-full max-w-[600px] overflow-hidden transform transition-all scale-100 flex flex-col">
               <div className="p-8 flex flex-col items-center">
                 <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
                    <LockOpen className="text-red-700" size={32} strokeWidth={1.5} />
                 </div>
                 
                 <h3 className="text-xl font-bold text-red-900 mb-2 uppercase tracking-wide">YÊU CẦU MỞ KHÓA</h3>
                 
                 <div className="text-blue-700 font-bold text-lg mb-4">
                    {term} - Lớp {selectedClass}
                 </div>
                 
                 <p className="text-gray-600 text-center mb-6 text-base">
                    Thầy/Cô đang yêu cầu mở khóa sổ điểm môn <span className="font-bold text-gray-900">Tiếng Việt</span>.
                 </p>

                 <div className="w-full bg-orange-50 border-l-4 border-orange-400 p-5 mb-6 rounded-r flex items-start gap-3">
                    <AlertTriangle className="text-orange-500 shrink-0 mt-0.5" size={24} />
                    <div className="text-left">
                        <span className="text-orange-700 font-bold text-sm uppercase block mb-1">LƯU Ý QUAN TRỌNG</span>
                        <p className="text-orange-800 text-sm leading-relaxed">
                            Hành động này cần được BGH phê duyệt và sẽ được ghi lại trong lịch sử hệ thống.
                        </p>
                    </div>
                 </div>

                 <div className="w-full mb-8 text-left">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Lý do mở khóa <span className="text-red-500">*</span></label>
                    <textarea 
                        className={`w-full border ${showReasonError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-lg p-3 text-base focus:ring-2 outline-none resize-none h-28 transition-all`}
                        placeholder="Nhập lý do chi tiết..."
                        value={unlockReason}
                        onChange={(e) => {
                            setUnlockReason(e.target.value);
                            if (e.target.value.trim()) setShowReasonError(false);
                        }}
                    ></textarea>
                    {showReasonError && <p className="text-red-500 text-sm mt-1 italic">Vui lòng nhập lý do để tiếp tục</p>}
                 </div>

                 <div className="flex w-full gap-5">
                   <button 
                     onClick={() => setShowRequestUnlockModal(false)}
                     className="flex-1 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors text-base"
                   >
                     Hủy bỏ
                   </button>
                   <button 
                     onClick={handleSendUnlockRequest}
                     className="flex-1 py-3 bg-[#85b995] text-white rounded-lg hover:bg-[#6da880] transition-colors text-base font-bold shadow-sm"
                   >
                     Gửi yêu cầu
                   </button>
                 </div>
               </div>
             </div>
           </div>
        )}

        {/* 2. Unlock Request Success Modal */}
        {showUnlockSuccessModal && (
           <div className="fixed inset-0 z-[1002] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
             <div className="bg-white rounded-xl shadow-2xl w-full max-w-[480px] overflow-hidden transform transition-all scale-100 p-8 text-center">
                 <div className="w-24 h-24 rounded-full border-4 border-green-50 flex items-center justify-center mx-auto mb-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="text-green-500" size={40} strokeWidth={3} />
                    </div>
                 </div>

                 <h3 className="text-xl font-bold text-gray-700 mb-2">Gửi yêu cầu thành công</h3>
                 <p className="text-gray-500 mb-8 text-base">
                   Yêu cầu hủy chốt sổ đã được gửi đi
                 </p>
                 
                 <button 
                   onClick={handleCloseSuccessModal}
                   className="px-10 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-base font-bold min-w-[140px]"
                 >
                   OK
                 </button>
             </div>
           </div>
        )}
    </div>
  );
};

export default FilterBar;