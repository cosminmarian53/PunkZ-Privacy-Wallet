import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '../../store/walletStore';
import { TopAppBar } from '../../components/navigation/TopAppBar';
import { BottomNavigation } from '../../components/navigation/BottomNavigation';
import { BalanceWidget } from '../../components/wallet/BalanceWidget';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { PublicKey } from '@solana/web3.js';
import { 
  QrCode, 
  User, 
  AlertCircle, 
  ArrowRight, 
  Loader2,
  CheckCircle2,
  XCircle
} from 'lucide-react';

type SendStep = 'form' | 'review' | 'sending' | 'success' | 'error';

export const SendScreen: React.FC = () => {
  const navigate = useNavigate();
  const { balance, sendTransaction, contacts, isLoading } = useWalletStore();
  
  const [step, setStep] = useState<SendStep>('form');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const [showContacts, setShowContacts] = useState(false);

  const isValidAddress = useMemo(() => {
    if (!recipientAddress) return null;
    try {
      new PublicKey(recipientAddress);
      return true;
    } catch {
      return false;
    }
  }, [recipientAddress]);

  const amountNumber = parseFloat(amount) || 0;
  const isValidAmount = amountNumber > 0 && amountNumber <= balance;
  const canProceed = isValidAddress && isValidAmount;

  const handleReview = () => {
    setError(null);
    setStep('review');
  };

  const handleSend = async () => {
    setStep('sending');
    try {
      const signature = await sendTransaction(recipientAddress, amountNumber, memo || undefined);
      setTxSignature(signature);
      setStep('success');
    } catch (err) {
      setError((err as Error).message);
      setStep('error');
    }
  };

  const handleSelectContact = (address: string) => {
    setRecipientAddress(address);
    setShowContacts(false);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  const handleSetMax = () => {
    // Leave some for fees
    const maxAmount = Math.max(0, balance - 0.001);
    setAmount(maxAmount.toFixed(9));
  };

  const renderForm = () => (
    <div className="flex-1 flex flex-col px-4 py-4">
      {/* Balance */}
      <div className="mb-6">
        <BalanceWidget />
      </div>

      {/* Recipient */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Recipient Address
        </label>
        <div className="relative">
          <Input
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            placeholder="Enter Solana address"
            error={isValidAddress === false ? 'Invalid address' : undefined}
          />
          <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-2">
            <button
              onClick={() => setShowContacts(true)}
              className="p-2 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-zinc-700"
            >
              <User className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/scan')}
              className="p-2 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-zinc-700"
            >
              <QrCode className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Amount */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-zinc-300">
            Amount
          </label>
          <button
            onClick={handleSetMax}
            className="text-xs text-violet-400 hover:text-violet-300 font-medium"
          >
            MAX
          </button>
        </div>
        <div className="relative">
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.000000001"
            error={amount && !isValidAmount ? 'Insufficient balance' : undefined}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
            <span className="text-zinc-500 text-sm">SOL</span>
          </div>
        </div>
        {amountNumber > 0 && (
          <p className="text-xs text-zinc-500 mt-1">
            ≈ ${(amountNumber * 150).toFixed(2)} USD
          </p>
        )}
      </div>

      {/* Memo */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Memo (optional)
        </label>
        <Input
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="Add a note"
          maxLength={256}
        />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Continue button */}
      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={handleReview}
        disabled={!canProceed}
        rightIcon={<ArrowRight className="w-4 h-4" />}
      >
        Review Transaction
      </Button>

      {/* Contacts modal */}
      <Modal
        isOpen={showContacts}
        onClose={() => setShowContacts(false)}
        title="Address Book"
      >
        {contacts.length === 0 ? (
          <div className="py-8 text-center">
            <User className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <p className="text-zinc-400">No saved contacts</p>
          </div>
        ) : (
          <div className="space-y-2">
            {contacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => handleSelectContact(contact.address)}
                className="w-full p-3 flex items-center gap-3 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-violet-400" />
                </div>
                <div className="text-left">
                  <p className="text-white font-medium">{contact.name}</p>
                  <p className="text-xs text-zinc-500">{formatAddress(contact.address)}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );

  const renderReview = () => (
    <div className="flex-1 flex flex-col px-4 py-4">
      <h2 className="text-xl font-semibold text-white mb-6 text-center">
        Review Transaction
      </h2>

      <Card className="p-4 mb-4">
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-zinc-500">To</span>
            <span className="text-white font-mono text-sm">{formatAddress(recipientAddress)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Amount</span>
            <span className="text-white font-semibold">{amountNumber.toFixed(6)} SOL</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">USD Value</span>
            <span className="text-zinc-400">${(amountNumber * 150).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Network Fee</span>
            <span className="text-zinc-400">~0.000005 SOL</span>
          </div>
          {memo && (
            <div className="flex justify-between">
              <span className="text-zinc-500">Memo</span>
              <span className="text-zinc-400 text-sm max-w-[200px] truncate">{memo}</span>
            </div>
          )}
        </div>
      </Card>

      <div className="flex-1" />

      <div className="space-y-3">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleSend}
        >
          Confirm & Send
        </Button>
        <Button
          variant="ghost"
          size="lg"
          fullWidth
          onClick={() => setStep('form')}
        >
          Back
        </Button>
      </div>
    </div>
  );

  const renderSending = () => (
    <div className="flex-1 flex flex-col items-center justify-center px-4">
      <div className="w-16 h-16 rounded-full bg-violet-500/20 flex items-center justify-center mb-6">
        <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
      </div>
      <h2 className="text-xl font-semibold text-white mb-2">Sending...</h2>
      <p className="text-zinc-500 text-center">
        Please wait while your transaction is being processed
      </p>
    </div>
  );

  const renderSuccess = () => (
    <div className="flex-1 flex flex-col items-center justify-center px-4">
      <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
        <CheckCircle2 className="w-10 h-10 text-green-500" />
      </div>
      <h2 className="text-xl font-semibold text-white mb-2">Transaction Sent!</h2>
      <p className="text-zinc-500 text-center mb-6">
        Your transaction has been submitted to the network
      </p>
      
      {txSignature && (
        <p className="text-xs text-zinc-600 font-mono mb-6 max-w-full truncate px-4">
          {txSignature}
        </p>
      )}

      <Button
        variant="primary"
        size="lg"
        onClick={() => navigate('/home')}
      >
        Back to Home
      </Button>
    </div>
  );

  const renderError = () => (
    <div className="flex-1 flex flex-col items-center justify-center px-4">
      <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
        <XCircle className="w-10 h-10 text-red-500" />
      </div>
      <h2 className="text-xl font-semibold text-white mb-2">Transaction Failed</h2>
      <p className="text-zinc-500 text-center mb-2">
        Something went wrong with your transaction
      </p>
      {error && (
        <p className="text-sm text-red-400 text-center mb-6 max-w-xs">
          {error}
        </p>
      )}

      <div className="space-y-3 w-full max-w-xs">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => setStep('form')}
        >
          Try Again
        </Button>
        <Button
          variant="ghost"
          size="lg"
          fullWidth
          onClick={() => navigate('/home')}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 'form':
        return renderForm();
      case 'review':
        return renderReview();
      case 'sending':
        return renderSending();
      case 'success':
        return renderSuccess();
      case 'error':
        return renderError();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-zinc-900 via-zinc-950 to-black pb-20">
      <TopAppBar 
        title="Send SOL" 
        showBack 
        onBack={step === 'form' ? undefined : () => setStep('form')}
      />
      {renderStep()}
      {step === 'form' && <BottomNavigation />}
    </div>
  );
};
