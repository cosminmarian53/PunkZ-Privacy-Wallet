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
    <div className="min-h-screen flex flex-col bg-[#0d0221] pb-20 relative overflow-hidden">
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ff00ff10 1px, transparent 1px),
            linear-gradient(to bottom, #ff00ff10 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 py-4 flex items-center justify-between relative z-10"
      >
        <div className="flex items-center gap-3">
          <motion.div 
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ 
              background: 'linear-gradient(135deg, #ff00ff, #00f0ff)',
              boxShadow: '0 0 20px #ff00ff80',
            }}
            animate={{ 
              boxShadow: ['0 0 20px #ff00ff80', '0 0 30px #ff00ff', '0 0 20px #ff00ff80'],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Wallet className="w-5 h-5 text-white" />
          </motion.div>
          <span 
            className="font-bold text-xl"
            style={{ 
              fontFamily: 'Monoton, cursive',
              color: '#ff00ff',
              textShadow: '0 0 10px #ff00ff',
            }}
          >
            PUNKZ
          </span>
        </div>
        <motion.button
          onClick={handleRefresh}
          disabled={isSyncing}
          className="p-2.5 rounded-lg transition-all disabled:opacity-50"
          style={{
            background: 'rgba(255, 0, 255, 0.1)',
            border: '1px solid rgba(255, 0, 255, 0.3)',
          }}
          whileHover={{ 
            boxShadow: '0 0 15px #ff00ff80',
            borderColor: '#ff00ff',
          }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw className={`w-5 h-5 text-[#ff00ff] ${isSyncing ? 'animate-spin' : ''}`} />
        </motion.button>
      </motion.header>

      {/* Main content */}
      <div className="flex-1 flex flex-col px-4 relative z-10">
        {/* Balance */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="py-6"
        >
          <BalanceWidget />
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-4 gap-3 mb-6"
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
          transition={{ delay: 0.3 }}
          className="flex-1 rounded-t-3xl -mx-4 px-4 pt-6"
          style={{
            background: 'linear-gradient(180deg, rgba(26, 0, 51, 0.8) 0%, rgba(13, 2, 33, 0.9) 100%)',
            borderTop: '1px solid rgba(255, 0, 255, 0.2)',
          }}
        >
          <TransactionList />
        </motion.div>
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
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 + delay }}
    onClick={onClick}
    className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all"
    style={{
      background: 'rgba(0, 0, 0, 0.5)',
      border: `1px solid ${color}40`,
    }}
    whileHover={{ 
      borderColor: color,
      boxShadow: `0 0 20px ${color}40`,
      y: -2,
    }}
    whileTap={{ scale: 0.95 }}
  >
    <motion.div 
      className="w-10 h-10 rounded-full flex items-center justify-center"
      style={{ 
        background: `${color}20`,
        color: color,
        boxShadow: `0 0 10px ${color}40`,
      }}
    >
      {icon}
    </motion.div>
    <span className="text-xs font-mono font-medium" style={{ color: color }}>{label}</span>
  </motion.button>
);
