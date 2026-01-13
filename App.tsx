import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import FilterBar from './components/FilterBar';
import GradeTable from './components/GradeTable';
import PeriodicReviewTable from './components/PeriodicReviewTable';
import SubjectManagement from './components/SubjectManagement';
import CommentBank from './components/CommentBank';
import { ViewFilter, UserConfig, CommentItem } from './types';
import { MOCK_USERS_DB } from './constants';

const App: React.FC = () => {
  // Initialize collapsed state based on screen width
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); // Default to collapsed to avoid flash
  const [viewFilter, setViewFilter] = useState<ViewFilter>('all');
  const [term, setTerm] = useState<string>('Cuối năm');
  const [activePage, setActivePage] = useState<string>('subjects'); // Default to subjects for demo
  const [selectedClass, setSelectedClass] = useState<string>('1A2');
  const [isMounted, setIsMounted] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  // User State - Default to Admin or User A
  const [currentUser, setCurrentUser] = useState<UserConfig>(MOCK_USERS_DB['user_a']);

  // GLOBAL COMMENT BANK STATE (Lifted from CommentBank.tsx)
  const [globalComments, setGlobalComments] = useState<CommentItem[]>([
    // KHỐI 1
    // Toán
    { id: 101, grade: 'Khối 01', subject: 'Toán', term: 'Cuối kỳ 1', level: 'T', content: 'Thực hiện thành thạo phép cộng, trừ trong phạm vi 10.' },
    { id: 111, grade: 'Khối 01', subject: 'Toán', term: 'Cuối kỳ 1', level: 'T', content: 'Có tư duy logic tốt, nhận biết hình học nhanh.' },
    { id: 102, grade: 'Khối 01', subject: 'Toán', term: 'Cuối kỳ 1', level: 'H', content: 'Biết cách đặt tính nhưng đôi khi còn nhầm lẫn.' },
    { id: 112, grade: 'Khối 01', subject: 'Toán', term: 'Cuối kỳ 1', level: 'H', content: 'Làm bài tập đầy đủ nhưng đôi khi tính sai kết quả.' },
    { id: 103, grade: 'Khối 01', subject: 'Toán', term: 'Cuối kỳ 1', level: 'C', content: 'Cần rèn luyện thêm về kỹ năng viết số.' },
    { id: 113, grade: 'Khối 01', subject: 'Toán', term: 'Cuối kỳ 1', level: 'C', content: 'Cần giáo viên hướng dẫn thêm khi làm toán đố.' },
    
    // Tiếng Việt
    { id: 104, grade: 'Khối 01', subject: 'Tiếng Việt', term: 'Cuối kỳ 1', level: 'T', content: 'Đọc to, rõ ràng, tốc độ đọc nhanh. Chữ viết đẹp.' },
    { id: 114, grade: 'Khối 01', subject: 'Tiếng Việt', term: 'Cuối kỳ 1', level: 'T', content: 'Kể chuyện diễn cảm, nhớ nội dung câu chuyện tốt.' },
    { id: 105, grade: 'Khối 01', subject: 'Tiếng Việt', term: 'Cuối kỳ 1', level: 'H', content: 'Đọc đúng nhưng còn ngập ngừng khi gặp từ khó.' },
    { id: 115, grade: 'Khối 01', subject: 'Tiếng Việt', term: 'Cuối kỳ 1', level: 'H', content: 'Viết đúng độ cao nhưng khoảng cách chữ chưa đều.' },
    { id: 106, grade: 'Khối 01', subject: 'Tiếng Việt', term: 'Cuối kỳ 1', level: 'C', content: 'Cần luyện đọc nhiều hơn để cải thiện tốc độ.' },
    { id: 116, grade: 'Khối 01', subject: 'Tiếng Việt', term: 'Cuối kỳ 1', level: 'C', content: 'Cần rèn đọc trơn và ngắt nghỉ đúng dấu câu.' },
    
    // KHỐI 2
    // Toán
    { id: 201, grade: 'Khối 02', subject: 'Toán', term: 'Cuối kỳ 1', level: 'T', content: 'Nắm vững bảng nhân chia, giải toán có lời văn tốt.' },
    { id: 211, grade: 'Khối 02', subject: 'Toán', term: 'Cuối kỳ 1', level: 'T', content: 'Tính nhẩm nhanh, trình bày vở sạch sẽ.' },
    { id: 202, grade: 'Khối 02', subject: 'Toán', term: 'Cuối kỳ 1', level: 'H', content: 'Thuộc bảng cửu chương nhưng vận dụng còn chậm.' },
    { id: 212, grade: 'Khối 02', subject: 'Toán', term: 'Cuối kỳ 1', level: 'H', content: 'Biết xem đồng hồ nhưng còn lúng túng khi tính thời gian.' },
    { id: 203, grade: 'Khối 02', subject: 'Toán', term: 'Cuối kỳ 1', level: 'C', content: 'Cần ôn tập kỹ hơn về phép cộng có nhớ.' },
    { id: 213, grade: 'Khối 02', subject: 'Toán', term: 'Cuối kỳ 1', level: 'C', content: 'Cần thực hành nhiều hơn các bài toán về độ dài.' },

    // Tiếng Việt
    { id: 204, grade: 'Khối 02', subject: 'Tiếng Việt', term: 'Cuối kỳ 1', level: 'T', content: 'Đọc diễn cảm, ngắt nghỉ đúng dấu câu. Viết chính tả tốt.' },
    { id: 214, grade: 'Khối 02', subject: 'Tiếng Việt', term: 'Cuối kỳ 1', level: 'T', content: 'Viết chữ đẹp, đúng mẫu, giữ vở sạch sẽ.' },
    { id: 205, grade: 'Khối 02', subject: 'Tiếng Việt', term: 'Cuối kỳ 1', level: 'H', content: 'Chữ viết rõ ràng nhưng trình bày chưa sạch đẹp.' },
    { id: 215, grade: 'Khối 02', subject: 'Tiếng Việt', term: 'Cuối kỳ 1', level: 'H', content: 'Đọc to nhưng chưa diễn cảm lắm.' },
    { id: 206, grade: 'Khối 02', subject: 'Tiếng Việt', term: 'Cuối kỳ 1', level: 'C', content: 'Hay sai lỗi chính tả, cần rèn luyện thêm.' },
    { id: 216, grade: 'Khối 02', subject: 'Tiếng Việt', term: 'Cuối kỳ 1', level: 'C', content: 'Viết câu còn thiếu chủ ngữ hoặc vị ngữ.' },

    // KHỐI 3
    // Tiếng Anh
    { id: 301, grade: 'Khối 03', subject: 'Tiếng Anh', term: 'Cuối kỳ 1', level: 'T', content: 'Vocabulary retention is excellent. Participates actively.' },
    { id: 311, grade: 'Khối 03', subject: 'Tiếng Anh', term: 'Cuối kỳ 1', level: 'T', content: 'Excellent pronunciation and intonation.' },
    { id: 302, grade: 'Khối 03', subject: 'Tiếng Anh', term: 'Cuối kỳ 1', level: 'H', content: 'Good effort in speaking activities. Needs to work on spelling.' },
    { id: 312, grade: 'Khối 03', subject: 'Tiếng Anh', term: 'Cuối kỳ 1', level: 'H', content: 'Can answer simple questions about daily routines.' },
    { id: 303, grade: 'Khối 03', subject: 'Tiếng Anh', term: 'Cuối kỳ 1', level: 'C', content: 'Struggles with basic sentence structures.' },
    { id: 313, grade: 'Khối 03', subject: 'Tiếng Anh', term: 'Cuối kỳ 1', level: 'C', content: 'Struggles to complete workbook exercises.' },

    // Toán
    { id: 304, grade: 'Khối 03', subject: 'Toán', term: 'Cuối kỳ 1', level: 'T', content: 'Thực hiện tốt các phép tính với số lớn.' },
    { id: 314, grade: 'Khối 03', subject: 'Toán', term: 'Cuối kỳ 1', level: 'T', content: 'Vận dụng linh hoạt tính chất giao hoán, kết hợp.' },
    { id: 305, grade: 'Khối 03', subject: 'Toán', term: 'Cuối kỳ 1', level: 'H', content: 'Biết giải toán nhưng trình bày chưa khoa học.' },
    { id: 315, grade: 'Khối 03', subject: 'Toán', term: 'Cuối kỳ 1', level: 'H', content: 'Thực hiện phép chia còn chậm, cần rèn luyện thêm.' },
    { id: 306, grade: 'Khối 03', subject: 'Toán', term: 'Cuối kỳ 1', level: 'C', content: 'Cần ôn lại bảng nhân và chia.' },
    { id: 316, grade: 'Khối 03', subject: 'Toán', term: 'Cuối kỳ 1', level: 'C', content: 'Hay nhầm lẫn đơn vị đo độ dài, khối lượng.' },

    // KHỐI 4
    // Toán
    { id: 401, grade: 'Khối 04', subject: 'Toán', term: 'Cuối kỳ 1', level: 'T', content: 'Em tính toán nhanh, chính xác, hiểu bài tốt.' },
    { id: 411, grade: 'Khối 04', subject: 'Toán', term: 'Cuối kỳ 1', level: 'T', content: 'Giải toán đố mạch lạc, lập luận chặt chẽ.' },
    { id: 402, grade: 'Khối 04', subject: 'Toán', term: 'Cuối kỳ 1', level: 'H', content: 'Em nắm được kiến thức cơ bản, cần cẩn thận hơn khi tính toán.' },
    { id: 412, grade: 'Khối 04', subject: 'Toán', term: 'Cuối kỳ 1', level: 'H', content: 'Biết quy đồng mẫu số nhưng hay rút gọn sai.' },
    { id: 403, grade: 'Khối 04', subject: 'Toán', term: 'Cuối kỳ 1', level: 'C', content: 'Cần ôn lại bảng cửu chương và phép chia cho số có 2 chữ số.' },
    { id: 413, grade: 'Khối 04', subject: 'Toán', term: 'Cuối kỳ 1', level: 'C', content: 'Gặp khó khăn với các bài toán về phân số.' },

    // Tiếng Việt
    { id: 404, grade: 'Khối 04', subject: 'Tiếng Việt', term: 'Cuối kỳ 1', level: 'T', content: 'Đọc to, rõ ràng, diễn cảm. Chữ viết đẹp.' },
    { id: 414, grade: 'Khối 04', subject: 'Tiếng Việt', term: 'Cuối kỳ 1', level: 'T', content: 'Vốn từ phong phú, biết sử dụng biện pháp nhân hóa.' },
    { id: 405, grade: 'Khối 04', subject: 'Tiếng Việt', term: 'Cuối kỳ 1', level: 'H', content: 'Viết văn khá trôi chảy nhưng còn mắc lỗi dùng từ.' },
    { id: 415, grade: 'Khối 04', subject: 'Tiếng Việt', term: 'Cuối kỳ 1', level: 'H', content: 'Bài văn có bố cục rõ ràng nhưng nội dung còn sơ sài.' },
    { id: 406, grade: 'Khối 04', subject: 'Tiếng Việt', term: 'Cuối kỳ 1', level: 'C', content: 'Cần chú ý hơn về lỗi chính tả và ngữ pháp.' },
    { id: 416, grade: 'Khối 04', subject: 'Tiếng Việt', term: 'Cuối kỳ 1', level: 'C', content: 'Cần rèn chữ viết và cách trình bày bài văn.' },

    // Tiếng Anh
    { id: 407, grade: 'Khối 04', subject: 'Tiếng Anh', term: 'Cuối kỳ 1', level: 'T', content: 'Shows great interest in learning English. Good grammar usage.' },
    { id: 417, grade: 'Khối 04', subject: 'Tiếng Anh', term: 'Cuối kỳ 1', level: 'T', content: 'Confidently presents topics in front of the class.' },
    { id: 408, grade: 'Khối 04', subject: 'Tiếng Anh', term: 'Cuối kỳ 1', level: 'H', content: 'Can communicate simple ideas. Writing needs improvement.' },
    { id: 418, grade: 'Khối 04', subject: 'Tiếng Anh', term: 'Cuối kỳ 1', level: 'H', content: 'Understands the lesson but needs to participate more.' },
    { id: 409, grade: 'Khối 04', subject: 'Tiếng Anh', term: 'Cuối kỳ 1', level: 'C', content: 'Needs to focus more during listening activities.' },
    { id: 419, grade: 'Khối 04', subject: 'Tiếng Anh', term: 'Cuối kỳ 1', level: 'C', content: 'Difficulty understanding spoken English at natural speed.' },

    // Khoa học
    { id: 410, grade: 'Khối 04', subject: 'Khoa học', term: 'Cuối kỳ 1', level: 'T', content: 'Hiểu biết rộng về thế giới tự nhiên, tích cực tìm tòi.' },
    { id: 420, grade: 'Khối 04', subject: 'Khoa học', term: 'Cuối kỳ 1', level: 'T', content: 'Tích cực phát biểu, liên hệ thực tế tốt.' },
    { id: 411, grade: 'Khối 04', subject: 'Khoa học', term: 'Cuối kỳ 1', level: 'H', content: 'Nắm được các kiến thức cơ bản trong bài học.' },
    { id: 421, grade: 'Khối 04', subject: 'Khoa học', term: 'Cuối kỳ 1', level: 'H', content: 'Hoàn thành các bài tập trong vở bài tập.' },
    { id: 412, grade: 'Khối 04', subject: 'Khoa học', term: 'Cuối kỳ 1', level: 'C', content: 'Cần tham gia tích cực hơn vào các hoạt động nhóm.' },
    { id: 422, grade: 'Khối 04', subject: 'Khoa học', term: 'Cuối kỳ 1', level: 'C', content: 'Chưa nhớ kỹ các tính chất của nước/không khí.' },

    // KHỐI 5
    // Toán
    { id: 501, grade: 'Khối 05', subject: 'Toán', term: 'Cuối kỳ 1', level: 'T', content: 'Giải quyết tốt các bài toán về tỉ số phần trăm và hình học.' },
    { id: 511, grade: 'Khối 05', subject: 'Toán', term: 'Cuối kỳ 1', level: 'T', content: 'Tính toán chính xác các bài toán về diện tích, thể tích.' },
    { id: 502, grade: 'Khối 05', subject: 'Toán', term: 'Cuối kỳ 1', level: 'H', content: 'Làm tính cộng trừ nhân chia số thập phân khá tốt.' },
    { id: 512, grade: 'Khối 05', subject: 'Toán', term: 'Cuối kỳ 1', level: 'H', content: 'Hiểu bài nhưng còn ẩu khi thực hiện phép tính cộng trừ.' },
    { id: 503, grade: 'Khối 05', subject: 'Toán', term: 'Cuối kỳ 1', level: 'C', content: 'Cần cẩn thận hơn khi đổi đơn vị đo.' },
    { id: 513, grade: 'Khối 05', subject: 'Toán', term: 'Cuối kỳ 1', level: 'C', content: 'Chưa nắm vững cách tính phần trăm.' },

    // Tiếng Anh
    { id: 504, grade: 'Khối 05', subject: 'Tiếng Anh', term: 'Cuối kỳ 1', level: 'T', content: 'Fluent in speaking daily topics. Excellent listening skills.' },
    { id: 514, grade: 'Khối 05', subject: 'Tiếng Anh', term: 'Cuối kỳ 1', level: 'T', content: 'Writes clear and coherent paragraphs.' },
    { id: 505, grade: 'Khối 05', subject: 'Tiếng Anh', term: 'Cuối kỳ 1', level: 'H', content: 'Good vocabulary but needs work on tenses.' },
    { id: 515, grade: 'Khối 05', subject: 'Tiếng Anh', term: 'Cuối kỳ 1', level: 'H', content: 'Good reading skills but writing needs structure.' },
    { id: 506, grade: 'Khối 05', subject: 'Tiếng Anh', term: 'Cuối kỳ 1', level: 'C', content: 'Should practice speaking more often in class.' },
    { id: 516, grade: 'Khối 05', subject: 'Tiếng Anh', term: 'Cuối kỳ 1', level: 'C', content: 'Needs support to complete classroom tasks.' }
  ]);

  useEffect(() => {
    // On mount, check width. If desktop, open sidebar.
    if (window.innerWidth >= 1024) {
      setIsSidebarCollapsed(false);
    }
    setIsMounted(true);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Prevent hydration mismatch or layout shift visualization if needed, 
  // though simple client-side rendering is fine here.
  if (!isMounted) return null; 

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden font-sans">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed} 
        activePage={activePage}
        setActivePage={setActivePage}
      />
      
      <main 
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:ml-0' : 'lg:ml-72'
        }`}
      >
        <TopHeader 
            toggleSidebar={toggleSidebar} 
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
        />
        
        <div className="flex flex-col h-full overflow-hidden p-0 md:p-0"> 
          {/* Note: Removed padding here to let CommentBank take full width/height or handle its own padding if needed. 
              Sub-components can add padding as needed. */}
          
          {activePage === 'class_manager' ? (
            <div className="p-4 md:p-6 flex flex-col h-full overflow-hidden">
              <FilterBar 
                viewFilter={viewFilter} 
                setViewFilter={setViewFilter} 
                term={term}
                setTerm={setTerm}
                selectedClass={selectedClass}
                setSelectedClass={setSelectedClass}
                isLocked={isLocked}
                setIsLocked={setIsLocked}
              />
              <GradeTable 
                viewFilter={viewFilter} 
                term={term} 
                selectedClass={selectedClass} 
                isLocked={isLocked}
              />
            </div>
          ) : activePage === 'periodic_review' ? (
             <div className="p-4 md:p-6 flex flex-col h-full overflow-hidden">
                <PeriodicReviewTable selectedClass={selectedClass} />
             </div>
          ) : activePage === 'subjects' ? (
             <div className="p-4 md:p-6 flex flex-col h-full overflow-hidden">
                <SubjectManagement 
                  comments={globalComments}
                  currentUser={currentUser}
                />
             </div>
          ) : activePage === 'comment_bank' ? (
             <CommentBank 
                currentUser={currentUser} 
                comments={globalComments}
                setComments={setGlobalComments}
             />
          ) : (
             <div className="flex items-center justify-center h-full text-gray-400">
               Tính năng đang phát triển
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;