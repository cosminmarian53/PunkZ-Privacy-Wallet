import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Send, ArrowDownToLine, Settings, History } from 'lucide-react';

const navItems = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/receive', icon: ArrowDownToLine, label: 'Receive' },
  { path: '/send', icon: Send, label: 'Send' },
  { path: '/history', icon: History, label: 'Activity' },
  { path: '/settings', icon: Settings, label: 'More' },
];

export const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 px-4 py-3 safe-area-inset-bottom"
      style={{
        background: 'linear-gradient(180deg, rgba(10, 0, 20, 0.95) 0%, rgba(10, 0, 20, 0.98) 100%)',
        borderTop: '1px solid rgba(255, 0, 255, 0.2)',
        boxShadow: '0 -10px 40px rgba(255, 0, 255, 0.1)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center p-3 rounded-xl transition-all duration-200 min-w-[70px] relative"
              style={{
                background: isActive 
                  ? 'linear-gradient(135deg, rgba(255, 0, 255, 0.2) 0%, rgba(0, 240, 255, 0.1) 100%)'
                  : 'transparent',
                border: isActive ? '1px solid rgba(255, 0, 255, 0.3)' : '1px solid transparent',
                color: isActive ? '#ff00ff' : 'rgba(255, 255, 255, 0.5)',
              }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 0 15px rgba(255, 0, 255, 0.3)',
              }}
              whileTap={{ scale: 0.95 }}
            >
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    boxShadow: '0 0 20px rgba(255, 0, 255, 0.3)',
                  }}
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(255, 0, 255, 0.3)',
                      '0 0 30px rgba(255, 0, 255, 0.5)',
                      '0 0 20px rgba(255, 0, 255, 0.3)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              <Icon 
                className="w-5 h-5 relative z-10" 
                style={{
                  filter: isActive ? 'drop-shadow(0 0 8px #ff00ff)' : 'none',
                }}
              />
              <span 
                className="text-xs mt-1.5 font-mono relative z-10"
                style={{
                  textShadow: isActive ? '0 0 10px #ff00ff' : 'none',
                }}
              >
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};
