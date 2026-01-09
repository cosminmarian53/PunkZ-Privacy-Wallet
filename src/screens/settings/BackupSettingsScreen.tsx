import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopAppBar } from '../../components/navigation/TopAppBar';
import { useWalletStore } from '../../store/walletStore';
import { Copy, Check, AlertTriangle, Eye, EyeOff } from 'lucide-react';

export const BackupSettingsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { mnemonic } = useWalletStore();
  const [showPhrase, setShowPhrase] = useState(false);
  const [copied, setCopied] = useState(false);

  const words = mnemonic?.split(' ') || [];

  const handleCopy = async () => {
    if (mnemonic) {
      await navigator.clipboard.writeText(mnemonic);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950">
      <TopAppBar title="Recovery Phrase" showBack onBack={() => navigate('/settings/security')} />

      <div className="max-w-lg mx-auto px-6 py-4">
        {/* Warning */}
        <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl mb-6">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-200 text-sm font-medium">Keep this secret</p>
            <p className="text-amber-200/70 text-sm">
              Anyone with this phrase can access your wallet. Never share it with anyone.
            </p>
          </div>
        </div>

        {/* Show/Hide Toggle */}
        <button
          onClick={() => setShowPhrase(!showPhrase)}
          className="w-full flex items-center justify-center gap-2 p-3 mb-4 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-800/50 transition-colors"
        >
          {showPhrase ? (
            <>
              <EyeOff className="w-4 h-4" />
              Hide Recovery Phrase
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              Show Recovery Phrase
            </>
          )}
        </button>

        {/* Phrase Display */}
        {showPhrase && (
          <>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {words.map((word, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 bg-slate-900/50 border border-slate-800 rounded-lg"
                >
                  <span className="text-slate-500 text-sm w-5">{index + 1}.</span>
                  <span className="text-white font-mono">{word}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleCopy}
              className="w-full flex items-center justify-center gap-2 p-3 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-800/50 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy to Clipboard
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default BackupSettingsScreen;
