import React from 'react';
import { motion } from 'framer-motion';
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
    <header 
      className="sticky top-0 z-40 px-4 py-4"
      style={{
        background: transparent ? 'transparent' : 'linear-gradient(180deg, rgba(10, 0, 20, 0.95) 0%, rgba(10, 0, 20, 0.8) 100%)',
        backdropFilter: transparent ? 'none' : 'blur(20px)',
        borderBottom: transparent ? 'none' : '1px solid rgba(255, 0, 255, 0.1)',
      }}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="w-12">
          {showBack && (
            <motion.button
              onClick={handleBack}
              className="p-2 -ml-2 rounded-lg transition-colors"
              style={{ color: '#ff00ff' }}
              whileHover={{ 
                scale: 1.1,
                filter: 'drop-shadow(0 0 8px #ff00ff)',
              }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
          )}
        </div>
        
        {title && (
          <h1 
            className="text-xl font-mono font-bold"
            style={{ 
              color: '#ff00ff',
              textShadow: '0 0 15px rgba(255, 0, 255, 0.5)',
            }}
          >
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
