import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '../../store/walletStore';
import { Button } from '../../components/ui/Button';

export const OnboardingScreen: React.FC = () => {
  const navigate = useNavigate();
  const { createWallet, isLoading } = useWalletStore();
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-zinc-900 via-zinc-950 to-black">
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-violet-500/30">
            <span className="text-white text-4xl font-bold">P</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Punkz</h1>
          <p className="text-lg text-zinc-400 text-center mt-4 max-w-xs">
            A secure Solana wallet for the modern crypto punk
          </p>
        </div>

        {/* Spacer */}
        <div className="flex-1 min-h-[60px]" />

        {/* Buttons */}
        <div className="w-full max-w-sm space-y-4">
          <Button
            variant="tertiary"
            size="lg"
            fullWidth
            onClick={handleImportWallet}
            disabled={isLoading}
          >
            Import Existing Wallet
          </Button>
          
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleCreateWallet}
            isLoading={isCreating}
            disabled={isLoading}
          >
            Create New Wallet
          </Button>
        </div>
      </div>
    </div>
  );
};
