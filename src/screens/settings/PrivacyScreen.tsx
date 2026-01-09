import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopAppBar } from '../../components/navigation/TopAppBar';
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  CheckCircle, 
  Copy,
  Info,
  Zap,
  ChevronRight
} from 'lucide-react';
import { useWalletStore } from '../../store/walletStore';
import { formatCommitment } from '../../lib/zk';

export const PrivacyScreen: React.FC = () => {
  const navigate = useNavigate();
  const { 
    balance, 
    privacy, 
    balanceCommitment, 
    generateBalanceCommitment, 
    verifyBalanceCommitment,
    togglePrivacyMode 
  } = useWalletStore();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerateCommitment = async () => {
    setIsGenerating(true);
    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 500));
    generateBalanceCommitment();
    setIsGenerating(false);
    setVerificationResult(null);
  };

  const handleVerifyCommitment = async () => {
    if (!balanceCommitment) return;
    setIsVerifying(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    const result = verifyBalanceCommitment(
      balanceCommitment.commitment,
      balance,
      balanceCommitment.blindingFactor
    );
    setVerificationResult(result);
    setIsVerifying(false);
  };

  const copyCommitment = () => {
    if (balanceCommitment) {
      navigator.clipboard.writeText(balanceCommitment.commitment);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950">
      <TopAppBar title="ZK Privacy" showBack onBack={() => navigate('/settings')} />

      <div className="max-w-lg mx-auto px-6 py-4">
        {/* Header Card */}
        <div className="p-4 bg-gradient-to-r from-fuchsia-900/30 to-cyan-900/30 border border-fuchsia-500/30 rounded-2xl mb-6">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-fuchsia-500/20 rounded-xl flex items-center justify-center neon-box-pink">
              <Shield className="w-6 h-6 text-fuchsia-400" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Zero-Knowledge Privacy</h2>
              <p className="text-slate-400 text-sm">Cryptographic balance protection</p>
            </div>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Use Pedersen commitments to prove balance ownership without revealing the actual amount.
          </p>
        </div>

        {/* Privacy Mode Toggle */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {privacy.hideBalanceEnabled ? (
                <EyeOff className="w-5 h-5 text-fuchsia-400" />
              ) : (
                <Eye className="w-5 h-5 text-cyan-400" />
              )}
              <div>
                <p className="text-white font-medium">Privacy Mode</p>
                <p className="text-slate-500 text-sm">
                  {privacy.hideBalanceEnabled ? 'Balance hidden' : 'Balance visible'}
                </p>
              </div>
            </div>
            <button
              onClick={togglePrivacyMode}
              className={`w-14 h-8 rounded-full transition-all duration-300 ${
                privacy.hideBalanceEnabled 
                  ? 'bg-fuchsia-500 shadow-lg shadow-fuchsia-500/50' 
                  : 'bg-slate-700'
              }`}
            >
              <div className={`w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
                privacy.hideBalanceEnabled ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>

        {/* Commitment Section */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden mb-6">
          <div className="p-4 border-b border-slate-800">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-cyan-400" />
              <h3 className="text-white font-medium">Balance Commitment</h3>
            </div>
            <p className="text-slate-500 text-sm">
              A cryptographic proof of your balance
            </p>
          </div>

          {balanceCommitment ? (
            <div className="p-4">
              {/* Commitment Hash */}
              <div className="mb-4">
                <p className="text-slate-400 text-xs mb-1">Commitment (Public)</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs text-fuchsia-400 font-mono bg-slate-800/50 p-2 rounded-lg break-all">
                    {formatCommitment(balanceCommitment.commitment)}
                  </code>
                  <button 
                    onClick={copyCommitment}
                    className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    {copied ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Blinding Factor (Secret) */}
              <div className="mb-4">
                <p className="text-slate-400 text-xs mb-1">Blinding Factor (Secret - Keep Safe!)</p>
                <div className="relative">
                  <code className="block text-xs text-amber-400 font-mono bg-amber-900/20 border border-amber-500/30 p-2 rounded-lg break-all blur-sm hover:blur-none transition-all duration-300 cursor-pointer">
                    {formatCommitment(balanceCommitment.blindingFactor)}
                  </code>
                  <p className="absolute inset-0 flex items-center justify-center text-amber-400 text-xs pointer-events-none hover:opacity-0 transition-opacity">
                    Hover to reveal
                  </p>
                </div>
              </div>

              {/* Timestamp */}
              <p className="text-slate-500 text-xs">
                Generated: {new Date(balanceCommitment.timestamp).toLocaleString()}
              </p>

              {/* Verify Button */}
              <button
                onClick={handleVerifyCommitment}
                disabled={isVerifying}
                className="w-full mt-4 py-3 bg-cyan-500/20 border border-cyan-500/50 rounded-xl text-cyan-400 font-medium hover:bg-cyan-500/30 transition-all duration-300 flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                Verify Commitment
              </button>

              {/* Verification Result */}
              {verificationResult !== null && (
                <div className={`mt-4 p-3 rounded-xl flex items-center gap-2 ${
                  verificationResult 
                    ? 'bg-emerald-500/20 border border-emerald-500/50' 
                    : 'bg-red-500/20 border border-red-500/50'
                }`}>
                  {verificationResult ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                      <span className="text-emerald-400 text-sm">✓ Commitment verified! Balance matches.</span>
                    </>
                  ) : (
                    <>
                      <Info className="w-5 h-5 text-red-400" />
                      <span className="text-red-400 text-sm">✗ Verification failed. Balance may have changed.</span>
                    </>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-slate-600" />
              </div>
              <p className="text-slate-400 mb-4">No commitment generated yet</p>
            </div>
          )}

          {/* Generate Button */}
          <div className="p-4 border-t border-slate-800">
            <button
              onClick={handleGenerateCommitment}
              disabled={isGenerating}
              className="w-full py-3 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-xl text-white font-bold hover:shadow-lg hover:shadow-fuchsia-500/30 transition-all duration-300 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Zap className="w-4 h-4" />
              )}
              {balanceCommitment ? 'Regenerate Commitment' : 'Generate Commitment'}
            </button>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-cyan-400" />
            <h3 className="text-white font-medium">How It Works</h3>
          </div>
          <div className="space-y-3 text-sm text-slate-400">
            <p>
              <span className="text-fuchsia-400 font-mono">1.</span> A <strong className="text-white">Pedersen commitment</strong> is created: 
              C = g<sup>balance</sup> × h<sup>random</sup>
            </p>
            <p>
              <span className="text-fuchsia-400 font-mono">2.</span> The commitment hides your balance but binds you to it cryptographically.
            </p>
            <p>
              <span className="text-fuchsia-400 font-mono">3.</span> You can prove ownership without revealing the actual amount.
            </p>
            <p>
              <span className="text-fuchsia-400 font-mono">4.</span> The blinding factor must stay secret — never share it!
            </p>
          </div>
        </div>

        {/* Stealth Addresses Link */}
        <button
          onClick={() => navigate('/settings/stealth')}
          className="w-full bg-gradient-to-r from-purple-900/30 to-fuchsia-900/30 border border-purple-500/30 rounded-2xl p-4 flex items-center justify-between hover:from-purple-900/40 hover:to-fuchsia-900/40 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Eye className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-left">
              <p className="text-white font-medium">Stealth Addresses</p>
              <p className="text-slate-500 text-sm">Receive payments privately</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-purple-400 transition-colors" />
        </button>
      </div>
    </div>
  );
};

export default PrivacyScreen;
