import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '../../store/walletStore';
import { BalanceWidget } from '../../components/wallet/BalanceWidget';
import { TransactionList } from '../../components/wallet/TransactionList';
import { BottomNavigation } from '../../components/navigation/BottomNavigation';
import { Button } from '../../components/ui/Button';
import { RefreshCw, ArrowUpRight, ArrowDownLeft, Repeat, QrCode } from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { publicKey, refreshBalance, isSyncing } = useWalletStore();

  useEffect(() => {
    if (publicKey) {
      refreshBalance();
    }
  }, [publicKey, refreshBalance]);

  const handleRefresh = () => {
    refreshBalance();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-zinc-900 via-zinc-950 to-black pb-20">
      {/* Header */}
      <header className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="font-semibold text-white">Punkz</span>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isSyncing}
          className="p-2 text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-zinc-800 disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
        </button>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col px-4">
        {/* Balance */}
        <div className="py-6">
          <BalanceWidget />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          <QuickActionButton
            icon={<ArrowDownLeft className="w-5 h-5" />}
            label="Receive"
            onClick={() => navigate('/receive')}
          />
          <QuickActionButton
            icon={<ArrowUpRight className="w-5 h-5" />}
            label="Send"
            onClick={() => navigate('/send')}
          />
          <QuickActionButton
            icon={<Repeat className="w-5 h-5" />}
            label="Swap"
            onClick={() => navigate('/swap')}
          />
          <QuickActionButton
            icon={<QrCode className="w-5 h-5" />}
            label="Scan"
            onClick={() => navigate('/scan')}
          />
        </div>

        {/* Sync status message */}
        {isSyncing && (
          <div className="mb-4 p-3 bg-violet-500/10 border border-violet-500/30 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-violet-300">Syncing wallet...</span>
            </div>
          </div>
        )}

        {/* Transactions */}
        <div className="flex-1 bg-zinc-900/50 rounded-t-3xl -mx-4 px-4 pt-6">
          <TransactionList />
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

interface QuickActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-2 p-3 bg-zinc-900 rounded-xl hover:bg-zinc-800 transition-colors"
  >
    <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400">
      {icon}
    </div>
    <span className="text-xs text-zinc-400 font-medium">{label}</span>
  </button>
);
