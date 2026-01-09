import React from 'react';
import { motion } from 'framer-motion';
import { TopAppBar } from '../../components/navigation/TopAppBar';
import { ExternalLink, Github, Twitter, Globe } from 'lucide-react';

export const AboutScreen: React.FC = () => {
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
      <TopAppBar title="About" showBack />

      <div className="flex-1 px-4 py-4 relative z-10">
        {/* Logo and version */}
        <motion.div 
          className="flex flex-col items-center py-8 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div 
            className="w-24 h-24 rounded-full flex items-center justify-center mb-4"
            style={{
              background: 'linear-gradient(135deg, #ff00ff 0%, #00f0ff 100%)',
              boxShadow: '0 0 40px rgba(255, 0, 255, 0.5)',
            }}
            animate={{
              boxShadow: ['0 0 40px rgba(255, 0, 255, 0.5)', '0 0 60px rgba(0, 240, 255, 0.5)', '0 0 40px rgba(255, 0, 255, 0.5)'],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="text-white text-4xl font-bold font-mono">P</span>
          </motion.div>
          <h1 
            className="text-3xl font-mono font-bold"
            style={{ color: '#ff00ff', textShadow: '0 0 20px rgba(255, 0, 255, 0.5)' }}
          >
            Punkz Wallet
          </h1>
          <p className="font-mono mt-1" style={{ color: 'rgba(0, 240, 255, 0.6)' }}>Version 1.0.0</p>
        </motion.div>

        {/* Info cards */}
        <div className="space-y-4 mb-6">
          <motion.div 
            className="p-5 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 0, 255, 0.1) 0%, rgba(0, 240, 255, 0.05) 100%)',
              border: '1px solid rgba(255, 0, 255, 0.2)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-mono font-bold mb-2" style={{ color: '#ff00ff' }}>About</h3>
            <p className="text-sm font-mono" style={{ color: 'rgba(0, 240, 255, 0.7)' }}>
              Punkz is a modern, secure Solana wallet built for the crypto-punk community. 
              Inspired by the best practices of mobile wallet design, Punkz provides a 
              seamless experience for managing your SOL and tokens.
            </p>
          </motion.div>

          <motion.div 
            className="p-5 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 0, 255, 0.1) 0%, rgba(0, 240, 255, 0.05) 100%)',
              border: '1px solid rgba(255, 0, 255, 0.2)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-mono font-bold mb-2" style={{ color: '#ff00ff' }}>Features</h3>
            <ul className="text-sm font-mono space-y-1" style={{ color: 'rgba(0, 240, 255, 0.7)' }}>
              <li>• Secure key management with BIP39 mnemonics</li>
              <li>• Send and receive SOL</li>
              <li>• Transaction history</li>
              <li>• Address book for contacts</li>
              <li>• Multiple network support (Mainnet, Devnet, Testnet)</li>
            </ul>
          </motion.div>
        </div>

        {/* Links */}
        <motion.div 
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(255, 0, 255, 0.05)',
            border: '1px solid rgba(255, 0, 255, 0.2)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {[
            { href: 'https://github.com', icon: Github, label: 'GitHub' },
            { href: 'https://twitter.com', icon: Twitter, label: 'Twitter' },
            { href: 'https://solana.com', icon: Globe, label: 'Website' },
          ].map((link, index) => (
            <motion.a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 transition-colors"
              style={{
                borderBottom: index < 2 ? '1px solid rgba(255, 0, 255, 0.1)' : 'none',
              }}
              whileHover={{ background: 'rgba(255, 0, 255, 0.1)' }}
            >
              <link.icon className="w-5 h-5" style={{ color: '#ff00ff' }} />
              <span className="flex-1 font-mono" style={{ color: '#00f0ff' }}>{link.label}</span>
              <ExternalLink className="w-4 h-4" style={{ color: 'rgba(0, 240, 255, 0.4)' }} />
            </motion.a>
          ))}
        </motion.div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs font-mono" style={{ color: 'rgba(255, 0, 255, 0.4)' }}>
            © 2024 Punkz Wallet. All rights reserved.
          </p>
          <p className="text-xs font-mono mt-1" style={{ color: 'rgba(0, 240, 255, 0.3)' }}>
            Built with React + Solana Web3.js
          </p>
        </div>
      </div>
    </div>
  );
};
