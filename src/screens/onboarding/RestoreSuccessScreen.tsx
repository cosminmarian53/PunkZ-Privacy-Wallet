import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export const RestoreSuccessScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 flex flex-col items-center justify-center px-6">
      <div className="max-w-sm text-center">
        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">Wallet Restored!</h1>
        <p className="text-slate-400 mb-8">
          Your wallet has been successfully restored. You can now access your funds.
        </p>

        <button
          onClick={() => navigate('/home')}
          className="w-full py-4 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-xl text-white font-semibold flex items-center justify-center gap-2"
        >
          Go to Wallet
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default RestoreSuccessScreen;
