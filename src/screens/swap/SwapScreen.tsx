import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TopAppBar } from '../../components/navigation/TopAppBar';
import { BottomNavigation } from '../../components/navigation/BottomNavigation';
import { ArrowRightLeft, Sparkles } from 'lucide-react';

export const SwapScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 pb-24">
      <TopAppBar title="Swap" showBack />

      <div className="max-w-lg mx-auto px-6 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-20 h-20 rounded-full bg-violet-500/20 flex items-center justify-center mb-6">
          <ArrowRightLeft className="w-10 h-10 text-violet-400" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-3 text-center">
          Token Swaps
        </h2>
        
        <p className="text-slate-400 text-center max-w-xs mb-6">
          Swap between SOL and SPL tokens directly in your wallet
        </p>

        <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full mb-8">
          <Sparkles className="w-4 h-4 text-yellow-500" />
          <span className="text-sm text-yellow-200">Coming Soon</span>
        </div>

        <button
          onClick={() => navigate('/home')}
          className="px-6 py-3 border border-slate-700 rounded-xl text-slate-400 hover:bg-slate-800"
        >
          Back to Home
        </button>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default SwapScreen;
