import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Shield, Key, History, Settings, ChevronRight, Wallet } from 'lucide-react';
import { useWalletStore } from '../../store/walletStore';
import { BottomNavigation } from '../../components/navigation/BottomNavigation';

export const UserProfileScreen = () => {
  const navigate = useNavigate();
  const { publicKey, balance, network, deleteWallet } = useWalletStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Helper to format public key
  const formatAddress = (address: string | null) => {
    if (!address) return 'Not Connected';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await deleteWallet();
    navigate('/onboarding');
  };

  return (
    <div className="flex flex-col h-full bg-[#050510] relative overflow-hidden pb-24 font-['Rajdhani']">
      {/* Background Effects */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="px-6 pt-12 pb-6 flex items-center justify-between relative z-10 border-b border-fuchsia-500/20 bg-black/40 backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-cyan-400 font-['Orbitron']">
            PROFILE
          </h1>
          <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse glow-green" />
            Connected to {network === 'mainnet-beta' ? 'Mainnet' : 'Devnet'}
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-400 p-[2px] neon-box-pink">
          <div className="w-full h-full bg-[#0a0a0f] rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-fuchsia-400" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide relative z-10">
        <div className="space-y-6">
          
          {/* Main Info Card */}
          <div className="bg-[#0a0a0f]/80 rounded-2xl p-6 border border-fuchsia-500/20 neon-card backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/5 blur-[50px]" />
            <h2 className="text-xl font-semibold text-white mb-2">Anonymous Punk</h2>
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
              <Wallet className="w-4 h-4 text-fuchsia-400" />
              <span className="font-mono tracking-wider">{formatAddress(publicKey)}</span>
            </div>
            <div className="flex gap-3 mt-4">
              <div className="flex-1 bg-black/40 rounded-xl p-3 border border-fuchsia-500/10">
                <p className="text-xs text-slate-500 mb-1">Status</p>
                <p className="text-sm font-medium text-green-400 flex items-center gap-1">
                  <Shield className="w-4 h-4" /> Secured
                </p>
              </div>
              <div className="flex-1 bg-black/40 rounded-xl p-3 border border-fuchsia-500/10">
                <p className="text-xs text-slate-500 mb-1">Balance</p>
                <p className="text-sm font-medium text-white tracking-wide">{balance.toFixed(2)} SOL</p>
              </div>
            </div>
          </div>

          {/* Settings List */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-fuchsia-400 mb-3 px-2 uppercase tracking-wider">Account Settings</h3>
            
            <button 
              onClick={() => navigate('/settings/security')}
              className="w-full bg-[#0a0a0f]/60 hover:bg-[#151520] p-4 rounded-xl flex items-center justify-between border border-transparent hover:border-fuchsia-500/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                  <Key className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-white font-medium">Security & Keys</p>
                  <p className="text-xs text-slate-400">Manage recovery phrase</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-fuchsia-400 group-hover:translate-x-1 transition-all" />
            </button>

            <button 
              onClick={() => navigate('/history')}
              className="w-full bg-[#0a0a0f]/60 hover:bg-[#151520] p-4 rounded-xl flex items-center justify-between border border-transparent hover:border-fuchsia-500/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-400 group-hover:scale-110 transition-transform">
                  <History className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-white font-medium">Activity Log</p>
                  <p className="text-xs text-slate-400">View recent transactions</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-fuchsia-400 group-hover:translate-x-1 transition-all" />
            </button>

            <button 
              onClick={() => navigate('/settings')}
              className="w-full bg-[#0a0a0f]/60 hover:bg-[#151520] p-4 rounded-xl flex items-center justify-between border border-transparent hover:border-fuchsia-500/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <Settings className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-white font-medium">Preferences</p>
                  <p className="text-xs text-slate-400">Currency, app theme, node RPCs</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-fuchsia-400 group-hover:translate-x-1 transition-all" />
            </button>
          </div>

          <div className="pt-4 pb-20">
             <button 
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full py-4 rounded-xl border border-red-500/30 text-red-400 font-medium hover:bg-red-500/10 transition-colors shadow-[0_0_15px_rgba(239,68,68,0.1)] disabled:opacity-50"
             >
                {isLoggingOut ? 'Logging Out...' : 'Log Out & Disconnect'}
             </button>
          </div>

        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};
