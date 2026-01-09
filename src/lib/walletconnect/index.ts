import SignClient from '@walletconnect/sign-client';
import { SessionTypes, SignClientTypes } from '@walletconnect/types';

// WalletConnect Project ID from environment variable
const PROJECT_ID = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'ef86d17069657ef5591e653b8a3fb70a';

export interface WalletConnectSession {
  topic: string;
  peerMeta: {
    name: string;
    description: string;
    url: string;
    icons: string[];
  };
  chains: string[];
  accounts: string[];
  expiry: number;
}

export interface PendingRequest {
  id: number;
  topic: string;
  method: string;
  params: unknown;
  peerMeta: {
    name: string;
    url: string;
    icons: string[];
  };
}

export type WalletConnectEventHandler = {
  onSessionProposal?: (proposal: SignClientTypes.EventArguments['session_proposal']) => void;
  onSessionRequest?: (request: SignClientTypes.EventArguments['session_request']) => void;
  onSessionDelete?: (session: { topic: string }) => void;
};

class WalletConnectManager {
  private client: SignClient | null = null;
  private sessions: Map<string, SessionTypes.Struct> = new Map();
  private eventHandlers: WalletConnectEventHandler = {};
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      this.client = await SignClient.init({
        projectId: PROJECT_ID,
        metadata: {
          name: 'PunkZ Wallet',
          description: 'A cyberpunk-themed Solana wallet with ZK privacy features',
          url: 'https://punkz-wallet.app',
          icons: ['https://punkz-wallet.app/icon.png'],
        },
      });

      this.setupEventListeners();
      this.initialized = true;
      
      // Restore existing sessions
      const existingSessions = this.client.session.getAll();
      existingSessions.forEach(session => {
        this.sessions.set(session.topic, session);
      });
      
      console.log('[WalletConnect] Initialized with', existingSessions.length, 'existing sessions');
    } catch (error) {
      console.error('[WalletConnect] Failed to initialize:', error);
      throw error;
    }
  }

  private setupEventListeners(): void {
    if (!this.client) return;

    // Session proposal - when a dApp wants to connect
    this.client.on('session_proposal', async (proposal) => {
      console.log('[WalletConnect] Session proposal received:', proposal);
      this.eventHandlers.onSessionProposal?.(proposal);
    });

    // Session request - when a dApp requests a signature
    this.client.on('session_request', async (request) => {
      console.log('[WalletConnect] Session request received:', request);
      this.eventHandlers.onSessionRequest?.(request);
    });

    // Session delete - when a session is disconnected
    this.client.on('session_delete', ({ topic }) => {
      console.log('[WalletConnect] Session deleted:', topic);
      this.sessions.delete(topic);
      this.eventHandlers.onSessionDelete?.({ topic });
    });
  }

  setEventHandlers(handlers: WalletConnectEventHandler): void {
    this.eventHandlers = handlers;
  }

  async pair(uri: string): Promise<void> {
    if (!this.client) {
      throw new Error('WalletConnect not initialized');
    }

    try {
      await this.client.core.pairing.pair({ uri });
      console.log('[WalletConnect] Pairing initiated');
    } catch (error) {
      console.error('[WalletConnect] Failed to pair:', error);
      throw error;
    }
  }

  async approveSession(
    proposal: SignClientTypes.EventArguments['session_proposal'],
    publicKey: string
  ): Promise<SessionTypes.Struct> {
    if (!this.client) {
      throw new Error('WalletConnect not initialized');
    }

    const { id, params } = proposal;
    const { requiredNamespaces, optionalNamespaces } = params;

    // Build the namespace for Solana
    const solanaNamespace = {
      chains: ['solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp'], // Solana Devnet
      methods: [
        'solana_signTransaction',
        'solana_signMessage',
        'solana_signAndSendTransaction',
      ],
      events: ['accountsChanged', 'chainChanged'],
      accounts: [`solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp:${publicKey}`],
    };

    const namespaces: SessionTypes.Namespaces = {
      solana: solanaNamespace,
    };

    try {
      const session = await this.client.approve({
        id,
        namespaces,
      });

      this.sessions.set(session.topic, session);
      console.log('[WalletConnect] Session approved:', session.topic);
      return session;
    } catch (error) {
      console.error('[WalletConnect] Failed to approve session:', error);
      throw error;
    }
  }

  async rejectSession(
    proposal: SignClientTypes.EventArguments['session_proposal']
  ): Promise<void> {
    if (!this.client) {
      throw new Error('WalletConnect not initialized');
    }

    try {
      await this.client.reject({
        id: proposal.id,
        reason: {
          code: 4001,
          message: 'User rejected the session',
        },
      });
      console.log('[WalletConnect] Session rejected');
    } catch (error) {
      console.error('[WalletConnect] Failed to reject session:', error);
      throw error;
    }
  }

  async respondToRequest(
    topic: string,
    requestId: number,
    result: unknown
  ): Promise<void> {
    if (!this.client) {
      throw new Error('WalletConnect not initialized');
    }

    try {
      await this.client.respond({
        topic,
        response: {
          id: requestId,
          jsonrpc: '2.0',
          result,
        },
      });
      console.log('[WalletConnect] Request response sent');
    } catch (error) {
      console.error('[WalletConnect] Failed to respond to request:', error);
      throw error;
    }
  }

  async rejectRequest(
    topic: string,
    requestId: number,
    message = 'User rejected the request'
  ): Promise<void> {
    if (!this.client) {
      throw new Error('WalletConnect not initialized');
    }

    try {
      await this.client.respond({
        topic,
        response: {
          id: requestId,
          jsonrpc: '2.0',
          error: {
            code: 4001,
            message,
          },
        },
      });
      console.log('[WalletConnect] Request rejected');
    } catch (error) {
      console.error('[WalletConnect] Failed to reject request:', error);
      throw error;
    }
  }

  async disconnectSession(topic: string): Promise<void> {
    if (!this.client) {
      throw new Error('WalletConnect not initialized');
    }

    try {
      await this.client.disconnect({
        topic,
        reason: {
          code: 6000,
          message: 'User disconnected',
        },
      });
      this.sessions.delete(topic);
      console.log('[WalletConnect] Session disconnected:', topic);
    } catch (error) {
      console.error('[WalletConnect] Failed to disconnect session:', error);
      throw error;
    }
  }

  getSessions(): WalletConnectSession[] {
    // Sync sessions from the client to ensure we have the latest
    if (this.client) {
      const clientSessions = this.client.session.getAll();
      clientSessions.forEach(session => {
        if (!this.sessions.has(session.topic)) {
          this.sessions.set(session.topic, session);
        }
      });
    }
    
    return Array.from(this.sessions.values())
      .filter(session => session.peer?.metadata) // Filter out sessions without peer metadata
      .map(session => ({
        topic: session.topic,
        peerMeta: {
          name: session.peer?.metadata?.name || 'Unknown dApp',
          description: session.peer?.metadata?.description || '',
          url: session.peer?.metadata?.url || '',
          icons: session.peer?.metadata?.icons || [],
        },
        chains: Object.values(session.namespaces || {}).flatMap(ns => ns.chains || []),
        accounts: Object.values(session.namespaces || {}).flatMap(ns => ns.accounts || []),
        expiry: session.expiry,
      }));
  }

  getSession(topic: string): SessionTypes.Struct | undefined {
    return this.sessions.get(topic);
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}

// Singleton instance
export const walletConnectManager = new WalletConnectManager();
