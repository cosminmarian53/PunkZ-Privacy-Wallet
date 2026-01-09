import React from 'react';
import { useWalletStore } from '../../store/walletStore';
import { Eye, EyeOff } from 'lucide-react';

export const BalanceWidget: React.FC = () => {
  const { balance, hideBalances, toggleHideBalances, isSyncing } = useWalletStore();

  const formatBalance = (bal: number): { integer: string; decimal: string } => {
    const [integer, decimal] = bal.toFixed(9).split('.');
    return { integer, decimal: decimal || '000000000' };
  };

  const { integer, decimal } = formatBalance(balance);

  return (
    <div className="flex flex-col items-center py-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
          <span className="text-white font-bold text-sm">◎</span>
        </div>
        
        {hideBalances ? (
          <div className="flex items-center">
            <span className="text-4xl font-semibold text-white">••••••</span>
          </div>
        ) : (
          <div className="flex items-baseline">
            <span className={`text-4xl font-semibold text-white ${isSyncing ? 'animate-pulse' : ''}`}>
              {integer}
            </span>
            <span className="text-lg font-semibold text-zinc-500">
              .{decimal.slice(0, 4)}
            </span>
          </div>
        )}

        <button
          onClick={toggleHideBalances}
          className="p-2 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-zinc-800"
        >
          {hideBalances ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
      
      <p className="text-zinc-500 text-sm mt-2">
        {hideBalances ? '••••••' : `≈ $${(balance * 150).toFixed(2)} USD`}
      </p>
    </div>
  );
};
