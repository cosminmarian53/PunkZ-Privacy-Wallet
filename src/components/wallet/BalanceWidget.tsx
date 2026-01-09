import React from 'react';
import { useWalletStore } from '../../store/walletStore';
import { RefreshCw, Eye, EyeOff } from 'lucide-react';

interface BalanceWidgetProps {
  showRefresh?: boolean;
}

export const BalanceWidget: React.FC<BalanceWidgetProps> = ({ showRefresh = true }) => {
  const { balance, isSyncing, refreshBalance } = useWalletStore();
  const [hidden, setHidden] = React.useState(false);

  const displayBalance = hidden ? '••••' : (balance?.toFixed(4) ?? '0.0000');

  return (
    <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl">
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-400 text-sm">Total Balance</span>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setHidden(!hidden)}
            className="p-1 text-slate-400 hover:text-white transition-colors"
          >
            {hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          {showRefresh && (
            <button 
              onClick={refreshBalance}
              disabled={isSyncing}
              className="p-1 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>
      
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold text-white">{displayBalance}</span>
        <span className="text-xl text-slate-400">SOL</span>
      </div>
    </div>
  );
};

export default BalanceWidget;
