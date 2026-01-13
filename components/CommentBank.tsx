import React, { useState, useEffect, useMemo, useRef } from 'react';
import { UserConfig, CommentItem, ImportRow } from '../types';
import { Download, Upload, Search, Trash2, Edit, Plus, Info, Check, X, Save, AlertTriangle } from 'lucide-react';
import CommentBankImportModal from './CommentBankImportModal';
import * as XLSX from 'xlsx';

interface CommentBankProps {
  currentUser: UserConfig;
  comments: CommentItem[];
  setComments: (comments: CommentItem[]) => void;
}

const CommentBank: React.FC<CommentBankProps> = ({ currentUser, comments, setComments }) => {
  // --- STATE ---
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [term, setTerm] = useState('Cuối kỳ 1');
  const [useSystemBank, setUseSystemBank] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Inline Add State
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newLevel, setNewLevel] = useState<'T' | 'H' | 'C'>('T');
  const [newContent, setNewContent] = useState('');
  const [addError, setAddError] = useState<string | null>(null); // State for Add Error

  // Inline Edit State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editLevel, setEditLevel] = useState<'T' | 'H' | 'C'>('T');
  const [editContent, setEditContent] = useState('');
  const [editError, setEditError] = useState<string | null>(null); // State for Edit Error
  
  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: number | null }>({ isOpen: false, id: null });
  
  // Import/Export States
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importData, setImportData] = useState<ImportRow[]>([]);
  const [isImporting, setIsImporting] = useState(false);

  // --- DERIVED STATE & EFFECTS ---

  // Get available Grades based on User Assignments
  const availableGrades = useMemo(() => {
    return Object.keys(currentUser.assignments).sort();
  }, [currentUser]);

  // Update Subject List when Grade Changes
  const availableSubjects = useMemo(() => {
    if (!selectedGrade) return [];
    return currentUser.assignments[selectedGrade] || [];
  }, [selectedGrade, currentUser]);

  // Auto-select Grade if user only has 1
  useEffect(() => {
    if (availableGrades.length > 0 && !availableGrades.includes(selectedGrade)) {
        setSelectedGrade(availableGrades[0]);
    }
  }, [availableGrades]);

  // Auto-select Subject if only 1 exists for the grade
  useEffect(() => {
    if (availableSubjects.length > 0) {
        // If current subject is not in the new list, select the first one
        if (!availableSubjects.includes(selectedSubject)) {
            setSelectedSubject(availableSubjects[0]);
        }
    } else {
        setSelectedSubject('');
    }
  }, [availableSubjects, selectedGrade]);


  // Filter AND Sort Comments
  const processedComments = useMemo(() => {
    // 1. Filter
    const filtered = comments.filter(c => {
        const matchGrade = c.grade === selectedGrade;
        const matchSubject = c.subject === selectedSubject;
        // In real app, match Term too if needed, here strict matching grade/subject
        const contentStr = String(c.content || "");
        const matchSearch = contentStr.toLowerCase().includes(searchTerm.toLowerCase());
        return matchGrade && matchSubject && matchSearch;
    });

    // 2. Sort Logic
    // Priority 1: Level (T -> H -> C)
    // Priority 2: ID Descending (Newest first)
    return filtered.sort((a, b) => {
        const levelPriority: Record<string, number> = { 'T': 1, 'H': 2, 'C': 3 };
        
        const priorityA = levelPriority[a.level] || 4;
        const priorityB = levelPriority[b.level] || 4;

        if (priorityA !== priorityB) {
            return priorityA - priorityB; // Ascending priority (1, 2, 3)
        }

        // If levels are same, sort by ID descending (newest first)
        return b.id - a.id;
    });
  }, [comments, selectedGrade, selectedSubject, searchTerm]);

  // --- HANDLERS ---

  // 0. DUPLICATE CHECK UTILITY
  const handleCheckDuplicate = (content: string, rating: string, currentId?: number): boolean => {
    const normalize = (str: string) => String(str || '').trim().toLowerCase();
    const inputContent = normalize(content);

    return comments.some(existingItem => {
      // Must match context (Grade/Subject/Term) - assumed from current view state
      const matchContext = 
         existingItem.grade === selectedGrade && 
         existingItem.subject === selectedSubject && 
         existingItem.term === term;
      
      if (!matchContext) return false;

      // Exclude self if editing
      if (currentId && existingItem.id === currentId) return false;

      // Check Content & Rating
      const matchContent = normalize(existingItem.content) === inputContent;
      const matchRating = existingItem.level === rating;

      return matchContent && matchRating;
    });
  };

  // 1. HANDLE DOWNLOAD TEMPLATE
  const handleDownloadTemplate = () => {
    if (!selectedGrade || !selectedSubject) {
        alert("Vui lòng chọn Khối và Môn học trước khi tải mẫu.");
        return;
    }

    const existingData = comments.filter(c => 
        c.grade === selectedGrade && 
        c.subject === selectedSubject && 
        c.term === term
    );

    const rows = [];
    let currentRowIndex = 1;

    existingData.forEach(item => {
        rows.push({
            'STT': currentRowIndex++,
            'Khối': item.grade,
            'Môn học': item.subject,
            'Học kỳ': item.term,
            'Mức độ (T/H/C)': item.level,
            'Nội dung nhận xét': item.content
        });
    });

    for (let i = 0; i < 50; i++) {
        rows.push({
            'STT': currentRowIndex++,
            'Khối': selectedGrade,
            'Môn học': selectedSubject,
            'Học kỳ': term,
            'Mức độ (T/H/C)': '', 
            'Nội dung nhận xét': '' 
        });
    }

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const wscols = [
        { wch: 5 }, { wch: 10 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 60 }
    ];
    worksheet['!cols'] = wscols;

    const endRow = rows.length + 1;
    const validationRange = `E2:E${endRow}`;

    (worksheet as any)['!dataValidation'] = [
      {
        sqref: validationRange,
        type: 'list',
        operator: 'equal',
        formula1: '"T,H,C"',
        showErrorMessage: true,
        errorTitle: 'Giá trị không hợp lệ',
        error: 'Vui lòng chọn T, H hoặc C từ danh sách.',
      }
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Mau_Nhan_Xet");

    const removeVietnameseTones = (str: string) => {
        return str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D')
            .replace(/\s+/g, '_'); 
    };

    const cleanGrade = removeVietnameseTones(selectedGrade);
    const cleanSubject = removeVietnameseTones(selectedSubject).replace(/_/g, '');
    const fileName = `Mau_Nhan_Xet_${cleanGrade}_Mon_${cleanSubject}.xlsx`;

    XLSX.writeFile(workbook, fileName);
  };

  const handleTriggerUpload = () => {
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
        fileInputRef.current.click();
    }
  };

  // 2. HANDLE FILE UPLOAD
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      
      reader.onload = (evt) => {
          const bstr = evt.target?.result;
          if (!bstr) return;

          try {
              const wb = XLSX.read(bstr, { type: 'binary' });
              const wsname = wb.SheetNames[0];
              const ws = wb.Sheets[wsname];
              const jsonData = XLSX.utils.sheet_to_json(ws);
              
              const normalize = (str: string) => str ? String(str).trim().toLowerCase() : '';
              const generateSig = (g: string, s: string, t: string, l: string, c: string) => 
                  `${g}|${s}|${t}|${l}|${normalize(c)}`;

              const existingSignatures = new Set(
                  comments.map(c => generateSig(c.grade, c.subject, c.term, c.level, c.content))
              );
              const fileSignatures = new Set<string>();
              const parsedRows: ImportRow[] = [];

              jsonData.forEach((row: any, index: number) => {
                  const grade = row['Khối'] || selectedGrade;
                  const subject = row['Môn học'] || selectedSubject;
                  const t = row['Học kỳ'] || term;
                  const rawLevel = row['Mức độ (T/H/C)'];
                  const rawContent = row['Nội dung nhận xét'];
                  const content = rawContent ? String(rawContent) : '';

                  if (!rawLevel && !content) return; 

                  let level = '';
                  let isValid = true;
                  let error = '';

                  if (rawLevel) {
                      const cleanLevel = String(rawLevel).trim().toUpperCase();
                      if (['T', 'H', 'C'].includes(cleanLevel)) {
                          level = cleanLevel;
                      } else {
                          isValid = false;
                          error = 'Mức độ không hợp lệ (Phải là T, H hoặc C)';
                      }
                  } else {
                       if (content) { isValid = false; error = 'Thiếu mức độ'; }
                       else { return; } 
                  }

                  if (!content && level) {
                      isValid = false;
                      error = 'Thiếu nội dung nhận xét';
                  }
                  
                  if (isValid) {
                      const sig = generateSig(grade, subject, t, level, content);
                      if (existingSignatures.has(sig)) return;
                      if (fileSignatures.has(sig)) return;
                      fileSignatures.add(sig);
                  }

                  parsedRows.push({
                      index,
                      grade,
                      subject,
                      term: t,
                      level,
                      content: content || '',
                      isValid,
                      error
                  });
              });

              if (parsedRows.length === 0) {
                  alert("Không tìm thấy dữ liệu mới. Tất cả các câu trong file đều đã tồn tại trên hệ thống hoặc file rỗng.");
                  return;
              }

              setImportData(parsedRows);
              setShowImportModal(true);

          } catch (error) {
              console.error("Error reading file:", error);
              alert("Đã xảy ra lỗi khi đọc file Excel. Vui lòng đảm bảo file đúng định dạng.");
          }
      };

      reader.readAsBinaryString(file);
  };

  const handleConfirmImport = () => {
      setIsImporting(true);
      setTimeout(() => {
          const validRows = importData.filter(r => r.isValid);
          const invalidCount = importData.length - validRows.length;

          const newComments = validRows.map((r, idx) => ({
              id: Date.now() + idx,
              grade: r.grade,
              subject: r.subject,
              term: r.term,
              level: r.level as any,
              content: r.content
          }));
          
          if (newComments.length === 0) {
              alert("Không có dữ liệu hợp lệ để lưu.");
              setIsImporting(false);
              return;
          }

          setComments([...newComments, ...comments]); // Updated to use prop setter
          setIsImporting(false);
          setShowImportModal(false);
          setImportData([]); 
          
          if (invalidCount > 0) {
             alert(`Đã nhập thành công ${newComments.length} nhận xét. Bỏ qua ${invalidCount} dòng lỗi.`);
          } else {
             alert(`Đã nhập thành công ${newComments.length} nhận xét.`);
          }
      }, 800);
  };

  // --- INLINE ADD HANDLERS ---
  const handleAddNewClick = () => {
    setEditingId(null);
    setIsAddingNew(true);
    setNewLevel('T');
    setNewContent('');
    setAddError(null); // Reset error
  };

  const handleSaveNew = () => {
    if (!newContent.trim()) {
      alert("Vui lòng nhập nội dung nhận xét");
      return;
    }

    // DUPLICATE CHECK
    const isDuplicate = handleCheckDuplicate(newContent, newLevel);
    if (isDuplicate) {
        setAddError("Đã tồn tại");
        return; // Stop saving, keep form open
    }

    // Proceed if no duplicate
    const newId = Date.now();
    const newComment: CommentItem = {
      id: newId,
      grade: selectedGrade,
      subject: selectedSubject,
      term: term,
      level: newLevel,
      content: newContent
    };
    
    setComments([newComment, ...comments]); // Updated to use prop setter
    setIsAddingNew(false);
    setAddError(null);
  };

  // --- INLINE EDIT HANDLERS ---
  const handleEditClick = (comment: CommentItem) => {
    setIsAddingNew(false);
    setEditingId(comment.id);
    setEditLevel(comment.level);
    setEditContent(comment.content);
    setEditError(null); // Reset error
  };

  const handleUpdateComment = () => {
     if (!editContent.trim()) {
        alert("Vui lòng nhập nội dung nhận xét");
        return;
     }

     // DUPLICATE CHECK (Exclude current ID)
     const isDuplicate = handleCheckDuplicate(editContent, editLevel, editingId!);
     if (isDuplicate) {
        setEditError("Đã tồn tại");
        return; // Stop saving, keep form open
     }

     // Updated to use prop setter
     setComments(comments.map(c => 
        c.id === editingId 
        ? { ...c, level: editLevel, content: editContent }
        : c
     ));

     setEditingId(null);
     setEditError(null);
  };

  const handleCancelEdit = () => {
     setEditingId(null);
     setEditError(null);
  };

  // --- DELETE HANDLERS ---
  const handleDeleteClick = (id: number) => {
    setDeleteModal({ isOpen: true, id });
  };

  const handleConfirmDelete = () => {
    if (deleteModal.id !== null) {
        setComments(comments.filter(c => c.id !== deleteModal.id)); // Updated to use prop setter
        if (editingId === deleteModal.id) {
            setEditingId(null);
        }
    }
    setDeleteModal({ isOpen: false, id: null });
  };

  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      
      {/* 1. Header & Configuration */}
      <div className="bg-white border-b border-gray-200 p-6 shadow-sm shrink-0">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
             <div>
                <h1 className="text-2xl font-bold text-gray-800">Ngân hàng Nhận xét Cá nhân</h1>
                <p className="text-sm text-gray-500 mt-1">Quản lý kho nhận xét mẫu cho <span className="font-semibold text-blue-700">{currentUser.name}</span></p>
             </div>
             <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
                <span className="text-sm font-medium text-blue-800">Ưu tiên nguồn gợi ý:</span>
                <button 
                    onClick={() => setUseSystemBank(!useSystemBank)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${useSystemBank ? 'bg-gray-300' : 'bg-blue-600'}`}
                >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${useSystemBank ? 'translate-x-1' : 'translate-x-6'}`} />
                </button>
                <span className={`text-sm font-bold ${!useSystemBank ? 'text-blue-700' : 'text-gray-500'}`}>Cá nhân</span>
                <span className="text-gray-300">|</span>
                <span className={`text-sm font-bold ${useSystemBank ? 'text-gray-700' : 'text-gray-400'}`}>Hệ thống</span>
             </div>
         </div>

         {/* Filters */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1.5">
               <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Năm học</label>
               <select className="input-field border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                  <option>2025-2026</option>
                  <option>2024-2025</option>
               </select>
            </div>
            <div className="flex flex-col gap-1.5">
               <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Khối lớp</label>
               <select 
                 className="input-field border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                 value={selectedGrade}
                 onChange={(e) => setSelectedGrade(e.target.value)}
               >
                  {availableGrades.map(g => <option key={g} value={g}>{g}</option>)}
               </select>
            </div>
            <div className="flex flex-col gap-1.5">
               <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Môn học</label>
               <select 
                 className="input-field border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                 value={selectedSubject}
                 onChange={(e) => setSelectedSubject(e.target.value)}
               >
                  {availableSubjects.map(s => <option key={s} value={s}>{s}</option>)}
               </select>
            </div>
            <div className="flex flex-col gap-1.5">
               <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Học kỳ</label>
               <select 
                 className="input-field border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                 value={term}
                 onChange={(e) => setTerm(e.target.value)}
               >
                  <option>Giữa kỳ 1</option>
                  <option>Cuối kỳ 1</option>
                  <option>Giữa kỳ 2</option>
                  <option>Cuối năm</option>
               </select>
            </div>
         </div>
      </div>

      {/* 2. Toolbar */}
      <div className="px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
         {/* Search */}
         <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm nội dung nhận xét..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>

         {/* Actions */}
         <div className="flex items-center gap-3 w-full md:w-auto">
             <button 
                onClick={handleDownloadTemplate}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors whitespace-nowrap"
             >
                <Download size={16} />
                <span>Tải file mẫu</span>
             </button>
             <button 
                onClick={handleTriggerUpload}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm whitespace-nowrap"
             >
                <Upload size={16} />
                <span>Tải lên & Cập nhật</span>
             </button>
             <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx, .xls" onChange={handleFileUpload} />
             
             <button 
                onClick={handleAddNewClick}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
             >
                <Plus size={16} />
                <span>Thêm mới</span>
             </button>
         </div>
      </div>

      {/* 3. Data Table - Updated for Sticky Header */}
      <div className="flex-1 flex flex-col min-h-0 px-6 pb-6">
         <div className="flex-1 overflow-auto custom-scrollbar bg-white border border-gray-200 rounded-xl shadow-sm relative">
            <table className="w-full text-left border-collapse">
               <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold sticky top-0 z-10 shadow-sm">
                  <tr>
                     <th className="px-6 py-4 w-16 text-center border-b bg-gray-50">STT</th>
                     <th className="px-6 py-4 w-32 border-b bg-gray-50">Mức độ</th>
                     <th className="px-6 py-4 border-b bg-gray-50">Nội dung nhận xét</th>
                     <th className="px-6 py-4 w-32 text-center border-b bg-gray-50">Hành động</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                  {/* INLINE ADD ROW - ALWAYS AT TOP */}
                  {isAddingNew && (
                    <tr className="bg-blue-50 animate-in fade-in slide-in-from-top-2 duration-300 border-b border-blue-100 shadow-inner">
                      <td className="px-6 py-4 text-center text-sm text-gray-500 font-medium">#</td>
                      <td className="px-6 py-4 align-top">
                          <select 
                            className="w-full p-2 border border-gray-300 rounded-md text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-700"
                            value={newLevel}
                            onChange={(e) => setNewLevel(e.target.value as any)}
                          >
                            <option value="T">T</option>
                            <option value="H">H</option>
                            <option value="C">C</option>
                          </select>
                      </td>
                      <td className="px-6 py-4 align-top">
                          <div className="flex flex-col">
                            <input 
                              type="text"
                              autoFocus
                              className={`w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white placeholder-gray-400 font-medium transition-colors ${addError ? 'border-red-500 ring-1 ring-red-500' : 'border-blue-300'}`}
                              placeholder="Nhập nội dung nhận xét..."
                              value={newContent}
                              onChange={(e) => {
                                setNewContent(e.target.value);
                                if (addError) setAddError(null);
                              }}
                              onKeyDown={(e) => {
                                  if(e.key === 'Enter') handleSaveNew();
                                  if(e.key === 'Escape') setIsAddingNew(false);
                              }}
                            />
                            {addError && <p className="text-xs text-red-500 mt-1 font-medium">{addError}</p>}
                          </div>
                      </td>
                      <td className="px-6 py-4 text-center align-top">
                          <div className="flex items-center justify-center gap-2">
                              <button onClick={handleSaveNew} className="p-2 text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors shadow-sm" title="Lưu">
                                  <Check size={16} />
                              </button>
                              <button onClick={() => setIsAddingNew(false)} className="p-2 text-gray-600 bg-white border border-gray-300 hover:bg-gray-100 rounded-lg transition-colors shadow-sm" title="Hủy">
                                  <X size={16} />
                              </button>
                          </div>
                      </td>
                    </tr>
                  )}

                  {processedComments.length > 0 ? (
                    processedComments.map((comment, index) => {
                      const isEditing = comment.id === editingId;

                      if (isEditing) {
                          return (
                              <tr key={comment.id} className="bg-white border-b border-gray-100 animate-in fade-in">
                                  <td className="px-6 py-4 text-center text-sm text-gray-500 font-medium">
                                      {index + 1}
                                  </td>
                                  <td className="px-6 py-4 align-top">
                                      <select 
                                        className="w-full p-2 border border-blue-300 rounded-md text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-700"
                                        value={editLevel}
                                        onChange={(e) => setEditLevel(e.target.value as any)}
                                      >
                                        <option value="T">T</option>
                                        <option value="H">H</option>
                                        <option value="C">C</option>
                                      </select>
                                  </td>
                                  <td className="px-6 py-4 align-top">
                                      <div className="flex flex-col">
                                          <input 
                                            type="text"
                                            autoFocus
                                            className={`w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium text-gray-800 transition-colors ${editError ? 'border-red-500 ring-1 ring-red-500' : 'border-blue-400'}`}
                                            value={editContent}
                                            onChange={(e) => {
                                                setEditContent(e.target.value);
                                                if (editError) setEditError(null);
                                            }}
                                            onKeyDown={(e) => {
                                                if(e.key === 'Enter') handleUpdateComment();
                                                if(e.key === 'Escape') handleCancelEdit();
                                            }}
                                          />
                                          {editError && <p className="text-xs text-red-500 mt-1 font-medium">{editError}</p>}
                                      </div>
                                  </td>
                                  <td className="px-6 py-4 text-center align-top">
                                      <div className="flex items-center justify-center gap-3">
                                          <button 
                                            onClick={handleUpdateComment} 
                                            className="p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
                                            title="Lưu thay đổi"
                                          >
                                              <Save size={20} />
                                          </button>
                                          <button 
                                            onClick={handleCancelEdit} 
                                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded transition-colors"
                                            title="Hủy bỏ"
                                          >
                                              <X size={20} />
                                          </button>
                                      </div>
                                  </td>
                              </tr>
                          );
                      }

                      return (
                        <tr key={comment.id} className="hover:bg-blue-50/50 transition-colors group">
                           <td className="px-6 py-4 text-center text-sm text-gray-500 font-medium">{index + 1}</td>
                           <td className="px-6 py-4">
                              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold border ${
                                comment.level === 'T' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                comment.level === 'H' ? 'bg-cyan-50 text-cyan-700 border-cyan-200' :
                                'bg-orange-50 text-orange-700 border-orange-200'
                              }`}>
                                 {comment.level}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-sm text-gray-800 leading-relaxed font-medium">
                              {comment.content}
                           </td>
                           <td className="px-6 py-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                 <button 
                                    onClick={() => handleEditClick(comment)}
                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Chỉnh sửa"
                                 >
                                    <Edit size={16} />
                                 </button>
                                 <button 
                                    onClick={() => handleDeleteClick(comment.id)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Xóa"
                                 >
                                    <Trash2 size={16} />
                                 </button>
                              </div>
                           </td>
                        </tr>
                      );
                    })
                  ) : (
                    !isAddingNew && (
                        <tr>
                            <td colSpan={4} className="px-6 py-20 text-center">
                            <div className="flex flex-col items-center justify-center text-gray-400">
                                <Info size={48} className="mb-4 text-gray-300" />
                                <p className="text-lg font-medium text-gray-500">Chưa có dữ liệu nhận xét</p>
                                <p className="text-sm mt-1 max-w-sm mx-auto">
                                    Vui lòng "Thêm mới" hoặc sử dụng chức năng "Tải lên" để nhập dữ liệu từ Excel cho môn <span className="font-bold text-gray-600">{selectedSubject}</span>.
                                </p>
                            </div>
                            </td>
                        </tr>
                    )
                  )}
               </tbody>
            </table>
         </div>
      </div>

      {/* Import Modal */}
      <CommentBankImportModal 
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        importData={importData}
        onConfirm={handleConfirmImport}
        isLoading={isImporting}
      />

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white rounded-lg shadow-2xl w-full max-w-[400px] overflow-hidden transform transition-all scale-100">
              <div className="p-6 text-center">
                 <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="text-red-600" size={28} />
                 </div>
                 <h3 className="text-lg font-bold text-gray-900 mb-2">Xác nhận xóa</h3>
                 <p className="text-gray-600 text-sm mb-6">
                    Bạn có chắc chắn muốn xóa nhận xét này không? Hành động này không thể hoàn tác.
                 </p>
                 <div className="flex gap-3 justify-center">
                    <button 
                       onClick={() => setDeleteModal({ isOpen: false, id: null })}
                       className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                       Hủy bỏ
                    </button>
                    <button 
                       onClick={handleConfirmDelete}
                       className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium shadow-sm"
                    >
                       Xóa nhận xét
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default CommentBank;