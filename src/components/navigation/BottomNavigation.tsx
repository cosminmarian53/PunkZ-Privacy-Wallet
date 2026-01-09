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
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-lg border-t border-fuchsia-500/20 px-4 py-3 z-50">
      <div className="max-w-lg mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          if (item.isMain) {
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center -mt-8 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-fuchsia-500/40 group-hover:shadow-fuchsia-500/60 transition-all neon-btn">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-xs font-semibold text-fuchsia-400 mt-1.5 neon-text-pink" style={{ textShadow: '0 0 5px #ff00ff' }}>
                  {item.label}
                </span>
              </button>
            );
          }
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center p-2 rounded-xl transition-all ${
                isActive 
                  ? 'text-fuchsia-400' 
                  : 'text-slate-500 hover:text-fuchsia-400'
              }`}
            >
              <div className={`p-2 rounded-xl transition-all ${
                isActive ? 'bg-fuchsia-500/20' : 'hover:bg-slate-800'
              }`}>
                <Icon className={`w-5 h-5 ${isActive ? 'drop-shadow-[0_0_8px_#ff00ff]' : ''}`} />
              </div>
              <span className={`text-xs mt-1 font-medium ${isActive ? 'neon-text-pink' : ''}`} style={isActive ? { textShadow: '0 0 5px #ff00ff' } : {}}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
