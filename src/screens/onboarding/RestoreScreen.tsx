import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '../../store/walletStore';
import { Button } from '../../components/ui/Button';
import { TopAppBar } from '../../components/navigation/TopAppBar';
import { AlertCircle, FileText } from 'lucide-react';

export const RestoreScreen: React.FC = () => {
  const navigate = useNavigate();
  const { importWallet, isLoading, error } = useWalletStore();
  const [seedPhrase, setSeedPhrase] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleRestore = async () => {
    setLocalError(null);
    
    // Validate seed phrase format
    const words = seedPhrase.trim().toLowerCase().split(/\s+/);
    if (words.length !== 12 && words.length !== 24) {
      setLocalError('Please enter a valid 12 or 24 word recovery phrase');
      return;
    }

    const success = await importWallet(words.join(' '));
    if (success) {
      navigate('/restore-success');
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setSeedPhrase(text);
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-zinc-900 via-zinc-950 to-black">
      <TopAppBar title="Import Wallet" showBack />
      
      <div className="flex-1 flex flex-col px-6 py-4">
        {/* Instructions */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-2">
            Enter your recovery phrase
          </h2>
          <p className="text-sm text-zinc-400">
            Enter your 12 or 24 word recovery phrase to restore your wallet.
          </p>
        </div>

        {/* Seed phrase input */}
        <div className="relative mb-4">
          <textarea
            value={seedPhrase}
            onChange={(e) => {
              setSeedPhrase(e.target.value);
              setLocalError(null);
            }}
            placeholder="Enter your recovery phrase, separated by spaces"
            className="w-full h-40 bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
          />
          <button
            onClick={handlePaste}
            className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 text-sm text-violet-400 hover:text-violet-300 bg-violet-500/10 hover:bg-violet-500/20 rounded-lg transition-colors"
          >
            <FileText className="w-4 h-4" />
            Paste
          </button>
        </div>

        {/* Word count indicator */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-zinc-500">
            Words: {seedPhrase.trim() ? seedPhrase.trim().split(/\s+/).length : 0}/12 or 24
          </span>
        </div>

        {/* Error message */}
        {displayError && (
          <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl mb-4">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{displayError}</p>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Restore button */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleRestore}
          isLoading={isLoading}
          disabled={!seedPhrase.trim() || isLoading}
        >
          Restore Wallet
        </Button>
      </div>
    </div>
  );
};
