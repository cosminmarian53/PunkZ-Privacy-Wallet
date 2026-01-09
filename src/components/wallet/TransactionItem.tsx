import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, XCircle } from 'lucide-react';
import type { TransactionRecord } from '../../store/walletStore';
import { Card } from '../ui/Card';

interface TransactionItemProps {
  transaction: TransactionRecord;
  onClick?: () => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onClick }) => {
  const formatAddress = (address: string) => {
    if (address === 'Unknown') return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const statusIcons = {
    pending: <Clock className="w-4 h-4 text-yellow-500" />,
    confirmed: <CheckCircle2 className="w-4 h-4 text-green-500" />,
    failed: <XCircle className="w-4 h-4 text-red-500" />,
  };

  return (
    <Card variant="outlined" className="p-4" onClick={onClick}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          transaction.type === 'receive' ? 'bg-green-500/20' : 'bg-violet-500/20'
        }`}>
          {transaction.type === 'receive' ? (
            <ArrowDownLeft className="w-5 h-5 text-green-500" />
          ) : (
            <ArrowUpRight className="w-5 h-5 text-violet-500" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-white">
              {transaction.type === 'receive' ? 'Received' : 'Sent'}
            </span>
            {statusIcons[transaction.status]}
          </div>
          <p className="text-sm text-zinc-500 truncate">
            {transaction.type === 'receive' ? 'From' : 'To'}: {formatAddress(transaction.address)}
          </p>
        </div>
        
        <div className="text-right">
          <p className={`font-semibold ${
            transaction.type === 'receive' ? 'text-green-500' : 'text-white'
          }`}>
            {transaction.type === 'receive' ? '+' : '-'}{transaction.amount.toFixed(4)} SOL
          </p>
          <p className="text-xs text-zinc-500">{formatDate(transaction.timestamp)}</p>
        </div>
      </div>
    </Card>
  );
};
