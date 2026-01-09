import { useEffect } from 'react';
import { useWalletConnect } from '../../hooks/useWalletConnect';
import { useWalletStore } from '../../store/walletStore';
import { AlertTriangle, Loader2, X, PenTool, Send, FileText } from 'lucide-react';
import bs58 from 'bs58';
import { Transaction, VersionedTransaction } from '@solana/web3.js';

/**
 * Global WalletConnect Request Modal
 * 
 * This component should be mounted at the root level of the app
 * to catch incoming signing requests from connected dApps regardless
 * of which screen the user is currently on.
 */
export const WalletConnectRequestModal = () => {
  const { publicKey } = useWalletStore();
  const {
    isInitialized,
    pendingRequest,
    approveRequest,
    rejectRequest,
    initialize,
  } = useWalletConnect();

  // Initialize WalletConnect when wallet is available
  useEffect(() => {
    if (publicKey && !isInitialized) {
      initialize();
    }
  }, [publicKey, isInitialized, initialize]);

  // Don't render anything if there's no pending request
  if (!pendingRequest) return null;

  const request = pendingRequest.params.request;
  const method = request.method;
  
  // Get dApp metadata from session if available
  const dAppName = 'Connected dApp';

  const getMethodInfo = () => {
    switch (method) {
      case 'solana_signMessage':
        return {
          icon: PenTool,
          title: 'Sign Message',
          description: 'A dApp is requesting you to sign a message',
          color: 'text-cyan-400',
          bgColor: 'bg-cyan-500/20',
        };
      case 'solana_signTransaction':
        return {
          icon: FileText,
          title: 'Sign Transaction',
          description: 'A dApp is requesting you to sign a transaction',
          color: 'text-amber-400',
          bgColor: 'bg-amber-500/20',
        };
      case 'solana_signAndSendTransaction':
        return {
          icon: Send,
          title: 'Sign & Send Transaction',
          description: 'A dApp is requesting you to sign and send a transaction',
          color: 'text-fuchsia-400',
          bgColor: 'bg-fuchsia-500/20',
        };
      default:
        return {
          icon: AlertTriangle,
          title: 'Unknown Request',
          description: `Method: ${method}`,
          color: 'text-amber-400',
          bgColor: 'bg-amber-500/20',
        };
    }
  };

  const methodInfo = getMethodInfo();
  const IconComponent = methodInfo.icon;

  const handleSign = async () => {
    try {
      const { getKeypair } = useWalletStore.getState();
      const keypair = getKeypair();
      
      if (!keypair) {
        console.error('[WC Request] No keypair available');
        await rejectRequest();
        return;
      }

      let result: unknown;

      if (method === 'solana_signMessage') {
        // Sign a message
        const message = request.params?.message;
        if (!message) {
          throw new Error('No message to sign');
        }
        
        // Message is base58 encoded
        const messageBytes = bs58.decode(message);
        const signature = await signMessage(keypair, messageBytes);
        result = { signature: bs58.encode(signature) };
        
      } else if (method === 'solana_signTransaction') {
        // Sign a transaction
        const transaction = request.params?.transaction;
        if (!transaction) {
          throw new Error('No transaction to sign');
        }
        
        const signedTx = await signTransaction(keypair, transaction);
        result = { transaction: signedTx };
        
      } else if (method === 'solana_signAndSendTransaction') {
        // Sign and send a transaction
        const transaction = request.params?.transaction;
        if (!transaction) {
          throw new Error('No transaction to sign');
        }
        
        // For now, just sign it - actual sending would require RPC call
        const signedTx = await signTransaction(keypair, transaction);
        result = { signature: signedTx };
      }

      await approveRequest(result);
    } catch (error) {
      console.error('[WC Request] Signing error:', error);
      await rejectRequest();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">Signature Request</h2>
          <button
            onClick={rejectRequest}
            className="p-1 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 ${methodInfo.bgColor} rounded-2xl flex items-center justify-center`}>
              <IconComponent className={`w-8 h-8 ${methodInfo.color}`} />
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-white text-center mb-2">
            {methodInfo.title}
          </h3>
          <p className="text-slate-400 text-center mb-6">
            {methodInfo.description}
          </p>
          
          {/* Method Details */}
          <div className="p-4 bg-slate-800/50 rounded-xl mb-6 space-y-3">
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Method</p>
              <code className="text-cyan-400 text-sm font-mono">{method}</code>
            </div>
            
            {request.params?.message && (
              <div>
                <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Message</p>
                <p className="text-slate-300 text-sm break-all font-mono">
                  {tryDecodeMessage(request.params.message)}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={rejectRequest}
              className="flex-1 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-700 transition-colors font-medium"
            >
              Reject
            </button>
            <button
              onClick={handleSign}
              className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-xl text-white font-medium hover:opacity-90 transition-opacity"
            >
              Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to sign a message using Ed25519
async function signMessage(keypair: { secretKey: Uint8Array }, message: Uint8Array): Promise<Uint8Array> {
  // Use nacl for ed25519 signing
  const nacl = await import('tweetnacl');
  return nacl.sign.detached(message, keypair.secretKey);
}

// Helper function to sign a transaction
async function signTransaction(
  keypair: { secretKey: Uint8Array; publicKey: { toBytes: () => Uint8Array } },
  serializedTransaction: string
): Promise<string> {
  const nacl = await import('tweetnacl');
  
  try {
    // Try to deserialize as base58 first
    const txBytes = bs58.decode(serializedTransaction);
    
    // Try versioned transaction first
    try {
      const tx = VersionedTransaction.deserialize(txBytes);
      tx.sign([{ secretKey: keypair.secretKey, publicKey: keypair.publicKey } as any]);
      return bs58.encode(tx.serialize());
    } catch {
      // Fall back to legacy transaction
      const tx = Transaction.from(txBytes);
      tx.partialSign({ secretKey: keypair.secretKey, publicKey: keypair.publicKey } as any);
      return bs58.encode(tx.serialize());
    }
  } catch (e) {
    // If base58 decode fails, try base64
    const txBytes = Uint8Array.from(atob(serializedTransaction), c => c.charCodeAt(0));
    
    try {
      const tx = VersionedTransaction.deserialize(txBytes);
      tx.sign([{ secretKey: keypair.secretKey, publicKey: keypair.publicKey } as any]);
      return bs58.encode(tx.serialize());
    } catch {
      const tx = Transaction.from(txBytes);
      tx.partialSign({ secretKey: keypair.secretKey, publicKey: keypair.publicKey } as any);
      return bs58.encode(tx.serialize());
    }
  }
}

// Try to decode a base58 message to UTF-8 for display
function tryDecodeMessage(message: string): string {
  try {
    const bytes = bs58.decode(message);
    const decoded = new TextDecoder().decode(bytes);
    // Check if it's readable text
    if (/^[\x20-\x7E\s]+$/.test(decoded)) {
      return decoded;
    }
    return message.slice(0, 40) + (message.length > 40 ? '...' : '');
  } catch {
    return message.slice(0, 40) + (message.length > 40 ? '...' : '');
  }
}

export default WalletConnectRequestModal;
