import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '../../store/walletStore';
import { Wallet, ArrowRight, Download } from 'lucide-react';

export const OnboardingScreen: React.FC = () => {
  const navigate = useNavigate();
  const { createWallet } = useWalletStore();
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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
        {/* Logo */}
        <div className="w-28 h-28 bg-gradient-to-br from-fuchsia-500 to-cyan-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-fuchsia-500/30">
          <Wallet className="w-14 h-14 text-white" />
        </div>
        
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400 mb-2 tracking-wider">
          PUNKZ
        </h1>
        
        <p className="text-slate-400 text-center max-w-xs mb-12">
          Your gateway to the Solana blockchain. Secure, fast, and built for the future.
        </p>

        {/* Action Buttons */}
        <div className="w-full max-w-sm space-y-4">
          <button
            onClick={handleCreateWallet}
            disabled={isCreating}
            className="w-full py-4 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-fuchsia-500/30 transition-shadow disabled:opacity-50"
          >
            {isCreating ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Create New Wallet
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          <button
            onClick={handleImportWallet}
            className="w-full py-4 border border-slate-700 rounded-xl text-slate-300 font-medium flex items-center justify-center gap-2 hover:bg-slate-800/50 transition-colors"
          >
            <Download className="w-5 h-5" />
            Import Existing Wallet
          </button>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="w-12 h-12 mx-auto bg-fuchsia-500/10 rounded-xl flex items-center justify-center mb-2">
              <span className="text-fuchsia-400 text-xl">🔐</span>
            </div>
            <p className="text-slate-500 text-xs">Secure</p>
          </div>
          <div>
            <div className="w-12 h-12 mx-auto bg-cyan-500/10 rounded-xl flex items-center justify-center mb-2">
              <span className="text-cyan-400 text-xl">⚡</span>
            </div>
            <p className="text-slate-500 text-xs">Fast</p>
          </div>
          <div>
            <div className="w-12 h-12 mx-auto bg-violet-500/10 rounded-xl flex items-center justify-center mb-2">
              <span className="text-violet-400 text-xl">🌐</span>
            </div>
            <p className="text-slate-500 text-xs">Decentralized</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pb-8 text-center">
        <p className="text-slate-600 text-sm">Powered by Solana</p>
      </div>
    </div>
  );
};

export default OnboardingScreen;
