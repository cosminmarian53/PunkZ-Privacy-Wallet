import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '../../store/walletStore';
import { BottomNavigation } from '../../components/navigation/BottomNavigation';
import { 
  RefreshCw, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Repeat, 
  QrCode, 
  Wallet,
  Eye,
  EyeOff,
  TrendingUp
} from 'lucide-react';

export const HomeScreen = () => {
  const navigate = useNavigate();
  const { 
    publicKey, 
    balance, 
    refreshBalance, 
    isSyncing,
    hideBalances,
    toggleHideBalances,
    transactions 
  } = useWalletStore();

  useEffect(() => {
    if (publicKey) {
      refreshBalance();
    }
  }, [publicKey, refreshBalance]);

  const formatBalance = (bal: number) => {
    return bal.toFixed(4);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 pb-24">
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 to-cyan-400 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <span 
            className="text-xl font-bold text-fuchsia-400"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            PUNKZ
          </span>
        </div>
        <button
          onClick={() => refreshBalance()}
          disabled={isSyncing}
          className="p-2.5 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-fuchsia-500/50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 text-fuchsia-400 ${isSyncing ? 'animate-spin' : ''}`} />
        </button>
      </header>

      {/* Main Content - Centered */}
      <div className="max-w-lg mx-auto px-6">
        {/* Balance Card */}
        <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-sm font-medium">Total Balance</span>
            <button 
              onClick={toggleHideBalances}
              className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors"
            >
              {hideBalances ? (
                <EyeOff className="w-4 h-4 text-slate-400" />
              ) : (
                <Eye className="w-4 h-4 text-slate-400" />
              )}
            </button>
          </div>
          
          <div className="flex items-baseline gap-2 mb-2">
            {hideBalances ? (
              <span className="text-4xl font-bold text-white">••••••</span>
            ) : (
              <>
                <span className="text-4xl font-bold text-white">{formatBalance(balance)}</span>
                <span className="text-xl text-slate-400">SOL</span>
              </>
            )}
          </div>
          
          {!hideBalances && (
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-400">≈ ${(balance * 150).toFixed(2)} USD</span>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          <button
            onClick={() => navigate('/receive')}
            className="flex flex-col items-center gap-2 p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-cyan-500/50 transition-colors"
          >
            <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center">
              <ArrowDownLeft className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="text-xs font-medium text-slate-300">Receive</span>
          </button>

          <button
            onClick={() => navigate('/send')}
            className="flex flex-col items-center gap-2 p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-fuchsia-500/50 transition-colors"
          >
            <div className="w-10 h-10 bg-fuchsia-500/20 rounded-xl flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-fuchsia-400" />
            </div>
            <span className="text-xs font-medium text-slate-300">Send</span>
          </button>

          <button
            onClick={() => navigate('/swap')}
            className="flex flex-col items-center gap-2 p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-cyan-500/50 transition-colors"
          >
            <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center">
              <Repeat className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="text-xs font-medium text-slate-300">Swap</span>
          </button>

          <button
            onClick={() => navigate('/scan')}
            className="flex flex-col items-center gap-2 p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-fuchsia-500/50 transition-colors"
          >
            <div className="w-10 h-10 bg-fuchsia-500/20 rounded-xl flex items-center justify-center">
              <QrCode className="w-5 h-5 text-fuchsia-400" />
            </div>
            <span className="text-xs font-medium text-slate-300">Scan</span>
          </button>
        </div>

        {/* Transactions */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800">
            <h3 className="font-semibold text-white">Recent Activity</h3>
          </div>
          
          <div className="p-5">
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Wallet className="w-6 h-6 text-slate-500" />
                </div>
                <p className="text-slate-400 font-medium">No transactions yet</p>
                <p className="text-slate-500 text-sm mt-1">Your activity will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.slice(0, 5).map((tx) => (
                  <div 
                    key={tx.id}
                    className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        tx.type === 'receive' ? 'bg-emerald-500/20' : 'bg-rose-500/20'
                      }`}>
                        {tx.type === 'receive' ? (
                          <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 text-rose-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white capitalize">{tx.type}</p>
                        <p className="text-xs text-slate-500">{tx.timestamp}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-medium ${
                      tx.type === 'receive' ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {tx.type === 'receive' ? '+' : '-'}{tx.amount} SOL
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default HomeScreen;
