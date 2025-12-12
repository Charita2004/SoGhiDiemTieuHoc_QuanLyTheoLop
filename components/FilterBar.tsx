import React from 'react';
import { ViewFilter } from '../types';
import { Download, Save, Lock, History, RefreshCw } from 'lucide-react';
import { STUDENTS_DATA } from '../constants';

interface FilterBarProps {
  viewFilter: ViewFilter;
  setViewFilter: (filter: ViewFilter) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ viewFilter, setViewFilter }) => {
  const displayOptions: { label: string; value: ViewFilter }[] = [
    { value: 'all', label: 'Tất cả thông tin' },
    { value: 'subjects', label: 'Môn học và hoạt động giáo dục' },
    { value: 'skills', label: 'Năng lực cốt lõi (Chung & Đặc thù)' },
    { value: 'qualities', label: 'Phẩm chất chủ yếu' },
  ];

  return (
    <div className="mb-4 flex flex-col gap-4">
      {/* Row 1: Filters and Export Button */}
      <div className="flex flex-col xl:flex-row justify-between items-end gap-4">
        {/* Filters Group */}
        <div className="flex flex-wrap gap-4 w-full xl:w-auto">
          <div className="w-full sm:w-auto">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Năm học</label>
            <select 
              className="w-full sm:w-40 px-3 py-2 border border-gray-300 rounded bg-gray-50 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              defaultValue="2025-2026"
            >
              <option>2025-2026</option>
              <option>2024-2025</option>
              <option>2023-2024</option>
            </select>
          </div>
          
          <div className="w-full sm:w-auto">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Học kỳ</label>
            <select 
              className="w-full sm:w-40 px-3 py-2 border border-gray-300 rounded bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              defaultValue="Cuối năm"
            >
              <option>Giữa kỳ 1</option>
              <option>Cuối kỳ 1</option>
              <option>Giữa kỳ 2</option>
              <option>Cuối năm</option>
            </select>
          </div>
          
          <div className="w-full sm:w-auto">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Tên lớp</label>
            <select 
              className="w-full sm:w-40 px-3 py-2 border border-gray-300 rounded bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              defaultValue="1.1"
            >
              <option>1.1</option>
              <option>1A2</option>
              <option>1A3</option>
            </select>
          </div>

          <div className="w-full sm:w-auto">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Nội dung hiển thị</label>
            <select 
              value={viewFilter}
              onChange={(e) => setViewFilter(e.target.value as ViewFilter)}
              className="w-full sm:w-60 px-3 py-2 border border-gray-300 rounded bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              {displayOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Export Button */}
        <div className="flex-shrink-0">
           <button className="px-4 py-2 bg-[#3b82f6] text-white rounded font-medium hover:bg-blue-600 shadow-sm transition-all flex items-center gap-2 text-sm">
            <span className="whitespace-nowrap">Xuất excel</span>
          </button>
        </div>
      </div>

      {/* Row 2: Stats/Notes and Action Buttons */}
      <div className="flex flex-col xl:flex-row justify-between items-end gap-4 mt-2">
        {/* Left: Stats and Notes */}
        <div className="flex flex-col gap-1 text-sm">
          <div className="font-bold text-gray-800">Số học sinh: {STUDENTS_DATA.length}</div>
          <div className="text-red-500 font-medium">
            (Thầy cô có thể nhấn trực tiếp vào ô đánh giá phẩm chất, năng lực để sửa đánh giá)
          </div>
          <div className="text-red-500 font-medium hidden sm:block">
            (Thầy cô chủ nhiệm có thể nhấn trực tiếp vào các ô đánh giá kết quả cuối năm và xét lên lớp để thay đổi kết quả)
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 justify-start xl:justify-end w-full xl:w-auto mt-2 xl:mt-0">
          <button className="px-4 py-2 bg-[#22c55e] text-white rounded font-medium hover:bg-green-600 shadow-sm transition-all flex items-center gap-2 text-sm">
            <span className="whitespace-nowrap">Đồng bộ điểm</span>
          </button>
          
          <button className="px-4 py-2 bg-[#ef4444] text-white rounded font-medium hover:bg-red-600 shadow-sm transition-all flex items-center gap-2 text-sm">
            <span className="whitespace-nowrap">Chốt sổ</span>
          </button>

          <button className="px-4 py-2 bg-[#6366f1] text-white rounded font-medium hover:bg-indigo-600 shadow-sm transition-all flex items-center gap-2 text-sm">
            <span className="whitespace-nowrap">Lịch sử chỉnh sửa</span>
          </button>

          <button className="px-6 py-2 bg-[#6366f1] text-white rounded font-medium hover:bg-indigo-600 shadow-sm transition-all flex items-center gap-2 text-sm">
            <span className="whitespace-nowrap">Lưu</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;