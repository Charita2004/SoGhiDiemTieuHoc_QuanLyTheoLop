
import React, { useState, useRef, useEffect } from 'react';
import { Wand2 } from 'lucide-react';

interface CommentInputProps {
  initialValue?: string;
  placeholder?: string;
}

const SUGGESTIONS = [
  "Ngoan, lễ phép, vâng lời thầy cô.",
  "Có tiến bộ rõ rệt trong học tập.",
  "Cần rèn luyện thêm chữ viết cho sạch đẹp.",
  "Hoàn thành tốt các nội dung học tập và rèn luyện.",
  "Tích cực tham gia phát biểu xây dựng bài.",
  "Cần mạnh dạn hơn trong giao tiếp.",
  "Chăm chỉ, hòa đồng với bạn bè."
];

const CommentInput: React.FC<CommentInputProps> = ({ initialValue = '', placeholder = '' }) => {
  const [value, setValue] = useState(initialValue);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleMagicClick = (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent closing dropdown or losing focus logic
      const randomSuggestion = SUGGESTIONS[Math.floor(Math.random() * SUGGESTIONS.length)];
      setValue(randomSuggestion);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setValue(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full min-w-[200px]" ref={wrapperRef}>
      <div className="relative group">
        <textarea
            className="w-full min-h-[70px] px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y pr-9 shadow-sm transition-all"
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            spellCheck={false}
        />
        <button 
            type="button"
            onClick={handleMagicClick}
            className="absolute bottom-2 right-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all p-1.5 rounded-md"
            title="Gợi ý ngẫu nhiên"
        >
            <Wand2 size={16} />
        </button>
      </div>
      
      {showSuggestions && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto animate-in fade-in zoom-in-95 duration-100 origin-top">
          <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 border-b border-gray-100">
            Gợi ý nhận xét
          </div>
          <ul className="py-1">
             {SUGGESTIONS.map((s, i) => (
                 <li 
                    key={i} 
                    className="px-3 py-2 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer border-b last:border-0 border-gray-50 transition-colors"
                    onClick={() => handleSuggestionClick(s)}
                 >
                    {s}
                 </li>
             ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CommentInput;
