import React, { useState, useRef, useEffect } from 'react';
import { Wand2, Lightbulb } from 'lucide-react';

interface CommentInputProps {
  initialValue?: string;
  placeholder?: string;
  readOnly?: boolean;
  smartSuggestions?: string[]; // New prop for context-aware suggestions
}

// Fallback random suggestions if no smart suggestions are provided
const RANDOM_SUGGESTIONS = [
  "Ngoan, lễ phép, vâng lời thầy cô.",
  "Có tiến bộ rõ rệt trong học tập.",
  "Cần rèn luyện thêm chữ viết cho sạch đẹp.",
  "Hoàn thành tốt các nội dung học tập và rèn luyện.",
  "Tích cực tham gia phát biểu xây dựng bài.",
  "Cần mạnh dạn hơn trong giao tiếp.",
  "Chăm chỉ, hòa đồng với bạn bè."
];

const CommentInput: React.FC<CommentInputProps> = ({ 
  initialValue = '', 
  placeholder = '', 
  readOnly = false,
  smartSuggestions = [] 
}) => {
  const [value, setValue] = useState(initialValue);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const hasSmartSuggestions = smartSuggestions.length > 0;
  const displaySuggestions = hasSmartSuggestions ? smartSuggestions : RANDOM_SUGGESTIONS;

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
      if (readOnly) return;
      e.stopPropagation(); // Prevent closing dropdown or losing focus logic
      const randomSuggestion = displaySuggestions[Math.floor(Math.random() * displaySuggestions.length)];
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
            className={`w-full min-h-[70px] px-3 py-2 text-sm border rounded-lg resize-y pr-9 shadow-sm transition-all
              ${readOnly 
                ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed' 
                : 'bg-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              }`}
            placeholder={readOnly ? '' : placeholder}
            value={value}
            onChange={(e) => !readOnly && setValue(e.target.value)}
            onFocus={() => !readOnly && setShowSuggestions(true)}
            spellCheck={false}
            disabled={readOnly}
        />
        {!readOnly && (
          <button 
              type="button"
              onClick={handleMagicClick}
              className={`absolute bottom-2 right-2 transition-all p-1.5 rounded-md ${hasSmartSuggestions ? 'text-amber-500 hover:text-amber-600 hover:bg-amber-50' : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
              title={hasSmartSuggestions ? "Gợi ý thông minh (Random)" : "Gợi ý ngẫu nhiên"}
          >
              {hasSmartSuggestions ? <Lightbulb size={16} /> : <Wand2 size={16} />}
          </button>
        )}
      </div>
      
      {showSuggestions && !readOnly && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto animate-in fade-in zoom-in-95 duration-100 origin-top">
          <div className={`px-3 py-2 text-[10px] font-bold uppercase tracking-wider border-b border-gray-100 flex items-center gap-2 ${hasSmartSuggestions ? 'bg-amber-50 text-amber-600' : 'bg-gray-50 text-gray-400'}`}>
            {hasSmartSuggestions ? <Lightbulb size={12} /> : <Wand2 size={12} />}
            {hasSmartSuggestions ? 'Gợi ý phù hợp (Theo mức độ)' : 'Gợi ý ngẫu nhiên'}
          </div>
          <ul className="py-1">
             {displaySuggestions.map((s, i) => (
                 <li 
                    key={i} 
                    className="px-3 py-2 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer border-b last:border-0 border-gray-50 transition-colors"
                    onClick={() => handleSuggestionClick(s)}
                 >
                    {s}
                 </li>
             ))}
             {hasSmartSuggestions && displaySuggestions.length === 0 && (
                <li className="px-3 py-2 text-xs text-gray-400 italic text-center">
                    Không tìm thấy câu nhận xét phù hợp với mức độ này.
                </li>
             )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CommentInput;