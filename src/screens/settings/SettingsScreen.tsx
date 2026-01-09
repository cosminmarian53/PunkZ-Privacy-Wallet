import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWalletStore } from '../../store/walletStore';
import { TopAppBar } from '../../components/navigation/TopAppBar';
import { BottomNavigation } from '../../components/navigation/BottomNavigation';
import {
  Key,
  Server,
  Users,
  Shield,
  Info,
  ChevronRight,
  Trash2,
  AlertTriangle,
  X
} from 'lucide-react';

interface SettingsItem {
  id: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}

// Retro Modal component
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

export const SettingsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { deleteWallet, network, setNetwork } = useWalletStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const handleDeleteWallet = () => {
    if (deleteConfirmation.toLowerCase() === 'delete') {
      deleteWallet();
      navigate('/');
    }
  };

  const settingsItems: SettingsItem[] = [
    {
      id: 'backup',
      title: 'Recovery Phrase',
      description: 'View your wallet backup phrase',
      icon: <Key className="w-5 h-5" />,
      onClick: () => navigate('/settings/backup'),
    },
    {
      id: 'network',
      title: 'Network',
      description: `Connected to ${network}`,
      icon: <Server className="w-5 h-5" />,
      onClick: () => setShowNetworkModal(true),
    },
    {
      id: 'addressbook',
      title: 'Address Book',
      description: 'Manage saved addresses',
      icon: <Users className="w-5 h-5" />,
      onClick: () => navigate('/settings/addressbook'),
    },
    {
      id: 'security',
      title: 'Security',
      description: 'Manage security settings',
      icon: <Shield className="w-5 h-5" />,
      onClick: () => navigate('/settings/security'),
    },
    {
      id: 'about',
      title: 'About',
      description: 'App version and info',
      icon: <Info className="w-5 h-5" />,
      onClick: () => navigate('/settings/about'),
    },
  ];

  return (
    <div 
      className="min-h-screen flex flex-col pb-20"
      style={{
        background: 'linear-gradient(180deg, #0a0014 0%, #1a0030 50%, #0a0014 100%)',
      }}
    >
      {/* Grid background */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 0, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 0, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      <TopAppBar title="Settings" />

      <div className="flex-1 px-4 py-4">
        {/* Settings list */}
        <motion.div 
          className="rounded-2xl overflow-hidden mb-6"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 0, 255, 0.05) 0%, rgba(0, 240, 255, 0.02) 100%)',
            border: '1px solid rgba(255, 0, 255, 0.2)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {settingsItems.map((item, index) => (
            <motion.button
              key={item.id}
              onClick={item.onClick}
              className="w-full flex items-center gap-4 p-4 transition-all"
              style={{
                borderBottom: index < settingsItems.length - 1 ? '1px solid rgba(255, 0, 255, 0.1)' : 'none',
              }}
              whileHover={{ 
                background: 'rgba(255, 0, 255, 0.1)',
              }}
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: item.danger 
                    ? 'rgba(255, 68, 68, 0.2)' 
                    : 'linear-gradient(135deg, rgba(255, 0, 255, 0.2) 0%, rgba(0, 240, 255, 0.1) 100%)',
                  border: item.danger 
                    ? '1px solid rgba(255, 68, 68, 0.3)' 
                    : '1px solid rgba(255, 0, 255, 0.2)',
                  color: item.danger ? '#ff4444' : '#ff00ff',
                }}
              >
                {item.icon}
              </div>
              <div className="flex-1 text-left">
                <p 
                  className="font-mono font-medium"
                  style={{ color: item.danger ? '#ff4444' : '#ff00ff' }}
                >
                  {item.title}
                </p>
                {item.description && (
                  <p 
                    className="text-sm font-mono"
                    style={{ color: 'rgba(0, 240, 255, 0.6)' }}
                  >
                    {item.description}
                  </p>
                )}
              </div>
              <ChevronRight className="w-5 h-5" style={{ color: '#00f0ff' }} />
            </motion.button>
          ))}
        </motion.div>

        {/* Delete wallet */}
        <motion.div 
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(255, 68, 68, 0.05)',
            border: '1px solid rgba(255, 68, 68, 0.2)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <motion.button
            onClick={() => setShowDeleteModal(true)}
            className="w-full flex items-center gap-4 p-4 transition-all"
            whileHover={{ 
              background: 'rgba(255, 68, 68, 0.1)',
            }}
          >
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background: 'rgba(255, 68, 68, 0.2)',
                border: '1px solid rgba(255, 68, 68, 0.3)',
              }}
            >
              <Trash2 className="w-5 h-5" style={{ color: '#ff4444' }} />
            </div>
            <div className="flex-1 text-left">
              <p className="font-mono font-medium" style={{ color: '#ff4444' }}>Delete Wallet</p>
              <p className="text-sm font-mono" style={{ color: 'rgba(255, 68, 68, 0.6)' }}>
                Remove wallet from this device
              </p>
            </div>
            <ChevronRight className="w-5 h-5" style={{ color: '#ff4444' }} />
          </motion.button>
        </motion.div>

        {/* Version info */}
        <div className="mt-8 text-center">
          <p 
            className="text-xs font-mono"
            style={{ color: 'rgba(255, 0, 255, 0.4)' }}
          >
            Punkz Wallet v1.0.0
          </p>
          <p 
            className="text-xs font-mono mt-1"
            style={{ color: 'rgba(0, 240, 255, 0.3)' }}
          >
            Made with ♥ for the Solana community
          </p>
        </div>
      </div>

      {/* Delete wallet modal */}
      <RetroModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteConfirmation('');
        }}
        title="Delete Wallet"
      >
        <div className="space-y-4">
          <div 
            className="flex items-start gap-3 p-4 rounded-xl"
            style={{
              background: 'rgba(255, 68, 68, 0.1)',
              border: '1px solid rgba(255, 68, 68, 0.3)',
            }}
          >
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#ff4444' }} />
            <div>
              <p className="text-sm font-mono font-medium" style={{ color: '#ff4444' }}>
                This action cannot be undone
              </p>
              <p className="text-xs font-mono mt-1" style={{ color: 'rgba(255, 68, 68, 0.7)' }}>
                Make sure you have backed up your recovery phrase before deleting.
              </p>
            </div>
          </div>

          <p className="text-sm font-mono" style={{ color: 'rgba(0, 240, 255, 0.6)' }}>
            Type <span style={{ color: '#ff00ff' }}>delete</span> to confirm:
          </p>

          <input
            type="text"
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            placeholder="delete"
            className="w-full rounded-xl px-4 py-3 font-mono text-white placeholder-gray-500 outline-none transition-all"
            style={{
              background: 'rgba(10, 0, 20, 0.6)',
              border: '1px solid rgba(255, 68, 68, 0.3)',
            }}
          />

          <div className="flex gap-3 pt-2">
            <motion.button
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteConfirmation('');
              }}
              className="flex-1 px-4 py-3 rounded-xl font-mono font-bold"
              style={{
                background: 'transparent',
                border: '1px solid rgba(0, 240, 255, 0.3)',
                color: '#00f0ff',
              }}
              whileHover={{ boxShadow: '0 0 15px rgba(0, 240, 255, 0.3)' }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button
              onClick={handleDeleteWallet}
              disabled={deleteConfirmation.toLowerCase() !== 'delete'}
              className="flex-1 px-4 py-3 rounded-xl font-mono font-bold"
              style={{
                background: deleteConfirmation.toLowerCase() === 'delete' 
                  ? 'linear-gradient(135deg, #ff4444 0%, #ff0000 100%)'
                  : 'rgba(255, 68, 68, 0.2)',
                color: 'white',
                opacity: deleteConfirmation.toLowerCase() !== 'delete' ? 0.5 : 1,
              }}
              whileHover={deleteConfirmation.toLowerCase() === 'delete' ? { boxShadow: '0 0 20px rgba(255, 68, 68, 0.5)' } : {}}
              whileTap={deleteConfirmation.toLowerCase() === 'delete' ? { scale: 0.98 } : {}}
            >
              Delete Wallet
            </motion.button>
          </div>
        </div>
      </RetroModal>

      {/* Network modal */}
      <RetroModal
        isOpen={showNetworkModal}
        onClose={() => setShowNetworkModal(false)}
        title="Select Network"
      >
        <div className="space-y-2">
          {(['mainnet-beta', 'devnet', 'testnet'] as const).map((net) => (
            <motion.button
              key={net}
              onClick={() => {
                setNetwork(net);
                setShowNetworkModal(false);
              }}
              className="w-full flex items-center justify-between p-4 rounded-xl transition-colors"
              style={{
                background: network === net 
                  ? 'linear-gradient(135deg, rgba(255, 0, 255, 0.2) 0%, rgba(0, 240, 255, 0.1) 100%)'
                  : 'rgba(255, 0, 255, 0.05)',
                border: network === net 
                  ? '1px solid rgba(255, 0, 255, 0.5)' 
                  : '1px solid rgba(255, 0, 255, 0.1)',
              }}
              whileHover={{ 
                borderColor: 'rgba(255, 0, 255, 0.4)',
                boxShadow: '0 0 15px rgba(255, 0, 255, 0.2)',
              }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{
                    background: net === 'mainnet-beta' ? '#00ff88' :
                      net === 'devnet' ? '#fbbf24' : '#00f0ff',
                    boxShadow: `0 0 10px ${
                      net === 'mainnet-beta' ? '#00ff88' :
                      net === 'devnet' ? '#fbbf24' : '#00f0ff'
                    }`,
                  }}
                />
                <span className="font-mono font-medium capitalize" style={{ color: '#ff00ff' }}>
                  {net === 'mainnet-beta' ? 'Mainnet' : net}
                </span>
              </div>
              {network === net && (
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #ff00ff 0%, #00f0ff 100%)',
                  }}
                >
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </RetroModal>

      <BottomNavigation />
    </div>
  );
};
