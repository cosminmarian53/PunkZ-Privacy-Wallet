import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TopAppBar } from '../../components/navigation/TopAppBar';
import { Globe, Check, Wifi, Server, Zap } from 'lucide-react';
import { useWalletStore } from '../../store/walletStore';

const networks = [
  { 
    id: 'mainnet-beta' as const, 
    name: 'Mainnet', 
    description: 'Production network',
    icon: Zap,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/20'
  },
  { 
    id: 'devnet' as const, 
    name: 'Devnet', 
    description: 'Development & testing',
    icon: Server,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/20'
  },
  { 
    id: 'testnet' as const, 
    name: 'Testnet', 
    description: 'Validator testing',
    icon: Wifi,
    color: 'text-fuchsia-400',
    bgColor: 'bg-fuchsia-500/20'
  },
];

export const NetworkScreen: React.FC = () => {
  const navigate = useNavigate();
  const { network, setNetwork, isSyncing } = useWalletStore();

  const handleNetworkChange = (newNetwork: 'mainnet-beta' | 'devnet' | 'testnet') => {
    if (newNetwork !== network) {
      // setNetwork already calls refreshBalance internally
      setNetwork(newNetwork);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950">
      <TopAppBar title="Network" showBack onBack={() => navigate('/settings')} />

      <div className="max-w-lg mx-auto px-6 py-4">
        {/* Header Card */}
        <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl mb-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-fuchsia-500/20 rounded-xl flex items-center justify-center">
            <Globe className="w-6 h-6 text-fuchsia-400" />
          </div>
          <div>
            <p className="text-white font-medium">Solana Network</p>
            <p className="text-slate-500 text-sm">Select your preferred network</p>
          </div>
        </div>

        {/* Network Options */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
          {networks.map((net, index) => (
            <button
              key={net.id}
              onClick={() => handleNetworkChange(net.id)}
              className={`w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-all duration-200 ${
                index !== networks.length - 1 ? 'border-b border-slate-800' : ''
              } ${network === net.id ? 'bg-slate-800/30' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${net.bgColor} rounded-xl flex items-center justify-center`}>
                  <net.icon className={`w-5 h-5 ${net.color}`} />
                </div>
                <div className="text-left">
                  <p className="text-white font-medium">{net.name}</p>
                  <p className="text-slate-500 text-sm">{net.description}</p>
                </div>
              </div>
              {network === net.id && (
                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Warning for Mainnet */}
        {network === 'mainnet-beta' && (
          <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl">
            <p className="text-amber-400 text-sm font-medium mb-1">⚠️ Real Assets</p>
            <p className="text-amber-300/70 text-sm">
              You're on mainnet. Transactions involve real SOL and tokens.
            </p>
          </div>
        )}

        {/* Info for Devnet */}
        {network === 'devnet' && (
          <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl">
            <p className="text-cyan-400 text-sm font-medium mb-1">🧪 Test Network</p>
            <p className="text-cyan-300/70 text-sm">
              Devnet uses test tokens. Get free SOL from the Solana faucet.
            </p>
          </div>
        )}

        {/* RPC Endpoint Info */}
        <div className="mt-6 p-4 bg-slate-900/50 border border-slate-800 rounded-2xl">
          <p className="text-slate-400 text-sm font-medium mb-2">RPC Endpoint</p>
          <code className="text-xs text-fuchsia-400 font-mono break-all">
            {network === 'mainnet-beta' 
              ? 'https://api.mainnet-beta.solana.com'
              : network === 'devnet'
              ? 'https://api.devnet.solana.com'
              : 'https://api.testnet.solana.com'
            }
          </code>
        </div>
      </div>
    </div>
  );
};

export default NetworkScreen;
