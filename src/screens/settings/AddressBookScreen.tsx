import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TopAppBar } from '../../components/navigation/TopAppBar';
import { useWalletStore } from '../../store/walletStore';
import { Plus, User, Trash2 } from 'lucide-react';

export const AddressBookScreen: React.FC = () => {
  const navigate = useNavigate();
  const { contacts } = useWalletStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950">
      <TopAppBar title="Address Book" showBack onBack={() => navigate('/settings')} />

      <div className="max-w-lg mx-auto px-6 py-4">
        {/* Add Contact Button */}
        <button className="w-full flex items-center justify-center gap-2 p-4 border border-dashed border-slate-700 rounded-2xl text-slate-400 hover:border-fuchsia-500/50 hover:text-fuchsia-400 transition-colors mb-6">
          <Plus className="w-5 h-5" />
          Add New Contact
        </button>

        {/* Contacts List */}
        {contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-slate-500" />
            </div>
            <p className="text-white font-medium mb-1">No contacts yet</p>
            <p className="text-slate-500 text-sm">Save addresses for quick transfers</p>
          </div>
        ) : (
          <div className="space-y-2">
            {contacts.map((contact) => (
              <div
                key={contact.address}
                className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-xl"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-fuchsia-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-fuchsia-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-medium">{contact.name}</p>
                    <p className="text-slate-500 text-sm font-mono truncate">{contact.address}</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-slate-700 rounded-lg">
                  <Trash2 className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressBookScreen;
