import React, { useState, useRef, useEffect } from 'react';
import { STUDENTS_DATA } from '../constants';
import { Student } from '../types';
import { CloudUpload, Printer, FileSpreadsheet } from 'lucide-react';
import ReportPreviewModal from './ReportPreviewModal';
import StudentPrintSelectModal from './StudentPrintSelectModal';

interface PeriodicReviewTableProps {
  selectedClass?: string;
}

const PeriodicReviewTable: React.FC<PeriodicReviewTableProps> = ({ selectedClass = '1A2' }) => {
  const [term, setTerm] = useState('Cuối năm');
  const [isPrintSelectOpen, setIsPrintSelectOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);

  const filteredStudents = STUDENTS_DATA.filter(s => s.className === selectedClass);

  const groups = [
    { title: 'Môn học và hoạt động giáo dục', color: 'bg-[#00609c]' },
    { title: 'Nhận xét năng lực chung', color: 'bg-[#00609c]' },
    { title: 'Nhận xét năng lực đặc thù', color: 'bg-[#00609c]' },
    { title: 'Nhận xét phẩm chất chủ yếu', color: 'bg-[#00609c]' },
  ];

  const handleConfirmStudents = (students: Student[]) => {
    if (students.length > 0) {
      setSelectedStudents(students);
      setIsPrintSelectOpen(false);
      setIsPreviewOpen(true);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Filters and Actions Section */}
      <div className="flex flex-col gap-5 mb-2 shrink-0">
        {/* ROW 1: Filters */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] font-medium text-[#1f2937]">Năm học</label>
              <select className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-[140px] shadow-sm text-gray-700">
                <option>2025-2026</option>
                <option>2024-2025</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] font-medium text-[#1f2937]">Khối học</label>
              <select className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-[140px] shadow-sm text-gray-700">
                <option>Khối 01</option>
                <option>Khối 02</option>
                <option>Khối 03</option>
                <option>Khối 04</option>
                <option>Khối 05</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] font-medium text-[#1f2937]">Lớp</label>
              <select className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-[100px] shadow-sm text-gray-700" value={selectedClass} disabled>
                <option value="1A2">1A2</option>
                <option value="5A2">5A2</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] font-medium text-[#1f2937]">Môn</label>
              <select className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-w-[120px] shadow-sm text-gray-700">
                <option>Tin học</option>
                <option>Toán</option>
                <option>Tiếng Việt</option>
                <option>Đạo đức</option>
              </select>
            </div>
              <div className="flex flex-col gap-1.5">
              <label className="text-[14px] font-medium text-[#1f2937]">Học kỳ</label>
              <select 
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-[140px] shadow-sm text-gray-700"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
              >
                <option>Giữa kỳ 1</option>
                <option>Cuối kỳ 1</option>
                <option>Giữa kỳ 2</option>
                <option>Cuối năm</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] font-medium text-[#1f2937]">Tháng</label>
              <select className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-[140px] shadow-sm text-gray-700">
                <option>7/2025</option>
                <option>8/2025</option>
                <option>9/2025</option>
                <option>10/2025</option>
                <option>11/2025</option>
                <option>12/2025</option>
              </select>
            </div>
          </div>
        </div>

        {/* ROW 2: Import Header Section */}
        <div className="flex items-center justify-between pb-1 border-b-[1.5px] border-blue-500 mt-2">
          <div className="flex items-center gap-3">
             <div className="text-[#1f2937]">
                <CloudUpload size={28} fill="#1f2937" className="text-white" />
             </div>
             <span className="text-[#1f2937] font-semibold text-sm uppercase tracking-wide">Import file nhận xét đánh giá thường xuyên</span>
          </div>
          <div className="flex gap-8 text-sm text-[#3b82f6] font-medium">
             <button className="hover:text-blue-700 hover:underline">Mẫu Import</button>
             <button className="hover:text-blue-700 hover:underline">Import</button>
          </div>
        </div>

        {/* ROW 3: Action Buttons & Stats */}
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-gray-200 pb-3">
          <div className="mb-2 md:mb-0">
             <div className="font-bold text-gray-800 text-sm">Số học sinh: {filteredStudents.length}</div>
             <div className="text-red-500 text-xs mt-1 italic">
                ( Thầy Cô nhập Nội dung nhận xét vào các cột tương ứng )
             </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button 
              onClick={() => setIsPrintSelectOpen(true)}
              className="flex items-center gap-2 px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm shadow-sm whitespace-nowrap font-medium"
            >
                <Printer size={18} className="text-blue-600" />
                <span><span className="text-red-600">In</span> phiếu điểm</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm shadow-sm whitespace-nowrap font-medium">
                <FileSpreadsheet size={18} className="text-green-600" />
                <span>Xuất Excel</span>
            </button>
            <button className="px-6 py-2 bg-[#6366f1] text-white rounded font-medium hover:bg-indigo-600 transition-colors text-sm shadow-sm whitespace-nowrap">
              Lưu
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-t-2xl shadow-lg overflow-hidden border border-gray-200 flex-1 flex flex-col min-h-0 mt-2">
        <div className="overflow-auto custom-scrollbar flex-1 pb-40">
          <table className="w-full min-w-max border-separate border-spacing-0">
            <thead className="sticky top-0 z-20 shadow-md">
              <tr>
                <th rowSpan={2} className="px-4 py-3 text-center text-xs font-bold text-white uppercase tracking-wider sticky left-0 z-30 border-r border-b border-white/20 bg-[#00609c]">
                  STT
                </th>
                <th rowSpan={2} className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider sticky left-[50px] z-30 border-r border-b border-white/20 bg-[#00609c] min-w-[180px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.3)]">
                  Họ tên
                </th>
                <th rowSpan={2} className="px-4 py-3 text-center text-xs font-bold text-white uppercase tracking-wider bg-[#00609c] border-r border-b border-white/20 min-w-[100px]">
                  Ngày sinh
                </th>
                {groups.map((group, index) => (
                  <th key={index} colSpan={1} className={`px-4 py-3 text-center text-xs font-bold text-white uppercase tracking-wider ${group.color} border-r border-b border-white/20`}>
                    {group.title}
                  </th>
                ))}
              </tr>
              <tr>
                {groups.map((_, index) => (
                  <React.Fragment key={index}>
                    <th className="px-2 py-2 text-center text-xs font-bold text-white uppercase bg-[#00609c] border-r border-b border-white/20 min-w-[300px]">
                      Nội dung
                    </th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-2 py-3 text-center text-sm font-medium text-gray-900 sticky left-0 bg-white group-hover:bg-blue-50/30 transition-colors z-10 border-r border-gray-300">
                    {student.stt}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900 sticky left-[50px] bg-white group-hover:bg-blue-50/30 transition-colors z-10 border-r border-gray-300 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                    {student.name}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-300">
                    {student.dob}
                  </td>
                  {groups.map((_, index) => (
                    <React.Fragment key={index}>
                      <td className="px-2 py-2 border-r border-gray-300 align-top bg-white group-hover:bg-blue-50/30 p-2">
                         <textarea
                            className="w-full min-h-[70px] px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y shadow-sm transition-all"
                            placeholder="Nhập nội dung..."
                         />
                      </td>
                    </React.Fragment>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
          onClose={() => setIsPreviewOpen(false)} 
          selectedStudents={selectedStudents}
          currentTerm={term}
       />
    </div>
  );
};

export default PeriodicReviewTable;