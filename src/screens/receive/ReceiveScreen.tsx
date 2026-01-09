import React, { useState } from 'react';
import { useWalletStore } from '../../store/walletStore';
import { TopAppBar } from '../../components/navigation/TopAppBar';
import { BottomNavigation } from '../../components/navigation/BottomNavigation';
import { Card } from '../../components/ui/Card';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, Share2, Shield, Eye } from 'lucide-react';

interface AddressTypeOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  isShielded: boolean;
}

const addressTypes: AddressTypeOption[] = [
  {
    id: 'default',
    title: 'Default Address',
    description: 'Your main Solana address for receiving SOL and tokens',
    icon: <Shield className="w-5 h-5" />,
    isShielded: false,
  },
];

export const ReceiveScreen: React.FC = () => {
  const { publicKey } = useWalletStore();
  const [copied, setCopied] = useState(false);
  const [selectedType] = useState('default');

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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-zinc-900 via-zinc-950 to-black pb-20">
      <TopAppBar title="Receive SOL" showBack />

      <div className="flex-1 px-4 py-4">
        {/* QR Code Card */}
        <Card className="p-6 mb-4">
          <div className="flex flex-col items-center">
            {/* QR Code */}
            <div className="bg-white p-4 rounded-2xl mb-6">
              <QRCodeSVG
                value={publicKey || ''}
                size={180}
                level="H"
                includeMargin={false}
              />
            </div>

            {/* Address */}
            <div className="w-full">
              <p className="text-xs text-zinc-500 text-center mb-2">Your Address</p>
              <div className="flex items-center justify-center gap-2 p-3 bg-zinc-800 rounded-xl">
                <span className="text-sm text-white font-mono">
                  {publicKey ? formatAddress(publicKey) : '...'}
                </span>
                <button
                  onClick={handleCopy}
                  className="p-1.5 text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-zinc-700"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Full address (expandable) */}
            <details className="w-full mt-3">
              <summary className="flex items-center justify-center gap-1 text-xs text-violet-400 cursor-pointer hover:text-violet-300">
                <Eye className="w-3 h-3" />
                Show full address
              </summary>
              <p className="mt-2 p-3 bg-zinc-800 rounded-xl text-xs text-zinc-300 font-mono break-all">
                {publicKey}
              </p>
            </details>
          </div>
        </Card>

        {/* Action buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 p-3 bg-zinc-900 rounded-xl text-white hover:bg-zinc-800 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            <span className="text-sm font-medium">{copied ? 'Copied!' : 'Copy Address'}</span>
          </button>
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 p-3 bg-zinc-900 rounded-xl text-white hover:bg-zinc-800 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>

        {/* Info */}
        <div className="flex items-start gap-3 p-4 bg-zinc-900/50 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0">
            <Shield className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <p className="text-sm text-zinc-300 font-medium">Receive SOL & SPL Tokens</p>
            <p className="text-xs text-zinc-500 mt-1">
              Use this address to receive SOL and any SPL tokens on the Solana network.
            </p>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};
