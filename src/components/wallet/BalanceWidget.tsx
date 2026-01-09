import React from 'react';
import { motion } from 'framer-motion';
import { useWalletStore } from '../../store/walletStore';
import { Eye, EyeOff } from 'lucide-react';

export const BalanceWidget: React.FC = () => {
  const { balance, hideBalances, toggleHideBalances, isSyncing } = useWalletStore();

  const formatBalance = (bal: number): { integer: string; decimal: string } => {
    const [integer, decimal] = bal.toFixed(9).split('.');
    return { integer, decimal: decimal || '000000000' };
  };

  const { integer, decimal } = formatBalance(balance);

  return (
    <motion.div 
      className="flex flex-col items-center py-6 px-4 rounded-2xl"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 0, 255, 0.1) 0%, rgba(0, 240, 255, 0.05) 100%)',
        border: '1px solid rgba(255, 0, 255, 0.2)',
        boxShadow: '0 0 30px rgba(255, 0, 255, 0.1)',
      }}
    >
      <div className="flex items-center gap-4">
        <motion.div 
          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold"
          style={{ 
            background: 'linear-gradient(135deg, #ff00ff, #00f0ff)',
            boxShadow: '0 0 20px #ff00ff80',
            color: 'white',
          }}
          animate={{
            boxShadow: ['0 0 20px #ff00ff80', '0 0 30px #ff00ff', '0 0 20px #ff00ff80'],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ◎
        </motion.div>
        
        {hideBalances ? (
          <div className="flex items-center">
            <span 
              className="text-5xl font-bold font-mono"
              style={{ 
                color: '#ff00ff',
                textShadow: '0 0 20px #ff00ff',
              }}
            >
              ••••••
            </span>
          </div>
        ) : (
          <div className="flex items-baseline">
            <motion.span 
              className={`text-5xl font-bold font-mono ${isSyncing ? 'animate-pulse' : ''}`}
              style={{ 
                color: '#ff00ff',
                textShadow: '0 0 20px #ff00ff, 0 0 40px #ff00ff80',
              }}
            >
              {integer}
            </motion.span>
            <span 
              className="text-2xl font-bold font-mono"
              style={{ color: '#00f0ff' }}
            >
              .{decimal.slice(0, 4)}
            </span>
            <span 
              className="text-sm ml-2 font-mono"
              style={{ color: '#00f0ff' }}
            >
              SOL
            </span>
          </div>
        )}

        <motion.button
          onClick={toggleHideBalances}
          className="p-2.5 rounded-lg transition-all"
          style={{
            background: 'rgba(255, 0, 255, 0.1)',
            border: '1px solid rgba(255, 0, 255, 0.3)',
            color: '#ff00ff',
          }}
          whileHover={{ 
            boxShadow: '0 0 15px #ff00ff80',
            borderColor: '#ff00ff',
          }}
          whileTap={{ scale: 0.95 }}
        >
          {hideBalances ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </motion.button>
      </div>
      
      <p 
        className="text-sm mt-4 font-mono"
        style={{ color: 'rgba(0, 240, 255, 0.7)' }}
      >
        {hideBalances ? '••••••' : `≈ $${(balance * 150).toFixed(2)} USD`}
      </p>
    </motion.div>
  );
};
