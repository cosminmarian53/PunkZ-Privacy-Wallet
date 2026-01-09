import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWalletStore } from '../../store/walletStore';
import { Wallet, ArrowRight, Download, Sparkles } from 'lucide-react';

// Flickering Neon Text Component
const NeonText = ({ text, color = '#ff00ff' }: { text: string; color?: string }) => {
  const [flickerIndex, setFlickerIndex] = useState<number | null>(null);

  useEffect(() => {
    let flickerTimeout: NodeJS.Timeout;

    const flicker = () => {
      const randomIndex = Math.floor(Math.random() * text.length);
      setFlickerIndex(randomIndex);

      setTimeout(() => {
        setFlickerIndex(null);
      }, Math.random() * 100 + 50);

      flickerTimeout = setTimeout(flicker, Math.random() * 4000 + 1000);
    };

    flickerTimeout = setTimeout(flicker, Math.random() * 4000 + 1000);

    return () => clearTimeout(flickerTimeout);
  }, [text.length]);

  return (
    <span>
      {text.split('').map((char, index) => (
        <span
          key={index}
          style={{
            opacity: flickerIndex === index ? 0.1 : 1,
            transition: 'opacity 0.06s',
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
};

export const OnboardingScreen: React.FC = () => {
  const navigate = useNavigate();
  const { createWallet, isLoading } = useWalletStore();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateWallet = async () => {
    setIsCreating(true);
    try {
      const mnemonic = await createWallet();
      navigate('/backup', { state: { mnemonic } });
    } catch (error) {
      console.error('Failed to create wallet:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleImportWallet = () => {
    navigate('/restore');
  };

  return (
    <div className="min-h-screen w-full bg-[#0d0221] relative overflow-hidden">
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ff00ff10 1px, transparent 1px),
            linear-gradient(to bottom, #ff00ff10 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          perspective: '1000px',
          transform: 'rotateX(60deg) scale(2.5)',
          transformOrigin: 'center top',
        }}
      />

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-purple-500/50"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -500],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}

      {/* Centered Container */}
      <div className="max-w-2xl mx-auto min-h-screen flex flex-col relative z-10">
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center mb-8"
          >
            <motion.div 
              className="w-28 h-28 rounded-full flex items-center justify-center mb-6"
              style={{ 
                background: 'linear-gradient(135deg, #ff00ff, #00f0ff)',
                boxShadow: '0 0 40px #ff00ff80, 0 0 80px #ff00ff40',
              }}
              animate={{ 
              boxShadow: [
                '0 0 40px #ff00ff80, 0 0 80px #ff00ff40',
                '0 0 60px #ff00ff, 0 0 100px #ff00ff60',
                '0 0 40px #ff00ff80, 0 0 80px #ff00ff40',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Wallet className="w-14 h-14 text-white" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-bold mb-2 tracking-wider"
            style={{ 
              fontFamily: 'Monoton, cursive',
              color: '#ff00ff',
              textShadow: '0 0 20px #ff00ff, 0 0 40px #ff00ff80',
            }}
          >
            <NeonText text="PUNKZ" />
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-center mt-4 max-w-xs font-mono"
            style={{ 
              color: '#e0e0e0',
              textShadow: '0 0 5px #00f0ff',
            }}
          >
            Unlock financial privacy on Solana
          </motion.p>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex items-center gap-2 mb-8"
        >
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-mono text-gray-400">Devnet Ready</span>
          <Sparkles className="w-4 h-4 text-yellow-400" />
        </motion.div>

        {/* Spacer */}
        <div className="flex-1 min-h-[40px]" />

        {/* Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="w-full max-w-sm space-y-4"
        >
          <motion.button
            onClick={handleImportWallet}
            disabled={isLoading}
            className="w-full py-4 px-6 rounded-xl font-mono text-lg font-bold flex items-center justify-center gap-3 transition-all disabled:opacity-50"
            style={{
              background: 'rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(0, 240, 255, 0.5)',
              color: '#00f0ff',
            }}
            whileHover={{ 
              borderColor: '#00f0ff',
              boxShadow: '0 0 25px #00f0ff80',
              y: -2,
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-5 h-5" />
            Import Existing Wallet
          </motion.button>
          
          <motion.button
            onClick={handleCreateWallet}
            disabled={isLoading || isCreating}
            className="w-full py-4 px-6 rounded-xl font-mono text-lg font-bold flex items-center justify-center gap-3 text-white disabled:opacity-50"
            style={{
              background: 'linear-gradient(45deg, #ff00ff, #00f0ff)',
              boxShadow: '0 0 30px #ff00ff80, 0 0 30px #00f0ff80',
            }}
            whileHover={{ 
              scale: 1.02,
              boxShadow: '0 0 40px #ff00ff, 0 0 40px #00f0ff',
            }}
            whileTap={{ scale: 0.98 }}
          >
            {isCreating ? (
              <>
                <motion.div 
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                Creating...
              </>
            ) : (
              <>
                Create New Wallet
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-xs text-gray-500 font-mono text-center"
        >
          Your keys, your coins. Self-custody wallet.
        </motion.p>
        </div>
      </div>
    </div>
  );
};
