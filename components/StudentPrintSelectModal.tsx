import React, { useState, useMemo } from 'react';
import { X, Search } from 'lucide-react';
import { Student } from '../types';
import { STUDENTS_DATA } from '../constants';

interface StudentPrintSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedClass: string;
  onConfirm: (selectedStudents: Student[]) => void;
  term?: string;
  onTermChange?: (term: string) => void;
}

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

  const handlePrint = () => {
    const selected = filteredStudents.filter(s => selectedIds.has(s.id));
    if (selected.length === 0) {
      alert('Vui lòng chọn ít nhất một học sinh để in.');
      return;
    }
    onConfirm(selected);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header - Based on reference image color */}
        <div className="bg-[#4f46e5] px-6 py-3 flex items-center justify-between">
          <h2 className="text-white font-semibold text-lg">In phiếu điểm</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content Section */}
        <div className="p-6 overflow-auto custom-scrollbar">
          {/* Filters Row: Semester and Search combined */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
             {/* Semester Filter */}
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

             {/* Search Filter */}
             <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Tìm kiếm theo</label>
                <div className="relative">
                   <input 
                    type="text"
                    placeholder="Tìm kiếm theo tên học sinh..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                   />
                   <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
             </div>
          </div>

          {/* Action Row Above Table */}
          <div className="flex justify-end items-center gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-700">
               <input 
                type="checkbox" 
                id="select-all" 
                checked={selectedIds.size === filteredStudents.length && filteredStudents.length > 0}
                onChange={toggleSelectAll}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" 
               />
               <label htmlFor="select-all" className="cursor-pointer">Chọn tất cả</label>
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

          {/* Data Table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
             <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-[#1d4ed8] text-white">
                  <tr>
                    <th className="px-4 py-3 font-bold border-r border-white/10 w-16 text-center">Stt</th>
                    <th className="px-4 py-3 font-bold border-r border-white/10">Mã học sinh</th>
                    <th className="px-4 py-3 font-bold border-r border-white/10">Họ và tên</th>
                    <th className="px-4 py-3 font-bold border-r border-white/10">Lớp</th>
                    <th className="px-4 py-3 font-bold text-center">Chọn</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student, idx) => (
                      <tr key={student.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-4 py-3 text-center text-gray-600 border-r border-gray-200">{idx + 1}</td>
                        <td className="px-4 py-3 text-gray-700 border-r border-gray-200">{student.id}</td>
                        <td className="px-4 py-3 font-medium text-gray-900 border-r border-gray-200">{student.name}</td>
                        <td className="px-4 py-3 text-gray-600 border-r border-gray-200">{student.className}</td>
                        <td className="px-4 py-3 text-center">
                          <input 
                            type="checkbox" 
                            checked={selectedIds.has(student.id)}
                            onChange={() => toggleStudent(student.id)}
                            className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-gray-500 italic">
                        Không tìm thấy học sinh phù hợp
                      </td>
                    </tr>
                  )}
                </tbody>
             </table>
          </div>
          <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
            <span>Đang xem {filteredStudents.length} học sinh</span>
            <div className="flex gap-4">
              <button className="hover:text-indigo-600">Trước</button>
              <button className="hover:text-indigo-600">Tiếp</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPrintSelectModal;