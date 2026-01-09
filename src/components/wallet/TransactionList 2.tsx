import React from 'react';
import { motion } from 'framer-motion';
import { useWalletStore } from '../../store/walletStore';
import { TransactionItem } from './TransactionItem';
import { ArrowUpDown, Inbox } from 'lucide-react';

export const TransactionList: React.FC = () => {
  const { transactions, isSyncing } = useWalletStore();

  if (isSyncing && transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <motion.div 
          className="w-14 h-14 rounded-full"
          style={{
            border: '3px solid transparent',
            borderTopColor: '#ff00ff',
            borderRightColor: '#00f0ff',
            boxShadow: '0 0 20px rgba(255, 0, 255, 0.3)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <p 
          className="mt-4 font-mono"
          style={{ color: '#00f0ff', textShadow: '0 0 10px rgba(0, 240, 255, 0.5)' }}
        >
          Syncing transactions...
        </p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center py-12"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 0, 255, 0.1) 0%, rgba(0, 240, 255, 0.05) 100%)',
            border: '1px solid rgba(255, 0, 255, 0.2)',
          }}
          animate={{
            boxShadow: ['0 0 20px rgba(255, 0, 255, 0.1)', '0 0 30px rgba(255, 0, 255, 0.2)', '0 0 20px rgba(255, 0, 255, 0.1)'],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Inbox className="w-10 h-10" style={{ color: '#ff00ff', filter: 'drop-shadow(0 0 8px #ff00ff)' }} />
        </motion.div>
        <p 
          className="font-mono font-medium text-lg"
          style={{ color: '#ff00ff', textShadow: '0 0 10px rgba(255, 0, 255, 0.5)' }}
        >
          No transactions yet
        </p>
        <p 
          className="text-sm font-mono mt-2"
          style={{ color: 'rgba(0, 240, 255, 0.6)' }}
        >
          Your transaction history will appear here
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 
          className="text-xl font-mono font-bold"
          style={{ color: '#ff00ff', textShadow: '0 0 15px rgba(255, 0, 255, 0.5)' }}
        >
          Activity
        </h3>
        <motion.button 
          className="p-2.5 rounded-lg transition-all"
          style={{
            background: 'rgba(255, 0, 255, 0.1)',
            border: '1px solid rgba(255, 0, 255, 0.2)',
            color: '#00f0ff',
          }}
          whileHover={{ 
            boxShadow: '0 0 15px rgba(255, 0, 255, 0.3)',
            borderColor: '#ff00ff',
          }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowUpDown className="w-4 h-4" />
        </motion.button>
      </div>
      {transactions.map((tx, index) => (
        <motion.div
          key={tx.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <TransactionItem transaction={tx} />
        </motion.div>
      ))}
    </div>
  );
};
