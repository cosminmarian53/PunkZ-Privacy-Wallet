import React from 'react';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'send' | 'receive';
  amount: number;
  timestamp: string;
  status: string;
}

interface TransactionItemProps {
  transaction: Transaction;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const { type, amount, timestamp, status } = transaction;
  
  return (
    <div className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          type === 'receive' ? 'bg-emerald-500/20' : 'bg-rose-500/20'
        }`}>
          {type === 'receive' ? (
            <ArrowDownLeft className="w-5 h-5 text-emerald-400" />
          ) : (
            <ArrowUpRight className="w-5 h-5 text-rose-400" />
          )}
        </div>
        <div>
          <p className="text-white font-medium capitalize">{type}</p>
          <p className="text-slate-500 text-sm">{timestamp}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-medium ${
          type === 'receive' ? 'text-emerald-400' : 'text-rose-400'
        }`}>
          {type === 'receive' ? '+' : '-'}{amount} SOL
        </p>
        <p className="text-slate-500 text-sm">{status}</p>
      </div>
    </div>
  );
};

export default TransactionItem;
