import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TopAppBar } from '../../components/navigation/TopAppBar';
import { Camera, AlertCircle } from 'lucide-react';

export const ScanScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950">
      <TopAppBar title="Scan QR Code" showBack onBack={() => navigate(-1)} />

      <div className="max-w-lg mx-auto px-6 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-6">
          <Camera className="w-10 h-10 text-slate-500" />
        </div>
        
        <h2 className="text-xl font-semibold text-white mb-3 text-center">
          Camera Access Required
        </h2>
        
        <div className="flex items-start gap-2 p-4 bg-slate-800/50 border border-slate-700 rounded-xl mb-6 max-w-sm">
          <AlertCircle className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
          <p className="text-slate-400 text-sm">
            QR code scanning requires camera access. This feature is not available in the web browser.
          </p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 border border-slate-700 rounded-xl text-slate-400 hover:bg-slate-800 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default ScanScreen;
