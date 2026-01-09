import { useWalletStore } from '../../store/walletStore';
import { TopAppBar } from '../../components/navigation/TopAppBar';
import { BottomNavigation } from '../../components/navigation/BottomNavigation';
import { ArrowUpRight, ArrowDownLeft, Inbox } from 'lucide-react';

export const HistoryScreen = () => {
  const { transactions, isSyncing } = useWalletStore();

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
              <div 
                key={tx.id}
                className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-xl"
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
                    <p className="text-slate-500 text-sm">{tx.timestamp}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${
                    tx.type === 'receive' ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {tx.type === 'receive' ? '+' : '-'}{tx.amount} SOL
                  </p>
                  <p className="text-slate-500 text-sm">{tx.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default HistoryScreen;
