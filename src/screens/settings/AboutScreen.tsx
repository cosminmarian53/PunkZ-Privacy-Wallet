import React from 'react';
import { TopAppBar } from '../../components/navigation/TopAppBar';
import { Card } from '../../components/ui/Card';
import { ExternalLink, Github, Twitter, Globe } from 'lucide-react';

export const AboutScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-zinc-900 via-zinc-950 to-black">
      <TopAppBar title="About" showBack />

      <div className="flex-1 px-4 py-4">
        {/* Logo and version */}
        <div className="flex flex-col items-center py-8 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-violet-500/30">
            <span className="text-white text-3xl font-bold">P</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Punkz Wallet</h1>
          <p className="text-zinc-500 mt-1">Version 1.0.0</p>
        </div>

        {/* Info cards */}
        <div className="space-y-3 mb-6">
          <Card className="p-4">
            <h3 className="font-medium text-white mb-2">About</h3>
            <p className="text-sm text-zinc-400">
              Punkz is a modern, secure Solana wallet built for the crypto-punk community. 
              Inspired by the best practices of mobile wallet design, Punkz provides a 
              seamless experience for managing your SOL and tokens.
            </p>
          </Card>

          <Card className="p-4">
            <h3 className="font-medium text-white mb-2">Features</h3>
            <ul className="text-sm text-zinc-400 space-y-1">
              <li>• Secure key management with BIP39 mnemonics</li>
              <li>• Send and receive SOL</li>
              <li>• Transaction history</li>
              <li>• Address book for contacts</li>
              <li>• Multiple network support (Mainnet, Devnet, Testnet)</li>
            </ul>
          </Card>
        </div>

        {/* Links */}
        <Card className="divide-y divide-zinc-800 overflow-hidden">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 hover:bg-zinc-800 transition-colors"
          >
            <Github className="w-5 h-5 text-zinc-400" />
            <span className="flex-1 text-white">GitHub</span>
            <ExternalLink className="w-4 h-4 text-zinc-600" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 hover:bg-zinc-800 transition-colors"
          >
            <Twitter className="w-5 h-5 text-zinc-400" />
            <span className="flex-1 text-white">Twitter</span>
            <ExternalLink className="w-4 h-4 text-zinc-600" />
          </a>
          <a
            href="https://solana.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 hover:bg-zinc-800 transition-colors"
          >
            <Globe className="w-5 h-5 text-zinc-400" />
            <span className="flex-1 text-white">Website</span>
            <ExternalLink className="w-4 h-4 text-zinc-600" />
          </a>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-zinc-600">
            © 2024 Punkz Wallet. All rights reserved.
          </p>
          <p className="text-xs text-zinc-700 mt-1">
            Built with React + Solana Web3.js
          </p>
        </div>
      </div>
    </div>
  );
};
