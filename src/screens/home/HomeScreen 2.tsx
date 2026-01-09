import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWalletStore } from '../../store/walletStore';
import { BalanceWidget } from '../../components/wallet/BalanceWidget';
import { TransactionList } from '../../components/wallet/TransactionList';
import { BottomNavigation } from '../../components/navigation/BottomNavigation';
import { RefreshCw, ArrowUpRight, ArrowDownLeft, Repeat, QrCode, Wallet } from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { publicKey, refreshBalance, isSyncing } = useWalletStore();

  useEffect(() => {
    if (publicKey) {
      refreshBalance();
    }
  }, [publicKey, refreshBalance]);

  const handleRefresh = () => {
    refreshBalance();
  };

  return (
    <div className="min-h-screen w-full bg-[#0d0221] pb-24 relative overflow-hidden">
      {/* Grid Background */}
      <div 
        className="fixed inset-0 opacity-10 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ff00ff10 1px, transparent 1px),
            linear-gradient(to bottom, #ff00ff10 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      
      {/* Gradient orbs */}
      <div 
        className="fixed top-0 left-0 w-80 h-80 rounded-full blur-3xl pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(255, 0, 255, 0.15) 0%, transparent 70%)' }}
      />
      <div 
        className="fixed bottom-40 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(0, 240, 255, 0.1) 0%, transparent 70%)' }}
      />

      {/* Centered Container */}
      <div className="max-w-2xl mx-auto flex flex-col min-h-screen">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 py-5 flex items-center justify-between relative z-10"
        >
        <div className="flex items-center gap-4">
          <motion.div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ 
              background: 'linear-gradient(135deg, #ff00ff, #00f0ff)',
              boxShadow: '0 0 25px #ff00ff80',
            }}
            animate={{ 
              boxShadow: ['0 0 25px #ff00ff80', '0 0 40px #ff00ff', '0 0 25px #ff00ff80'],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Wallet className="w-6 h-6 text-white" />
          </motion.div>
          <span 
            className="font-bold text-2xl"
            style={{ 
              fontFamily: 'Monoton, cursive',
              color: '#ff00ff',
              textShadow: '0 0 15px #ff00ff',
            }}
          >
            PUNKZ
          </span>
        </div>
        <motion.button
          onClick={handleRefresh}
          disabled={isSyncing}
          className="p-3 rounded-xl transition-all disabled:opacity-50"
          style={{
            background: 'rgba(255, 0, 255, 0.1)',
            border: '1px solid rgba(255, 0, 255, 0.3)',
          }}
          whileHover={{ 
            boxShadow: '0 0 20px #ff00ff80',
            borderColor: '#ff00ff',
            scale: 1.05,
          }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw className={`w-5 h-5 text-[#ff00ff] ${isSyncing ? 'animate-spin' : ''}`} />
        </motion.button>
      </motion.header>

      {/* Main content */}
      <div className="flex-1 flex flex-col px-6 relative z-10">
        {/* Balance */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="py-8"
        >
          <BalanceWidget />
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-4 gap-4 mb-8"
        >
          <QuickActionButton
            icon={<ArrowDownLeft className="w-5 h-5" />}
            label="Receive"
            onClick={() => navigate('/receive')}
            color="#00f0ff"
            delay={0}
          />
          <QuickActionButton
            icon={<ArrowUpRight className="w-5 h-5" />}
            label="Send"
            onClick={() => navigate('/send')}
            color="#ff00ff"
            delay={0.05}
          />
          <QuickActionButton
            icon={<Repeat className="w-5 h-5" />}
            label="Swap"
            onClick={() => navigate('/swap')}
            color="#00f0ff"
            delay={0.1}
          />
          <QuickActionButton
            icon={<QrCode className="w-5 h-5" />}
            label="Scan"
            onClick={() => navigate('/scan')}
            color="#ff00ff"
            delay={0.15}
          />
        </motion.div>

        {/* Sync status message */}
        {isSyncing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 p-3 rounded-xl"
            style={{
              background: 'rgba(255, 0, 255, 0.1)',
              border: '1px solid rgba(255, 0, 255, 0.3)',
              boxShadow: '0 0 15px rgba(255, 0, 255, 0.2)',
            }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: '#ff00ff', borderTopColor: 'transparent' }}
              />
              <span className="text-sm font-mono" style={{ color: '#ff00ff' }}>Syncing wallet...</span>
            </div>
          </motion.div>
        )}

        {/* Transactions */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex-1 rounded-3xl px-6 pt-8"
          style={{
            background: 'linear-gradient(180deg, rgba(26, 0, 51, 0.9) 0%, rgba(13, 2, 33, 0.95) 100%)',
            borderTop: '2px solid rgba(255, 0, 255, 0.3)',
            boxShadow: '0 -10px 40px rgba(255, 0, 255, 0.1)',
          }}
        >
          <TransactionList />
        </motion.div>
      </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

interface QuickActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color: string;
  delay?: number;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ icon, label, onClick, color, delay = 0 }) => (
  <motion.button
    initial={{ opacity: 0, y: 20, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay: 0.2 + delay, type: 'spring', stiffness: 200 }}
    onClick={onClick}
    className="flex flex-col items-center gap-3 p-4 rounded-2xl transition-all"
    style={{
      background: 'linear-gradient(135deg, rgba(10, 0, 20, 0.8) 0%, rgba(20, 0, 40, 0.6) 100%)',
      border: `1px solid ${color}50`,
      backdropFilter: 'blur(10px)',
    }}
    whileHover={{ 
      borderColor: color,
      boxShadow: `0 0 30px ${color}50`,
      y: -5,
      scale: 1.05,
    }}
    whileTap={{ scale: 0.95 }}
  >
    <motion.div 
      className="w-12 h-12 rounded-2xl flex items-center justify-center"
      style={{ 
        background: `${color}25`,
        color: color,
        boxShadow: `0 0 15px ${color}40`,
      }}
      whileHover={{ rotate: [0, -10, 10, 0] }}
      transition={{ duration: 0.4 }}
    >
      {icon}
    </motion.div>
    <span 
      className="text-sm font-mono font-bold" 
      style={{ color: color, textShadow: `0 0 10px ${color}60` }}
    >
      {label}
    </span>
  </motion.button>
);
