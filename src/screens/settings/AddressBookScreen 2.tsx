import React, { useState } from 'react';
import { useWalletStore, type Contact } from '../../store/walletStore';
import { TopAppBar } from '../../components/navigation/TopAppBar';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { User, Plus, Trash2, Copy, Check } from 'lucide-react';
import { PublicKey } from '@solana/web3.js';

export const AddressBookScreen: React.FC = () => {
  const { contacts, addContact, removeContact } = useWalletStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleAddContact = () => {
    setError(null);
    
    if (!newName.trim()) {
      setError('Please enter a name');
      return;
    }

    try {
      new PublicKey(newAddress);
    } catch {
      setError('Invalid Solana address');
      return;
    }

    addContact(newName.trim(), newAddress.trim());
    setNewName('');
    setNewAddress('');
    setShowAddModal(false);
  };

  const handleCopy = async (contact: Contact) => {
    await navigator.clipboard.writeText(contact.address);
    setCopiedId(contact.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-zinc-900 via-zinc-950 to-black">
      <TopAppBar 
        title="Address Book" 
        showBack
        rightAction={
          <button
            onClick={() => setShowAddModal(true)}
            className="p-2 text-violet-400 hover:text-violet-300 transition-colors rounded-lg hover:bg-zinc-800"
          >
            <Plus className="w-5 h-5" />
          </button>
        }
      />

      <div className="flex-1 px-4 py-4">
        {contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-zinc-500" />
            </div>
            <p className="text-zinc-400 font-medium">No saved contacts</p>
            <p className="text-sm text-zinc-500 mt-1 mb-6">Add contacts for quick access</p>
            <Button
              variant="primary"
              onClick={() => setShowAddModal(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Contact
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {contacts.map((contact) => (
              <Card key={contact.id} className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white">{contact.name}</p>
                    <p className="text-sm text-zinc-500 font-mono truncate">
                      {formatAddress(contact.address)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopy(contact)}
                      className="p-2 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-zinc-700"
                    >
                      {copiedId === contact.id ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => removeContact(contact.id)}
                      className="p-2 text-zinc-500 hover:text-red-400 transition-colors rounded-lg hover:bg-zinc-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add contact modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setNewName('');
          setNewAddress('');
          setError(null);
        }}
        title="Add Contact"
      >
        <div className="space-y-4">
          <Input
            label="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter contact name"
          />
          <Input
            label="Address"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            placeholder="Enter Solana address"
            error={error || undefined}
          />
          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                setShowAddModal(false);
                setNewName('');
                setNewAddress('');
                setError(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={handleAddContact}
            >
              Add Contact
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
