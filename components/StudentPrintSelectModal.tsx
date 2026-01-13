import React, { useState, useMemo, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { Student } from '../types';
import { STUDENTS_DATA } from '../constants';

interface StudentPrintSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedClass: string;
  onConfirm: (selectedStudents: Student[], selectedColumns: string[]) => void;
  term?: string;
  onTermChange?: (term: string) => void;
}

const COL_OPTIONS = [
    { key: 'gk1', label: 'Giữa HK 1' },
    { key: 'ck1', label: 'Cuối HK 1' },
    { key: 'gk2', label: 'Giữa HK 2' },
    { key: 'cn', label: 'Cuối năm' },
];

const StudentPrintSelectModal: React.FC<StudentPrintSelectModalProps> = ({ 
  isOpen, 
  onClose, 
  selectedClass, 
  onConfirm,
  term = 'Cuối năm',
  onTermChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedColumns, setSelectedColumns] = useState<string[]>(['gk1', 'ck1', 'gk2', 'cn']);

  // Auto-select columns based on Term with STRICT default values per requirement
  useEffect(() => {
    switch (term) {
        case 'Giữa kỳ 1':
            // Trường hợp 1: Chỉ chọn GK1
            setSelectedColumns(['gk1']);
            break;
        case 'Cuối kỳ 1':
            // Trường hợp 2: Chọn GK1 và CK1
            setSelectedColumns(['gk1', 'ck1']);
            break;
        case 'Giữa kỳ 2':
            // Trường hợp 3: Chỉ chọn GK2
            setSelectedColumns(['gk2']);
            break;
        case 'Cuối năm':
            // Trường hợp 4: Chọn tất cả
            setSelectedColumns(['gk1', 'ck1', 'gk2', 'cn']);
            break;
        default:
            setSelectedColumns(['gk1', 'ck1', 'gk2', 'cn']);
    }
  }, [term]);

  const filteredStudents = useMemo(() => {
    return STUDENTS_DATA.filter(s => 
      s.className === selectedClass && 
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [selectedClass, searchTerm]);

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredStudents.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredStudents.map(s => s.id)));
    }
  };

  const toggleStudent = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  // Determine if a column checkbox should be disabled
  const isColDisabled = (key: string) => {
      switch (term) {
          case 'Giữa kỳ 1':
              return key !== 'gk1'; // Disable everything except GK1
          case 'Cuối kỳ 1':
              return key === 'gk2' || key === 'cn'; // Disable GK2 and CN
          case 'Giữa kỳ 2':
              return key !== 'gk2'; // Disable everything except GK2
          case 'Cuối năm':
              return false; // Enable all
          default:
              return false;
      }
  };

  const toggleColumn = (key: string) => {
      // Prevent toggling if disabled
      if (isColDisabled(key)) return;

      setSelectedColumns(prev => {
          if (prev.includes(key)) {
              return prev.filter(k => k !== key);
          } else {
              // Maintain order: gk1 -> ck1 -> gk2 -> cn
              const newSelection = [...prev, key];
              return COL_OPTIONS
                  .filter(opt => newSelection.includes(opt.key))
                  .map(opt => opt.key);
          }
      });
  };

  const handlePrint = () => {
    const selected = filteredStudents.filter(s => selectedIds.has(s.id));
    if (selected.length === 0) {
      alert('Vui lòng chọn ít nhất một học sinh để in.');
      return;
    }
    if (selectedColumns.length === 0) {
        alert('Vui lòng chọn ít nhất một cột điểm để hiển thị.');
        return;
    }
    onConfirm(selected, selectedColumns);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col h-[85vh]">
        {/* 1. Fixed Header - Purple Background */}
        <div className="bg-[#4f46e5] px-6 py-3 flex items-center justify-between shrink-0">
          <h2 className="text-white font-semibold text-lg">In phiếu điểm</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* 2. Fixed Controls (Filters & Configuration) */}
        <div className="px-6 py-5 shrink-0 bg-white border-b border-gray-200 flex flex-col gap-5">
          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Học kỳ</label>
                <select 
                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm outline-none bg-white shadow-sm"
                   value={term}
                   onChange={(e) => onTermChange?.(e.target.value)}
                >
                   <option>Giữa kỳ 1</option>
                   <option>Cuối kỳ 1</option>
                   <option>Giữa kỳ 2</option>
                   <option>Cuối năm</option>
                </select>
             </div>

             <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Tìm kiếm theo</label>
                <div className="relative">
                   <input 
                    type="text"
                    placeholder="Tìm kiếm theo tên học sinh..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm outline-none shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                   />
                   <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
             </div>
          </div>

          {/* NEW: Column Configuration Row */}
          <div className="flex flex-col gap-2 bg-blue-50 border border-blue-100 rounded-lg p-3">
             <label className="text-xs font-bold text-blue-800 uppercase tracking-wide">Cấu hình cột hiển thị</label>
             <div className="flex flex-wrap gap-6">
                {COL_OPTIONS.map(opt => {
                    const disabled = isColDisabled(opt.key);
                    const checked = selectedColumns.includes(opt.key);
                    
                    return (
                        <label 
                            key={opt.key} 
                            className={`flex items-center gap-2 group select-none ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                        >
                            <input 
                                type="checkbox" 
                                className={`w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 ${disabled ? 'cursor-not-allowed bg-gray-100' : 'cursor-pointer'}`}
                                checked={checked}
                                onChange={() => toggleColumn(opt.key)}
                                disabled={disabled}
                            />
                            <span className={`text-sm ${checked ? 'text-indigo-900 font-bold' : 'text-gray-600 group-hover:text-gray-900'}`}>
                                {opt.label}
                            </span>
                        </label>
                    );
                })}
             </div>
          </div>

          {/* Action Row */}
          <div className="flex justify-end items-center gap-4 pt-1">
            <div className="flex items-center gap-2 text-sm text-gray-700 mr-auto">
               <input 
                type="checkbox" 
                id="select-all" 
                checked={selectedIds.size === filteredStudents.length && filteredStudents.length > 0}
                onChange={toggleSelectAll}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer" 
               />
               <label htmlFor="select-all" className="cursor-pointer font-medium select-none">Chọn tất cả</label>
            </div>
            <button 
              onClick={handlePrint}
              className="px-6 py-2 bg-[#4f46e5] text-white rounded font-medium hover:bg-indigo-700 transition-colors text-sm shadow-sm flex items-center gap-2"
            >
              In
            </button>
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-[#10b981] text-white rounded font-medium hover:bg-emerald-600 transition-colors text-sm shadow-sm"
            >
              Đóng
            </button>
          </div>
        </div>

        {/* 3. Table Container - Scrollable Area */}
        <div className="flex-1 min-h-0 p-6 bg-gray-50 flex flex-col">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">
             <div className="flex-1 overflow-auto custom-scrollbar">
               <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-[#1d4ed8] text-white sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 font-bold border-r border-white/20 w-16 text-center">Stt</th>
                      <th className="px-4 py-3 font-bold border-r border-white/20 w-32">Mã học sinh</th>
                      <th className="px-4 py-3 font-bold border-r border-white/20">Họ và tên</th>
                      <th className="px-4 py-3 font-bold border-r border-white/20 w-24">Lớp</th>
                      <th className="px-4 py-3 font-bold text-center w-24">Chọn</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student, idx) => (
                        <tr key={student.id} className="hover:bg-blue-50 transition-colors group cursor-pointer" onClick={() => toggleStudent(student.id)}>
                          <td className="px-4 py-3 text-center text-gray-600 border-r border-gray-200">{idx + 1}</td>
                          <td className="px-4 py-3 text-gray-700 border-r border-gray-200 font-mono text-xs">{student.id}</td>
                          <td className="px-4 py-3 font-semibold text-gray-900 border-r border-gray-200">{student.name}</td>
                          <td className="px-4 py-3 text-gray-600 border-r border-gray-200">{student.className}</td>
                          <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                            <input 
                              type="checkbox" 
                              checked={selectedIds.has(student.id)}
                              onChange={() => toggleStudent(student.id)}
                              className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer align-middle"
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-4 py-12 text-center text-gray-500 italic bg-white">
                          Không tìm thấy học sinh phù hợp với từ khóa "{searchTerm}"
                        </td>
                      </tr>
                    )}
                  </tbody>
               </table>
             </div>
          </div>
        </div>

        {/* 4. Fixed Footer / Pagination */}
        <div className="shrink-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center text-xs text-gray-500 rounded-b-lg">
            <span className="font-medium">Đang xem {filteredStudents.length} học sinh</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-gray-600 disabled:opacity-50" disabled>Trước</button>
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-gray-600 disabled:opacity-50" disabled>Tiếp</button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default StudentPrintSelectModal;