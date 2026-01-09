import { useEffect, useState } from 'react';
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
  TrendingUp,
  Copy,
  Check
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

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (publicKey) {
      refreshBalance();
    }
  }, [publicKey, refreshBalance]);

  const formatBalance = (bal: number) => {
    return bal.toFixed(4);
  };

  const truncatedAddress = publicKey 
    ? `${publicKey.slice(0, 6)}...${publicKey.slice(-4)}`
    : '';

  const handleCopyAddress = async () => {
    if (publicKey) {
      await navigator.clipboard.writeText(publicKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen animated-bg relative pb-24">
      {/* Grid Background */}
      <div className="fixed inset-0 grid-bg pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-fuchsia-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-fuchsia-500/25">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <span 
              className="text-xl font-bold text-fuchsia-400 neon-text-pink"
              style={{ fontFamily: 'Monoton, cursive' }}
            >
              PUNKZ
            </span>
          </div>
        </div>
        <button
          onClick={() => refreshBalance()}
          disabled={isSyncing}
          className="p-2.5 bg-slate-900/50 border border-fuchsia-500/30 rounded-xl hover:border-fuchsia-500 hover:neon-box-pink transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 text-fuchsia-400 ${isSyncing ? 'animate-spin' : ''}`} />
        </button>
      </header>

      {/* Main Content - Centered */}
      <div className="max-w-lg mx-auto px-6 relative z-10">
        {/* Balance Card */}
        <div className="p-6 bg-slate-900/70 border border-fuchsia-500/20 rounded-2xl mb-6 neon-card relative overflow-hidden">
          {/* Glow Effect */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-fuchsia-500/20 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="relative z-10">
            {/* Address */}
            <button 
              onClick={handleCopyAddress}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 border border-slate-700 rounded-lg mb-4 hover:border-fuchsia-500/50 transition-colors group"
            >
              <span className="text-sm font-mono text-slate-400 group-hover:text-fuchsia-400 transition-colors">
                {truncatedAddress}
              </span>
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-500 group-hover:text-fuchsia-400 transition-colors" />
              )}
            </button>

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
                <span className="text-5xl font-bold text-white">••••••</span>
              ) : (
                <>
                  <span 
                    className="text-5xl font-bold gradient-text"
                    style={{ fontFamily: 'Orbitron, sans-serif' }}
                  >
                    {formatBalance(balance)}
                  </span>
                  <span className="text-xl text-cyan-400 neon-text-cyan" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                    SOL
                  </span>
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
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          <button
            onClick={() => navigate('/receive')}
            className="flex flex-col items-center gap-2 p-4 bg-slate-900/50 border border-slate-800 rounded-xl neon-card group"
          >
            <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center group-hover:neon-box-cyan transition-all">
              <ArrowDownLeft className="w-6 h-6 text-cyan-400" />
            </div>
            <span className="text-xs font-medium text-slate-300 group-hover:text-cyan-400 transition-colors">Receive</span>
          </button>

          <button
            onClick={() => navigate('/send')}
            className="flex flex-col items-center gap-2 p-4 bg-slate-900/50 border border-slate-800 rounded-xl neon-card group"
          >
            <div className="w-12 h-12 bg-fuchsia-500/20 rounded-xl flex items-center justify-center group-hover:neon-box-pink transition-all">
              <ArrowUpRight className="w-6 h-6 text-fuchsia-400" />
            </div>
            <span className="text-xs font-medium text-slate-300 group-hover:text-fuchsia-400 transition-colors">Send</span>
          </button>

          <button
            onClick={() => navigate('/swap')}
            className="flex flex-col items-center gap-2 p-4 bg-slate-900/50 border border-slate-800 rounded-xl neon-card group"
          >
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-purple-500/30 transition-all">
              <Repeat className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-xs font-medium text-slate-300 group-hover:text-purple-400 transition-colors">Swap</span>
          </button>

          <button
            onClick={() => navigate('/scan')}
            className="flex flex-col items-center gap-2 p-4 bg-slate-900/50 border border-slate-800 rounded-xl neon-card group"
          >
            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-amber-500/30 transition-all">
              <QrCode className="w-6 h-6 text-amber-400" />
            </div>
            <span className="text-xs font-medium text-slate-300 group-hover:text-amber-400 transition-colors">Scan</span>
          </button>
        </div>

        {/* Transactions */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
            <h3 
              className="font-semibold text-white"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              Recent Activity
            </h3>
            {transactions.length > 0 && (
              <button 
                onClick={() => navigate('/history')}
                className="text-xs text-fuchsia-400 hover:text-fuchsia-300 transition-colors"
              >
                View All
              </button>
            )}
          </div>
          
          <div className="p-5">
            {transactions.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4 pulse-glow" style={{ animationDuration: '3s' }}>
                  <Wallet className="w-7 h-7 text-fuchsia-400" />
                </div>
                <p className="text-white font-medium mb-1">No transactions yet</p>
                <p className="text-slate-500 text-sm">Your activity will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.slice(0, 5).map((tx) => (
                  <div 
                    key={tx.id}
                    className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        tx.type === 'receive' ? 'bg-emerald-500/20' : 'bg-rose-500/20'
                      }`}>
                        {tx.type === 'receive' ? (
                          <ArrowDownLeft className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-rose-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white capitalize">{tx.type}</p>
                        <p className="text-xs text-slate-500">{tx.timestamp}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-bold ${
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
