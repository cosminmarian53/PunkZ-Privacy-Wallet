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
      <TopAppBar title="Receive SOL" showBack />

      <div className="flex-1 px-4 py-4">
        {/* QR Code Card */}
        <motion.div 
          className="p-6 mb-6 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 0, 255, 0.1) 0%, rgba(0, 240, 255, 0.05) 100%)',
            border: '1px solid rgba(255, 0, 255, 0.2)',
            boxShadow: '0 0 40px rgba(255, 0, 255, 0.1)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center">
            {/* QR Code */}
            <motion.div 
              className="p-4 rounded-2xl mb-6"
              style={{
                background: 'white',
                boxShadow: '0 0 30px rgba(255, 0, 255, 0.3)',
              }}
              animate={{
                boxShadow: ['0 0 30px rgba(255, 0, 255, 0.3)', '0 0 50px rgba(0, 240, 255, 0.4)', '0 0 30px rgba(255, 0, 255, 0.3)'],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <QRCodeSVG
                value={publicKey || ''}
                size={180}
                level="H"
                includeMargin={false}
                fgColor="#1a0030"
              />
            </motion.div>

            {/* Address */}
            <div className="w-full">
              <p 
                className="text-xs font-mono text-center mb-2"
                style={{ color: 'rgba(0, 240, 255, 0.6)' }}
              >
                Your Address
              </p>
              <div 
                className="flex items-center justify-center gap-2 p-4 rounded-xl"
                style={{
                  background: 'rgba(10, 0, 20, 0.6)',
                  border: '1px solid rgba(255, 0, 255, 0.2)',
                }}
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
              </div>
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
        <div className="flex gap-3 mb-6">
          <motion.button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 p-4 rounded-xl font-mono"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 0, 255, 0.1) 0%, rgba(0, 240, 255, 0.05) 100%)',
              border: '1px solid rgba(255, 0, 255, 0.3)',
              color: copied ? '#00ff88' : '#ff00ff',
            }}
            whileHover={{ 
              boxShadow: '0 0 20px rgba(255, 0, 255, 0.3)',
              borderColor: '#ff00ff',
            }}
            whileTap={{ scale: 0.98 }}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span className="text-sm font-medium">{copied ? 'Copied!' : 'Copy Address'}</span>
          </motion.button>
          <motion.button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 p-4 rounded-xl font-mono"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.1) 0%, rgba(255, 0, 255, 0.05) 100%)',
              border: '1px solid rgba(0, 240, 255, 0.3)',
              color: '#00f0ff',
            }}
            whileHover={{ 
              boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)',
              borderColor: '#00f0ff',
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Share2 className="w-4 h-4" />
            <span className="text-sm font-medium">Share</span>
          </motion.button>
        </div>

        {/* Info */}
        <motion.div 
          className="flex items-start gap-4 p-4 rounded-xl"
          style={{
            background: 'rgba(255, 0, 255, 0.05)',
            border: '1px solid rgba(255, 0, 255, 0.15)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 0, 255, 0.2) 0%, rgba(0, 240, 255, 0.1) 100%)',
              border: '1px solid rgba(255, 0, 255, 0.3)',
            }}
          >
            <Shield className="w-5 h-5" style={{ color: '#ff00ff' }} />
          </div>
          <div>
            <p 
              className="text-sm font-mono font-medium"
              style={{ color: '#ff00ff' }}
            >
              Receive SOL & SPL Tokens
            </p>
            <p 
              className="text-xs font-mono mt-1"
              style={{ color: 'rgba(0, 240, 255, 0.6)' }}
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
