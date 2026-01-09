import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '../../store/walletStore';
import { TopAppBar } from '../../components/navigation/TopAppBar';
import { BottomNavigation } from '../../components/navigation/BottomNavigation';
import { 
  User, 
  Shield, 
  Bell, 
  Globe, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Wallet,
  Lock
} from 'lucide-react';

const settingsItems: Array<{ icon: React.ElementType; label: string; path: string; highlight?: boolean }> = [
  { icon: User, label: 'Profile', path: '/settings/profile' },
  { icon: Shield, label: 'Security', path: '/settings/security' },
  { icon: Lock, label: 'ZK Privacy', path: '/settings/privacy', highlight: true },
  { icon: Bell, label: 'Notifications', path: '/settings/notifications' },
  { icon: Globe, label: 'Network', path: '/settings/network' },
  { icon: HelpCircle, label: 'Help & Support', path: '/settings/help' },
];

export const SettingsScreen = () => {
  const navigate = useNavigate();
  const { publicKey, deleteWallet } = useWalletStore();

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout? Make sure you have backed up your recovery phrase.')) {
      deleteWallet();
      navigate('/');
    }
  };

  const truncatedAddress = publicKey 
    ? `${publicKey.slice(0, 6)}...${publicKey.slice(-4)}`
    : '';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 pb-24">
      <TopAppBar title="Settings" />

      <div className="max-w-lg mx-auto px-6 py-4">
        {/* Wallet Card */}
        <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-fuchsia-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Wallet className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-lg">My Wallet</p>
              <p className="text-slate-400 text-sm font-mono">{truncatedAddress}</p>
            </div>
          </div>
        </div>

        {/* Settings List */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden mb-6">
          {settingsItems.map((item, index) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors ${
                index !== settingsItems.length - 1 ? 'border-b border-slate-800' : ''
              } ${item.highlight ? 'bg-gradient-to-r from-fuchsia-900/20 to-cyan-900/20' : ''}`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-5 h-5 ${item.highlight ? 'text-cyan-400' : 'text-fuchsia-400'}`} />
                <span className="text-white">{item.label}</span>
                {item.highlight && (
                  <span className="text-xs px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded-full">NEW</span>
                )}
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500" />
            </button>
          ))}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 hover:bg-rose-500/20 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>

        {/* App Info */}
        <div className="mt-8 text-center">
          <p className="text-slate-600 text-sm">Punkz Wallet v1.0.0</p>
          <p className="text-slate-700 text-xs mt-1">Solana Devnet</p>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default SettingsScreen;
