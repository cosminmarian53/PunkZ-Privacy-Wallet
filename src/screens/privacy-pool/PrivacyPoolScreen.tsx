import { useState, useEffect, useCallback } from 'react';
import { useWalletStore } from '../../store/walletStore';
import { Connection, PublicKey } from '@solana/web3.js';
import {
  generateNote,
  deposit,
  withdraw,
  fetchPoolInfo,
  type VaultNote,
  type PoolInfo,
} from '../../lib/zk-vault';
import { TopAppBar } from '../../components/navigation/TopAppBar';
import { BottomNavigation } from '../../components/navigation/BottomNavigation';
import {
  Copy,
  AlertTriangle,
  Shield,
  ArrowDownToLine,
  ArrowUpFromLine,
  FileText,
  Trash2,
  Check,
  Info,
  Zap,
  ChevronDown,
} from 'lucide-react';

// ============================================================================
// Denomination Tiers (in SOL)
// ============================================================================
const DENOMINATION_TIERS = [
  { label: '0.1 SOL', sol: 0.1, lamports: 100_000_000 },
  { label: '1 SOL', sol: 1, lamports: 1_000_000_000 },
  { label: '10 SOL', sol: 10, lamports: 10_000_000_000 },
];

// Pre-deployed devnet pool instances per denomination
const DEVNET_INSTANCES: Record<number, string> = {
  0.1: 'CcJ7XVqdhRFebgwmyVzHBA2SVXsr1cgvrLSUdZJ9WMwJ',
  1: 'xzUDHgBCrKPzS78xJkLVRSyEXkPegVjZ72v9u2ebuCq',
  10: '8HLuWprbdYXMTdgfeKynHH3zivt1QYiAbiacYRF6wZX8',
};

const RPC_ENDPOINTS: Record<string, string> = {
  'mainnet-beta': 'https://api.mainnet-beta.solana.com',
  'devnet': 'https://api.devnet.solana.com',
  'testnet': 'https://api.testnet.solana.com',
};

type Tab = 'deposit' | 'withdraw' | 'notes';

// ============================================================================
// Main Component
// ============================================================================
const PrivacyPoolScreen = () => {
  const { network, getKeypair, balance, vaultNotes, saveVaultNote, removeVaultNote, updateVaultNoteStatus } = useWalletStore();
  const connection = new Connection(RPC_ENDPOINTS[network], 'confirmed');
  const keypair = getKeypair();

  // Tab state
  const [activeTab, setActiveTab] = useState<Tab>('deposit');

  // Pool state
  const [_poolInfo, setPoolInfo] = useState<PoolInfo | null>(null);
  const [_isLoadingPool, setIsLoadingPool] = useState(false);

  // Deposit state
  const [note, setNote] = useState('');
  const [commitment, setCommitment] = useState<Buffer | null>(null);
  const [selectedDenom, setSelectedDenom] = useState(0); // index 0 = 0.1 SOL
  const [showDenomDropdown, setShowDenomDropdown] = useState(false);
  
  // Derived active instance from selection and network
  const instanceAddress = network === 'devnet' 
    ? DEVNET_INSTANCES[DENOMINATION_TIERS[selectedDenom].sol] 
    : '';

  // Withdraw state
  const [withdrawNote, setWithdrawNote] = useState('');
  const [recipient, setRecipient] = useState('');

  // Shared state
  const [isLoading, setIsLoading] = useState(false);
  const [txSignature, setTxSignature] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Transaction confirmation modal (W009 — Solana Dev Skill safety guardrail)
  const [pendingTx, setPendingTx] = useState<{
    type: 'deposit' | 'withdraw';
    amount: string;
    feePayer: string;
    recipient?: string;
    poolAddress: string;
    cluster: string;
  } | null>(null);

  // ============================================================================
  // Pool Info Loading
  // ============================================================================
  const loadPoolInfo = useCallback(async () => {
    if (!instanceAddress) return;
    setIsLoadingPool(true);
    try {
      const pubkey = new PublicKey(instanceAddress);
      const info = await fetchPoolInfo(connection, pubkey);
      setPoolInfo(info);
    } catch {
      setPoolInfo(null);
    } finally {
      setIsLoadingPool(false);
    }
  }, [instanceAddress, network]);

  useEffect(() => {
    if (instanceAddress) {
      loadPoolInfo();
    }
  }, [instanceAddress, loadPoolInfo]);

  // ============================================================================
  // Handlers
  // ============================================================================
  const handleGenerateNote = () => {
    const { note: newNote, commitment: newCommitment } = generateNote();
    setNote(newNote);
    setCommitment(newCommitment);
    setError('');
    setTxSignature('');
  };

  // Show confirmation modal before deposit
  const handleDepositRequest = () => {
    if (!commitment || !keypair || !instanceAddress) {
      setError('Please generate a note first, enter a pool address, and connect your wallet.');
      return;
    }
    setError('');
    setTxSignature('');
    setPendingTx({
      type: 'deposit',
      amount: DENOMINATION_TIERS[selectedDenom].label,
      feePayer: keypair.publicKey.toBase58(),
      poolAddress: instanceAddress,
      cluster: network,
    });
  };

  const executeDeposit = async () => {
    if (!commitment || !keypair || !instanceAddress) return;
    setPendingTx(null);
    setIsLoading(true);
    setError('');
    setTxSignature('');
    try {
      const instancePubkey = new PublicKey(instanceAddress);
      const denom = DENOMINATION_TIERS[selectedDenom];
      const signature = await deposit(connection, keypair, instancePubkey, commitment, denom.lamports);
      setTxSignature(signature);

      // Save note to wallet store
      const vaultNote: VaultNote = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        note,
        denomination: denom.sol,
        instanceAddress,
        timestamp: Date.now(),
        status: 'deposited',
      };
      saveVaultNote(vaultNote);

      // Clear the note from UI state
      setNote('');
      setCommitment(null);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Show confirmation modal before withdrawal
  const handleWithdrawRequest = () => {
    if (!withdrawNote || !recipient || !keypair) {
      setError('Please provide a note, recipient address, and connect your wallet.');
      return;
    }
    const matchingNoteInfo = vaultNotes.find(n => n.note === withdrawNote);
    let targetInstanceAddress = instanceAddress;
    if (matchingNoteInfo && matchingNoteInfo.instanceAddress) {
      targetInstanceAddress = matchingNoteInfo.instanceAddress;
    }
    if (!targetInstanceAddress) {
      setError('Could not determine pool instance for this note.');
      return;
    }
    setError('');
    setTxSignature('');
    setPendingTx({
      type: 'withdraw',
      amount: matchingNoteInfo ? `${matchingNoteInfo.denomination} SOL` : 'Unknown',
      feePayer: keypair.publicKey.toBase58(),
      recipient: recipient,
      poolAddress: targetInstanceAddress,
      cluster: network,
    });
  };

  const executeWithdraw = async () => {
    if (!withdrawNote || !recipient || !keypair) return;
    const matchingNoteInfo = vaultNotes.find(n => n.note === withdrawNote);
    let targetInstanceAddress = instanceAddress;
    if (matchingNoteInfo && matchingNoteInfo.instanceAddress) {
      targetInstanceAddress = matchingNoteInfo.instanceAddress;
    }
    if (!targetInstanceAddress) return;

    setPendingTx(null);
    setIsLoading(true);
    setError('');
    setTxSignature('');
    try {
      const instancePubkey = new PublicKey(targetInstanceAddress);
      const recipientPubkey = new PublicKey(recipient);
      const signature = await withdraw(connection, keypair, instancePubkey, withdrawNote, recipientPubkey);
      setTxSignature(signature);

      // Update matching note status
      const matchingNote = vaultNotes.find((n) => n.note === withdrawNote);
      if (matchingNote) {
        updateVaultNoteStatus(matchingNote.id, 'withdrawn');
      }

      setWithdrawNote('');
      setRecipient('');
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeleteNote = (noteId: string) => {
    if (deleteConfirmId === noteId) {
      removeVaultNote(noteId);
      setDeleteConfirmId(null);
    } else {
      setDeleteConfirmId(noteId);
      setTimeout(() => {
        setDeleteConfirmId((current) => current === noteId ? null : current);
      }, 3000);
    }
  };

  const useNoteForWithdraw = (noteText: string) => {
    setWithdrawNote(noteText);
    setActiveTab('withdraw');
  };

  // ============================================================================
  // Explorer URL
  // ============================================================================
  const getExplorerUrl = (sig: string) => {
    const cluster = network === 'mainnet-beta' ? '' : `?cluster=${network}`;
    return `https://explorer.solana.com/tx/${sig}${cluster}`;
  };

  // ============================================================================
  // Render
  // ============================================================================
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 pb-24">
      <TopAppBar title="Privacy Pool" />

      <div className="max-w-lg mx-auto px-4 py-4 space-y-5">
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-fuchsia-900/40 via-purple-900/30 to-cyan-900/40 border border-fuchsia-500/20 p-5">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,0,255,0.1),transparent_50%)]" />
          <div className="relative flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-fuchsia-500/30">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">ZK Privacy Pool</h2>
              <p className="text-sm text-slate-400">Break the on-chain link between sender & recipient</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex rounded-xl bg-slate-900/60 border border-slate-800/40 p-1">
          {[
            { key: 'deposit' as Tab, icon: ArrowDownToLine, label: 'Deposit' },
            { key: 'withdraw' as Tab, icon: ArrowUpFromLine, label: 'Withdraw' },
            { key: 'notes' as Tab, icon: FileText, label: `Notes (${vaultNotes.length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setError(''); setTxSignature(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-fuchsia-500/30 to-cyan-500/20 text-white shadow-inner shadow-fuchsia-500/10 border border-fuchsia-500/30'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ================================================================ */}
        {/* DEPOSIT TAB */}
        {/* ================================================================ */}
        {activeTab === 'deposit' && (
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800/40 p-5 space-y-5">
            {/* Denomination Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                Denomination
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowDenomDropdown(!showDenomDropdown)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-slate-800/80 border border-slate-700/60 rounded-xl text-white hover:border-fuchsia-500/40 transition-all"
                >
                  <span className="text-lg font-bold">{DENOMINATION_TIERS[selectedDenom].label}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${showDenomDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showDenomDropdown && (
                  <div className="absolute top-full mt-2 w-full bg-slate-800 border border-slate-700 rounded-xl overflow-hidden z-10 shadow-xl shadow-black/40">
                    {DENOMINATION_TIERS.map((tier, i) => (
                      <button
                        key={tier.label}
                        onClick={() => { setSelectedDenom(i); setShowDenomDropdown(false); }}
                        className={`w-full text-left px-4 py-3 hover:bg-fuchsia-500/20 transition-all ${
                          i === selectedDenom ? 'bg-fuchsia-500/10 text-fuchsia-300' : 'text-slate-300'
                        }`}
                      >
                        <span className="font-semibold">{tier.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Step 1: Generate Note */}
            <button
              onClick={handleGenerateNote}
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-fuchsia-500 text-white font-semibold hover:from-fuchsia-500 hover:to-fuchsia-400 transition-all shadow-lg shadow-fuchsia-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center gap-2">
                <Shield className="w-5 h-5" />
                1. Generate Secret Note
              </div>
            </button>

            {/* Note Display */}
            {note && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                {/* Warning */}
                <div className="flex items-start gap-3 p-3 bg-red-900/30 border border-red-500/30 rounded-xl">
                  <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-red-300 text-sm">
                    <b>CRITICAL:</b> Save this note now. It is the <b>only way</b> to withdraw your funds. Loss of this note = permanent loss of funds.
                  </p>
                </div>

                {/* Note Text */}
                <div className="relative">
                  <textarea
                    readOnly
                    value={note}
                    className="w-full h-20 p-3 bg-slate-800/80 border border-slate-700/60 rounded-xl text-slate-300 font-mono text-xs resize-none focus:outline-none"
                  />
                  <button
                    onClick={() => copyToClipboard(note)}
                    className="absolute top-2 right-2 p-2 bg-slate-700/80 rounded-lg hover:bg-fuchsia-500/30 transition-all"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-white" />
                    )}
                  </button>
                </div>

                {/* Step 2: Deposit */}
                <button
                  onClick={handleDepositRequest}
                  disabled={isLoading || !commitment || !instanceAddress}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 text-white font-semibold hover:from-cyan-500 hover:to-cyan-400 transition-all shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-center gap-2">
                    <ArrowDownToLine className="w-5 h-5" />
                    {isLoading ? 'Depositing...' : `2. Deposit ${DENOMINATION_TIERS[selectedDenom].label}`}
                  </div>
                </button>

                {!instanceAddress && (
                  <div className="flex items-start gap-3 p-3 bg-amber-900/20 border border-amber-500/20 rounded-xl">
                    <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-200">
                      The {DENOMINATION_TIERS[selectedDenom].label} pool is not available on {network} yet. Please select a different denomination or switch to Devnet.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Balance Info */}
            <div className="flex items-center justify-between p-3 bg-slate-800/40 rounded-xl">
              <span className="text-xs text-slate-500">Your Balance</span>
              <span className="text-sm font-semibold text-white">{balance.toFixed(4)} SOL</span>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* WITHDRAW TAB */}
        {/* ================================================================ */}
        {activeTab === 'withdraw' && (
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800/40 p-5 space-y-5">
            <div className="flex items-start gap-3 p-3 bg-amber-900/20 border border-amber-500/20 rounded-xl">
              <Info className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-amber-300/80 text-sm">
                Withdraw sends funds to a <b>new address</b>, breaking the on-chain link. Use a fresh wallet for maximum privacy.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Your Secret Note</label>
              <textarea
                placeholder="Paste your saved note (punkz-vault-note-v1:...)"
                value={withdrawNote}
                onChange={(e) => setWithdrawNote(e.target.value)}
                className="w-full h-20 px-3 py-2.5 bg-slate-800/80 border border-slate-700/60 rounded-xl text-slate-200 placeholder-slate-500 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-fuchsia-500/40 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Recipient Address</label>
              <input
                type="text"
                placeholder="Recipient Solana address (new wallet recommended)"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-800/80 border border-slate-700/60 rounded-lg text-slate-200 placeholder-slate-500 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-fuchsia-500/40 transition-all"
              />
            </div>

            <button
               onClick={handleWithdrawRequest}
               disabled={isLoading || !withdrawNote || !recipient}
               className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold hover:from-emerald-500 hover:to-emerald-400 transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
             >
               <div className="flex items-center justify-center gap-2">
                 <ArrowUpFromLine className="w-5 h-5" />
                 {isLoading ? 'Withdrawing...' : 'Withdraw'}
               </div>
             </button>

             <div className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-xl">
               <Info className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
               <p className="text-xs text-slate-500">
                 Note: Withdrawal requires a valid ZK proof. On devnet, the on-chain verifier uses placeholder keys and will reject proofs.
                 Once production ZK circuits are deployed, withdrawal will become fully functional.
               </p>
             </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* NOTES TAB */}
        {/* ================================================================ */}
        {activeTab === 'notes' && (
          <div className="space-y-3">
            {vaultNotes.length === 0 ? (
              <div className="rounded-2xl bg-slate-900/60 border border-slate-800/40 p-8 text-center">
                <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">No saved notes yet</p>
                <p className="text-slate-600 text-xs mt-1">
                  Deposit into the pool to generate a note
                </p>
              </div>
            ) : (
              vaultNotes.map((vn) => (
                <div
                  key={vn.id}
                  className="rounded-xl bg-slate-900/60 border border-slate-800/40 p-4 space-y-3"
                >
                  {/* Note Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        vn.status === 'deposited'
                          ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50'
                          : vn.status === 'withdrawn'
                          ? 'bg-slate-500'
                          : 'bg-amber-400 shadow-sm shadow-amber-400/50'
                      }`} />
                      <span className="text-sm font-semibold text-white">
                        {vn.denomination} SOL
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        vn.status === 'deposited'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : vn.status === 'withdrawn'
                          ? 'bg-slate-500/20 text-slate-400'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {vn.status}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {new Date(vn.timestamp).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Note Preview */}
                  <div className="p-2.5 bg-slate-800/50 rounded-lg font-mono text-xs text-slate-400 truncate">
                    {vn.note}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(vn.note)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-800/60 text-slate-300 text-xs rounded-lg hover:bg-slate-700/60 transition-all"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Copy
                    </button>
                    {vn.status === 'deposited' && (
                      <button
                        onClick={() => useNoteForWithdraw(vn.note)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-500/20 text-emerald-300 text-xs rounded-lg hover:bg-emerald-500/30 transition-all"
                      >
                        <ArrowUpFromLine className="w-3.5 h-3.5" />
                        Withdraw
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteNote(vn.id)}
                      className={`flex items-center justify-center p-2 rounded-lg transition-all ${
                        deleteConfirmId === vn.id 
                          ? 'bg-red-500 text-white w-20' 
                          : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                      }`}
                    >
                      {deleteConfirmId === vn.id ? (
                        <span className="text-xs font-bold">Confirm?</span>
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ================================================================ */}
        {/* STATUS SECTION (shared across tabs) */}
        {/* ================================================================ */}
        {error && (
          <div className="rounded-xl bg-red-900/30 border border-red-500/30 p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-300 break-all">{error}</p>
            </div>
          </div>
        )}
        {txSignature && (
          <div className="rounded-xl bg-emerald-900/20 border border-emerald-500/20 p-3 space-y-2">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Transaction Successful!</span>
            </div>
            <a
              href={getExplorerUrl(txSignature)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 text-sm break-all underline decoration-cyan-500/30 underline-offset-2"
            >
              View on Solana Explorer →
            </a>
          </div>
        )}
      </div>

      {/* ================================================================ */}
      {/* TRANSACTION CONFIRMATION MODAL (W009 Safety Guardrail) */}
      {/* ================================================================ */}
      {pendingTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
            {/* Header */}
            <div className={`px-5 py-4 border-b border-slate-800 ${
              pendingTx.type === 'deposit'
                ? 'bg-gradient-to-r from-cyan-900/40 to-cyan-800/20'
                : 'bg-gradient-to-r from-emerald-900/40 to-emerald-800/20'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${
                  pendingTx.type === 'deposit' ? 'bg-cyan-500/20' : 'bg-emerald-500/20'
                }`}>
                  <AlertTriangle className={`w-5 h-5 ${
                    pendingTx.type === 'deposit' ? 'text-cyan-400' : 'text-emerald-400'
                  }`} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base">
                    Confirm {pendingTx.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                  </h3>
                  <p className="text-slate-400 text-xs">Review transaction details before signing</p>
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="px-5 py-4 space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
                <span className="text-sm text-slate-400">Amount</span>
                <span className="text-base font-bold text-white">{pendingTx.amount}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
                <span className="text-sm text-slate-400">Cluster</span>
                <span className={`text-sm font-semibold px-2 py-0.5 rounded-full ${
                  pendingTx.cluster === 'mainnet-beta'
                    ? 'bg-red-500/20 text-red-300'
                    : 'bg-fuchsia-500/20 text-fuchsia-300'
                }`}>{pendingTx.cluster}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
                <span className="text-sm text-slate-400">Fee Payer</span>
                <span className="text-xs font-mono text-slate-300">
                  {pendingTx.feePayer.slice(0, 4)}...{pendingTx.feePayer.slice(-4)}
                </span>
              </div>
              {pendingTx.recipient && (
                <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
                  <span className="text-sm text-slate-400">Recipient</span>
                  <span className="text-xs font-mono text-emerald-300">
                    {pendingTx.recipient.slice(0, 4)}...{pendingTx.recipient.slice(-4)}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-slate-400">Pool</span>
                <span className="text-xs font-mono text-slate-300">
                  {pendingTx.poolAddress.slice(0, 4)}...{pendingTx.poolAddress.slice(-4)}
                </span>
              </div>
              {pendingTx.cluster === 'mainnet-beta' && (
                <div className="flex items-start gap-2 p-3 bg-red-900/30 border border-red-500/30 rounded-xl">
                  <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-red-300">
                    <b>WARNING:</b> You are on MAINNET. Real funds will be transferred.
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="px-5 pb-5 flex gap-3">
              <button
                onClick={() => setPendingTx(null)}
                className="flex-1 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-sm font-semibold hover:bg-slate-700 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={pendingTx.type === 'deposit' ? executeDeposit : executeWithdraw}
                className={`flex-1 py-3 rounded-xl text-white text-sm font-bold shadow-lg transition-all ${
                  pendingTx.type === 'deposit'
                    ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 shadow-cyan-500/25'
                    : 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-emerald-500/25'
                }`}
              >
                Approve & Sign
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
};

export default PrivacyPoolScreen;

