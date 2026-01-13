import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, Bell, User, ChevronDown, Check } from 'lucide-react';
import { UserConfig } from '../types';
import { MOCK_USERS_DB } from '../constants';

interface TopHeaderProps {
  toggleSidebar: () => void;
  currentUser: UserConfig;
  setCurrentUser: (user: UserConfig) => void;
}

const TopHeader: React.FC<TopHeaderProps> = ({ toggleSidebar, currentUser, setCurrentUser }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUserSwitch = (userId: string) => {
    setCurrentUser(MOCK_USERS_DB[userId]);
    setIsUserMenuOpen(false);
  };

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
          
          {/* User Profile with Switcher */}
          <div className="relative" ref={menuRef}>
            <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200"
            >
                <div className={`w-8 h-8 bg-gradient-to-br ${currentUser.avatarColor} rounded-full flex items-center justify-center shadow-sm`}>
                <User size={16} className="text-white" />
                </div>
                <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm text-gray-800 font-semibold leading-tight max-w-[150px] truncate">{currentUser.name}</span>
                </div>
                <ChevronDown size={14} className="text-gray-500 hidden md:block" />
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Giả lập: Chuyển đổi tài khoản</p>
                        <p className="text-[10px] text-gray-400">Chọn user để test phân quyền dữ liệu</p>
                    </div>
                    <div className="p-2 space-y-1">
                        {Object.values(MOCK_USERS_DB).map((user) => (
                            <button
                                key={user.id}
                                onClick={() => handleUserSwitch(user.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${currentUser.id === user.id ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-gray-50 text-gray-700'}`}
                            >
                                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${user.avatarColor} flex items-center justify-center shrink-0`}>
                                    <span className="text-white font-bold text-xs">{user.name.charAt(0)}</span>
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="font-medium">{user.name}</div>
                                    <div className="text-[10px] text-gray-500">{user.role === 'admin' ? 'Quản trị viên' : user.role === 'subject_teacher' ? 'GV Bộ môn' : 'GV Chủ nhiệm'}</div>
                                </div>
                                {currentUser.id === user.id && <Check size={16} />}
                            </button>
                        ))}
                    </div>
                    <div className="border-t border-gray-100 p-2">
                        <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                            Đăng xuất
                        </button>
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;