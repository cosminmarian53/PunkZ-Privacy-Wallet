import { useState } from 'react';
import { useWalletStore } from '../../store/walletStore';
import { TopAppBar } from '../../components/navigation/TopAppBar';
import { BottomNavigation } from '../../components/navigation/BottomNavigation';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, Share2 } from 'lucide-react';

export const ReceiveScreen = () => {
  const { publicKey } = useWalletStore();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!publicKey) return;
    await navigator.clipboard.writeText(publicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!publicKey) return;
    if (navigator.share) {
      await navigator.share({
        title: 'My Solana Address',
        text: publicKey,
      });
    } else {
      handleCopy();
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 pb-24">
      <TopAppBar title="Receive SOL" showBack />

      <div className="max-w-lg mx-auto px-6 py-6">
        {/* QR Code Card */}
        <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl mb-6">
          <div className="flex flex-col items-center">
            {/* QR Code */}
            <div className="p-4 bg-white rounded-2xl mb-6">
              <QRCodeSVG
                value={publicKey || ''}
                size={200}
                level="H"
                includeMargin={false}
              />
            </div>

            {/* Address */}
            <p className="text-slate-400 text-sm mb-2">Your Wallet Address</p>
            <p className="text-white font-mono text-lg mb-6">
              {publicKey ? formatAddress(publicKey) : '...'}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-3 w-full">
              <button
                onClick={handleCopy}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5 text-slate-300" />
                    <span className="text-slate-300 font-medium">Copy</span>
                  </>
                )}
              </button>
              
              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-fuchsia-600 to-cyan-500 hover:from-fuchsia-500 hover:to-cyan-400 rounded-xl transition-colors"
              >
                <Share2 className="w-5 h-5 text-white" />
                <span className="text-white font-medium">Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl">
          <p className="text-slate-400 text-sm leading-relaxed">
            Use this address to receive SOL and any SPL tokens on the Solana network. 
            Make sure the sender is using the correct network.
          </p>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default ReceiveScreen;
