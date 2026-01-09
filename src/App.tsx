import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useWalletStore } from './store/walletStore';

// Landing page
import { LandingPage } from './screens/landing/LandingPage';

// Onboarding screens
import { OnboardingScreen, BackupScreen, RestoreScreen, RestoreSuccessScreen } from './screens/onboarding';

// Main screens
import { HomeScreen } from './screens/home';
import { ReceiveScreen } from './screens/receive';
import { SendScreen } from './screens/send';
import { HistoryScreen } from './screens/history';
import { SwapScreen } from './screens/swap';
import { ScanScreen } from './screens/scan';

// Settings screens
import { 
  SettingsScreen, 
  BackupSettingsScreen, 
  AddressBookScreen, 
  AboutScreen, 
  SecurityScreen 
} from './screens/settings';

// Auth guard component
const RequireWallet: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { publicKey } = useWalletStore();
  
  if (!publicKey) {
    return <Navigate to="/onboarding" replace />;
  }
  
  return <>{children}</>;
};

// Redirect if already has wallet
const RedirectIfWallet: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { publicKey } = useWalletStore();
  
  if (publicKey) {
    return <Navigate to="/home" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen w-full bg-[#0d0221]">
        <Routes>
          {/* Landing page - always accessible */}
          <Route path="/" element={<LandingPage />} />

          {/* Onboarding routes */}
          <Route path="/onboarding" element={
            <RedirectIfWallet>
              <OnboardingScreen />
            </RedirectIfWallet>
          } />
          <Route path="/backup" element={<BackupScreen />} />
          <Route path="/restore" element={
            <RedirectIfWallet>
              <RestoreScreen />
            </RedirectIfWallet>
          } />
          <Route path="/restore-success" element={<RestoreSuccessScreen />} />

          {/* Main wallet routes */}
          <Route path="/home" element={
            <RequireWallet>
              <HomeScreen />
            </RequireWallet>
          } />
          <Route path="/receive" element={
            <RequireWallet>
              <ReceiveScreen />
            </RequireWallet>
          } />
          <Route path="/send" element={
            <RequireWallet>
              <SendScreen />
            </RequireWallet>
          } />
          <Route path="/history" element={
            <RequireWallet>
              <HistoryScreen />
            </RequireWallet>
          } />
          <Route path="/swap" element={
            <RequireWallet>
              <SwapScreen />
            </RequireWallet>
          } />
          <Route path="/scan" element={
            <RequireWallet>
              <ScanScreen />
            </RequireWallet>
          } />

          {/* Settings routes */}
          <Route path="/settings" element={
            <RequireWallet>
              <SettingsScreen />
            </RequireWallet>
          } />
          <Route path="/settings/backup" element={
            <RequireWallet>
              <BackupSettingsScreen />
            </RequireWallet>
          } />
          <Route path="/settings/addressbook" element={
            <RequireWallet>
              <AddressBookScreen />
            </RequireWallet>
          } />
          <Route path="/settings/security" element={
            <RequireWallet>
              <SecurityScreen />
            </RequireWallet>
          } />
          <Route path="/settings/about" element={
            <RequireWallet>
              <AboutScreen />
            </RequireWallet>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
