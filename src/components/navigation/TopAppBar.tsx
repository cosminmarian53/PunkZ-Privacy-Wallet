import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TopAppBarProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  transparent?: boolean;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  title,
  showBack = false,
  onBack,
  rightAction,
  transparent = false,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className={`sticky top-0 z-40 px-4 py-3 ${transparent ? '' : 'bg-[#0F0F0F]/90 backdrop-blur-lg border-b border-zinc-800/50'}`}>
      <div className="max-w-lg mx-auto flex items-center justify-between">
        <div className="w-10">
          {showBack && (
            <button
              onClick={handleBack}
              className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-zinc-800"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
        </div>
        
        {title && (
          <h1 className="text-lg font-semibold text-white">{title}</h1>
        )}
        
        <div className="w-10 flex justify-end">
          {rightAction}
        </div>
      </div>
    </header>
  );
};
