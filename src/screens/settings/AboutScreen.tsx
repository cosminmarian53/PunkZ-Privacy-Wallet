import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TopAppBar } from '../../components/navigation/TopAppBar';
import { Wallet, Github, Globe } from 'lucide-react';

export const AboutScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950">
      <TopAppBar title="About" showBack onBack={() => navigate('/settings')} />

      <div className="max-w-lg mx-auto px-6 py-8 flex flex-col items-center">
        {/* Logo */}
        <div className="w-20 h-20 bg-gradient-to-br from-fuchsia-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-fuchsia-500/30">
          <Wallet className="w-10 h-10 text-white" />
        </div>

        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400 mb-1">
          PUNKZ WALLET
        </h1>
        <p className="text-slate-400 mb-6">Version 1.0.0</p>

        {/* Info Card */}
        <div className="w-full p-4 bg-slate-900/50 border border-slate-800 rounded-2xl mb-6">
          <p className="text-slate-300 text-center">
            A modern Solana wallet designed for the decentralized future.
          </p>
        </div>

        {/* Links */}
        <div className="w-full space-y-2">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:bg-slate-800/50 transition-colors"
          >
            <Github className="w-5 h-5 text-slate-400" />
            <span className="text-white">View on GitHub</span>
          </a>
          <a
            href="https://solana.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:bg-slate-800/50 transition-colors"
          >
            <Globe className="w-5 h-5 text-slate-400" />
            <span className="text-white">Learn about Solana</span>
          </a>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-12 text-center">
          <p className="text-slate-600 text-sm">Built on Solana Devnet</p>
          <p className="text-slate-700 text-xs mt-1">© 2024 Punkz Wallet</p>
        </div>
      </div>
    </div>
  );
};

export default AboutScreen;
