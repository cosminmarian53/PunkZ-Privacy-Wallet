import React from 'react';
import { useWalletStore } from '../../store/walletStore';
import { TransactionItem } from './TransactionItem';
import { ArrowUpDown, Inbox } from 'lucide-react';

export const TransactionList: React.FC = () => {
  const { transactions, isSyncing } = useWalletStore();

  if (isSyncing && transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-zinc-500">Syncing transactions...</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
          <Inbox className="w-8 h-8 text-zinc-500" />
        </div>
        <p className="text-zinc-400 font-medium">No transactions yet</p>
        <p className="text-sm text-zinc-500 mt-1">Your transaction history will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Activity</h3>
        <button className="p-2 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-zinc-800">
          <ArrowUpDown className="w-4 h-4" />
        </button>
      </div>
      {transactions.map((tx) => (
        <TransactionItem key={tx.id} transaction={tx} />
      ))}
    </div>
  );
};
