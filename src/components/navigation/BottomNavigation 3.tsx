import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Send, ArrowDownToLine, Settings, History } from 'lucide-react';

const navItems = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/receive', icon: ArrowDownToLine, label: 'Receive' },
  { path: '/send', icon: Send, label: 'Send', isMain: true },
  { path: '/history', icon: History, label: 'Activity' },
  { path: '/settings', icon: Settings, label: 'More' },
];

export const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 px-4 py-3">
      <div className="max-w-lg mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          if (item.isMain) {
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center -mt-6"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-fuchsia-500/25">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-medium text-fuchsia-400 mt-1">{item.label}</span>
              </button>
            );
          }
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center p-2 rounded-xl transition-colors ${
                isActive 
                  ? 'text-fuchsia-400' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
