import React from 'react';
import { ViewFilter } from '../types';
import { STUDENTS_DATA } from '../constants';
import { FileSpreadsheet } from 'lucide-react';

interface FilterBarProps {
  viewFilter: ViewFilter;
  setViewFilter: (filter: ViewFilter) => void;
  term: string;
  setTerm: (term: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ viewFilter, setViewFilter, term, setTerm }) => {
  const tabs: { label: string; value: ViewFilter }[] = [
    { value: 'all', label: 'Tất cả thông tin' },
    { value: 'subjects', label: 'Môn học' },
    { value: 'skills', label: 'Năng lực' },
    { value: 'qualities', label: 'Phẩm chất' },
  ];

  return (
    <div className="flex flex-col gap-3 mb-2">
       {/* ROW 1: Filters (Left) & Export Button (Right) */}
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
                <select className="px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-24 shadow-sm">
                   <option>1.1</option>
                   <option>1A2</option>
                </select>
              </div>
          </div>
          
          {/* Excel Export Button - Right aligned */}
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-white text-[#16a34a] border border-[#16a34a] rounded hover:bg-green-50 transition-all shadow-sm text-sm font-medium"
            title="Xuất dữ liệu ra file Excel"
          >
            <FileSpreadsheet size={18} />
            <span>Xuất Excel</span>
          </button>
       </div>

       {/* Dashed Separator */}
       <div className="border-b border-dashed border-gray-300 w-full"></div>

       {/* ROW 2: Tabs (Left) and Action Buttons (Right) */}
       <div className="flex flex-col md:flex-row justify-between items-end gap-4 mt-1">
          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto no-scrollbar w-full md:w-auto relative top-[1px]">
            {tabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setViewFilter(tab.value)}
                  className={`
                    px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                    ${viewFilter === tab.value 
                      ? 'border-blue-600 text-blue-700' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'}
                  `}
                >
                  {tab.label}
                </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pb-2 overflow-x-auto w-full md:w-auto justify-start md:justify-end border-b md:border-b-0 border-gray-200 md:pb-0">
             {viewFilter === 'all' && (
                <>
                    <button className="px-4 py-2 bg-[#22c55e] text-white rounded font-medium hover:bg-green-600 transition-colors text-sm shadow-sm whitespace-nowrap">
                        Đồng bộ điểm
                    </button>
                    <button className="px-4 py-2 bg-[#ef4444] text-white rounded font-medium hover:bg-red-600 transition-colors text-sm shadow-sm whitespace-nowrap">
                        Chốt sổ
                    </button>
                </>
             )}
             <button className="px-4 py-2 bg-[#6366f1] text-white rounded font-medium hover:bg-indigo-600 transition-colors text-sm shadow-sm whitespace-nowrap">
                Lịch sử chỉnh sửa
             </button>
             <button className="px-6 py-2 bg-[#6366f1] text-white rounded font-medium hover:bg-indigo-600 transition-colors text-sm shadow-sm whitespace-nowrap">
                Lưu
             </button>
          </div>
       </div>
       
       {/* Full width border for tabs bottom */}
       <div className="border-b border-gray-200 w-full -mt-2 hidden md:block"></div>

       {/* ROW 3: Stats and Notes */}
       <div className="mt-2 text-sm">
          <div className="font-bold text-gray-800">Số học sinh: {STUDENTS_DATA.length}</div>
          <div className="text-red-500 text-xs mt-1">
             (Thầy cô có thể nhấn trực tiếp vào ô đánh giá phẩm chất, năng lực để sửa đánh giá)
          </div>
          <div className="text-red-500 text-xs">
             (Thầy cô chủ nhiệm có thể nhấn trực tiếp vào các ô đánh giá kết quả cuối năm và xét lên lớp để thay đổi kết quả)
          </div>
       </div>
    </div>
  );
};

export default FilterBar;