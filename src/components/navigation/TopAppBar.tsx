import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TopAppBarProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  title,
  showBack = false,
  onBack,
  rightAction,
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
    <header className="sticky top-0 z-40 px-4 py-4 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/50">
      <div className="max-w-lg mx-auto flex items-center justify-between">
        <div className="w-12">
          {showBack && (
            <button
              onClick={handleBack}
              className="p-2 -ml-2 rounded-lg text-fuchsia-400 hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
        </div>
        
        {title && (
          <h1 className="text-xl font-semibold text-white">
            {title}
          </h1>
        )}
        
        <div className="w-12 flex justify-end">
          {rightAction}
        </div>
      </div>
    </header>
  );
};

export default TopAppBar;
