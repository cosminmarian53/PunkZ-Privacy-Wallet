import React from 'react';
import { TransactionItem } from './TransactionItem';
import { Inbox } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'send' | 'receive';
  amount: number;
  timestamp: string;
  status: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-fuchsia-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-400">Loading transactions...</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
          <Inbox className="w-7 h-7 text-slate-500" />
        </div>
        <p className="text-white font-medium mb-1">No transactions yet</p>
        <p className="text-slate-500 text-sm">Your activity will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {transactions.map((tx) => (
        <TransactionItem key={tx.id} transaction={tx} />
      ))}
    </div>
  );
};

export default TransactionList;
