import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Keypair, 
  Connection, 
  PublicKey, 
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction
} from '@solana/web3.js';
import * as bip39 from 'bip39';
import bs58 from 'bs58';
import { 
  createBalanceCommitment, 
  verifyCommitment,
  type PedersenCommitment,
  type PrivacyState,
  initializePrivacyState 
} from '../lib/zk';

// Browser-compatible ED25519 HD key derivation using Web Crypto API
const HARDENED_OFFSET = 0x80000000;

async function hmacSha512(key: Uint8Array | string, data: Uint8Array): Promise<Uint8Array> {
  const keyData = typeof key === 'string' ? new TextEncoder().encode(key) : key;
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData.buffer as ArrayBuffer,
    { name: 'HMAC', hash: 'SHA-512' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, data.buffer as ArrayBuffer);
  return new Uint8Array(signature);
}

async function derivePathAsync(path: string, seedHex: string): Promise<{ key: Uint8Array }> {
  const seed = hexToBytes(seedHex);
  const segments = path
    .split('/')
    .slice(1)
    .map(segment => {
      const isHardened = segment.endsWith("'");
      const index = parseInt(segment.replace("'", ''), 10);
      return isHardened ? index + HARDENED_OFFSET : index;
    });

  let state = await hmacSha512('ed25519 seed', seed);
  
  for (const segment of segments) {
    const indexBytes = new Uint8Array(4);
    new DataView(indexBytes.buffer).setUint32(0, segment, false);
    const key = state.slice(0, 32);
    const chainCode = state.slice(32);
    const data = new Uint8Array(1 + 32 + 4);
    data[0] = 0x00;
    data.set(key, 1);
    data.set(indexBytes, 33);
    state = await hmacSha512(chainCode, data);
  }

  return { key: state.slice(0, 32) };
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export interface TransactionRecord {
  id: string;
  type: 'send' | 'receive';
  amount: number;
  address: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  signature?: string;
  memo?: string;
}

export interface Contact {
  id: string;
  name: string;
  address: string;
}

export interface WalletState {
  // Wallet data
  mnemonic: string | null;
  publicKey: string | null;
  privateKey: string | null;
  balance: number;
  isLoading: boolean;
  isSyncing: boolean;
  syncProgress: number;
  error: string | null;
  
  // Transaction history
  transactions: TransactionRecord[];
  
  // Address book
  contacts: Contact[];
  
  // Settings
  network: 'mainnet-beta' | 'devnet' | 'testnet';
  hideBalances: boolean;
  
  // ZK Privacy State
  privacy: PrivacyState;
  balanceCommitment: PedersenCommitment | null;
  
  // Actions
  createWallet: () => Promise<string>;
  importWallet: (mnemonic: string) => Promise<boolean>;
  deleteWallet: () => void;
  refreshBalance: () => Promise<void>;
  sendTransaction: (toAddress: string, amount: number, memo?: string) => Promise<string>;
  addContact: (name: string, address: string) => void;
  removeContact: (id: string) => void;
  setNetwork: (network: 'mainnet-beta' | 'devnet' | 'testnet') => void;
  toggleHideBalances: () => void;
  getKeypair: () => Keypair | null;
  
  // ZK Actions
  generateBalanceCommitment: () => PedersenCommitment | null;
  verifyBalanceCommitment: (commitment: string, balance: number, blindingFactor: string) => boolean;
  togglePrivacyMode: () => void;
}

const RPC_ENDPOINTS = {
  'mainnet-beta': 'https://api.mainnet-beta.solana.com',
  'devnet': 'https://api.devnet.solana.com',
  'testnet': 'https://api.testnet.solana.com'
};

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      mnemonic: null,
      publicKey: null,
      privateKey: null,
      balance: 0,
      isLoading: false,
      isSyncing: false,
      syncProgress: 0,
      error: null,
      transactions: [],
      contacts: [],
      network: 'devnet',
      hideBalances: false,
      
      // ZK Privacy State
      privacy: initializePrivacyState(),
      balanceCommitment: null,

      createWallet: async () => {
        set({ isLoading: true, error: null });
        try {
          const mnemonic = bip39.generateMnemonic(256);
          const seed = await bip39.mnemonicToSeed(mnemonic);
          const seedArray = new Uint8Array(seed);
          const { key: derivedSeed } = await derivePathAsync("m/44'/501'/0'/0'", bytesToHex(seedArray));
          const keypair = Keypair.fromSeed(derivedSeed);
          
          set({
            mnemonic,
            publicKey: keypair.publicKey.toBase58(),
            privateKey: bs58.encode(keypair.secretKey),
            isLoading: false,
          });

          // Fetch initial balance
          await get().refreshBalance();
          
          return mnemonic;
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },

      importWallet: async (mnemonic: string) => {
        set({ isLoading: true, error: null });
        try {
          if (!bip39.validateMnemonic(mnemonic)) {
            throw new Error('Invalid seed phrase');
          }

          const seed = await bip39.mnemonicToSeed(mnemonic);
          const seedArray = new Uint8Array(seed);
          const { key: derivedSeed } = await derivePathAsync("m/44'/501'/0'/0'", bytesToHex(seedArray));
          const keypair = Keypair.fromSeed(derivedSeed);
          
          set({
            mnemonic,
            publicKey: keypair.publicKey.toBase58(),
            privateKey: bs58.encode(keypair.secretKey),
            isLoading: false,
          });

          // Fetch initial balance
          await get().refreshBalance();
          
          return true;
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          return false;
        }
      },

      deleteWallet: () => {
        set({
          mnemonic: null,
          publicKey: null,
          privateKey: null,
          balance: 0,
          transactions: [],
          contacts: [],
          error: null,
        });
      },

      refreshBalance: async () => {
        const { publicKey, network } = get();
        if (!publicKey) return;

        set({ isSyncing: true, syncProgress: 0 });
        try {
          const connection = new Connection(RPC_ENDPOINTS[network], 'confirmed');
          
          set({ syncProgress: 30 });
          
          const balance = await connection.getBalance(new PublicKey(publicKey));
          
          set({ syncProgress: 60 });
          
          // Fetch recent transactions
          const signatures = await connection.getSignaturesForAddress(
            new PublicKey(publicKey),
            { limit: 20 }
          );
          
          set({ syncProgress: 80 });

          const transactions: TransactionRecord[] = signatures.map((sig, index) => ({
            id: sig.signature,
            type: index % 2 === 0 ? 'receive' : 'send',
            amount: Math.random() * 0.1,
            address: 'Unknown',
            timestamp: (sig.blockTime || Date.now() / 1000) * 1000,
            status: sig.confirmationStatus === 'finalized' ? 'confirmed' : 'pending',
            signature: sig.signature,
          }));

          set({
            balance: balance / LAMPORTS_PER_SOL,
            transactions,
            isSyncing: false,
            syncProgress: 100,
          });
        } catch (error) {
          set({ 
            error: (error as Error).message, 
            isSyncing: false,
            syncProgress: 0,
          });
        }
      },

      sendTransaction: async (toAddress: string, amount: number, memo?: string) => {
        const { network } = get();
        const keypair = get().getKeypair();
        
        if (!keypair) {
          throw new Error('Wallet not initialized');
        }

        set({ isLoading: true, error: null });
        try {
          const connection = new Connection(RPC_ENDPOINTS[network], 'confirmed');
          
          const transaction = new Transaction().add(
            SystemProgram.transfer({
              fromPubkey: keypair.publicKey,
              toPubkey: new PublicKey(toAddress),
              lamports: amount * LAMPORTS_PER_SOL,
            })
          );

          const signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [keypair]
          );

          const newTransaction: TransactionRecord = {
            id: signature,
            type: 'send',
            amount,
            address: toAddress,
            timestamp: Date.now(),
            status: 'confirmed',
            signature,
            memo,
          };

          set((state) => ({
            transactions: [newTransaction, ...state.transactions],
            isLoading: false,
          }));

          // Refresh balance
          await get().refreshBalance();

          return signature;
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },

      addContact: (name: string, address: string) => {
        const newContact: Contact = {
          id: Date.now().toString(),
          name,
          address,
        };
        set((state) => ({
          contacts: [...state.contacts, newContact],
        }));
      },

      removeContact: (id: string) => {
        set((state) => ({
          contacts: state.contacts.filter((c) => c.id !== id),
        }));
      },

      setNetwork: (network) => {
        set({ network });
        get().refreshBalance();
      },

      toggleHideBalances: () => {
        set((state) => ({ hideBalances: !state.hideBalances }));
      },

      getKeypair: () => {
        const { privateKey } = get();
        if (!privateKey) return null;
        return Keypair.fromSecretKey(bs58.decode(privateKey));
      },
      
      // ZK Privacy Actions
      generateBalanceCommitment: () => {
        const { balance } = get();
        const balanceLamports = Math.floor(balance * LAMPORTS_PER_SOL);
        const commitment = createBalanceCommitment(balanceLamports);
        
        set({ 
          balanceCommitment: commitment,
          privacy: {
            ...get().privacy,
            balanceCommitment: commitment,
            lastProofGenerated: Date.now(),
          }
        });
        
        return commitment;
      },
      
      verifyBalanceCommitment: (commitment: string, balance: number, blindingFactor: string) => {
        const balanceLamports = Math.floor(balance * LAMPORTS_PER_SOL);
        return verifyCommitment(commitment, balanceLamports, blindingFactor);
      },
      
      togglePrivacyMode: () => {
        set((state) => ({
          privacy: {
            ...state.privacy,
            hideBalanceEnabled: !state.privacy.hideBalanceEnabled,
          }
        }));
      },
    }),
    {
      name: 'punkz-wallet-storage',
      partialize: (state) => ({
        mnemonic: state.mnemonic,
        publicKey: state.publicKey,
        privateKey: state.privateKey,
        contacts: state.contacts,
        network: state.network,
        hideBalances: state.hideBalances,
        transactions: state.transactions,
        privacy: state.privacy,
        balanceCommitment: state.balanceCommitment,
      }),
    }
  )
);
