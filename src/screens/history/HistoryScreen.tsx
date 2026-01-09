import React from 'react';
import { useWalletStore } from '../../store/walletStore';
import { TopAppBar } from '../../components/navigation/TopAppBar';
import { BottomNavigation } from '../../components/navigation/BottomNavigation';
import { TransactionItem } from '../../components/wallet/TransactionItem';
import { Inbox, Filter } from 'lucide-react';

export const HistoryScreen: React.FC = () => {
  const { transactions, isSyncing } = useWalletStore();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-zinc-900 via-zinc-950 to-black pb-20">
      <TopAppBar 
        title="Activity" 
        rightAction={
          <button className="p-2 text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-zinc-800">
            <Filter className="w-5 h-5" />
          </button>
        }
      />

      <div className="flex-1 px-4 py-4">
        {isSyncing && transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-zinc-500">Loading transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
              <Inbox className="w-8 h-8 text-zinc-500" />
            </div>
            <p className="text-zinc-400 font-medium">No transactions yet</p>
            <p className="text-sm text-zinc-500 mt-1">Your transaction history will appear here</p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx) => (
              <TransactionItem key={tx.id} transaction={tx} />
            ))}
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};
