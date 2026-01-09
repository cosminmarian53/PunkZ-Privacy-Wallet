import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TopAppBar } from '../../components/navigation/TopAppBar';
import { Copy, Check, Eye, EyeOff, AlertTriangle } from 'lucide-react';

export const BackupScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mnemonic = location.state?.mnemonic as string || '';
  const words = mnemonic.split(' ');
  
  const [showWords, setShowWords] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(mnemonic);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContinue = () => {
    navigate('/home');
  };

  return (
    <div 
      className="min-h-screen flex flex-col"
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
      <TopAppBar title="Backup Your Wallet" showBack />
      
      <div className="flex-1 flex flex-col px-6 py-4 relative z-10">
        {/* Warning */}
        <motion.div 
          className="rounded-xl p-4 mb-6"
          style={{
            background: 'rgba(251, 191, 36, 0.1)',
            border: '1px solid rgba(251, 191, 36, 0.3)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#fbbf24' }} />
            <div>
              <p className="text-sm font-mono font-medium" style={{ color: '#fbbf24' }}>
                Write down your recovery phrase
              </p>
              <p className="text-xs font-mono mt-1" style={{ color: 'rgba(251, 191, 36, 0.7)' }}>
                This is the only way to recover your wallet. Never share it with anyone.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Seed phrase grid */}
        <motion.div 
          className="relative rounded-2xl p-4 mb-6"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 0, 255, 0.1) 0%, rgba(0, 240, 255, 0.05) 100%)',
            border: '1px solid rgba(255, 0, 255, 0.2)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid grid-cols-3 gap-3">
            {words.map((word, index) => (
              <motion.div
                key={index}
                className="rounded-lg p-3 flex items-center gap-2"
                style={{
                  background: 'rgba(10, 0, 20, 0.6)',
                  border: '1px solid rgba(255, 0, 255, 0.15)',
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * index }}
              >
                <span className="text-xs font-mono w-5" style={{ color: 'rgba(0, 240, 255, 0.5)' }}>{index + 1}.</span>
                <span 
                  className="text-sm font-mono font-medium"
                  style={{ 
                    color: showWords ? '#ff00ff' : 'transparent',
                    background: showWords ? 'transparent' : 'rgba(255, 0, 255, 0.2)',
                    borderRadius: '4px',
                    textShadow: showWords ? '0 0 10px rgba(255, 0, 255, 0.5)' : 'none',
                  }}
                >
                  {showWords ? word : '•••••'}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Overlay for hidden state */}
          {!showWords && (
            <div 
              className="absolute inset-0 flex items-center justify-center rounded-2xl"
              style={{ background: 'rgba(10, 0, 20, 0.5)', backdropFilter: 'blur(4px)' }}
            >
              <motion.button
                onClick={() => setShowWords(true)}
                className="px-6 py-3 rounded-xl font-mono font-bold flex items-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 0, 255, 0.2) 0%, rgba(0, 240, 255, 0.1) 100%)',
                  border: '1px solid rgba(255, 0, 255, 0.4)',
                  color: '#ff00ff',
                }}
                whileHover={{ boxShadow: '0 0 20px rgba(255, 0, 255, 0.4)' }}
                whileTap={{ scale: 0.98 }}
              >
                <Eye className="w-4 h-4" />
                Reveal Recovery Phrase
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* Actions */}
        {showWords && (
          <div className="flex gap-3 mb-6">
            <motion.button
              onClick={handleCopy}
              className="flex-1 px-4 py-3 rounded-xl font-mono font-bold flex items-center justify-center gap-2"
              style={{
                background: 'rgba(255, 0, 255, 0.1)',
                border: '1px solid rgba(255, 0, 255, 0.3)',
                color: copied ? '#00ff88' : '#ff00ff',
              }}
              whileHover={{ boxShadow: '0 0 15px rgba(255, 0, 255, 0.3)' }}
              whileTap={{ scale: 0.98 }}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </motion.button>
            <motion.button
              onClick={() => setShowWords(false)}
              className="flex-1 px-4 py-3 rounded-xl font-mono font-bold flex items-center justify-center gap-2"
              style={{
                background: 'rgba(0, 240, 255, 0.1)',
                border: '1px solid rgba(0, 240, 255, 0.3)',
                color: '#00f0ff',
              }}
              whileHover={{ boxShadow: '0 0 15px rgba(0, 240, 255, 0.3)' }}
              whileTap={{ scale: 0.98 }}
            >
              <EyeOff className="w-4 h-4" />
              Hide
            </motion.button>
          </div>
        )}

        {/* Confirmation checkbox */}
        <label 
          className="flex items-start gap-3 p-4 rounded-xl cursor-pointer mb-6"
          style={{
            background: 'rgba(255, 0, 255, 0.05)',
            border: '1px solid rgba(255, 0, 255, 0.15)',
          }}
        >
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="w-5 h-5 rounded mt-0.5"
            style={{ accentColor: '#ff00ff' }}
          />
          <span className="text-sm font-mono" style={{ color: 'rgba(0, 240, 255, 0.7)' }}>
            I have securely stored my recovery phrase and understand that losing it means losing access to my wallet.
          </span>
        </label>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Continue button */}
        <motion.button
          onClick={handleContinue}
          disabled={!confirmed}
          className="w-full px-6 py-4 rounded-xl font-mono font-bold text-lg"
          style={{
            background: confirmed 
              ? 'linear-gradient(135deg, #ff00ff 0%, #00f0ff 100%)'
              : 'rgba(255, 0, 255, 0.2)',
            color: 'white',
            opacity: confirmed ? 1 : 0.5,
            cursor: confirmed ? 'pointer' : 'not-allowed',
          }}
          whileHover={confirmed ? { boxShadow: '0 0 30px rgba(255, 0, 255, 0.5)' } : {}}
          whileTap={confirmed ? { scale: 0.98 } : {}}
        >
          Continue to Wallet
        </motion.button>
      </div>
    </div>
  );
};
