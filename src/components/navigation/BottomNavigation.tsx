import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
    <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 px-2 py-2 safe-area-inset-bottom">
      <div className="max-w-lg mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center p-2 rounded-xl transition-all duration-200 min-w-[60px] ${
                isActive 
                  ? 'bg-violet-500/20 text-violet-400' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
