import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '../../store/walletStore';
import { TopAppBar } from '../../components/navigation/TopAppBar';
import { BottomNavigation } from '../../components/navigation/BottomNavigation';
import { PublicKey } from '@solana/web3.js';
import { 
  QrCode, 
  User, 
  ArrowRight, 
  Loader2,
  CheckCircle2,
  XCircle,
  X
} from 'lucide-react';

type SendStep = 'form' | 'review' | 'sending' | 'success' | 'error';

export const SendScreen: React.FC = () => {
  const navigate = useNavigate();
  const { balance, sendTransaction, contacts } = useWalletStore();
  
  const [step, setStep] = useState<SendStep>('form');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [showContacts, setShowContacts] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [txHash, setTxHash] = useState('');

  const isValidAddress = useMemo(() => {
    if (!recipientAddress) return false;
    try {
      new PublicKey(recipientAddress);
      return true;
    } catch {
      return false;
    }
  }, [recipientAddress]);

  const isValidAmount = useMemo(() => {
    const amountNum = parseFloat(amount);
    return amount && amountNum > 0 && amountNum <= (balance || 0);
  }, [amount, balance]);

  const canProceed = isValidAddress && isValidAmount;

  const handleSend = async () => {
    setStep('sending');
    try {
      const hash = await sendTransaction(recipientAddress, parseFloat(amount), memo || undefined);
      setTxHash(hash);
      setStep('success');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Transaction failed');
      setStep('error');
    }
  };

  const handleReset = () => {
    setStep('form');
    setRecipientAddress('');
    setAmount('');
    setMemo('');
    setErrorMessage('');
    setTxHash('');
  };

  const selectContact = (address: string) => {
    setRecipientAddress(address);
    setShowContacts(false);
  };

  // Success State
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950">
        <TopAppBar title="Send" showBack />
        <div className="max-w-lg mx-auto px-6 py-12 flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Transaction Sent!</h2>
          <p className="text-slate-400 text-center mb-6">
            Your transaction has been submitted to the Solana network
          </p>
          <div className="w-full p-4 bg-slate-900/50 border border-slate-800 rounded-xl mb-6">
            <p className="text-slate-500 text-sm mb-1">Transaction Hash</p>
            <p className="text-white font-mono text-sm break-all">{txHash}</p>
          </div>
          <button
            onClick={handleReset}
            className="w-full py-4 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-xl text-white font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  // Error State
  if (step === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950">
        <TopAppBar title="Send" showBack />
        <div className="max-w-lg mx-auto px-6 py-12 flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-rose-500/20 rounded-full flex items-center justify-center mb-6">
            <XCircle className="w-10 h-10 text-rose-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Transaction Failed</h2>
          <p className="text-slate-400 text-center mb-6">{errorMessage}</p>
          <button
            onClick={handleReset}
            className="w-full py-4 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-xl text-white font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Sending State
  if (step === 'sending') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950">
        <TopAppBar title="Send" showBack />
        <div className="max-w-lg mx-auto px-6 py-12 flex flex-col items-center justify-center">
          <Loader2 className="w-16 h-16 text-fuchsia-400 animate-spin mb-6" />
          <h2 className="text-xl font-semibold text-white mb-2">Sending Transaction</h2>
          <p className="text-slate-400">Please wait...</p>
        </div>
      </div>
    );
  }

  // Review State
  if (step === 'review') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 pb-24">
        <TopAppBar title="Review Transaction" showBack onBack={() => setStep('form')} />
        <div className="max-w-lg mx-auto px-6 py-4">
          <div className="space-y-4">
            <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
              <p className="text-slate-500 text-sm mb-1">To</p>
              <p className="text-white font-mono text-sm break-all">{recipientAddress}</p>
            </div>
            <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
              <p className="text-slate-500 text-sm mb-1">Amount</p>
              <p className="text-white text-2xl font-bold">{amount} SOL</p>
            </div>
            {memo && (
              <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                <p className="text-slate-500 text-sm mb-1">Memo</p>
                <p className="text-white">{memo}</p>
              </div>
            )}
            <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
              <p className="text-slate-500 text-sm mb-1">Network Fee</p>
              <p className="text-white">~0.000005 SOL</p>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <button
              onClick={handleSend}
              className="w-full py-4 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-xl text-white font-semibold flex items-center justify-center gap-2"
            >
              Confirm & Send
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setStep('form')}
              className="w-full py-4 border border-slate-700 rounded-xl text-slate-400"
            >
              Cancel
            </button>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  // Form State (default)
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 pb-24">
      <TopAppBar title="Send SOL" showBack />

      <div className="max-w-lg mx-auto px-6 py-4">
        {/* Balance Card */}
        <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl mb-6">
          <p className="text-slate-400 text-sm mb-1">Available Balance</p>
          <p className="text-white text-2xl font-bold">{balance?.toFixed(4)} SOL</p>
        </div>

        <div className="space-y-4">
          {/* Recipient Input */}
          <div>
            <label className="block text-slate-400 text-sm mb-2">Recipient Address</label>
            <div className="relative">
              <input
                type="text"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                placeholder="Enter Solana address"
                className="w-full px-4 py-4 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 font-mono text-sm focus:border-fuchsia-500 focus:outline-none"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <button
                  onClick={() => setShowContacts(true)}
                  className="p-2 hover:bg-slate-700 rounded-lg"
                >
                  <User className="w-5 h-5 text-slate-400" />
                </button>
                <button
                  onClick={() => navigate('/scan')}
                  className="p-2 hover:bg-slate-700 rounded-lg"
                >
                  <QrCode className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>
            {recipientAddress && !isValidAddress && (
              <p className="text-rose-400 text-sm mt-1">Invalid Solana address</p>
            )}
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-slate-400 text-sm mb-2">Amount</label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.0001"
                className="w-full px-4 py-4 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xl focus:border-fuchsia-500 focus:outline-none"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button
                  onClick={() => setAmount(((balance || 0) - 0.001).toFixed(4))}
                  className="px-3 py-1 bg-fuchsia-500/20 text-fuchsia-400 rounded-lg text-sm font-medium"
                >
                  MAX
                </button>
                <span className="text-slate-400">SOL</span>
              </div>
            </div>
            {amount && parseFloat(amount) > (balance || 0) && (
              <p className="text-rose-400 text-sm mt-1">Insufficient balance</p>
            )}
          </div>

          {/* Memo Input (Optional) */}
          <div>
            <label className="block text-slate-400 text-sm mb-2">Memo (Optional)</label>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="Add a note"
              maxLength={100}
              className="w-full px-4 py-4 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-fuchsia-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={() => setStep('review')}
          disabled={!canProceed}
          className={`w-full mt-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 ${
            canProceed
              ? 'bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          Continue
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Contacts Modal */}
      {showContacts && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowContacts(false)}
        >
          <div 
            className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Select Contact</h3>
              <button onClick={() => setShowContacts(false)} className="p-1">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            {contacts.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No contacts saved</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {contacts.map((contact) => (
                  <button
                    key={contact.address}
                    onClick={() => selectContact(contact.address)}
                    className="w-full p-3 bg-slate-800 rounded-xl text-left hover:bg-slate-700"
                  >
                    <p className="text-white font-medium">{contact.name}</p>
                    <p className="text-slate-500 text-sm font-mono truncate">{contact.address}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
};

export default SendScreen;
