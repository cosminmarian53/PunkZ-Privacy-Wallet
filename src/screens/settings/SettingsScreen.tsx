import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletStore } from '../../store/walletStore';
import { TopAppBar } from '../../components/navigation/TopAppBar';
import { BottomNavigation } from '../../components/navigation/BottomNavigation';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import {
  Key,
  Server,
  Users,
  Shield,
  Info,
  ChevronRight,
  Trash2,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';

interface SettingsItem {
  id: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}

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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-zinc-900 via-zinc-950 to-black pb-20">
      <TopAppBar title="Settings" />

      <div className="flex-1 px-4 py-4">
        {/* Settings list */}
        <Card className="divide-y divide-zinc-800 overflow-hidden mb-6">
          {settingsItems.map((item) => (
            <button
              key={item.id}
              onClick={item.onClick}
              className="w-full flex items-center gap-4 p-4 hover:bg-zinc-800 transition-colors"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                item.danger ? 'bg-red-500/20 text-red-400' : 'bg-violet-500/20 text-violet-400'
              }`}>
                {item.icon}
              </div>
              <div className="flex-1 text-left">
                <p className={`font-medium ${item.danger ? 'text-red-400' : 'text-white'}`}>
                  {item.title}
                </p>
                {item.description && (
                  <p className="text-sm text-zinc-500">{item.description}</p>
                )}
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-600" />
            </button>
          ))}
        </Card>

        {/* Delete wallet */}
        <Card className="overflow-hidden">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full flex items-center gap-4 p-4 hover:bg-zinc-800 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-400" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-red-400">Delete Wallet</p>
              <p className="text-sm text-zinc-500">Remove wallet from this device</p>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-600" />
          </button>
        </Card>

        {/* Version info */}
        <div className="mt-8 text-center">
          <p className="text-xs text-zinc-600">Punkz Wallet v1.0.0</p>
          <p className="text-xs text-zinc-700 mt-1">Made with ♥ for the Solana community</p>
        </div>
      </div>

      {/* Delete wallet modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteConfirmation('');
        }}
        title="Delete Wallet"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-400 font-medium">This action cannot be undone</p>
              <p className="text-xs text-red-400/70 mt-1">
                Make sure you have backed up your recovery phrase before deleting.
              </p>
            </div>
          </div>

          <p className="text-sm text-zinc-400">
            Type <span className="text-white font-mono">delete</span> to confirm:
          </p>

          <input
            type="text"
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            placeholder="delete"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />

          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteConfirmation('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              fullWidth
              onClick={handleDeleteWallet}
              disabled={deleteConfirmation.toLowerCase() !== 'delete'}
            >
              Delete Wallet
            </Button>
          </div>
        </div>
      </Modal>

      {/* Network modal */}
      <Modal
        isOpen={showNetworkModal}
        onClose={() => setShowNetworkModal(false)}
        title="Select Network"
      >
        <div className="space-y-2">
          {(['mainnet-beta', 'devnet', 'testnet'] as const).map((net) => (
            <button
              key={net}
              onClick={() => {
                setNetwork(net);
                setShowNetworkModal(false);
              }}
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${
                network === net 
                  ? 'bg-violet-500/20 border border-violet-500/50' 
                  : 'bg-zinc-800 hover:bg-zinc-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  net === 'mainnet-beta' ? 'bg-green-500' :
                  net === 'devnet' ? 'bg-yellow-500' : 'bg-blue-500'
                }`} />
                <span className="text-white font-medium capitalize">
                  {net === 'mainnet-beta' ? 'Mainnet' : net}
                </span>
              </div>
              {network === net && (
                <div className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </Modal>

      <BottomNavigation />
    </div>
  );
};
