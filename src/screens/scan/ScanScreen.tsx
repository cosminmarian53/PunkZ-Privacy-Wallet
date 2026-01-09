import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TopAppBar } from '../../components/navigation/TopAppBar';
import { Button } from '../../components/ui/Button';
import { Camera, QrCode } from 'lucide-react';

export const ScanScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-zinc-900 via-zinc-950 to-black">
      <TopAppBar title="Scan QR Code" showBack />

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* QR Scanner Placeholder */}
        <div className="w-64 h-64 bg-zinc-800 rounded-2xl flex flex-col items-center justify-center mb-6 border-2 border-dashed border-zinc-700">
          <QrCode className="w-16 h-16 text-zinc-600 mb-4" />
          <p className="text-zinc-500 text-sm text-center px-4">
            Camera access required to scan QR codes
          </p>
        </div>

        <p className="text-zinc-400 text-center mb-6 max-w-xs">
          Position a Solana address QR code within the frame to scan
        </p>

        <div className="space-y-3 w-full max-w-xs">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            leftIcon={<Camera className="w-4 h-4" />}
            onClick={() => {
              // In a real app, this would request camera permissions
              alert('Camera feature would be enabled in a native app or with proper permissions');
            }}
          >
            Enable Camera
          </Button>
          
          <Button
            variant="ghost"
            size="lg"
            fullWidth
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
