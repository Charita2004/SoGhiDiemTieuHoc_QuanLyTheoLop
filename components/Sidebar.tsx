import React from 'react';
import { X, CalendarRange, CalendarDays } from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  activePage: string;
  setActivePage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed, activePage, setActivePage }) => {
  const menuGroups = [
    {
      title: 'ĐỊNH KÌ',
      icon: <CalendarRange size={20} />,
      items: [
        { id: 'bulk', label: 'Nhập/Xuất điểm hàng loạt' },
        { id: 'subjects', label: 'Quản lý theo bộ môn' },
        { id: 'class_manager', label: 'Quản lý theo lớp học' },
        { id: 'summer', label: 'Ôn luyện lại trong hè' },
      ]
    },
    {
      title: 'HÀNG THÁNG',
      icon: <CalendarDays size={20} />,
      items: [
        { id: 'periodic_review', label: 'Nhập nhận xét định kì' },
      ]
    }
  ];

  return (
    <>
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0b1121] text-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isCollapsed ? '-translate-x-full' : 'translate-x-0'}`}
      >
        {/* Mobile Close Button */}
        <button 
          onClick={() => setIsCollapsed(true)} 
          className="lg:hidden absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* Logo Section */}
        <div className="flex flex-col items-center justify-center pt-8 pb-6">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-4 border-[#1e2538] shadow-lg mb-2 relative overflow-hidden group">
            <div className="text-center">
               <div className="flex flex-col items-center">
                  <div className="text-[#0b1121] font-bold text-[10px] tracking-widest mt-1">VIET NAM</div>
                  <div className="w-10 h-0.5 bg-[#0b1121] my-0.5 opacity-50"></div>
                  <div className="text-[#0b1121] text-[6px] uppercase tracking-tighter">Software</div>
               </div>
            </div>
            {/* Glossy effect */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/50 to-transparent pointer-events-none"></div>
          </div>
        </div>
        
        {/* Navigation Menu */}
        <nav className="px-3 space-y-6 overflow-y-auto max-h-[calc(100vh-160px)] custom-scrollbar">
          {menuGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              {/* Group Title - Bold, White, Bigger */}
              <div className="px-4 mb-3 flex items-center gap-3 text-base font-bold text-white uppercase tracking-wide">
                 <span className="text-blue-400">{group.icon}</span>
                 <span>{group.title}</span>
              </div>
              {/* Group Items - Indented further */}
              <div className="space-y-1">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    className={`w-full flex items-center text-left pl-14 pr-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium leading-5 ${
                      activePage === item.id 
                        ? 'bg-white/10 text-white font-semibold shadow-inner' 
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  );
};

export default Sidebar;