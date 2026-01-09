# 🎮 PunkZ Wallet

<div align="center">

![PunkZ Wallet](https://img.shields.io/badge/PunkZ-Wallet-ff00ff?style=for-the-badge&logo=solana&logoColor=white)
![Solana](https://img.shields.io/badge/Solana-Devnet-00f0ff?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript)
![ZK](https://img.shields.io/badge/ZK-Pedersen-9945FF?style=for-the-badge)

### **A Cyberpunk-Themed Solana Wallet with Zero-Knowledge Cryptography**

*Retro aesthetics. Modern functionality. Privacy-focused architecture.*

[🚀 Live Demo](#) · [🐛 Report Bug](https://github.com/yourusername/punkz-wallet/issues) · [✨ Request Feature](https://github.com/yourusername/punkz-wallet/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Zero-Knowledge Privacy](#-zero-knowledge-privacy)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Tech Stack](#-tech-stack)
- [Security Model](#-security-model)
- [Network Configuration](#-network-configuration)
- [Design System](#-design-system)
- [API Reference](#-api-reference)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

---

## 🌟 Overview

PunkZ Wallet is a non-custodial Solana wallet built with a focus on user experience, privacy awareness, and developer education. Inspired by the architecture of [Zashi Android](https://github.com/Electric-Coin-Company/zashi-android) (Zcash's official wallet), PunkZ brings privacy-focused design patterns to the Solana ecosystem.

### Why PunkZ?

| Problem | PunkZ Solution |
|---------|---------------|
| Most wallets have boring UIs | Stunning 80s cyberpunk aesthetic with neon effects |
| Privacy is an afterthought | Built-in ZK commitment system for off-chain proofs |
| Complex onboarding | 3-step wallet creation with clear guidance |
| Centralized dependencies | Fully client-side, no backend required |

---

## ✨ Features

### Core Wallet Functionality

- 💰 **Send & Receive SOL** - Intuitive transaction interface with QR code support
- 📊 **Balance Tracking** - Real-time balance updates from Solana RPC
- 📜 **Transaction History** - View all past transactions with status indicators
- 📇 **Address Book** - Save frequently used addresses
- 🔄 **Token Swaps** - (Coming soon) DEX integration for token swaps

### Security Features

- 🔐 **HD Wallet** - BIP39 mnemonic-based hierarchical deterministic wallet
- 🔑 **Self-Custody** - Your keys never leave your device
- 🛡️ **Web Crypto API** - Browser-native cryptography for key derivation
- 💾 **Local Storage** - Encrypted wallet data with no server dependencies

### User Experience

- 🌈 **Neon Cyberpunk UI** - Glowing effects, animated gradients, retro fonts
- 📱 **Fully Responsive** - Works on desktop, tablet, and mobile
- ⚡ **Instant Feedback** - Optimistic UI updates with loading states
- 🌐 **Multi-Network** - Switch between Mainnet, Devnet, and Testnet

---

## 🔐 Zero-Knowledge Privacy

### What We Implement: Pedersen Commitments

PunkZ includes a Zero-Knowledge cryptography module that implements **Pedersen Commitments** — the same cryptographic primitive used in privacy-focused blockchains like Zcash and Monero.

```
┌─────────────────────────────────────────────────────────────────┐
│                    PEDERSEN COMMITMENT                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Your Balance: 1.5 SOL (1,500,000,000 lamports)                │
│                                                                  │
│   Step 1: Generate random blinding factor (r)                   │
│   Step 2: Compute commitment: C = G^balance × H^r (mod p)       │
│   Step 3: Hash result for fixed-size output                     │
│                                                                  │
│   Output:                                                        │
│   ├── Commitment: "a3f8b2c1..." (shareable publicly)            │
│   └── Blinding Factor: "7f3a9c2b..." (keep secret!)             │
│                                                                  │
│   Properties:                                                    │
│   • HIDING: Cannot determine balance from commitment             │
│   • BINDING: Cannot fake a different balance later               │
│   • VERIFIABLE: Only YOU can prove what's committed              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### ⚠️ Important: On-Chain vs Off-Chain Privacy

| Aspect | Status | Explanation |
|--------|--------|-------------|
| **On-Chain Balance** | ❌ PUBLIC | Solana is a transparent blockchain. Anyone with your address can see your balance on explorers like Solscan or Solana Explorer. |
| **On-Chain Transactions** | ❌ PUBLIC | All transactions are visible on the public ledger. |
| **Off-Chain Proofs** | ✅ PRIVATE | ZK commitments let you prove properties about your balance without revealing the actual amount to counterparties. |

### Use Cases for ZK Commitments

1. **OTC Trading** - Prove you have sufficient funds without revealing your total holdings
2. **Proof of Solvency** - Demonstrate liquidity to trading partners
3. **Confidential Negotiations** - "I can afford this" without showing exact balance
4. **Audit Trails** - Create verifiable records without exposing amounts

### ZK Module API

```typescript
import { 
  createBalanceCommitment,
  verifyCommitment,
  createRangeProof 
} from './lib/zk';

// Create a commitment to your balance
const commitment = createBalanceCommitment(balanceInLamports);
// Returns: { commitment: string, blindingFactor: string, timestamp: number }

// Verify a commitment (only possible with blinding factor)
const isValid = verifyCommitment(
  commitment.commitment, 
  balance, 
  commitment.blindingFactor
);

// Create a range proof (prove 0 <= balance <= max)
const proof = createRangeProof(balance, maxBalance, blindingFactor, commitment);
```

### Cryptographic Details

| Parameter | Value | Description |
|-----------|-------|-------------|
| Prime (p) | secp256k1 order | `0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141` |
| Generator G | secp256k1 base point x | Used for balance component |
| Generator H | secp256k1 point | Used for blinding factor component |
| Hash | Custom 256-bit | DJB2-based multi-round hash |

---

## 🏗️ Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         PunkZ Wallet                             │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   React UI   │  │   Zustand    │  │   ZK Module  │          │
│  │   (Screens)  │◄─┤    Store     │◄─┤ (Commitments)│          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│         │                  │                                     │
│         ▼                  ▼                                     │
│  ┌──────────────┐  ┌──────────────┐                             │
│  │  Components  │  │  LocalStorage│                             │
│  │   (UI Kit)   │  │  (Persist)   │                             │
│  └──────────────┘  └──────────────┘                             │
│                           │                                      │
├───────────────────────────┼──────────────────────────────────────┤
│                           ▼                                      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    @solana/web3.js                          │ │
│  │                    (RPC Client)                             │ │
│  └────────────────────────────────────────────────────────────┘ │
│                           │                                      │
└───────────────────────────┼──────────────────────────────────────┘
                            ▼
              ┌──────────────────────────┐
              │    Solana Blockchain     │
              │  (Mainnet/Devnet/Testnet)│
              └──────────────────────────┘
```

### State Management Flow

```
User Action → Component → Store Action → State Update → Re-render
     │                         │
     │                         ├── refreshBalance() → RPC Call → Update
     │                         ├── sendTransaction() → Sign → Submit
     │                         └── generateCommitment() → ZK Computation
     │
     └── Persist to localStorage via Zustand middleware
```

### Key Derivation Path

```
BIP39 Mnemonic (24 words)
         │
         ▼
    PBKDF2 (seed)
         │
         ▼
   HMAC-SHA512
         │
         ▼
  Solana Path: m/44'/501'/0'/0'
         │
         ▼
   Ed25519 Keypair
   ├── Public Key (address)
   └── Private Key (signing)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** 9.0+ or **pnpm** 8.0+ (recommended)
- Modern browser with Web Crypto API support

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/punkz-wallet.git
cd punkz-wallet

# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
# or
pnpm dev
```

### Build for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

### Getting Test SOL (Devnet)

```bash
# Option 1: Solana CLI
solana airdrop 2 YOUR_WALLET_ADDRESS --url devnet

# Option 2: Web Faucet
# Visit https://faucet.solana.com and paste your address
```

---

## 📁 Project Structure

```
punkz-wallet/
├── src/
│   ├── components/                 # Reusable UI components
│   │   ├── navigation/
│   │   │   ├── TopAppBar.tsx       # Top navigation with back button
│   │   │   └── BottomNavigation.tsx # Tab bar navigation
│   │   ├── wallet/
│   │   │   ├── BalanceWidget.tsx   # Balance display with animations
│   │   │   ├── TransactionItem.tsx # Single transaction row
│   │   │   └── TransactionList.tsx # List of transactions
│   │   └── ui/
│   │       ├── Button.tsx          # Styled button component
│   │       ├── Card.tsx            # Card container
│   │       ├── Input.tsx           # Form input
│   │       └── Modal.tsx           # Modal dialog
│   │
│   ├── screens/                    # Page-level components
│   │   ├── landing/
│   │   │   └── LandingPage.tsx     # Marketing landing page
│   │   ├── onboarding/
│   │   │   ├── OnboardingScreen.tsx # Create/Import choice
│   │   │   ├── BackupScreen.tsx    # Mnemonic display
│   │   │   ├── RestoreScreen.tsx   # Import mnemonic
│   │   │   └── RestoreSuccessScreen.tsx
│   │   ├── home/
│   │   │   └── HomeScreen.tsx      # Main wallet dashboard
│   │   ├── send/
│   │   │   └── SendScreen.tsx      # Send transaction
│   │   ├── receive/
│   │   │   └── ReceiveScreen.tsx   # QR code display
│   │   ├── history/
│   │   │   └── HistoryScreen.tsx   # Transaction history
│   │   ├── swap/
│   │   │   └── SwapScreen.tsx      # Token swap (WIP)
│   │   ├── scan/
│   │   │   └── ScanScreen.tsx      # QR scanner
│   │   └── settings/
│   │       ├── SettingsScreen.tsx  # Settings menu
│   │       ├── SecurityScreen.tsx  # Security options
│   │       ├── NetworkScreen.tsx   # Network selector
│   │       ├── PrivacyScreen.tsx   # ZK Privacy dashboard
│   │       ├── BackupSettingsScreen.tsx
│   │       ├── AddressBookScreen.tsx
│   │       └── AboutScreen.tsx
│   │
│   ├── lib/                        # Core libraries
│   │   └── zk/
│   │       ├── index.ts            # ZK module exports
│   │       └── commitments.ts      # Pedersen commitment implementation
│   │
│   ├── store/
│   │   └── walletStore.ts          # Zustand state management
│   │
│   ├── types/                      # TypeScript type definitions
│   │
│   ├── App.tsx                     # Root component with routing
│   ├── main.tsx                    # Entry point
│   └── index.css                   # Global styles & neon effects
│
├── public/                         # Static assets
├── index.html                      # HTML template
├── vite.config.ts                  # Vite configuration
├── tailwind.config.ts              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
└── package.json                    # Dependencies
```

---

## 🛠️ Tech Stack

### Frontend Framework

| Package | Version | Purpose |
|---------|---------|---------|
| React | 19.2.0 | UI framework with concurrent features |
| React DOM | 19.2.0 | DOM rendering |
| React Router DOM | 7.12.0 | Client-side routing |

### Styling

| Package | Version | Purpose |
|---------|---------|---------|
| Tailwind CSS | 4.1.18 | Utility-first CSS framework |
| @tailwindcss/vite | 4.1.18 | Vite integration for Tailwind v4 |

### State Management

| Package | Version | Purpose |
|---------|---------|---------|
| Zustand | 5.0.9 | Lightweight state management |
| zustand/middleware | - | Persist middleware for localStorage |

### Blockchain

| Package | Version | Purpose |
|---------|---------|---------|
| @solana/web3.js | 1.98.4 | Solana RPC client |
| @solana/spl-token | 0.4.14 | SPL token operations |
| bs58 | 6.0.0 | Base58 encoding/decoding |

### Cryptography

| Package | Version | Purpose |
|---------|---------|---------|
| bip39 | 3.1.0 | Mnemonic generation/validation |
| @noble/ed25519 | 3.0.0 | Ed25519 signatures |
| @noble/hashes | 2.0.1 | Cryptographic hash functions |
| tweetnacl | 1.0.3 | NaCl crypto library |

### UI Components

| Package | Version | Purpose |
|---------|---------|---------|
| lucide-react | 0.562.0 | Icon library |
| qrcode.react | 4.2.0 | QR code generation |
| @headlessui/react | 2.2.9 | Unstyled accessible components |

### Build Tools

| Package | Version | Purpose |
|---------|---------|---------|
| Vite | 7.3.1 | Next-gen build tool |
| TypeScript | 5.8+ | Type safety |
| ESLint | 9.39.1 | Code linting |

---

## 🔒 Security Model

### Threat Model

| Threat | Mitigation |
|--------|------------|
| Key theft | Keys never leave browser; Web Crypto API for derivation |
| Man-in-the-middle | HTTPS required; direct RPC communication |
| Phishing | No server-side auth; user controls mnemonic |
| XSS attacks | React's built-in XSS protection; CSP headers |
| Memory attacks | Sensitive data cleared after use where possible |

### What We Store Locally

```typescript
{
  mnemonic: string;           // Encrypted in localStorage
  publicKey: string;          // Wallet address
  privateKey: string;         // Base58-encoded secret key
  contacts: Contact[];        // Address book
  network: Network;           // Selected network
  transactions: Transaction[]; // Cached history
  privacy: PrivacyState;      // ZK commitment state
}
```

### Security Best Practices

1. **Never share your recovery phrase** — Anyone with it controls your funds
2. **Use a hardware wallet for mainnet** — PunkZ is educational/devnet focused
3. **Verify addresses carefully** — Double-check before sending
4. **Clear browser data on shared computers** — localStorage persists

---

## 🌐 Network Configuration

### Supported Networks

| Network | RPC Endpoint | Purpose |
|---------|-------------|---------|
| Mainnet Beta | `https://api.mainnet-beta.solana.com` | Production (real funds) |
| Devnet | `https://api.devnet.solana.com` | Development & testing |
| Testnet | `https://api.testnet.solana.com` | Validator testing |

### Switching Networks

Navigate to **Settings → Network** to change the active network. Balance and transactions will refresh automatically.

### Custom RPC (Future)

Support for custom RPC endpoints is planned for future releases.

---

## 🎨 Design System

### Color Palette

| Name | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| Neon Magenta | `#ff00ff` | `--neon-pink` | Primary accents, CTAs |
| Cyber Cyan | `#00f0ff` | `--neon-cyan` | Secondary accents, links |
| Electric Purple | `#9945FF` | `--neon-purple` | Gradients, highlights |
| Success Green | `#00ff88` | `--success` | Success states |
| Error Red | `#ff4444` | `--error` | Error states, warnings |
| Dark Base | `#0d0221` | `--bg-dark` | Background |
| Slate 950 | `#020617` | - | Card backgrounds |

### Typography

| Font | Usage | Weight |
|------|-------|--------|
| **Monoton** | Logo, hero titles | 400 |
| **Orbitron** | Headings, section titles | 500-700 |
| **Rajdhani** | Body text, descriptions | 400-500 |
| **Space Mono** | Code, addresses, numbers | 400 |

### Animation Classes

```css
.neon-text-pink    /* Glowing pink text */
.neon-text-cyan    /* Glowing cyan text */
.neon-box-pink     /* Pink box shadow glow */
.neon-box-cyan     /* Cyan box shadow glow */
.pulse-glow        /* Pulsing glow animation */
.float             /* Floating up/down animation */
.flicker           /* Neon flicker effect */
.gradient-text     /* Animated gradient text */
```

---

## 📚 API Reference

### Wallet Store

```typescript
// Get current state
const { balance, publicKey, transactions } = useWalletStore();

// Actions
createWallet(): Promise<string>           // Returns mnemonic
importWallet(mnemonic: string): Promise<boolean>
deleteWallet(): void
refreshBalance(): Promise<void>
sendTransaction(to: string, amount: number, memo?: string): Promise<string>

// ZK Actions
generateBalanceCommitment(): PedersenCommitment | null
verifyBalanceCommitment(commitment: string, balance: number, blindingFactor: string): boolean
togglePrivacyMode(): void
```

### ZK Module

```typescript
// Types
interface PedersenCommitment {
  commitment: string;      // Hex-encoded commitment
  blindingFactor: string;  // Hex-encoded blinding factor (secret)
  timestamp: number;       // Unix timestamp
}

interface RangeProof {
  commitment: string;
  rangeMin: number;
  rangeMax: number;
  proofHash: string;
  timestamp: number;
}

// Functions
createBalanceCommitment(lamports: number): PedersenCommitment
verifyCommitment(commitment: string, balance: number, blindingFactor: string): boolean
createRangeProof(balance: number, max: number, blindingFactor: string, commitment: string): RangeProof | null
formatCommitment(commitment: string): string  // Truncate for display
```

---

## 🤝 Contributing

Contributions are what make the open-source community amazing! Any contributions you make are **greatly appreciated**.

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting, missing semicolons, etc.
refactor: code restructuring
test: adding tests
chore: maintenance tasks
```

### Code Style

- TypeScript strict mode enabled
- ESLint for linting
- Prettier for formatting (recommended)
- Tailwind CSS for styling

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2026 PunkZ Wallet

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software...
```

---

## 🙏 Acknowledgments

- **[Zashi Wallet](https://github.com/Electric-Coin-Company/zashi-android)** - Architectural inspiration
- **[Solana Foundation](https://solana.com)** - Blockchain infrastructure
- **[Electric Coin Company](https://electriccoin.co)** - ZK cryptography research
- **80s Cyberpunk Aesthetic** - Visual design inspiration
- **Open Source Community** - Libraries and tools that made this possible

---

<div align="center">

### 🌟 Star this repo if you found it useful!

**Built with 💜 by PunkZ Team**

[⬆ Back to top](#-punkz-wallet)

</div>
