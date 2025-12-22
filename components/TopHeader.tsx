import React from 'react';
import { Menu, Search, Bell, User } from 'lucide-react';

interface TopHeaderProps {
  toggleSidebar: () => void;
}

const TopHeader: React.FC<TopHeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-3 shadow-sm sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2 text-gray-700">
            <span className="font-semibold text-lg hidden sm:block">Sổ ghi điểm</span>
            <span className="font-semibold text-lg sm:hidden">Sổ điểm</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Search size={20} className="text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg relative transition-colors">
            <div className="w-2 h-2 bg-red-500 rounded-full absolute top-2 right-2 animate-pulse"></div>
            <Bell size={20} className="text-gray-600" />
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all hidden sm:block">
            ← Quay lại trang chủ
          </button>
          <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <span className="text-sm text-gray-700 font-medium hidden md:block">Administrator</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;