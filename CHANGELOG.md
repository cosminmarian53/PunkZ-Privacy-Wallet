# PunkZ Wallet - Development Changelog

A detailed log of project progress, features, and improvements.

---

## [1.3.0] - 2026-01-09

### 🔗 WalletConnect v2 Integration (Major Feature)

#### Added
- **WalletConnect Sign Client** integration for dApp connectivity
  - Support for WalletConnect v2 protocol
  - QR code scanning and URI paste functionality
  - Session management (connect, disconnect, view active sessions)

- **Global Signing Request Modal**
  - Popup appears on any screen when dApps request signatures
  - Supports `solana_signMessage` - Message signing
  - Supports `solana_signTransaction` - Transaction signing
  - Supports `solana_signAndSendTransaction` - Sign and broadcast

- **Multi-Network Support for WalletConnect**
  - Dynamic chain ID based on selected network
  - Mainnet: `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp`
  - Devnet: `solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1`
  - Testnet: `solana:4uhcVJyU9pJkvQyS88uRDiswHXSCkY3z`

#### Fixed
- Network switching now properly refreshes balance for selected network
- Balance and transactions clear immediately on network change
- WalletConnect sessions now appear without requiring page refresh
- Modal properly dismisses after approving/rejecting sessions

#### Files Added
- `src/lib/walletconnect/index.ts` - WalletConnect manager singleton
- `src/hooks/useWalletConnect.ts` - React hook for WC state management
- `src/screens/settings/WalletConnectScreen.tsx` - Connection management UI
- `src/components/walletconnect/WalletConnectRequestModal.tsx` - Global signing modal

---

## [1.2.0] - 2026-01-09

### 🧪 Testing Infrastructure

#### Added
- **Vitest Testing Framework**
  - Configured with jsdom environment for React testing
  - Mock setup for browser APIs (crypto, localStorage)
  
- **ZK Module Unit Tests** (20 tests total)
  - Pedersen Commitment tests (10 tests)
    - Commitment generation and verification
    - Different balance handling
    - Invalid commitment detection
    - Blinding factor uniqueness
  - Stealth Address tests (10 tests)
    - Keypair generation
    - Stealth address derivation
    - Ephemeral key handling
    - Shared secret computation

#### Files Added
- `vitest.config.ts` - Test configuration
- `src/test/setup.ts` - Test environment setup with mocks
- `src/lib/zk/commitments.test.ts` - Pedersen commitment tests
- `src/lib/zk/stealth.test.ts` - Stealth address tests

---

## [1.1.0] - 2026-01-09

### 📊 Transaction History Improvements

#### Added
- **Real Transaction Data**
  - Fetches actual transaction details from Solana RPC
  - Calculates real balance changes from pre/post balances
  - Determines send/receive type accurately

- **Transaction Detail Modal**
  - Clickable transactions open detailed view
  - Shows full signature, addresses, amounts
  - Copy buttons for all data fields
  - Direct link to Solana Explorer

#### Fixed
- Transaction amounts no longer show random values
- Proper counterparty address detection
- Accurate timestamp formatting

---

## [1.0.0] - 2026-01-08

### 🔐 Zero-Knowledge Privacy Features (Major Feature)

#### Added
- **Pedersen Commitments**
  - Cryptographic balance hiding
  - Commitment generation with blinding factors
  - Zero-knowledge verification proofs
  - Privacy mode toggle in settings

- **Stealth Addresses**
  - One-time address generation for receiving
  - Ephemeral keypair system
  - Unlinkable transaction receiving
  - Stealth address management screen

#### Files Added
- `src/lib/zk/index.ts` - ZK module exports
- `src/lib/zk/commitments.ts` - Pedersen commitment implementation
- `src/lib/zk/stealth.ts` - Stealth address implementation
- `src/screens/settings/PrivacyScreen.tsx` - Privacy settings UI
- `src/screens/settings/StealthScreen.tsx` - Stealth address management

---

## [0.9.0] - 2026-01-07

### 💼 Core Wallet Features

#### Added
- **Wallet Creation & Import**
  - BIP39 mnemonic generation (24 words)
  - HD wallet derivation (m/44'/501'/0'/0')
  - Seed phrase backup and restore
  - Secure key storage

- **Balance & Transactions**
  - Real-time SOL balance fetching
  - Transaction history display
  - Send SOL functionality
  - Receive with QR code

- **Multi-Network Support**
  - Mainnet-beta
  - Devnet (default)
  - Testnet

- **Settings**
  - Network selection
  - Address book / contacts
  - Security settings
  - About screen

#### UI/UX
- Cyberpunk/Neon 80s aesthetic
- Gradient backgrounds and neon glows
- Responsive mobile-first design
- Bottom navigation
- Top app bar with back navigation

---

## [0.1.0] - 2026-01-06

### 🚀 Project Initialization

#### Added
- React 19 + TypeScript + Vite setup
- Tailwind CSS v4 configuration
- ESLint configuration
- Project structure scaffolding

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    PunkZ Wallet                         │
├─────────────────────────────────────────────────────────┤
│  UI Layer (React 19 + TypeScript)                       │
│  ├── Screens (Home, Send, Receive, Settings, etc.)     │
│  ├── Components (Navigation, Modals, Widgets)          │
│  └── Hooks (useWalletConnect, custom hooks)            │
├─────────────────────────────────────────────────────────┤
│  State Management (Zustand + Persist)                   │
│  └── walletStore.ts (wallet, network, transactions)    │
├─────────────────────────────────────────────────────────┤
│  Crypto Layer                                           │
│  ├── ZK Module (Pedersen, Stealth Addresses)           │
│  ├── Key Derivation (BIP39, ED25519)                   │
│  └── WalletConnect (Sign Client v2)                    │
├─────────────────────────────────────────────────────────┤
│  Solana Integration (@solana/web3.js)                   │
│  └── RPC Connection (Mainnet, Devnet, Testnet)         │
└─────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React 19, TypeScript 5.x |
| Build | Vite 7.3.1 |
| Styling | Tailwind CSS v4 |
| State | Zustand with persist middleware |
| Blockchain | @solana/web3.js |
| Crypto | tweetnacl, bip39, bs58 |
| dApp Connect | @walletconnect/sign-client v2 |
| Testing | Vitest 4.0.16, @testing-library/react |
| Icons | Lucide React |

---

## Future Roadmap

- [ ] Token (SPL) support
- [ ] NFT gallery view
- [ ] Hardware wallet integration
- [ ] Multi-account support
- [ ] Transaction simulation/preview
- [ ] Push notifications for incoming transactions
- [ ] Biometric authentication
- [ ] Dark/Light theme toggle
