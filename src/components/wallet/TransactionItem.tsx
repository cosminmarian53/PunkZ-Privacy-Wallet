import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, XCircle } from 'lucide-react';
import type { TransactionRecord } from '../../store/walletStore';

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
    pending: <Clock className="w-4 h-4" style={{ color: '#fbbf24', filter: 'drop-shadow(0 0 4px #fbbf24)' }} />,
    confirmed: <CheckCircle2 className="w-4 h-4" style={{ color: '#00ff88', filter: 'drop-shadow(0 0 4px #00ff88)' }} />,
    failed: <XCircle className="w-4 h-4" style={{ color: '#ff4444', filter: 'drop-shadow(0 0 4px #ff4444)' }} />,
  };

  const isReceive = transaction.type === 'receive';

  return (
    <motion.div 
      className="p-4 rounded-xl cursor-pointer"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 0, 255, 0.05) 0%, rgba(0, 240, 255, 0.02) 100%)',
        border: '1px solid rgba(255, 0, 255, 0.15)',
      }}
      onClick={onClick}
      whileHover={{ 
        borderColor: 'rgba(255, 0, 255, 0.4)',
        boxShadow: '0 0 20px rgba(255, 0, 255, 0.15)',
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-4">
        <motion.div 
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{
            background: isReceive 
              ? 'linear-gradient(135deg, rgba(0, 255, 136, 0.2) 0%, rgba(0, 240, 255, 0.1) 100%)'
              : 'linear-gradient(135deg, rgba(255, 0, 255, 0.2) 0%, rgba(0, 240, 255, 0.1) 100%)',
            border: isReceive 
              ? '1px solid rgba(0, 255, 136, 0.3)'
              : '1px solid rgba(255, 0, 255, 0.3)',
          }}
          whileHover={{
            boxShadow: isReceive ? '0 0 15px rgba(0, 255, 136, 0.3)' : '0 0 15px rgba(255, 0, 255, 0.3)',
          }}
        >
          {isReceive ? (
            <ArrowDownLeft className="w-5 h-5" style={{ color: '#00ff88', filter: 'drop-shadow(0 0 4px #00ff88)' }} />
          ) : (
            <ArrowUpRight className="w-5 h-5" style={{ color: '#ff00ff', filter: 'drop-shadow(0 0 4px #ff00ff)' }} />
          )}
        </motion.div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span 
              className="font-mono font-medium"
              style={{ 
                color: isReceive ? '#00ff88' : '#ff00ff',
                textShadow: isReceive ? '0 0 10px rgba(0, 255, 136, 0.5)' : '0 0 10px rgba(255, 0, 255, 0.5)',
              }}
            >
              {isReceive ? 'Received' : 'Sent'}
            </span>
            {statusIcons[transaction.status]}
          </div>
          <p 
            className="text-sm font-mono truncate"
            style={{ color: 'rgba(0, 240, 255, 0.6)' }}
          >
            {isReceive ? 'From' : 'To'}: {formatAddress(transaction.address)}
          </p>
        </div>
        
        <div className="text-right">
          <p 
            className="font-mono font-bold text-lg"
            style={{ 
              color: isReceive ? '#00ff88' : '#ff00ff',
              textShadow: isReceive ? '0 0 10px rgba(0, 255, 136, 0.5)' : '0 0 10px rgba(255, 0, 255, 0.5)',
            }}
          >
            {isReceive ? '+' : '-'}{transaction.amount.toFixed(4)} SOL
          </p>
          <p 
            className="text-xs font-mono"
            style={{ color: 'rgba(0, 240, 255, 0.5)' }}
          >
            {formatDate(transaction.timestamp)}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
