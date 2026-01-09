import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { CheckCircle2 } from 'lucide-react';

export const RestoreSuccessScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-zinc-900 via-zinc-950 to-black px-6">
      <div className="flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-3">
          Wallet Restored!
        </h1>
        <p className="text-zinc-400 max-w-xs mb-8">
          Your wallet has been successfully restored. You can now access your funds.
        </p>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => navigate('/home')}
        >
          Go to Wallet
        </Button>
      </div>
    </div>
  );
};
