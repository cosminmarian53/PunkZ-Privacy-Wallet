import React from 'react';
import { motion } from 'framer-motion';
import { useWalletStore } from '../../store/walletStore';
import { TopAppBar } from '../../components/navigation/TopAppBar';
import { BottomNavigation } from '../../components/navigation/BottomNavigation';
import { TransactionItem } from '../../components/wallet/TransactionItem';
import { Inbox, Filter } from 'lucide-react';

export const HistoryScreen: React.FC = () => {
  const { transactions, isSyncing } = useWalletStore();

  return (
    <div 
      className="min-h-screen flex flex-col pb-20"
      style={{
        background: 'linear-gradient(180deg, #0a0014 0%, #1a0030 50%, #0a0014 100%)',
      }}
    >
      {/* Grid background */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 0, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 0, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      <TopAppBar 
        title="Activity" 
        rightAction={
          <motion.button 
            className="p-2 rounded-lg transition-colors"
            style={{ color: '#00f0ff' }}
            whileHover={{ scale: 1.1, filter: 'drop-shadow(0 0 8px #00f0ff)' }}
            whileTap={{ scale: 0.9 }}
          >
            <Filter className="w-5 h-5" />
          </motion.button>
        }
      />

      <div className="flex-1 px-4 py-4">
        {isSyncing && transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
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
              Loading transactions...
            </p>
          </div>
        ) : transactions.length === 0 ? (
          <motion.div 
            className="flex flex-col items-center justify-center py-20"
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
        ) : (
          <div className="space-y-3">
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
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};
