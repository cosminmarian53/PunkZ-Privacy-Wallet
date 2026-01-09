import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWalletStore } from '../../store/walletStore';
import { TopAppBar } from '../../components/navigation/TopAppBar';
import { BottomNavigation } from '../../components/navigation/BottomNavigation';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, Share2, Shield, Eye } from 'lucide-react';

export const ReceiveScreen: React.FC = () => {
  const { publicKey } = useWalletStore();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!publicKey) return;
    await navigator.clipboard.writeText(publicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!publicKey) return;
    if (navigator.share) {
      await navigator.share({
        title: 'My Solana Address',
        text: publicKey,
      });
    } else {
      handleCopy();
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  return (
    <div 
      className="min-h-screen flex flex-col pb-24"
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
      
      {/* Gradient orbs */}
      <motion.div 
        className="fixed top-20 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0, 240, 255, 0.15) 0%, transparent 70%)' }}
        animate={{ 
          x: [0, -30, 0],
          y: [0, 20, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      <TopAppBar title="Receive SOL" showBack />

      <div className="flex-1 px-6 py-6">
        {/* QR Code Card */}
        <motion.div 
          className="p-8 mb-8 rounded-3xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 0, 255, 0.1) 0%, rgba(0, 240, 255, 0.05) 100%)',
            border: '2px solid rgba(255, 0, 255, 0.25)',
            boxShadow: '0 0 50px rgba(255, 0, 255, 0.15)',
          }}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
        >
          <div className="flex flex-col items-center">
            {/* QR Code */}
            <motion.div 
              className="p-5 rounded-3xl mb-8"
              style={{
                background: 'white',
                boxShadow: '0 0 40px rgba(255, 0, 255, 0.4)',
              }}
              animate={{
                boxShadow: ['0 0 40px rgba(255, 0, 255, 0.4)', '0 0 60px rgba(0, 240, 255, 0.5)', '0 0 40px rgba(255, 0, 255, 0.4)'],
                rotate: [0, 1, -1, 0],
              }}
              transition={{ duration: 4, repeat: Infinity }}
              whileHover={{ scale: 1.05 }}
            >
              <QRCodeSVG
                value={publicKey || ''}
                size={200}
                level="H"
                includeMargin={false}
                fgColor="#1a0030"
              />
            </motion.div>

            {/* Address */}
            <div className="w-full">
              <motion.p 
                className="text-sm font-mono text-center mb-3"
                style={{ color: 'rgba(0, 240, 255, 0.7)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Your Address
              </motion.p>
              <motion.div 
                className="flex items-center justify-center gap-3 p-5 rounded-2xl"
                style={{
                  background: 'rgba(10, 0, 20, 0.7)',
                  border: '1px solid rgba(255, 0, 255, 0.3)',
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ borderColor: '#ff00ff', boxShadow: '0 0 20px rgba(255, 0, 255, 0.3)' }}
              >
                <span 
                  className="text-sm font-mono"
                  style={{ color: '#ff00ff', textShadow: '0 0 10px rgba(255, 0, 255, 0.5)' }}
                >
                  {publicKey ? formatAddress(publicKey) : '...'}
                </span>
                <motion.button
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ color: copied ? '#00ff88' : '#00f0ff' }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </motion.button>
              </motion.div>
            </div>

            {/* Full address (expandable) */}
            <details className="w-full mt-3">
              <summary 
                className="flex items-center justify-center gap-1 text-xs font-mono cursor-pointer"
                style={{ color: '#ff00ff' }}
              >
                <Eye className="w-3 h-3" />
                Show full address
              </summary>
              <p 
                className="mt-2 p-3 rounded-xl text-xs font-mono break-all"
                style={{
                  background: 'rgba(10, 0, 20, 0.6)',
                  border: '1px solid rgba(255, 0, 255, 0.2)',
                  color: '#00f0ff',
                }}
              >
                {publicKey}
              </p>
            </details>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div 
          className="flex gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-3 p-5 rounded-2xl font-mono"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 0, 255, 0.15) 0%, rgba(0, 240, 255, 0.05) 100%)',
              border: '2px solid rgba(255, 0, 255, 0.4)',
              color: copied ? '#00ff88' : '#ff00ff',
            }}
            whileHover={{ 
              boxShadow: '0 0 30px rgba(255, 0, 255, 0.4)',
              borderColor: '#ff00ff',
              scale: 1.02,
              y: -3,
            }}
            whileTap={{ scale: 0.98 }}
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            <span className="text-base font-bold">{copied ? 'Copied!' : 'Copy Address'}</span>
          </motion.button>
          <motion.button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-3 p-5 rounded-2xl font-mono"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.15) 0%, rgba(255, 0, 255, 0.05) 100%)',
              border: '2px solid rgba(0, 240, 255, 0.4)',
              color: '#00f0ff',
            }}
            whileHover={{ 
              boxShadow: '0 0 30px rgba(0, 240, 255, 0.4)',
              borderColor: '#00f0ff',
              scale: 1.02,
              y: -3,
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Share2 className="w-5 h-5" />
            <span className="text-base font-bold">Share</span>
          </motion.button>
        </motion.div>

        {/* Info */}
        <motion.div 
          className="flex items-start gap-5 p-6 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 0, 255, 0.08) 0%, rgba(0, 240, 255, 0.03) 100%)',
            border: '1px solid rgba(255, 0, 255, 0.2)',
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ borderColor: 'rgba(255, 0, 255, 0.4)' }}
        >
          <motion.div 
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 0, 255, 0.25) 0%, rgba(0, 240, 255, 0.1) 100%)',
              border: '1px solid rgba(255, 0, 255, 0.4)',
              boxShadow: '0 0 20px rgba(255, 0, 255, 0.2)',
            }}
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            <Shield className="w-7 h-7" style={{ color: '#ff00ff', filter: 'drop-shadow(0 0 8px #ff00ff)' }} />
          </motion.div>
          <div>
            <p 
              className="text-lg font-mono font-bold mb-2"
              style={{ color: '#ff00ff', textShadow: '0 0 10px rgba(255, 0, 255, 0.5)' }}
            >
              Receive SOL & SPL Tokens
            </p>
            <p 
              className="text-base font-mono leading-relaxed"
              style={{ color: 'rgba(0, 240, 255, 0.7)' }}
            >
              Use this address to receive SOL and any SPL tokens on the Solana network.
            </p>
          </div>
        </motion.div>
      </div>

      <BottomNavigation />
    </div>
  );
};
