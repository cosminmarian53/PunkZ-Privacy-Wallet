import { useState } from 'react';
import { useWalletStore, type TransactionRecord } from '../../store/walletStore';
import { TopAppBar } from '../../components/navigation/TopAppBar';
import { BottomNavigation } from '../../components/navigation/BottomNavigation';
import { ArrowUpRight, ArrowDownLeft, Inbox, X, ExternalLink, Copy, CheckCircle2 } from 'lucide-react';

const TransactionDetailModal = ({ 
  tx, 
  onClose, 
  network 
}: { 
  tx: TransactionRecord; 
  onClose: () => void;
  network: string;
}) => {
  const [copied, setCopied] = useState<string | null>(null);
  
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };
  
  const getExplorerUrl = () => {
    const base = 'https://explorer.solana.com/tx/';
    const cluster = network === 'mainnet-beta' ? '' : `?cluster=${network}`;
    return `${base}${tx.signature}${cluster}`;
  };
  
  const truncateAddress = (addr: string) => {
    if (addr.length <= 16) return addr;
    return `${addr.slice(0, 8)}...${addr.slice(-8)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
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
              <p className="text-white font-semibold capitalize">{tx.type}</p>
              <p className={`text-sm font-medium ${
                tx.type === 'receive' ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {tx.type === 'receive' ? '+' : '-'}{tx.amount.toFixed(6)} SOL
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
            <span className="text-slate-400 text-sm">Status</span>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                tx.status === 'confirmed' ? 'bg-emerald-400' : 
                tx.status === 'pending' ? 'bg-amber-400' : 'bg-rose-400'
              }`} />
              <span className="text-white capitalize">{tx.status}</span>
            </div>
          </div>
          
          {/* Date */}
          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
            <span className="text-slate-400 text-sm">Date</span>
            <span className="text-white text-sm">{formatDate(tx.timestamp)}</span>
          </div>
          
          {/* Amount */}
          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
            <span className="text-slate-400 text-sm">Amount</span>
            <span className="text-white font-mono">{tx.amount.toFixed(9)} SOL</span>
          </div>
          
          {/* Counterparty Address */}
          <div className="p-3 bg-slate-800/50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">
                {tx.type === 'receive' ? 'From' : 'To'}
              </span>
              <button
                onClick={() => copyToClipboard(tx.address, 'address')}
                className="flex items-center gap-1 text-cyan-400 text-xs hover:text-cyan-300"
              >
                {copied === 'address' ? (
                  <>
                    <CheckCircle2 className="w-3 h-3" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <p className="text-white font-mono text-sm break-all">{tx.address}</p>
          </div>
          
          {/* Signature */}
          {tx.signature && (
            <div className="p-3 bg-slate-800/50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">Signature</span>
                <button
                  onClick={() => copyToClipboard(tx.signature!, 'signature')}
                  className="flex items-center gap-1 text-cyan-400 text-xs hover:text-cyan-300"
                >
                  {copied === 'signature' ? (
                    <>
                      <CheckCircle2 className="w-3 h-3" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <p className="text-white font-mono text-xs break-all">{tx.signature}</p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-slate-800">
          <a
            href={getExplorerUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 bg-fuchsia-500/20 border border-fuchsia-500/50 rounded-xl text-fuchsia-400 hover:bg-fuchsia-500/30 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View on Solana Explorer
          </a>
        </div>
      </div>
    </div>
  );
};

export const HistoryScreen = () => {
  const { transactions, isSyncing, network } = useWalletStore();
  const [selectedTx, setSelectedTx] = useState<TransactionRecord | null>(null);
  
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // Less than 24 hours - show relative time
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      if (hours < 1) {
        const minutes = Math.floor(diff / 60000);
        return minutes < 1 ? 'Just now' : `${minutes}m ago`;
      }
      return `${hours}h ago`;
    }
    
    // Less than 7 days - show day name
    if (diff < 604800000) {
      return date.toLocaleDateString('en-US', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    }
    
    // Older - show date
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 pb-24">
      <TopAppBar title="Activity" />

      <div className="max-w-lg mx-auto px-6 py-4">
        {isSyncing && transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-2 border-fuchsia-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-slate-400">Loading transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
              <Inbox className="w-8 h-8 text-slate-500" />
            </div>
            <p className="text-white font-medium mb-1">No transactions yet</p>
            <p className="text-slate-500 text-sm">Your transaction history will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <button 
                key={tx.id}
                onClick={() => setSelectedTx(tx)}
                className="w-full flex items-center justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:bg-slate-800/50 hover:border-slate-700 transition-all cursor-pointer text-left"
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
                    <p className="text-white font-medium capitalize">{tx.type}</p>
                    <p className="text-slate-500 text-sm">{formatTimestamp(tx.timestamp)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${
                    tx.type === 'receive' ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {tx.type === 'receive' ? '+' : '-'}{tx.amount.toFixed(4)} SOL
                  </p>
                  <p className="text-slate-500 text-sm capitalize">{tx.status}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Transaction Detail Modal */}
      {selectedTx && (
        <TransactionDetailModal 
          tx={selectedTx} 
          onClose={() => setSelectedTx(null)}
          network={network}
        />
      )}

      <BottomNavigation />
    </div>
  );
};

export default HistoryScreen;
