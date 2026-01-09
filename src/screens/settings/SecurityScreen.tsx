import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TopAppBar } from '../../components/navigation/TopAppBar';
import { Shield, Key, Fingerprint, Eye, ChevronRight } from 'lucide-react';

const securityOptions = [
  { icon: Key, label: 'View Recovery Phrase', description: 'Backup your wallet', path: '/settings/backup' },
  { icon: Fingerprint, label: 'Biometric Lock', description: 'Use fingerprint or face ID', disabled: true },
  { icon: Eye, label: 'Hide Balance', description: 'Hide balance on home screen', disabled: true },
];

export const SecurityScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950">
      <TopAppBar title="Security" showBack onBack={() => navigate('/settings')} />

      <div className="max-w-lg mx-auto px-6 py-4">
        {/* Header Card */}
        <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl mb-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-white font-medium">Wallet Protected</p>
            <p className="text-slate-500 text-sm">Your wallet is secured locally</p>
          </div>
        </div>

        {/* Options List */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
          {securityOptions.map((option, index) => (
            <button
              key={option.label}
              onClick={() => option.path && !option.disabled && navigate(option.path)}
              disabled={option.disabled}
              className={`w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors ${
                index !== securityOptions.length - 1 ? 'border-b border-slate-800' : ''
              } ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center gap-3">
                <option.icon className="w-5 h-5 text-fuchsia-400" />
                <div className="text-left">
                  <p className="text-white">{option.label}</p>
                  <p className="text-slate-500 text-sm">{option.description}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecurityScreen;
