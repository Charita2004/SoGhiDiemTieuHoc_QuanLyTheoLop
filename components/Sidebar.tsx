import React from 'react';
import { X } from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const menuItems = [
    { label: 'Nhập/Xuất điểm hàng loạt', active: false },
    { label: 'Quản lý theo bộ môn', active: false },
    { label: 'Quản lý theo lớp học', active: true },
    { label: 'Ôn luyện lại trong hè', active: false },
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
        <div className="flex flex-col items-center justify-center pt-8 pb-8">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-[#1e2538] shadow-lg mb-2 relative overflow-hidden group">
            <div className="text-center">
               {/* Simulating the logo in the image */}
               <div className="flex flex-col items-center">
                  <div className="text-[#0b1121] font-bold text-xs tracking-widest mt-1">VIET NAM</div>
                  <div className="w-12 h-0.5 bg-[#0b1121] my-1 opacity-50"></div>
                  <div className="text-[#0b1121] text-[8px] uppercase tracking-tighter">Software</div>
               </div>
            </div>
            {/* Glossy effect */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/50 to-transparent pointer-events-none"></div>
          </div>
        </div>
        
        {/* Navigation Menu */}
        <nav className="px-4 space-y-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className={`w-full flex items-center text-left px-5 py-4 rounded-lg transition-all duration-200 text-[15px] font-medium leading-5 ${
                item.active 
                  ? 'bg-[#2d3342] text-white shadow-inner' 
                  : 'text-gray-100 hover:bg-white/5'
              }`}
            >
              <span>{item.label}</span>
            </button>
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