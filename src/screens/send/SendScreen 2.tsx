import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWalletStore } from '../../store/walletStore';
import { TopAppBar } from '../../components/navigation/TopAppBar';
import { BottomNavigation } from '../../components/navigation/BottomNavigation';
import { BalanceWidget } from '../../components/wallet/BalanceWidget';
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

// Retro styled button component
const RetroButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'ghost';
  fullWidth?: boolean;
  rightIcon?: React.ReactNode;
}> = ({ children, onClick, disabled, variant = 'primary', fullWidth, rightIcon }) => (
  <motion.button
    onClick={onClick}
    disabled={disabled}
    className={`px-6 py-4 rounded-xl font-mono font-bold text-lg flex items-center justify-center gap-2 transition-all ${fullWidth ? 'w-full' : ''}`}
    style={{
      background: variant === 'primary' 
        ? 'linear-gradient(135deg, #ff00ff 0%, #00f0ff 100%)'
        : 'transparent',
      border: variant === 'ghost' ? '1px solid rgba(255, 0, 255, 0.3)' : 'none',
      color: 'white',
      opacity: disabled ? 0.5 : 1,
      cursor: disabled ? 'not-allowed' : 'pointer',
    }}
    whileHover={disabled ? {} : { 
      boxShadow: '0 0 30px rgba(255, 0, 255, 0.5)',
      scale: 1.02,
    }}
    whileTap={disabled ? {} : { scale: 0.98 }}
  >
    {children}
    {rightIcon}
  </motion.button>
);

// Retro styled input component
const RetroInput: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  step?: string;
  maxLength?: number;
  error?: string;
  rightContent?: React.ReactNode;
}> = ({ value, onChange, placeholder, type = 'text', step, maxLength, error, rightContent }) => (
  <div className="relative">
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      step={step}
      maxLength={maxLength}
      className="w-full px-4 py-4 rounded-xl font-mono text-white placeholder-gray-500 outline-none transition-all"
      style={{
        background: 'rgba(10, 0, 20, 0.6)',
        border: error ? '1px solid #ff4444' : '1px solid rgba(255, 0, 255, 0.2)',
        boxShadow: error ? '0 0 15px rgba(255, 68, 68, 0.2)' : 'none',
      }}
    />
    {rightContent && (
      <div className="absolute inset-y-0 right-0 flex items-center pr-2">
        {rightContent}
      </div>
    )}
    {error && (
      <p className="text-xs mt-1 font-mono" style={{ color: '#ff4444' }}>{error}</p>
    )}
  </div>
);

// Modal component
const RetroModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0, 0, 0, 0.8)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-md rounded-2xl p-6"
        style={{
          background: 'linear-gradient(135deg, rgba(20, 0, 40, 0.98) 0%, rgba(10, 0, 20, 0.98) 100%)',
          border: '1px solid rgba(255, 0, 255, 0.3)',
          boxShadow: '0 0 40px rgba(255, 0, 255, 0.2)',
        }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 
            className="text-xl font-mono font-bold"
            style={{ color: '#ff00ff', textShadow: '0 0 15px rgba(255, 0, 255, 0.5)' }}
          >
            {title}
          </h3>
          <motion.button
            onClick={onClose}
            className="p-2 rounded-lg"
            style={{ color: '#00f0ff' }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
};

export const SendScreen: React.FC = () => {
  const navigate = useNavigate();
  const { balance, sendTransaction, contacts } = useWalletStore();
  
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
    const maxAmount = Math.max(0, balance - 0.001);
    setAmount(maxAmount.toFixed(9));
  };

  const renderForm = () => (
    <div className="flex-1 flex flex-col px-6 py-6 overflow-y-auto">
      {/* Balance - Compact version */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <BalanceWidget />
      </motion.div>

      {/* Recipient */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <label 
          className="block text-sm font-mono font-medium mb-3"
          style={{ color: '#00f0ff', textShadow: '0 0 10px rgba(0, 240, 255, 0.3)' }}
        >
          Recipient Address
        </label>
        <RetroInput
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
          placeholder="Enter Solana address"
          error={isValidAddress === false ? 'Invalid address' : undefined}
          rightContent={
            <div className="flex items-center gap-2">
              <motion.button
                onClick={() => setShowContacts(true)}
                className="p-2.5 rounded-lg transition-colors"
                style={{ color: '#ff00ff' }}
                whileHover={{ scale: 1.15, filter: 'drop-shadow(0 0 10px #ff00ff)' }}
                whileTap={{ scale: 0.9 }}
              >
                <User className="w-5 h-5" />
              </motion.button>
              <motion.button
                onClick={() => navigate('/scan')}
                className="p-2.5 rounded-lg transition-colors"
                style={{ color: '#00f0ff' }}
                whileHover={{ scale: 1.15, filter: 'drop-shadow(0 0 10px #00f0ff)' }}
                whileTap={{ scale: 0.9 }}
              >
                <QrCode className="w-5 h-5" />
              </motion.button>
            </div>
          }
        />
      </motion.div>

      {/* Amount */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-3">
          <label 
            className="text-sm font-mono font-medium"
            style={{ color: '#00f0ff', textShadow: '0 0 10px rgba(0, 240, 255, 0.3)' }}
          >
            Amount
          </label>
          <motion.button
            onClick={handleSetMax}
            className="text-sm font-mono font-bold px-3 py-1.5 rounded-lg"
            style={{ 
              color: '#ff00ff',
              background: 'rgba(255, 0, 255, 0.15)',
              border: '1px solid rgba(255, 0, 255, 0.4)',
            }}
            whileHover={{ boxShadow: '0 0 20px rgba(255, 0, 255, 0.4)', scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            MAX
          </motion.button>
        </div>
        <RetroInput
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          step="0.000000001"
          error={amount && !isValidAmount ? 'Insufficient balance' : undefined}
          rightContent={
            <span className="text-sm font-mono font-bold pr-3" style={{ color: '#00f0ff' }}>SOL</span>
          }
        />
        {amountNumber > 0 && (
          <motion.p 
            className="text-sm font-mono mt-2" 
            style={{ color: 'rgba(0, 240, 255, 0.7)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            ≈ ${(amountNumber * 150).toFixed(2)} USD
          </motion.p>
        )}
      </motion.div>

      {/* Memo */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <label 
          className="block text-sm font-mono font-medium mb-3"
          style={{ color: '#00f0ff', textShadow: '0 0 10px rgba(0, 240, 255, 0.3)' }}
        >
          Memo (optional)
        </label>
        <RetroInput
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="Add a note"
          maxLength={256}
        />
      </motion.div>

      {/* Continue button - Always visible at bottom */}
      <motion.div 
        className="mt-auto pt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <RetroButton
          variant="primary"
          fullWidth
          onClick={handleReview}
          disabled={!canProceed}
          rightIcon={<ArrowRight className="w-5 h-5" />}
        >
          Review Transaction
        </RetroButton>
      </motion.div>

      {/* Contacts modal */}
      <RetroModal
        isOpen={showContacts}
        onClose={() => setShowContacts(false)}
        title="Address Book"
      >
        {contacts.length === 0 ? (
          <div className="py-8 text-center">
            <User className="w-12 h-12 mx-auto mb-3" style={{ color: 'rgba(255, 0, 255, 0.4)' }} />
            <p className="font-mono" style={{ color: 'rgba(0, 240, 255, 0.6)' }}>No saved contacts</p>
          </div>
        ) : (
          <div className="space-y-2">
            {contacts.map((contact) => (
              <motion.button
                key={contact.id}
                onClick={() => handleSelectContact(contact.address)}
                className="w-full p-3 flex items-center gap-3 rounded-xl transition-colors"
                style={{
                  background: 'rgba(255, 0, 255, 0.1)',
                  border: '1px solid rgba(255, 0, 255, 0.2)',
                }}
                whileHover={{ 
                  borderColor: '#ff00ff',
                  boxShadow: '0 0 15px rgba(255, 0, 255, 0.3)',
                }}
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 0, 255, 0.2) 0%, rgba(0, 240, 255, 0.1) 100%)',
                  }}
                >
                  <User className="w-5 h-5" style={{ color: '#ff00ff' }} />
                </div>
                <div className="text-left">
                  <p className="font-mono font-medium" style={{ color: '#ff00ff' }}>{contact.name}</p>
                  <p className="text-xs font-mono" style={{ color: 'rgba(0, 240, 255, 0.6)' }}>{formatAddress(contact.address)}</p>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </RetroModal>
    </div>
  );

  const renderReview = () => (
    <div className="flex-1 flex flex-col px-4 py-4">
      <h2 
        className="text-2xl font-mono font-bold mb-6 text-center"
        style={{ color: '#ff00ff', textShadow: '0 0 20px rgba(255, 0, 255, 0.5)' }}
      >
        Review Transaction
      </h2>

      <motion.div 
        className="p-6 rounded-2xl mb-4"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 0, 255, 0.1) 0%, rgba(0, 240, 255, 0.05) 100%)',
          border: '1px solid rgba(255, 0, 255, 0.2)',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-mono" style={{ color: 'rgba(0, 240, 255, 0.6)' }}>To</span>
            <span className="font-mono text-sm" style={{ color: '#00f0ff' }}>{formatAddress(recipientAddress)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-mono" style={{ color: 'rgba(0, 240, 255, 0.6)' }}>Amount</span>
            <span className="font-mono font-bold text-lg" style={{ color: '#ff00ff', textShadow: '0 0 10px rgba(255, 0, 255, 0.5)' }}>
              {amountNumber.toFixed(6)} SOL
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-mono" style={{ color: 'rgba(0, 240, 255, 0.6)' }}>USD Value</span>
            <span className="font-mono" style={{ color: '#00f0ff' }}>${(amountNumber * 150).toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-mono" style={{ color: 'rgba(0, 240, 255, 0.6)' }}>Network Fee</span>
            <span className="font-mono" style={{ color: '#00f0ff' }}>~0.000005 SOL</span>
          </div>
          {memo && (
            <div className="flex justify-between items-center">
              <span className="font-mono" style={{ color: 'rgba(0, 240, 255, 0.6)' }}>Memo</span>
              <span className="font-mono text-sm max-w-[200px] truncate" style={{ color: '#00f0ff' }}>{memo}</span>
            </div>
          )}
        </div>
      </motion.div>

      <div className="flex-1" />

      <div className="space-y-3">
        <RetroButton variant="primary" fullWidth onClick={handleSend}>
          Confirm & Send
        </RetroButton>
        <RetroButton variant="ghost" fullWidth onClick={() => setStep('form')}>
          Back
        </RetroButton>
      </div>
    </div>
  );

  const renderSending = () => (
    <div className="flex-1 flex flex-col items-center justify-center px-4">
      <motion.div 
        className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 0, 255, 0.2) 0%, rgba(0, 240, 255, 0.1) 100%)',
          border: '2px solid #ff00ff',
          boxShadow: '0 0 30px rgba(255, 0, 255, 0.3)',
        }}
        animate={{ 
          boxShadow: ['0 0 30px rgba(255, 0, 255, 0.3)', '0 0 50px rgba(255, 0, 255, 0.5)', '0 0 30px rgba(255, 0, 255, 0.3)'],
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <Loader2 className="w-10 h-10 animate-spin" style={{ color: '#ff00ff' }} />
      </motion.div>
      <h2 
        className="text-2xl font-mono font-bold mb-2"
        style={{ color: '#ff00ff', textShadow: '0 0 20px rgba(255, 0, 255, 0.5)' }}
      >
        Sending...
      </h2>
      <p className="font-mono text-center" style={{ color: 'rgba(0, 240, 255, 0.6)' }}>
        Please wait while your transaction is being processed
      </p>
    </div>
  );

  const renderSuccess = () => (
    <div className="flex-1 flex flex-col items-center justify-center px-4">
      <motion.div 
        className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.2) 0%, rgba(0, 240, 255, 0.1) 100%)',
          border: '2px solid #00ff88',
          boxShadow: '0 0 40px rgba(0, 255, 136, 0.3)',
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <CheckCircle2 className="w-12 h-12" style={{ color: '#00ff88', filter: 'drop-shadow(0 0 10px #00ff88)' }} />
      </motion.div>
      <motion.h2 
        className="text-2xl font-mono font-bold mb-2"
        style={{ color: '#00ff88', textShadow: '0 0 20px rgba(0, 255, 136, 0.5)' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Transaction Sent!
      </motion.h2>
      <p className="font-mono text-center mb-6" style={{ color: 'rgba(0, 240, 255, 0.6)' }}>
        Your transaction has been submitted to the network
      </p>
      
      {txSignature && (
        <p 
          className="text-xs font-mono mb-6 max-w-full truncate px-4"
          style={{ color: 'rgba(0, 240, 255, 0.4)' }}
        >
          {txSignature}
        </p>
      )}

      <RetroButton variant="primary" onClick={() => navigate('/home')}>
        Back to Home
      </RetroButton>
    </div>
  );

  const renderError = () => (
    <div className="flex-1 flex flex-col items-center justify-center px-4">
      <motion.div 
        className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
        style={{
          background: 'rgba(255, 68, 68, 0.1)',
          border: '2px solid #ff4444',
          boxShadow: '0 0 40px rgba(255, 68, 68, 0.2)',
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        <XCircle className="w-12 h-12" style={{ color: '#ff4444', filter: 'drop-shadow(0 0 10px #ff4444)' }} />
      </motion.div>
      <h2 
        className="text-2xl font-mono font-bold mb-2"
        style={{ color: '#ff4444', textShadow: '0 0 20px rgba(255, 68, 68, 0.5)' }}
      >
        Transaction Failed
      </h2>
      <p className="font-mono text-center mb-2" style={{ color: 'rgba(0, 240, 255, 0.6)' }}>
        Something went wrong with your transaction
      </p>
      {error && (
        <p className="text-sm font-mono text-center mb-6 max-w-xs" style={{ color: '#ff4444' }}>
          {error}
        </p>
      )}

      <div className="space-y-3 w-full max-w-xs">
        <RetroButton variant="primary" fullWidth onClick={() => setStep('form')}>
          Try Again
        </RetroButton>
        <RetroButton variant="ghost" fullWidth onClick={() => navigate('/home')}>
          Back to Home
        </RetroButton>
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
    <div 
      className="h-screen w-full"
      style={{
        background: 'linear-gradient(180deg, #0a0014 0%, #1a0030 50%, #0a0014 100%)',
      }}
    >
      {/* Grid background */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20 z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 0, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 0, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      {/* Centered Container */}
      <div className="max-w-2xl mx-auto flex flex-col h-full relative z-10">
        <TopAppBar 
          title="Send SOL" 
          showBack 
          onBack={step === 'form' ? undefined : () => setStep('form')}
        />
        <div className="flex-1 overflow-hidden pb-20">
          {renderStep()}
        </div>
      </div>
      {step === 'form' && <BottomNavigation />}
    </div>
  );
};
