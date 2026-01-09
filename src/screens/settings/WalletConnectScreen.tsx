import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopAppBar } from '../../components/navigation/TopAppBar';
import { useWalletConnect } from '../../hooks/useWalletConnect';
import { useWalletStore } from '../../store/walletStore';
import { 
  Link2, 
  Unlink, 
  QrCode, 
  Loader2, 
  Globe, 
  CheckCircle2, 
  XCircle,
  AlertTriangle,
  ExternalLink,
  X
} from 'lucide-react';

export const WalletConnectScreen = () => {
  const navigate = useNavigate();
  const { publicKey } = useWalletStore();
  const {
    isInitialized,
    isConnecting,
    sessions,
    pendingProposal,
    pendingRequest,
    error,
    connect,
    approveSession,
    rejectSession,
    approveRequest,
    rejectRequest,
    disconnect,
  } = useWalletConnect();
  
  const [wcUri, setWcUri] = useState('');
  const [showUriInput, setShowUriInput] = useState(false);

  const handleConnect = async () => {
    if (!wcUri.trim()) return;
    await connect(wcUri.trim());
    setWcUri('');
    setShowUriInput(false);
  };

  const handleApproveSession = async () => {
    if (publicKey) {
      await approveSession(publicKey);
    }
  };

  const formatExpiry = (expiry: number) => {
    const date = new Date(expiry * 1000);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 pb-8">
      <TopAppBar 
        title="WalletConnect" 
        showBack 
        onBack={() => navigate('/settings')} 
      />

      <div className="max-w-lg mx-auto px-6 py-4 space-y-6">
        {/* Header Info */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 border border-cyan-500/20 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Link2 className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Connect to dApps</h3>
              <p className="text-slate-400 text-sm">
                Scan QR codes or paste WalletConnect URIs to connect your wallet to decentralized applications.
              </p>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
          <span className="text-slate-400">Status</span>
          <div className="flex items-center gap-2">
            {!isInitialized ? (
              <>
                <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                <span className="text-amber-400">Initializing...</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-emerald-400">Ready</span>
              </>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-rose-400 font-medium">Connection Error</p>
                <p className="text-rose-300/70 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Pending Session Proposal Modal */}
        {pendingProposal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden">
              <div className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center">
                    {pendingProposal.params.proposer.metadata.icons[0] ? (
                      <img 
                        src={pendingProposal.params.proposer.metadata.icons[0]} 
                        alt="" 
                        className="w-10 h-10 rounded-lg"
                      />
                    ) : (
                      <Globe className="w-8 h-8 text-cyan-400" />
                    )}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white text-center mb-2">
                  Connection Request
                </h3>
                <p className="text-slate-400 text-center mb-4">
                  <span className="text-cyan-400 font-medium">
                    {pendingProposal.params.proposer.metadata.name}
                  </span>
                  {' '}wants to connect to your wallet
                </p>
                <a 
                  href={pendingProposal.params.proposer.metadata.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1 text-slate-500 text-sm hover:text-cyan-400 mb-6"
                >
                  {pendingProposal.params.proposer.metadata.url}
                  <ExternalLink className="w-3 h-3" />
                </a>
                
                <div className="space-y-2 mb-6">
                  <div className="p-3 bg-slate-800/50 rounded-lg">
                    <p className="text-slate-400 text-sm mb-1">Permissions requested:</p>
                    <ul className="text-white text-sm space-y-1">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        View wallet address
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Request transaction signatures
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Request message signatures
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={rejectSession}
                    className="flex-1 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-700 transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={handleApproveSession}
                    className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-xl text-white font-medium hover:opacity-90 transition-opacity"
                  >
                    Approve
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pending Request Modal */}
        {pendingRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden">
              <div className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8 text-amber-400" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white text-center mb-2">
                  Signature Request
                </h3>
                <p className="text-slate-400 text-center mb-4">
                  A dApp is requesting a signature
                </p>
                
                <div className="p-4 bg-slate-800/50 rounded-lg mb-6">
                  <p className="text-slate-400 text-sm mb-2">Method:</p>
                  <code className="text-cyan-400 text-sm">
                    {pendingRequest.params.request.method}
                  </code>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={rejectRequest}
                    className="flex-1 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-700 transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => approveRequest({ signature: 'demo' })}
                    className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-xl text-white font-medium hover:opacity-90 transition-opacity"
                  >
                    Sign
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Connect Button */}
        <div className="space-y-3">
          {!showUriInput ? (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate('/scan')}
                disabled={!isInitialized}
                className="flex items-center justify-center gap-2 py-4 bg-slate-900/50 border border-slate-800 rounded-xl text-white hover:bg-slate-800/50 transition-colors disabled:opacity-50"
              >
                <QrCode className="w-5 h-5 text-cyan-400" />
                Scan QR
              </button>
              <button
                onClick={() => setShowUriInput(true)}
                disabled={!isInitialized}
                className="flex items-center justify-center gap-2 py-4 bg-slate-900/50 border border-slate-800 rounded-xl text-white hover:bg-slate-800/50 transition-colors disabled:opacity-50"
              >
                <Link2 className="w-5 h-5 text-fuchsia-400" />
                Paste URI
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={wcUri}
                  onChange={(e) => setWcUri(e.target.value)}
                  placeholder="wc:a1b2c3..."
                  className="w-full px-4 py-3 pr-10 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={() => {
                    setShowUriInput(false);
                    setWcUri('');
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleConnect}
                disabled={!wcUri.trim() || isConnecting}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-xl text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Connect'
                )}
              </button>
            </div>
          )}
        </div>

        {/* Active Sessions */}
        <div>
          <h3 className="text-white font-semibold mb-3">Active Connections</h3>
          {sessions.length === 0 ? (
            <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-xl text-center">
              <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Unlink className="w-6 h-6 text-slate-500" />
              </div>
              <p className="text-slate-400 text-sm">No active connections</p>
              <p className="text-slate-500 text-xs mt-1">
                Connect to a dApp to see it here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div 
                  key={session.topic}
                  className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0">
                        {session.peerMeta.icons[0] ? (
                          <img 
                            src={session.peerMeta.icons[0]} 
                            alt="" 
                            className="w-6 h-6 rounded"
                          />
                        ) : (
                          <Globe className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">{session.peerMeta.name}</p>
                        <p className="text-slate-500 text-sm truncate max-w-[180px]">
                          {session.peerMeta.url}
                        </p>
                        <p className="text-slate-600 text-xs mt-1">
                          Expires: {formatExpiry(session.expiry)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => disconnect(session.topic)}
                      className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Disconnect"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletConnectScreen;
