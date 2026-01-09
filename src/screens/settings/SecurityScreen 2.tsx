import React from 'react';
import { TopAppBar } from '../../components/navigation/TopAppBar';
import { Card } from '../../components/ui/Card';
import { useWalletStore } from '../../store/walletStore';
import { Lock, Eye, EyeOff, Fingerprint, Shield } from 'lucide-react';

export const SecurityScreen: React.FC = () => {
  const { hideBalances, toggleHideBalances } = useWalletStore();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-zinc-900 via-zinc-950 to-black">
      <TopAppBar title="Security" showBack />

      <div className="flex-1 px-4 py-4">
        <Card className="divide-y divide-zinc-800 overflow-hidden">
          {/* Hide balances toggle */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                {hideBalances ? (
                  <EyeOff className="w-5 h-5 text-violet-400" />
                ) : (
                  <Eye className="w-5 h-5 text-violet-400" />
                )}
              </div>
              <div>
                <p className="font-medium text-white">Hide Balances</p>
                <p className="text-sm text-zinc-500">Hide balance amounts for privacy</p>
              </div>
            </div>
            <button
              onClick={toggleHideBalances}
              className={`relative w-12 h-7 rounded-full transition-colors ${
                hideBalances ? 'bg-violet-600' : 'bg-zinc-700'
              }`}
            >
              <span
                className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  hideBalances ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Biometric (placeholder) */}
          <div className="flex items-center justify-between p-4 opacity-50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                <Fingerprint className="w-5 h-5 text-zinc-500" />
              </div>
              <div>
                <p className="font-medium text-white">Biometric Lock</p>
                <p className="text-sm text-zinc-500">Coming soon</p>
              </div>
            </div>
            <button
              disabled
              className="relative w-12 h-7 rounded-full bg-zinc-700"
            >
              <span className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full" />
            </button>
          </div>

          {/* Auto-lock (placeholder) */}
          <div className="flex items-center justify-between p-4 opacity-50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                <Lock className="w-5 h-5 text-zinc-500" />
              </div>
              <div>
                <p className="font-medium text-white">Auto-Lock</p>
                <p className="text-sm text-zinc-500">Coming soon</p>
              </div>
            </div>
            <span className="text-sm text-zinc-600">5 minutes</span>
          </div>
        </Card>

        {/* Security tips */}
        <div className="mt-6 p-4 bg-zinc-900/50 rounded-xl">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-white">Security Tips</p>
              <ul className="text-xs text-zinc-400 mt-2 space-y-1">
                <li>• Never share your recovery phrase with anyone</li>
                <li>• Always verify the recipient address before sending</li>
                <li>• Keep your recovery phrase stored securely offline</li>
                <li>• Be careful of phishing attempts and fake websites</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
