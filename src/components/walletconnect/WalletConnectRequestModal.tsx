import { useEffect, useState, useMemo } from 'react';
import { useWalletConnect } from '../../hooks/useWalletConnect';
import { useWalletStore } from '../../store/walletStore';
import { 
  AlertTriangle, 
  X, 
  PenTool, 
  Send, 
  FileText, 
  Globe,
  Coins,
  ArrowRight,
  Shield,
  Info
} from 'lucide-react';
import bs58 from 'bs58';
import { 
  Transaction, 
  VersionedTransaction, 
  SystemProgram,
  LAMPORTS_PER_SOL,
  TransactionInstruction
} from '@solana/web3.js';

interface TransactionDetails {
  type: 'transfer' | 'program_call' | 'unknown';
  amount?: number;
  destination?: string;
  programId?: string;
  programName?: string;
  instructionCount: number;
  feePayer?: string;
  instructions: InstructionInfo[];
}

interface InstructionInfo {
  programId: string;
  programName: string;
  accounts: string[];
}

// Known program IDs for better UX
const KNOWN_PROGRAMS: Record<string, string> = {
  '11111111111111111111111111111111': 'System Program',
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA': 'Token Program',
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL': 'Associated Token Program',
  'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4': 'Jupiter Aggregator',
  'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc': 'Orca Whirlpools',
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s': 'Metaplex Metadata',
  'LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo': 'Meteora DLMM',
  'Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB': 'Meteora Pools',
  'MERLuDFBMmsHnsBPZw2sDQZHvXFMwp8EdjudcU2HKky': 'Mercurial',
  'srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX': 'Serum DEX',
  'PhoeNiXZ8ByJGLkxNfZRnkUfjvmuYqLR89jjFHGqdXY': 'Phoenix',
  'CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK': 'Raydium CLMM',
  '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8': 'Raydium AMM',
  'ComputeBudget111111111111111111111111111111': 'Compute Budget',
};

/**
 * Global WalletConnect Request Modal
 * 
 * Shows detailed information about what's being signed including:
 * - dApp name and icon
 * - Transaction type and details
 * - Amounts and destinations
 * - Program calls
 */
export const WalletConnectRequestModal = () => {
  const { publicKey, network } = useWalletStore();
  const {
    isInitialized,
    pendingRequest,
    approveRequest,
    rejectRequest,
    initialize,
    sessions,
  } = useWalletConnect();
  
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize WalletConnect when wallet is available
  useEffect(() => {
    if (publicKey && !isInitialized) {
      initialize();
    }
  }, [publicKey, isInitialized, initialize]);

  // Get dApp metadata from session
  const dAppInfo = useMemo(() => {
    if (!pendingRequest) return null;
    
    const session = sessions.find(s => s.topic === pendingRequest.topic);
    if (session) {
      return {
        name: session.peerMeta.name,
        url: session.peerMeta.url,
        icon: session.peerMeta.icons[0],
      };
    }
    return null;
  }, [pendingRequest, sessions]);

  // Parse transaction details
  const txDetails = useMemo((): TransactionDetails | null => {
    if (!pendingRequest) return null;
    
    const request = pendingRequest.params.request;
    const method = request.method;
    
    if (method === 'solana_signMessage') {
      return null; // Messages don't have transaction details
    }
    
    const serializedTx = request.params?.transaction;
    if (!serializedTx) return null;
    
    try {
      return parseTransaction(serializedTx, publicKey || '');
    } catch (e) {
      console.error('[WC] Failed to parse transaction:', e);
      return {
        type: 'unknown',
        instructionCount: 0,
        instructions: [],
      };
    }
  }, [pendingRequest, publicKey]);

  // Don't render anything if there's no pending request
  if (!pendingRequest) return null;

  const request = pendingRequest.params.request;
  const method = request.method;

  const getMethodInfo = () => {
    switch (method) {
      case 'solana_signMessage':
        return {
          icon: PenTool,
          title: 'Sign Message',
          description: 'Prove wallet ownership - no funds at risk',
          color: 'text-cyan-400',
          bgColor: 'bg-cyan-500/20',
          warning: false,
        };
      case 'solana_signTransaction':
        return {
          icon: FileText,
          title: 'Sign Transaction',
          description: 'Approve blockchain transaction',
          color: 'text-amber-400',
          bgColor: 'bg-amber-500/20',
          warning: true,
        };
      case 'solana_signAndSendTransaction':
        return {
          icon: Send,
          title: 'Sign & Send',
          description: 'Sign and broadcast immediately',
          color: 'text-fuchsia-400',
          bgColor: 'bg-fuchsia-500/20',
          warning: true,
        };
      default:
        return {
          icon: AlertTriangle,
          title: 'Unknown Request',
          description: method,
          color: 'text-amber-400',
          bgColor: 'bg-amber-500/20',
          warning: true,
        };
    }
  };

  const methodInfo = getMethodInfo();
  const IconComponent = methodInfo.icon;

  const handleSign = async () => {
    setIsProcessing(true);
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
        const message = request.params?.message;
        if (!message) throw new Error('No message to sign');
        
        const messageBytes = bs58.decode(message);
        const signature = await signMessage(keypair, messageBytes);
        result = { signature: bs58.encode(signature) };
        
      } else if (method === 'solana_signTransaction') {
        const transaction = request.params?.transaction;
        if (!transaction) throw new Error('No transaction to sign');
        
        const signedTx = await signTransaction(keypair, transaction);
        result = { transaction: signedTx };
        
      } else if (method === 'solana_signAndSendTransaction') {
        const transaction = request.params?.transaction;
        if (!transaction) throw new Error('No transaction to sign');
        
        const signedTx = await signTransaction(keypair, transaction);
        result = { signature: signedTx };
      }

      await approveRequest(result);
    } catch (error) {
      console.error('[WC Request] Signing error:', error);
      await rejectRequest();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    setIsProcessing(true);
    try {
      await rejectRequest();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header with dApp Info */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {dAppInfo?.icon ? (
              <img 
                src={dAppInfo.icon} 
                alt="" 
                className="w-10 h-10 rounded-xl bg-slate-800"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                <Globe className="w-5 h-5 text-slate-400" />
              </div>
            )}
            <div>
              <h2 className="text-white font-semibold">
                {dAppInfo?.name || 'Unknown dApp'}
              </h2>
              {dAppInfo?.url && (
                <p className="text-slate-500 text-xs truncate max-w-[200px]">
                  {(() => { try { return new URL(dAppInfo.url).hostname; } catch { return dAppInfo.url; } })()}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleReject}
            disabled={isProcessing}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Request Type Banner */}
        <div className={`p-4 ${methodInfo.bgColor} border-b border-slate-800`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-900/50 rounded-xl flex items-center justify-center">
              <IconComponent className={`w-6 h-6 ${methodInfo.color}`} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{methodInfo.title}</h3>
              <p className="text-slate-300 text-sm">{methodInfo.description}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Warning Banner for Transactions */}
          {methodInfo.warning && (
            <div className="flex items-start gap-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-amber-200 text-sm">
                Review carefully. This action may transfer funds or modify your accounts.
              </p>
            </div>
          )}

          {/* Message Content (for sign message) */}
          {method === 'solana_signMessage' && request.params?.message && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Info className="w-4 h-4" />
                <span>Message to Sign</span>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <p className="text-white font-mono text-sm break-all whitespace-pre-wrap">
                  {tryDecodeMessage(request.params.message)}
                </p>
              </div>
            </div>
          )}

          {/* Transaction Details */}
          {txDetails && (
            <div className="space-y-4">
              {/* Transfer Amount */}
              {txDetails.type === 'transfer' && txDetails.amount !== undefined && (
                <div className="p-4 bg-gradient-to-r from-fuchsia-500/10 to-cyan-500/10 border border-fuchsia-500/30 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-slate-400 text-sm">Amount</span>
                    <div className="flex items-center gap-2">
                      <Coins className="w-5 h-5 text-fuchsia-400" />
                      <span className="text-2xl font-bold text-white">
                        {txDetails.amount.toFixed(6)} SOL
                      </span>
                    </div>
                  </div>
                  {txDetails.destination && (
                    <div className="flex items-center gap-2 text-sm">
                      <ArrowRight className="w-4 h-4 text-cyan-400" />
                      <span className="text-slate-400">To:</span>
                      <code className="text-cyan-400 font-mono text-xs">
                        {txDetails.destination.slice(0, 8)}...{txDetails.destination.slice(-8)}
                      </code>
                    </div>
                  )}
                </div>
              )}

              {/* Program Calls */}
              {txDetails.instructions.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Shield className="w-4 h-4" />
                    <span>Programs Called ({txDetails.instructionCount})</span>
                  </div>
                  <div className="space-y-2">
                    {txDetails.instructions.slice(0, 5).map((ix, i) => (
                      <div 
                        key={i}
                        className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-slate-300 font-mono text-sm">
                            {i + 1}
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">
                              {ix.programName}
                            </p>
                            <code className="text-slate-500 text-xs font-mono">
                              {ix.programId.slice(0, 8)}...{ix.programId.slice(-4)}
                            </code>
                          </div>
                        </div>
                        <div className="text-slate-500 text-xs">
                          {ix.accounts.length} accounts
                        </div>
                      </div>
                    ))}
                    {txDetails.instructions.length > 5 && (
                      <p className="text-slate-500 text-sm text-center py-2">
                        +{txDetails.instructions.length - 5} more instructions
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Network Badge */}
              <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl">
                <span className="text-slate-400 text-sm">Network</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  network === 'mainnet-beta' 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {network === 'mainnet-beta' ? 'Mainnet' : network.charAt(0).toUpperCase() + network.slice(1)}
                </span>
              </div>
            </div>
          )}

          {/* Raw Details Toggle */}
          <details className="group">
            <summary className="text-slate-500 text-xs cursor-pointer hover:text-slate-300 transition-colors">
              Show raw request data
            </summary>
            <div className="mt-2 p-3 bg-slate-800/30 rounded-lg max-h-40 overflow-y-auto">
              <pre className="text-xs text-slate-400 font-mono whitespace-pre-wrap break-all">
                {JSON.stringify(request.params, null, 2)}
              </pre>
            </div>
          </details>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 sticky bottom-0">
          <div className="flex gap-3">
            <button
              onClick={handleReject}
              disabled={isProcessing}
              className="flex-1 py-3.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-700 transition-colors font-medium disabled:opacity-50"
            >
              Reject
            </button>
            <button
              onClick={handleSign}
              disabled={isProcessing}
              className="flex-1 py-3.5 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-xl text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                'Approve'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Parse a serialized transaction to extract details
function parseTransaction(serializedTx: string, walletPubkey: string): TransactionDetails {
  let txBytes: Uint8Array;
  
  try {
    txBytes = bs58.decode(serializedTx);
  } catch {
    txBytes = Uint8Array.from(atob(serializedTx), c => c.charCodeAt(0));
  }
  
  let instructions: TransactionInstruction[] = [];
  let feePayer: string | undefined;
  
  try {
    // Try versioned transaction
    const vtx = VersionedTransaction.deserialize(txBytes);
    const message = vtx.message;
    feePayer = message.staticAccountKeys[0]?.toBase58();
    
    // Extract instructions from versioned tx
    const accountKeys = message.staticAccountKeys;
    instructions = message.compiledInstructions.map(ix => ({
      programId: accountKeys[ix.programIdIndex],
      keys: ix.accountKeyIndexes.map(idx => ({
        pubkey: accountKeys[idx],
        isSigner: false,
        isWritable: false,
      })),
      data: Buffer.from(ix.data),
    }));
  } catch {
    // Fall back to legacy transaction
    try {
      const tx = Transaction.from(txBytes);
      feePayer = tx.feePayer?.toBase58();
      instructions = tx.instructions;
    } catch (e) {
      console.error('[WC] Could not parse transaction:', e);
      return {
        type: 'unknown',
        instructionCount: 0,
        instructions: [],
      };
    }
  }
  
  // Analyze instructions
  const parsedInstructions: InstructionInfo[] = instructions.map(ix => {
    const programId = ix.programId.toBase58();
    return {
      programId,
      programName: KNOWN_PROGRAMS[programId] || 'Unknown Program',
      accounts: ix.keys.map(k => k.pubkey.toBase58()),
    };
  });
  
  // Check for SOL transfer
  let type: 'transfer' | 'program_call' | 'unknown' = 'unknown';
  let amount: number | undefined;
  let destination: string | undefined;
  
  // Look for System Program transfer
  for (const ix of instructions) {
    if (ix.programId.equals(SystemProgram.programId)) {
      // System program instruction - could be transfer
      if (ix.data.length >= 12) {
        try {
          const dataView = new DataView(ix.data.buffer, ix.data.byteOffset, ix.data.length);
          const instructionType = dataView.getUint32(0, true);
          if (instructionType === 2) { // Transfer instruction
            type = 'transfer';
            amount = Number(dataView.getBigUint64(4, true)) / LAMPORTS_PER_SOL;
            destination = ix.keys[1]?.pubkey.toBase58();
          }
        } catch (e) {
          console.error('[WC] Could not parse transfer amount:', e);
        }
      }
    }
  }
  
  if (type === 'unknown' && parsedInstructions.length > 0) {
    type = 'program_call';
  }
  
  return {
    type,
    amount,
    destination,
    instructionCount: parsedInstructions.length,
    feePayer,
    instructions: parsedInstructions,
  };
}

// Helper function to sign a message using Ed25519
async function signMessage(keypair: { secretKey: Uint8Array }, message: Uint8Array): Promise<Uint8Array> {
  const nacl = await import('tweetnacl');
  return nacl.sign.detached(message, keypair.secretKey);
}

// Helper function to sign a transaction
async function signTransaction(
  keypair: { secretKey: Uint8Array; publicKey: { toBytes: () => Uint8Array } },
  serializedTransaction: string
): Promise<string> {
  let txBytes: Uint8Array;
  try {
    txBytes = bs58.decode(serializedTransaction);
  } catch {
    txBytes = Uint8Array.from(atob(serializedTransaction), c => c.charCodeAt(0));
  }
  
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
}

// Try to decode a base58 message to UTF-8 for display
function tryDecodeMessage(message: string): string {
  try {
    const bytes = bs58.decode(message);
    const decoded = new TextDecoder().decode(bytes);
    // Check if it's readable text
    if (/^[\x20-\x7E\s\n\r\t]+$/.test(decoded)) {
      return decoded;
    }
    // Return truncated base58 if not readable
    if (message.length > 100) {
      return message.slice(0, 50) + '...' + message.slice(-50);
    }
    return message;
  } catch {
    if (message.length > 100) {
      return message.slice(0, 50) + '...' + message.slice(-50);
    }
    return message;
  }
}

export default WalletConnectRequestModal;
