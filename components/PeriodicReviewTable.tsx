import React from 'react';
import { STUDENTS_DATA } from '../constants';
import { CloudUpload, FileSpreadsheet } from 'lucide-react';

const PeriodicReviewTable: React.FC = () => {
  const groups = [
    { title: 'Môn học và hoạt động giáo dục', color: 'bg-[#00609c]' },
    { title: 'Nhận xét năng lực chung', color: 'bg-[#00609c]' },
    { title: 'Nhận xét năng lực đặc thù', color: 'bg-[#00609c]' },
    { title: 'Nhận xét phẩm chất chủ yếu', color: 'bg-[#00609c]' },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Filters and Actions Section */}
      <div className="flex flex-col gap-5 mb-2 shrink-0">
        {/* ROW 1: Filters (Left) */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          {/* Filters Group */}
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
            {/* Split Filters: Class and Subject */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] font-medium text-[#1f2937]">Lớp</label>
              <select className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-[100px] shadow-sm text-gray-700">
                <option>1A2</option>
                <option>1A3</option>
                <option>1A4</option>
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
          {/* Stats */}
          <div className="mb-2 md:mb-0">
             <div className="font-bold text-gray-800 text-sm">Số học sinh: {STUDENTS_DATA.length}</div>
             <div className="text-red-500 text-xs mt-1 italic">
                ( Thầy Cô nhập Nội dung nhận xét vào các cột tương ứng )
             </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button 
                className="flex items-center gap-2 px-4 py-2 bg-white text-[#16a34a] border border-[#16a34a] rounded hover:bg-green-50 transition-all shadow-sm text-sm font-medium"
            >
                <FileSpreadsheet size={18} />
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
              {/* Row 1: Main Headers */}
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
              {/* Row 2: Sub Headers (Nội dung) */}
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
              {STUDENTS_DATA.map((student) => (
                <tr key={student.stt} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-2 py-3 text-center text-sm font-medium text-gray-900 sticky left-0 bg-white group-hover:bg-blue-50/30 transition-colors z-10 border-r border-gray-300">
                    {student.stt}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900 sticky left-[50px] bg-white group-hover:bg-blue-50/30 transition-colors z-10 border-r border-gray-300 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                    {student.name}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-300">
                    {student.dob}
                  </td>
                  
                  {/* Render standard textarea for each group instead of CommentInput */}
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
    </div>
  );
};

export default PeriodicReviewTable;