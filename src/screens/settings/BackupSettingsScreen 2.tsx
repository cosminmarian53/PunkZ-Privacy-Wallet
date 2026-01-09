import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '../../store/walletStore';
import { TopAppBar } from '../../components/navigation/TopAppBar';
import { Button } from '../../components/ui/Button';
import { Eye, EyeOff, Copy, Check, AlertTriangle } from 'lucide-react';

export const BackupSettingsScreen: React.FC = () => {
  const { mnemonic } = useWalletStore();
  const [showWords, setShowWords] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const words = mnemonic?.split(' ') || [];

  const handleCopy = async () => {
    if (!mnemonic) return;
    await navigator.clipboard.writeText(mnemonic);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!confirmed) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-zinc-900 via-zinc-950 to-black">
        <TopAppBar title="Recovery Phrase" showBack />
        
        <div className="flex-1 flex flex-col px-6 py-4">
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center mb-6">
              <AlertTriangle className="w-10 h-10 text-yellow-500" />
            </div>
            
            <h2 className="text-xl font-semibold text-white mb-3 text-center">
              View Recovery Phrase
            </h2>
            
            <p className="text-zinc-400 text-center max-w-xs mb-8">
              Your recovery phrase is the only way to recover your wallet if you lose access. 
              Never share it with anyone.
            </p>

            <div className="w-full max-w-sm space-y-4">
              <label className="flex items-start gap-3 p-4 bg-zinc-900 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="w-5 h-5 rounded border-zinc-600 bg-zinc-800 text-violet-500 focus:ring-violet-500 focus:ring-offset-0 mt-0.5"
                />
                <span className="text-sm text-zinc-300">
                  I understand that anyone with my recovery phrase can access my wallet and steal my funds.
                </span>
              </label>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                disabled={!confirmed}
                onClick={() => {}}
              >
                View Recovery Phrase
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-zinc-900 via-zinc-950 to-black">
      <TopAppBar title="Recovery Phrase" showBack />
      
      <div className="flex-1 flex flex-col px-6 py-4">
        {/* Warning */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-200 font-medium">
                Keep your phrase secret
              </p>
              <p className="text-xs text-yellow-200/70 mt-1">
                Never share it with anyone or enter it on any website.
              </p>
            </div>
          </div>
        </div>

        {/* Seed phrase grid */}
        <div className="relative bg-zinc-900 rounded-2xl p-4 mb-6">
          <div className="grid grid-cols-3 gap-3">
            {words.map((word, index) => (
              <div
                key={index}
                className="bg-zinc-800 rounded-lg p-3 flex items-center gap-2"
              >
                <span className="text-xs text-zinc-500 w-5">{index + 1}.</span>
                <span className={`text-sm font-medium ${showWords ? 'text-white' : 'text-transparent bg-zinc-600 rounded select-none'}`}>
                  {showWords ? word : '•••••'}
                </span>
              </div>
            ))}
          </div>

          {!showWords && (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm rounded-2xl">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowWords(true)}
                leftIcon={<Eye className="w-4 h-4" />}
              >
                Reveal Recovery Phrase
              </Button>
            </div>
          )}
        </div>

        {/* Actions */}
        {showWords && (
          <div className="flex gap-3">
            <Button
              variant="secondary"
              fullWidth
              onClick={handleCopy}
              leftIcon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setShowWords(false)}
              leftIcon={<EyeOff className="w-4 h-4" />}
            >
              Hide
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
