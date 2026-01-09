import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Send, ArrowDownToLine, Settings, History } from 'lucide-react';

const navItems = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/receive', icon: ArrowDownToLine, label: 'Receive' },
  { path: '/send', icon: Send, label: 'Send', isMain: true },
  { path: '/history', icon: History, label: 'Activity' },
  { path: '/settings', icon: Settings, label: 'More' },
];

export const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 px-6 py-4 safe-area-inset-bottom"
      style={{
        background: 'linear-gradient(180deg, rgba(10, 0, 20, 0.95) 0%, rgba(10, 0, 20, 0.98) 100%)',
        borderTop: '2px solid rgba(255, 0, 255, 0.25)',
        boxShadow: '0 -15px 50px rgba(255, 0, 255, 0.15)',
        backdropFilter: 'blur(25px)',
      }}
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
    >
      <div className="max-w-lg mx-auto flex items-center justify-around">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          const isMainButton = item.isMain;
          
          if (isMainButton) {
            return (
              <motion.button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center relative -mt-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <motion.div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-1"
                  style={{
                    background: 'linear-gradient(135deg, #ff00ff 0%, #00f0ff 100%)',
                    boxShadow: isActive 
                      ? '0 0 40px rgba(255, 0, 255, 0.8), 0 0 60px rgba(0, 240, 255, 0.4)'
                      : '0 0 25px rgba(255, 0, 255, 0.5)',
                  }}
                  whileHover={{ 
                    scale: 1.15,
                    boxShadow: '0 0 50px rgba(255, 0, 255, 0.9), 0 0 70px rgba(0, 240, 255, 0.5)',
                    rotate: [0, -5, 5, 0],
                  }}
                  whileTap={{ scale: 0.9 }}
                  animate={isActive ? {
                    boxShadow: [
                      '0 0 40px rgba(255, 0, 255, 0.8), 0 0 60px rgba(0, 240, 255, 0.4)',
                      '0 0 50px rgba(255, 0, 255, 1), 0 0 80px rgba(0, 240, 255, 0.6)',
                      '0 0 40px rgba(255, 0, 255, 0.8), 0 0 60px rgba(0, 240, 255, 0.4)',
                    ],
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Icon className="w-7 h-7 text-white" style={{ filter: 'drop-shadow(0 0 5px white)' }} />
                </motion.div>
                <span 
                  className="text-xs font-mono font-bold"
                  style={{
                    color: '#ff00ff',
                    textShadow: '0 0 10px #ff00ff',
                  }}
                >
                  {item.label}
                </span>
              </motion.button>
            );
          }
          
          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center p-3 rounded-2xl transition-all duration-200 min-w-[72px] relative"
              style={{
                background: isActive 
                  ? 'linear-gradient(135deg, rgba(255, 0, 255, 0.2) 0%, rgba(0, 240, 255, 0.1) 100%)'
                  : 'transparent',
                border: isActive ? '1px solid rgba(255, 0, 255, 0.4)' : '1px solid transparent',
                color: isActive ? '#ff00ff' : 'rgba(255, 255, 255, 0.5)',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ 
                scale: 1.08,
                boxShadow: '0 0 20px rgba(255, 0, 255, 0.4)',
                color: '#ff00ff',
              }}
              whileTap={{ scale: 0.92 }}
            >
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    boxShadow: '0 0 25px rgba(255, 0, 255, 0.4)',
                  }}
                  animate={{
                    boxShadow: [
                      '0 0 25px rgba(255, 0, 255, 0.4)',
                      '0 0 35px rgba(255, 0, 255, 0.6)',
                      '0 0 25px rgba(255, 0, 255, 0.4)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              <Icon 
                className="w-6 h-6 relative z-10" 
                style={{
                  filter: isActive ? 'drop-shadow(0 0 10px #ff00ff)' : 'none',
                }}
              />
              <span 
                className="text-xs mt-2 font-mono font-medium relative z-10"
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
    </motion.nav>
  );
};
