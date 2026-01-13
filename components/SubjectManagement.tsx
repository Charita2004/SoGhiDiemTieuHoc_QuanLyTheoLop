import React, { useState, useMemo } from 'react';
import { STUDENTS_DATA } from '../constants';
import { ChevronDown, ChevronUp, Printer, Users, LogOut, UserX } from 'lucide-react';
import CommentInput from './CommentInput';
import { CommentItem, UserConfig } from '../types';

interface SubjectManagementProps {
  comments?: CommentItem[];
  currentUser?: UserConfig;
}

const SubjectManagement: React.FC<SubjectManagementProps> = ({ comments = [], currentUser }) => {
  const [openSections, setOpenSections] = useState({
    active: true,
    transfer: false,
    quit: false
  });

  // Filters State - Default values match a scenario with data in the Mock DB
  const [selectedGrade, setSelectedGrade] = useState('Khối 01');
  const [selectedClass, setSelectedClass] = useState('1A2');
  const [selectedSubject, setSelectedSubject] = useState('Toán'); // Use simple names to match mock data keys
  const [selectedTerm, setSelectedTerm] = useState('Cuối kỳ 1');

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const activeStudents = STUDENTS_DATA.filter(s => s.className === selectedClass);
  const transferStudents: any[] = [];
  const quitStudents: any[] = [];

  // --- SMART SUGGESTION LOGIC ---
  
  // 1. Filter comments by Context (Grade, Subject, Term) ONCE per render
  // This reduces complexity from O(N*M) inside the row loop
  const contextComments = useMemo(() => {
    if (!comments || comments.length === 0) return [];
    
    return comments.filter(c => 
        c.grade === selectedGrade &&
        c.subject === selectedSubject &&
        c.term === selectedTerm
    );
  }, [comments, selectedGrade, selectedSubject, selectedTerm]);

  // Helper to get specific suggestions for a student based on their rating
  const getSuggestionsForStudent = (rating: string) => {
     // Filter by Level (T, H, C)
     // Normalize to uppercase just in case
     const cleanRating = rating.trim().toUpperCase();
     return contextComments
        .filter(c => c.level === cleanRating)
        .map(c => c.content);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Filters Area */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">Năm học</label>
            <select className="px-3 py-2 border border-gray-300 rounded bg-gray-100/50 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-32 shadow-sm">
              <option>2025-2026</option>
              <option>2024-2025</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">Khối học</label>
            <select 
                className="px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-32 shadow-sm"
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
            >
              <option value="Khối 01">Khối 01</option>
              <option value="Khối 02">Khối 02</option>
              <option value="Khối 03">Khối 03</option>
              <option value="Khối 04">Khối 04</option>
              <option value="Khối 05">Khối 05</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">Môn học</label>
            <select 
                className="px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-32 shadow-sm"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="Toán">Toán</option>
              <option value="Tiếng Việt">Tiếng Việt</option>
              <option value="Tiếng Anh">Tiếng Anh</option>
              <option value="Khoa học">Khoa học</option>
              <option value="Đạo đức">Đạo đức</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">Học kỳ</label>
            <select 
                className="px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-36 shadow-sm"
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
            >
              <option value="Giữa kỳ 1">Giữa kỳ 1</option>
              <option value="Cuối kỳ 1">Cuối kỳ 1</option>
              <option value="Giữa kỳ 2">Giữa kỳ 2</option>
              <option value="Cuối năm">Cuối năm</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600">Tên lớp</label>
            <select 
                className="px-3 py-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-40 shadow-sm"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="1A2">1A2</option>
              <option value="5A2">5A2</option>
            </select>
          </div>
        </div>

        {/* Excel Button - Aligned to bottom right of filters in desktop */}
        <div className="mb-0.5">
           <button className="flex items-center gap-2 px-4 py-2 bg-white text-[#16a34a] border border-[#16a34a] rounded hover:bg-green-50 transition-all shadow-sm text-sm font-medium">
             <Printer size={18} />
             <span>Xuất excel</span>
           </button>
        </div>
      </div>

      {/* Stats and Action Buttons Row */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-4 gap-4">
          <div>
            <div className="font-bold text-gray-800 text-sm">Số học sinh: {activeStudents.length}</div>
            <div className="text-red-500 text-xs font-medium mt-1">
               (Thầy cô có thể nhấn trực tiếp vào cột điểm để sửa điểm)
            </div>
            <div className="text-blue-600 text-xs font-medium flex items-center gap-1 mt-0.5">
               <span className="bg-amber-100 text-amber-700 px-1 rounded text-[10px] font-bold">MỚI</span>
               <span>Hệ thống tự động gợi ý nhận xét dựa trên mức đạt được (T/H/C) của học sinh.</span>
            </div>
          </div>
          <div className="flex gap-2">
             <button className="px-4 py-2 bg-[#ef4444] text-white rounded font-medium hover:bg-red-600 transition-colors text-sm shadow-sm">
                Chốt sổ
             </button>
             <button className="px-4 py-2 bg-[#6366f1] text-white rounded font-medium hover:bg-indigo-600 transition-colors text-sm shadow-sm">
                Lịch sử chỉnh sửa
             </button>
             <button className="px-6 py-2 bg-[#6366f1] text-white rounded font-medium hover:bg-indigo-600 transition-colors text-sm shadow-sm">
                Lưu
             </button>
          </div>
      </div>

      {/* Accordions Container - Scrollable */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pb-10 space-y-4">
          
          {/* 1. Active Students Accordion */}
          <div className="bg-white rounded-lg border border-indigo-100 shadow-sm overflow-hidden">
             <div 
                className="bg-[#eff4ff] px-4 py-3 flex justify-between items-center cursor-pointer select-none"
                onClick={() => toggleSection('active')}
             >
                <div className="flex items-center gap-3">
                    <Users className="text-indigo-600" size={20} />
                    <span className="font-bold text-gray-800 text-sm">Đang học ({activeStudents.length})</span>
                </div>
                <button className="bg-[#5c5cff] hover:bg-indigo-600 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 transition-colors">
                   {openSections.active ? 'Thu gọn' : 'Mở rộng'}
                   {openSections.active ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
             </div>

             {openSections.active && (
                <div className="p-4 border-t border-indigo-100">
                    <div className="overflow-x-auto border border-gray-200 rounded-t-lg">
                        <table className="w-full min-w-[800px] border-collapse">
                            <thead>
                                <tr className="bg-white border-b border-gray-200">
                                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 border-r border-gray-200 w-16 uppercase bg-gray-50">STT</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 border-r border-gray-200 w-48 uppercase bg-gray-50">Số định danh cá nhân</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 border-r border-gray-200 w-64 uppercase bg-gray-50">Họ và tên</th>
                                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 border-r border-gray-200 w-32 uppercase bg-gray-50">Mức đạt được</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase bg-gray-50">Nhận xét</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {activeStudents.map((student, index) => {
                                    // Mocking the score logic here for demo purposes
                                    // In a real app, this would come from the student data structure
                                    const mockRating = ['T', 'H', 'C'][index % 3]; 
                                    const smartSuggestions = getSuggestionsForStudent(mockRating);

                                    return (
                                        <tr key={student.id} className="hover:bg-blue-50/50 transition-colors">
                                            <td className="px-4 py-3 text-center text-sm text-gray-900 border-r border-gray-200">{index + 1}</td>
                                            <td className="px-4 py-3 text-left text-sm text-gray-600 font-mono border-r border-gray-200">{student.id}</td>
                                            <td className="px-4 py-3 text-left text-sm font-medium text-gray-900 border-r border-gray-200">{student.name}</td>
                                            <td className="px-4 py-3 text-center border-r border-gray-200">
                                                <input 
                                                    type="text" 
                                                    className={`w-12 h-9 text-center border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase font-bold text-sm shadow-sm
                                                        ${mockRating === 'T' ? 'text-blue-700 bg-blue-50 border-blue-200' : 
                                                          mockRating === 'H' ? 'text-cyan-700 bg-cyan-50 border-cyan-200' : 
                                                          'text-orange-700 bg-orange-50 border-orange-200'
                                                        }`}
                                                    defaultValue={mockRating} 
                                                />
                                            </td>
                                            <td className="px-4 py-2">
                                                <CommentInput 
                                                    initialValue="" 
                                                    placeholder="Nhập nhận xét..."
                                                    smartSuggestions={smartSuggestions}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
             )}
          </div>

          {/* 2. Transfer Students Accordion */}
          <div className="bg-white rounded-lg border border-orange-100 shadow-sm overflow-hidden">
             <div 
                className="bg-[#fff7ed] px-4 py-3 flex justify-between items-center cursor-pointer select-none"
                onClick={() => toggleSection('transfer')}
             >
                <div className="flex items-center gap-3">
                    <LogOut className="text-orange-600" size={20} />
                    <span className="font-bold text-gray-800 text-sm">Chuyển đi ({transferStudents.length})</span>
                </div>
                <button className="bg-[#5c5cff] hover:bg-indigo-600 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 transition-colors">
                   {openSections.transfer ? 'Thu gọn' : 'Mở rộng'}
                   {openSections.transfer ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
             </div>
             {openSections.transfer && (
                <div className="p-8 text-center text-gray-500 italic text-sm bg-white border-t border-orange-100">
                    Không có dữ liệu
                </div>
             )}
          </div>

          {/* 3. Quit Students Accordion */}
          <div className="bg-white rounded-lg border border-red-100 shadow-sm overflow-hidden">
             <div 
                className="bg-[#fef2f2] px-4 py-3 flex justify-between items-center cursor-pointer select-none"
                onClick={() => toggleSection('quit')}
             >
                <div className="flex items-center gap-3">
                    <UserX className="text-red-600" size={20} />
                    <span className="font-bold text-gray-800 text-sm">Thôi học ({quitStudents.length})</span>
                </div>
                <button className="bg-[#5c5cff] hover:bg-indigo-600 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 transition-colors">
                   {openSections.quit ? 'Thu gọn' : 'Mở rộng'}
                   {openSections.quit ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
             </div>
             {openSections.quit && (
                <div className="p-8 text-center text-gray-500 italic text-sm bg-white border-t border-red-100">
                    Không có dữ liệu
                </div>
             )}
          </div>

      </div>
    </div>
  );
};

export default SubjectManagement;