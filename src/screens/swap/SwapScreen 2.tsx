import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TopAppBar } from '../../components/navigation/TopAppBar';
import { BottomNavigation } from '../../components/navigation/BottomNavigation';
import { Button } from '../../components/ui/Button';
import { Repeat, ArrowRightLeft, Sparkles } from 'lucide-react';

export const SwapScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen w-full pb-20"
      style={{
        background: 'linear-gradient(180deg, #0a0014 0%, #1a0030 50%, #0a0014 100%)',
      }}
    >
      {/* Centered Container */}
      <div className="max-w-2xl mx-auto flex flex-col min-h-screen">
        <TopAppBar title="Swap" showBack />

        <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 rounded-full bg-violet-500/20 flex items-center justify-center mb-6">
          <ArrowRightLeft className="w-10 h-10 text-violet-400" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-3 text-center">
          Token Swaps
        </h2>
        
        <p className="text-zinc-400 text-center max-w-xs mb-6">
          Swap between SOL and SPL tokens directly in your wallet
        </p>

        <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full mb-8">
          <Sparkles className="w-4 h-4 text-yellow-500" />
          <span className="text-sm text-yellow-200">Coming Soon</span>
        </div>

        <Button
          variant="secondary"
          onClick={() => navigate('/home')}
        >
          Back to Home
        </Button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};
