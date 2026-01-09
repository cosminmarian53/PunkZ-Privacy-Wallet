import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '../../store/walletStore';
import { ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';

export const RestoreScreen: React.FC = () => {
  const navigate = useNavigate();
  const { importWallet } = useWalletStore();
  
  const [words, setWords] = useState<string[]>(Array(12).fill(''));
  const [isRestoring, setIsRestoring] = useState(false);
  const [error, setError] = useState('');

  const handleWordChange = (index: number, value: string) => {
    const newWords = [...words];
    newWords[index] = value.toLowerCase().trim();
    setWords(newWords);
    setError('');
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const pastedWords = text.trim().split(/\s+/);
      if (pastedWords.length === 12) {
        setWords(pastedWords);
      }
    } catch (err) {
      console.error('Failed to paste:', err);
    }
  };

  const handleRestore = async () => {
    const mnemonic = words.join(' ').trim();
    
    if (words.some(w => !w)) {
      setError('Please enter all 12 words');
      return;
    }

    setIsRestoring(true);
    setError('');

    try {
      await importWallet(mnemonic);
      navigate('/restore-success');
    } catch (err) {
      setError('Invalid recovery phrase. Please check your words and try again.');
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 px-6 py-8">
      <div className="max-w-lg mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-400 mb-6 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Header */}
        <h1 className="text-2xl font-bold text-white mb-2">Import Wallet</h1>
        <p className="text-slate-400 mb-6">
          Enter your 12-word recovery phrase to restore your wallet.
        </p>

        {/* Paste Button */}
        <button
          onClick={handlePaste}
          className="mb-4 px-4 py-2 bg-slate-800 rounded-lg text-slate-300 text-sm hover:bg-slate-700 transition-colors"
        >
          Paste from Clipboard
        </button>

        {/* Word Inputs */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {words.map((word, index) => (
            <div key={index} className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                {index + 1}.
              </span>
              <input
                type="text"
                value={word}
                onChange={(e) => handleWordChange(index, e.target.value)}
                className="w-full pl-8 pr-3 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white font-mono text-sm focus:border-fuchsia-500 focus:outline-none"
                placeholder="..."
              />
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg mb-6">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <p className="text-rose-400 text-sm">{error}</p>
          </div>
        )}

        {/* Restore Button */}
        <button
          onClick={handleRestore}
          disabled={isRestoring}
          className="w-full py-4 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-xl text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isRestoring ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              Restore Wallet
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default RestoreScreen;
