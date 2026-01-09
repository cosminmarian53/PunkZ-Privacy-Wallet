import { useState, useEffect, useCallback } from 'react';
import { 
  walletConnectManager, 
  type WalletConnectSession, 
  type PendingRequest 
} from '../lib/walletconnect';
import { SignClientTypes } from '@walletconnect/types';

export interface UseWalletConnectReturn {
  isInitialized: boolean;
  isConnecting: boolean;
  sessions: WalletConnectSession[];
  pendingProposal: SignClientTypes.EventArguments['session_proposal'] | null;
  pendingRequest: SignClientTypes.EventArguments['session_request'] | null;
  error: string | null;
  
  // Actions
  initialize: () => Promise<void>;
  connect: (uri: string) => Promise<void>;
  approveSession: (publicKey: string) => Promise<void>;
  rejectSession: () => Promise<void>;
  approveRequest: (result: unknown) => Promise<void>;
  rejectRequest: () => Promise<void>;
  disconnect: (topic: string) => Promise<void>;
}

export const useWalletConnect = (): UseWalletConnectReturn => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [sessions, setSessions] = useState<WalletConnectSession[]>([]);
  const [pendingProposal, setPendingProposal] = useState<SignClientTypes.EventArguments['session_proposal'] | null>(null);
  const [pendingRequest, setPendingRequest] = useState<SignClientTypes.EventArguments['session_request'] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize WalletConnect
  const initialize = useCallback(async () => {
    try {
      await walletConnectManager.initialize();
      setIsInitialized(true);
      setSessions(walletConnectManager.getSessions());
      
      // Set up event handlers
      walletConnectManager.setEventHandlers({
        onSessionProposal: (proposal) => {
          setPendingProposal(proposal);
        },
        onSessionRequest: (request) => {
          setPendingRequest(request);
        },
        onSessionDelete: () => {
          setSessions(walletConnectManager.getSessions());
        },
      });
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  // Connect via WalletConnect URI
  const connect = useCallback(async (uri: string) => {
    setIsConnecting(true);
    setError(null);
    
    try {
      await walletConnectManager.pair(uri);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Approve pending session proposal
  const approveSession = useCallback(async (publicKey: string) => {
    if (!pendingProposal) return;
    
    try {
      await walletConnectManager.approveSession(pendingProposal, publicKey);
      setSessions(walletConnectManager.getSessions());
      setPendingProposal(null);
    } catch (err) {
      setError((err as Error).message);
    }
  }, [pendingProposal]);

  // Reject pending session proposal
  const rejectSession = useCallback(async () => {
    if (!pendingProposal) return;
    
    try {
      await walletConnectManager.rejectSession(pendingProposal);
      setPendingProposal(null);
    } catch (err) {
      setError((err as Error).message);
    }
  }, [pendingProposal]);

  // Approve pending request
  const approveRequest = useCallback(async (result: unknown) => {
    if (!pendingRequest) return;
    
    try {
      await walletConnectManager.respondToRequest(
        pendingRequest.topic,
        pendingRequest.id,
        result
      );
      setPendingRequest(null);
    } catch (err) {
      setError((err as Error).message);
    }
  }, [pendingRequest]);

  // Reject pending request
  const rejectRequest = useCallback(async () => {
    if (!pendingRequest) return;
    
    try {
      await walletConnectManager.rejectRequest(
        pendingRequest.topic,
        pendingRequest.id
      );
      setPendingRequest(null);
    } catch (err) {
      setError((err as Error).message);
    }
  }, [pendingRequest]);

  // Disconnect session
  const disconnect = useCallback(async (topic: string) => {
    try {
      await walletConnectManager.disconnectSession(topic);
      setSessions(walletConnectManager.getSessions());
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  // Auto-initialize on mount
  useEffect(() => {
    if (!isInitialized && !walletConnectManager.isInitialized()) {
      initialize();
    } else if (walletConnectManager.isInitialized()) {
      setIsInitialized(true);
      setSessions(walletConnectManager.getSessions());
    }
  }, [initialize, isInitialized]);

  return {
    isInitialized,
    isConnecting,
    sessions,
    pendingProposal,
    pendingRequest,
    error,
    initialize,
    connect,
    approveSession,
    rejectSession,
    approveRequest,
    rejectRequest,
    disconnect,
  };
};
