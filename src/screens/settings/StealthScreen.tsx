import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopAppBar } from '../../components/navigation/TopAppBar';
import { useWalletStore } from '../../store/walletStore';
import { 
  generateStealthKeys,
  generateStealthAddress,
  formatMetaAddress,
  isValidStealthMetaAddress,
  type StealthKeys,
  type StealthAddress,
} from '../../lib/zk';
import { 
  Eye,
  EyeOff,
  Copy, 
  Check, 
  RefreshCw,
  Info,
  Send,
  QrCode,
  Shield,
  Sparkles,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';

export const StealthScreen: React.FC = () => {
  const navigate = useNavigate();
  const { publicKey } = useWalletStore();
  
  // Stealth keys state (would be persisted in real app)
  const [stealthKeys, setStealthKeys] = useState<StealthKeys | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [showViewingKey, setShowViewingKey] = useState(false);
  const [showSpendingKey, setShowSpendingKey] = useState(false);
  
  // Send to stealth address state
  const [recipientMetaAddress, setRecipientMetaAddress] = useState('');
  const [generatedAddress, setGeneratedAddress] = useState<StealthAddress | null>(null);
  const [isValidRecipient, setIsValidRecipient] = useState<boolean | null>(null);

  // Load stealth keys from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(`punkz-stealth-keys-${publicKey}`);
    if (saved) {
      try {
        setStealthKeys(JSON.parse(saved));
      } catch {
        // Invalid data, ignore
      }
    }
  }, [publicKey]);

  // Save stealth keys to localStorage
  const saveStealthKeys = (keys: StealthKeys) => {
    localStorage.setItem(`punkz-stealth-keys-${publicKey}`, JSON.stringify(keys));
    setStealthKeys(keys);
  };

  const handleGenerateKeys = () => {
    const keys = generateStealthKeys();
    saveStealthKeys(keys);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleRecipientChange = (value: string) => {
    setRecipientMetaAddress(value);
    setGeneratedAddress(null);
    if (value.length > 10) {
      setIsValidRecipient(isValidStealthMetaAddress(value));
    } else {
      setIsValidRecipient(null);
    }
  };

  const handleGenerateStealthAddress = () => {
    if (recipientMetaAddress && isValidRecipient) {
      const address = generateStealthAddress(recipientMetaAddress);
      setGeneratedAddress(address);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 pb-8">
      <TopAppBar title="Stealth Addresses" showBack onBack={() => navigate('/settings/privacy')} />

      <div className="max-w-lg mx-auto px-6 py-4 space-y-6">
        {/* Header Card */}
        <div className="p-4 bg-gradient-to-r from-purple-900/30 to-fuchsia-900/30 border border-purple-500/30 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-white font-medium">Stealth Addresses</p>
              <p className="text-slate-400 text-sm">Receive payments without linking to your identity</p>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-slate-300">
              <p className="mb-2">
                <strong className="text-white">How stealth addresses work:</strong>
              </p>
              <ol className="list-decimal list-inside space-y-1 text-slate-400">
                <li>You share your <span className="text-purple-400">stealth meta-address</span></li>
                <li>Sender generates a unique one-time address from it</li>
                <li>Only you can find and spend from that address</li>
                <li>No on-chain link between your identity and payments</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Your Stealth Meta-Address */}
        <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-purple-400" />
              <span className="text-white font-medium">Your Stealth Meta-Address</span>
            </div>
            {!stealthKeys && (
              <button
                onClick={handleGenerateKeys}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Generate
              </button>
            )}
          </div>

          {stealthKeys ? (
            <div className="space-y-4">
              {/* Meta Address */}
              <div>
                <p className="text-slate-500 text-xs mb-1">Share this to receive stealth payments</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs text-purple-400 font-mono bg-slate-800/50 px-3 py-2 rounded-lg break-all">
                    {stealthKeys.metaAddress.metaAddress}
                  </code>
                  <button
                    onClick={() => handleCopy(stealthKeys.metaAddress.metaAddress, 'meta')}
                    className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors flex-shrink-0"
                  >
                    {copied === 'meta' ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Spending Public Key */}
              <div>
                <p className="text-slate-500 text-xs mb-1">Spending Public Key</p>
                <code className="block text-xs text-cyan-400 font-mono bg-slate-800/50 px-3 py-2 rounded-lg truncate">
                  {stealthKeys.metaAddress.spendingPublicKey}
                </code>
              </div>

              {/* Viewing Public Key */}
              <div>
                <p className="text-slate-500 text-xs mb-1">Viewing Public Key</p>
                <code className="block text-xs text-fuchsia-400 font-mono bg-slate-800/50 px-3 py-2 rounded-lg truncate">
                  {stealthKeys.metaAddress.viewingPublicKey}
                </code>
              </div>

              {/* Private Keys (hidden by default) */}
              <div className="pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <p className="text-amber-400 text-xs font-medium">Private Keys (never share!)</p>
                </div>
                
                {/* Viewing Private Key */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-slate-500 text-xs">Viewing Private Key</p>
                    <button
                      onClick={() => setShowViewingKey(!showViewingKey)}
                      className="p-1 hover:bg-slate-800 rounded transition-colors"
                    >
                      {showViewingKey ? (
                        <EyeOff className="w-3 h-3 text-slate-500" />
                      ) : (
                        <Eye className="w-3 h-3 text-slate-500" />
                      )}
                    </button>
                  </div>
                  <code className={`block text-xs font-mono bg-slate-800/50 px-3 py-2 rounded-lg truncate ${
                    showViewingKey ? 'text-rose-400' : 'text-slate-600'
                  }`}>
                    {showViewingKey ? stealthKeys.viewingPrivateKey : '••••••••••••••••••••••••••••••••'}
                  </code>
                </div>

                {/* Spending Private Key */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-slate-500 text-xs">Spending Private Key</p>
                    <button
                      onClick={() => setShowSpendingKey(!showSpendingKey)}
                      className="p-1 hover:bg-slate-800 rounded transition-colors"
                    >
                      {showSpendingKey ? (
                        <EyeOff className="w-3 h-3 text-slate-500" />
                      ) : (
                        <Eye className="w-3 h-3 text-slate-500" />
                      )}
                    </button>
                  </div>
                  <code className={`block text-xs font-mono bg-slate-800/50 px-3 py-2 rounded-lg truncate ${
                    showSpendingKey ? 'text-rose-400' : 'text-slate-600'
                  }`}>
                    {showSpendingKey ? stealthKeys.spendingPrivateKey : '••••••••••••••••••••••••••••••••'}
                  </code>
                </div>
              </div>

              {/* Regenerate button */}
              <button
                onClick={handleGenerateKeys}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 text-slate-400 rounded-lg hover:bg-slate-700 hover:text-white transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate Keys
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">
                No stealth keys generated yet.<br />
                Click "Generate" to create your stealth meta-address.
              </p>
            </div>
          )}
        </div>

        {/* Send to Stealth Address */}
        <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Send className="w-5 h-5 text-cyan-400" />
            <span className="text-white font-medium">Send to Stealth Address</span>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-slate-500 text-xs mb-1">Recipient's Stealth Meta-Address</p>
              <textarea
                value={recipientMetaAddress}
                onChange={(e) => handleRecipientChange(e.target.value)}
                placeholder="st:ABC123...XYZ:DEF456...UVW"
                className={`w-full h-20 bg-slate-800/50 border rounded-lg px-3 py-2 text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:ring-2 resize-none ${
                  isValidRecipient === null 
                    ? 'border-slate-700 focus:ring-cyan-500/50' 
                    : isValidRecipient 
                    ? 'border-emerald-500/50 focus:ring-emerald-500/50' 
                    : 'border-rose-500/50 focus:ring-rose-500/50'
                }`}
              />
              {isValidRecipient === false && (
                <p className="text-rose-400 text-xs mt-1">Invalid stealth meta-address format</p>
              )}
            </div>

            <button
              onClick={handleGenerateStealthAddress}
              disabled={!isValidRecipient}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4" />
              Generate One-Time Address
            </button>

            {generatedAddress && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">One-Time Stealth Address Generated!</span>
                </div>
                
                <div>
                  <p className="text-slate-500 text-xs mb-1">Send funds to this address</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-sm text-emerald-400 font-mono bg-slate-800/50 px-3 py-2 rounded-lg truncate">
                      {generatedAddress.address}
                    </code>
                    <button
                      onClick={() => handleCopy(generatedAddress.address, 'stealth')}
                      className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors flex-shrink-0"
                    >
                      {copied === 'stealth' ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-slate-500 text-xs mb-1">Ephemeral Public Key (include in memo)</p>
                  <code className="block text-xs text-fuchsia-400 font-mono bg-slate-800/50 px-3 py-2 rounded-lg truncate">
                    {generatedAddress.ephemeralPublicKey}
                  </code>
                </div>

                <div className="flex items-center gap-2 pt-2 text-xs text-slate-500">
                  <Info className="w-4 h-4" />
                  <p>Only the recipient can spend from this address</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* How It Works Diagram */}
        <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl">
          <p className="text-white font-medium mb-4">How Stealth Addresses Work</p>
          
          <div className="space-y-4 text-sm">
            {/* Step 1 */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-purple-400 font-bold">1</span>
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Receiver shares meta-address</p>
                <p className="text-slate-500 text-xs mt-1">
                  st:SpendPubKey:ViewPubKey
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <ArrowRight className="w-4 h-4 text-slate-600" />
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-cyan-400 font-bold">2</span>
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Sender generates ephemeral key</p>
                <p className="text-slate-500 text-xs mt-1">
                  Random keypair for this transaction only
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <ArrowRight className="w-4 h-4 text-slate-600" />
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-fuchsia-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-fuchsia-400 font-bold">3</span>
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Compute shared secret</p>
                <p className="text-slate-500 text-xs mt-1">
                  S = Hash(ephemeral_priv || viewing_pub)
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <ArrowRight className="w-4 h-4 text-slate-600" />
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-emerald-400 font-bold">4</span>
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Derive stealth address</p>
                <p className="text-slate-500 text-xs mt-1">
                  Addr = Derive(S, spending_pub) — only receiver can spend
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StealthScreen;
