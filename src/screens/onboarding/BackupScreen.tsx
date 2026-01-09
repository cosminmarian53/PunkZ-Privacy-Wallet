import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { TopAppBar } from '../../components/navigation/TopAppBar';
import { Copy, Check, Eye, EyeOff, AlertTriangle } from 'lucide-react';

export const BackupScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mnemonic = location.state?.mnemonic as string || '';
  const words = mnemonic.split(' ');
  
  const [showWords, setShowWords] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(mnemonic);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContinue = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-zinc-900 via-zinc-950 to-black">
      <TopAppBar title="Backup Your Wallet" showBack />
      
      <div className="flex-1 flex flex-col px-6 py-4">
        {/* Warning */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-200 font-medium">
                Write down your recovery phrase
              </p>
              <p className="text-xs text-yellow-200/70 mt-1">
                This is the only way to recover your wallet. Never share it with anyone.
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

          {/* Overlay for hidden state */}
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
          <div className="flex gap-3 mb-6">
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

        {/* Confirmation checkbox */}
        <label className="flex items-start gap-3 p-4 bg-zinc-900 rounded-xl cursor-pointer mb-6">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="w-5 h-5 rounded border-zinc-600 bg-zinc-800 text-violet-500 focus:ring-violet-500 focus:ring-offset-0 mt-0.5"
          />
          <span className="text-sm text-zinc-300">
            I have securely stored my recovery phrase and understand that losing it means losing access to my wallet.
          </span>
        </label>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Continue button */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleContinue}
          disabled={!confirmed}
        >
          Continue to Wallet
        </Button>
      </div>
    </div>
  );
};
