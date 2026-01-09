import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Copy, Check, ArrowRight, AlertTriangle } from 'lucide-react';

export const BackupScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mnemonic = location.state?.mnemonic || '';
  const words = mnemonic.split(' ');
  
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(mnemonic);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContinue = () => {
    if (confirmed) {
      navigate('/home');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 px-6 py-8">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-bold text-white mb-2">Backup Your Wallet</h1>
        <p className="text-slate-400 mb-6">
          Write down these 12 words in order. This is the only way to recover your wallet.
        </p>

        {/* Warning */}
        <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl mb-6">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-200 text-sm font-medium">Keep this phrase secret</p>
            <p className="text-amber-200/70 text-sm">
              Anyone with these words can access your funds. Never share them.
            </p>
          </div>
        </div>

        {/* Mnemonic Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {words.map((word: string, index: number) => (
            <div
              key={index}
              className="flex items-center gap-2 p-3 bg-slate-900/50 border border-slate-800 rounded-lg"
            >
              <span className="text-slate-500 text-sm w-5">{index + 1}.</span>
              <span className="text-white font-mono">{word}</span>
            </div>
          ))}
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="w-full py-3 flex items-center justify-center gap-2 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-800/50 transition-colors mb-8"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy to Clipboard</span>
            </>
          )}
        </button>

        {/* Confirmation Checkbox */}
        <label className="flex items-start gap-3 mb-6 cursor-pointer">
          <div className="relative mt-0.5">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="sr-only"
            />
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
              confirmed 
                ? 'bg-fuchsia-500 border-fuchsia-500' 
                : 'border-slate-600'
            }`}>
              {confirmed && <Check className="w-3 h-3 text-white" />}
            </div>
          </div>
          <span className="text-slate-300 text-sm">
            I have written down my recovery phrase and stored it in a safe place.
          </span>
        </label>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!confirmed}
          className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 ${
            confirmed
              ? 'bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          Continue to Wallet
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default BackupScreen;
