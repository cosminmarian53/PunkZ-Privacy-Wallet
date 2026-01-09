import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '../../store/walletStore';
import { Wallet, ArrowRight, Download, Shield, Zap, Lock } from 'lucide-react';

export const OnboardingScreen = () => {
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
    <div className="min-h-screen animated-bg flex flex-col relative overflow-hidden">
      {/* Grid Background */}
      <div className="fixed inset-0 grid-bg pointer-events-none" />
      
      {/* Floating Stars */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="star"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}

      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-fuchsia-500/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 relative z-10">
        {/* Logo */}
        <div className="mb-10 float">
          <div className="w-32 h-32 bg-gradient-to-br from-fuchsia-500 to-cyan-500 rounded-3xl flex items-center justify-center pulse-glow">
            <Wallet className="w-16 h-16 text-white" />
          </div>
        </div>
        
        <h1 
          className="text-6xl md:text-7xl font-bold text-fuchsia-500 mb-3 neon-text-pink flicker"
          style={{ fontFamily: 'Monoton, cursive' }}
        >
          PUNKZ
        </h1>
        
        <p 
          className="text-2xl text-cyan-400 mb-8 tracking-[0.3em] neon-text-cyan"
          style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
          WALLET
        </p>

        <p className="text-xl text-slate-300 text-center max-w-md mb-12 leading-relaxed">
          Your gateway to the <span className="text-fuchsia-400">Solana blockchain</span>. 
          Secure, fast, and built for the <span className="text-cyan-400">future</span>.
        </p>

        {/* Action Buttons */}
        <div className="w-full max-w-sm space-y-4 mb-16">
          <button
            onClick={handleCreateWallet}
            disabled={isCreating}
            className="w-full py-5 bg-gradient-to-r from-fuchsia-600 to-cyan-500 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-3 neon-btn disabled:opacity-50"
          >
            {isCreating ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Create New Wallet
                <ArrowRight className="w-6 h-6" />
              </>
            )}
          </button>

          <button
            onClick={handleImportWallet}
            className="w-full py-5 border-2 border-fuchsia-500/50 rounded-xl text-fuchsia-400 font-bold text-lg flex items-center justify-center gap-3 hover:bg-fuchsia-500/10 hover:border-fuchsia-500 transition-all"
          >
            <Download className="w-6 h-6" />
            Import Existing Wallet
          </button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-8 text-center max-w-md">
          <div className="group">
            <div className="w-14 h-14 mx-auto bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-xl flex items-center justify-center mb-3 group-hover:neon-box-pink transition-all">
              <Shield className="w-7 h-7 text-fuchsia-400" />
            </div>
            <p className="text-slate-400 text-sm">Secure</p>
          </div>
          <div className="group">
            <div className="w-14 h-14 mx-auto bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-center justify-center mb-3 group-hover:neon-box-cyan transition-all">
              <Zap className="w-7 h-7 text-cyan-400" />
            </div>
            <p className="text-slate-400 text-sm">Fast</p>
          </div>
          <div className="group">
            <div className="w-14 h-14 mx-auto bg-purple-500/10 border border-purple-500/30 rounded-xl flex items-center justify-center mb-3 group-hover:shadow-lg group-hover:shadow-purple-500/30 transition-all">
              <Lock className="w-7 h-7 text-purple-400" />
            </div>
            <p className="text-slate-400 text-sm">Private</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pb-8 text-center relative z-10">
        <p className="text-slate-600 text-sm">Powered by <span className="gradient-text font-semibold">Solana</span></p>
      </div>
    </div>
  );
};

export default OnboardingScreen;
