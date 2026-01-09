import React from 'react';
import { motion } from 'framer-motion';
import { useWalletStore } from '../../store/walletStore';
import { Eye, EyeOff, TrendingUp } from 'lucide-react';

export const BalanceWidget: React.FC = () => {
  const { balance, hideBalances, toggleHideBalances, isSyncing } = useWalletStore();

  const formatBalance = (bal: number): { integer: string; decimal: string } => {
    const [integer, decimal] = bal.toFixed(9).split('.');
    return { integer, decimal: decimal || '000000000' };
  };

  const { integer, decimal } = formatBalance(balance);

  return (
    <motion.div 
      className="flex flex-col items-center py-8 px-6 rounded-3xl relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 0, 255, 0.12) 0%, rgba(0, 240, 255, 0.06) 100%)',
        border: '2px solid rgba(255, 0, 255, 0.25)',
        boxShadow: '0 0 50px rgba(255, 0, 255, 0.15), inset 0 0 30px rgba(255, 0, 255, 0.05)',
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
    >
      {/* Background glow effect */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 30%, rgba(255, 0, 255, 0.1) 0%, transparent 60%)',
        }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      
      <div className="flex items-center gap-5 relative z-10">
        <motion.div 
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-bold"
          style={{ 
            background: 'linear-gradient(135deg, #ff00ff, #00f0ff)',
            boxShadow: '0 0 30px #ff00ff80',
            color: 'white',
          }}
          animate={{
            boxShadow: ['0 0 30px #ff00ff80', '0 0 50px #ff00ff', '0 0 30px #ff00ff80'],
            rotate: [0, 5, -5, 0],
          }}
          transition={{ duration: 4, repeat: Infinity }}
          whileHover={{ scale: 1.1, rotate: 10 }}
        >
          ◎
        </motion.div>
        
        {hideBalances ? (
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span 
              className="text-6xl font-bold font-mono"
              style={{ 
                color: '#ff00ff',
                textShadow: '0 0 25px #ff00ff',
              }}
            >
              ••••••
            </span>
          </motion.div>
        ) : (
          <div className="flex items-baseline">
            <motion.span 
              className={`text-6xl font-bold font-mono ${isSyncing ? 'animate-pulse' : ''}`}
              style={{ 
                color: '#ff00ff',
                textShadow: '0 0 25px #ff00ff, 0 0 50px #ff00ff80',
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {integer}
            </motion.span>
            <motion.span 
              className="text-3xl font-bold font-mono"
              style={{ color: '#00f0ff', textShadow: '0 0 10px rgba(0, 240, 255, 0.5)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              .{decimal.slice(0, 4)}
            </motion.span>
            <motion.span 
              className="text-lg ml-3 font-mono font-bold"
              style={{ color: '#00f0ff' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              SOL
            </motion.span>
          </div>
        )}

        <motion.button
          onClick={toggleHideBalances}
          className="p-3 rounded-xl transition-all"
          style={{
            background: 'rgba(255, 0, 255, 0.15)',
            border: '1px solid rgba(255, 0, 255, 0.4)',
            color: '#ff00ff',
          }}
          whileHover={{ 
            boxShadow: '0 0 25px #ff00ff80',
            borderColor: '#ff00ff',
            scale: 1.1,
          }}
          whileTap={{ scale: 0.9 }}
        >
          {hideBalances ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </motion.button>
      </div>
      
      <motion.div 
        className="flex items-center gap-2 mt-6 relative z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <TrendingUp className="w-4 h-4" style={{ color: '#00ff88' }} />
        <p 
          className="text-lg font-mono font-medium"
          style={{ color: 'rgba(0, 240, 255, 0.8)' }}
        >
          {hideBalances ? '••••••' : `≈ $${(balance * 150).toFixed(2)} USD`}
        </p>
      </motion.div>
    </motion.div>
  );
};
