# 🎮 PunkZ Wallet

<div align="center">

![PunkZ Wallet](https://img.shields.io/badge/PunkZ-Wallet-ff00ff?style=for-the-badge&logo=solana&logoColor=white)
![Solana](https://img.shields.io/badge/Solana-Devnet-00f0ff?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript)

**A cyberpunk-themed Solana wallet with retro aesthetics and modern functionality**

[Live Demo](#) · [Report Bug](https://github.com/yourusername/punkz-wallet/issues) · [Request Feature](https://github.com/yourusername/punkz-wallet/issues)

</div>

---

## ✨ Features

- 🌈 **Stunning Retro/Neon UI** - Cyberpunk aesthetic with glowing effects and animations
- 💜 **Solana Integration** - Full support for SOL and SPL tokens
- ⚡️ **On-Chain Privacy Pool** - Deposit and withdraw SOL from a Tornado Cash-inspired privacy pool.
- 🔐 **Secure HD Wallet** - BIP39 mnemonic with browser-native cryptography
- 📱 **Responsive Design** - Works beautifully on desktop and mobile
- 🚀 **Fast & Modern** - Built with React 19, Vite, and Tailwind CSS v4
- 🔗 **Devnet Support** - Test transactions without real funds

## 🖼️ Screenshots

The wallet features a stunning landing page with neon effects, particle animations, and a cyberpunk grid background, followed by a fully-featured wallet interface.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/PunkZ-Privacy-Wallet.git
cd punkz-wallet
```

1. Install dependencies

```bash
pnpm install
```

1. Start the development server

```bash
pnpm dev
```

1. Open [http://localhost:5173](http://localhost:5173) in your browser

## 🧪 Testing with Solana Devnet

PunkZ Wallet is configured to use **Solana Devnet** by default for safe testing without real funds.

### Getting Test SOL

1. Create or import a wallet in the app
2. Copy your wallet address
3. Get free test SOL from the [Solana Faucet](https://faucet.solana.com/)
4. Or use CLI: `solana airdrop 1 YOUR_WALLET_ADDRESS --url devnet`

### Switching Networks

Go to **Settings > Network** to switch between:

- 🟢 **Mainnet** - Real transactions (use with caution)
- 🟡 **Devnet** - Free test tokens (default)
- 🔵 **Testnet** - Additional testing network

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI Framework |
| TypeScript | Type Safety |
| Vite | Build Tool |
| Tailwind CSS v4 | Styling |
| Framer Motion | Animations |
| Zustand | State Management |
| @solana/web3.js | Blockchain Integration |
| Web Crypto API | Secure Key Derivation |
| WalletConnect | dApp Connectivity |
| Vitest | Unit Testing |

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              PunkZ Wallet                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Landing    │  │  Onboarding  │  │    Home      │  │   Settings   │    │
│  │    Page      │  │   Screens    │  │   Screen     │  │   Screens    │    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │
│         │                 │                 │                 │             │
│         └─────────────────┴────────┬────────┴─────────────────┘             │
│                                    │                                         │
│                        ┌───────────▼───────────┐                            │
│                        │    React Router       │                            │
│                        │   (Route Management)  │                            │
│                        └───────────┬───────────┘                            │
│                                    │                                         │
│         ┌──────────────────────────┼──────────────────────────┐             │
│         │                          │                          │             │
│  ┌──────▼──────┐           ┌───────▼───────┐          ┌──────▼──────┐      │
│  │   Zustand   │           │  WalletConnect │          │     ZK      │      │
│  │   Store     │           │    Manager     │          │   Module    │      │
│  │             │           │                │          │             │      │
│  │ - Wallet    │           │ - Sessions     │          │ - On-Chain  │      │
│  │ - Balance   │           │ - Sign Requests│          │ - Client-Side│      │
│  │ - Tx History│           │ - dApp Connect │          │ - Proofs    │      │
│  └──────┬──────┘           └───────┬────────┘          └──────┬──────┘      │
│         │                          │                          │             │
│         └──────────────────────────┼──────────────────────────┘             │
│                                    │                                         │
│                        ┌───────────▼───────────┐                            │
│                        │   @solana/web3.js     │                            │
│                        │   (RPC Client)        │                            │
│                        └───────────┬───────────┘                            │
│                                    │                                         │
│          ┌─────────────────────────┼────────────────────────┐                │
│          │                         │                        │                │
└──────────┼─────────────────────────┼────────────────────────┼───────────────┘
           │                         │                        │
┌──────────▼───────────┐ ┌───────────▼───────────┐ ┌──────────▼───────────┐
│ Solana Blockchain    │ │ Solana Blockchain   │ │ Solana Blockchain    │
│ (Devnet/Mainnet)     │ │ (Punkz Vault Program) │ │ (Other dApps)        │
└──────────────────────┘ └───────────────────────┘ └──────────────────────┘
```

### Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER INTERACTION FLOW                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────┐     ┌─────────────┐     ┌─────────────────────┐   │
│  │  User   │────▶│  UI Action  │────▶│  Zustand Store      │   │
│  └─────────┘     └─────────────┘     │  Action             │   │
│                                       └──────────┬──────────┘   │
│                                                  │              │
│                                                  ▼              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    State Update                          │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐    │   │
│  │  │ Balance │  │ Tx List │  │ Network │  │ Privacy │    │   │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘    │   │
│  └──────────────────────────┬──────────────────────────────┘   │
│                             │                                   │
│                             ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              React Component Re-render                   │   │
│  │         (UI reflects new state automatically)            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### ZK Privacy Architecture

```
┌───────────────────────────────────────────────────────────────────────────┐
│                              ZK PRIVACY LAYER                           │
├───────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│   ┌──────────────────────────┐                          ┌─────────────────┐ │
│   │   Client-Side Privacy    │                          │ On-Chain Privacy│ │
│   └──────────────────────────┘                          └─────────────────┘ │
│                                                                           │
│  ┌───────────────────────┐     ┌───────────────────┐    ┌─────────────────┐ │
│  │  PEDERSEN COMMITMENTS │     │ STEALTH ADDRESSES │    │  PUNKZ VAULT    │ │
│  ├───────────────────────┤     ├───────────────────┤    ├─────────────────┤ │
│  │  - Hides balance      │     │ - Unlinkable addrs│    │ - Tornado-like  │ │
│  │  - Off-chain proofs   │     │ - One-time keys   │    │ - ZK-SNARKs     │ │
│  │  - Local verification │     │ - Scan with view key│    │ - Deposit/Withdraw│ │
│  └───────────┬───────────┘     └─────────┬─────────┘    └────────┬────────┘ │
│              │                           │                       │          │
│              └───────────────┬───────────┘                       │          │
│                              │                                   │          │
│                              ▼                                   │          │
│  ┌───────────────────────────────────────────────────────────┐   │          │
│  │                       PunkZ Wallet UI                       │   │          │
│  └───────────────────────────────────────────────────────────┘   │          │
│                              │                                   │          │
└──────────────────────────────┼───────────────────────────────────┼──────────┘
                               │                                   │
                     ┌─────────▼─────────┐               ┌─────────▼─────────┐
                     │ Off-Chain Message │               │ Solana Transaction│
                     │ Signing/Sharing   │               │ (to Punkz Vault)  │
                     └───────────────────┘               └───────────────────┘
```

## 📁 Project Structure

```
punkz-wallet/
├── src/
│   ├── components/       # Reusable UI components
│   ├── screens/          # Page components
│   │   ├── ...
│   │   ├── privacy-pool/ # On-chain privacy pool screen
│   │   │   └── PrivacyPoolScreen.tsx
│   │   └── settings/     # App settings + ZK + WalletConnect
│   ├── lib/
│   │   ├── zk/           # Client-side ZK primitives
│   │   ├── zk-vault/     # Client for on-chain privacy pool
│   │   └── ...
│   ├── store/            # Zustand state management
│   └── ...
└── ...
```

## 🔮 ZK Privacy Features

PunkZ Wallet implements both client-side and on-chain privacy features.

### On-Chain Privacy Pool (Punkz Vault)

The wallet integrates with the **Punkz Vault**, a non-custodial on-chain privacy pool inspired by Tornado Cash. It allows you to deposit a fixed amount of SOL and withdraw it to a different address, breaking the link between the source and destination of funds.

**Program ID (Devnet):** `5RnAtgkezoRF4WC4zVA2dPPGCxc91vBeMfAN3mbsobTn`

**How it Works:**

1. **Deposit:**
    - The user generates a secret **note**. This note contains a nullifier and a secret.
    - A commitment is created by hashing the note's contents.
    - The user submits a transaction to deposit SOL into the vault, along with the commitment. The on-chain program stores this commitment in a Merkle tree.
2. **Withdraw:**
    - The user provides the secret note and a new recipient address.
    - The wallet generates a **zk-SNARK proof** that proves the user possesses a secret to a commitment in the Merkle tree without revealing which one.
    - The proof, along with the recipient address and a nullifier hash (to prevent double-spending), is sent to the vault program.
    - If the proof is valid, the program transfers the SOL to the recipient address.

> ⚠️ **CRITICAL:** You must back up your secret note. If you lose the note, you will **not** be able to withdraw your funds. They will be permanently lost.

> ✅ **Implementation Status (Updated):** The application is now **fully functional end-to-end**! The client-side wallet integrates `snarkjs` and `poseidon-lite` to dynamically generate real Groth16 cryptographic proofs entirely in the browser. On the smart contract side, the Anchor program has been upgraded natively with Solana's `sol_poseidon` syscalls, providing true Zero-Knowledge execution with high compute efficiency. The **Groth16 on-chain verifier is completely implemented and passes verification** on localnet/devnet!

### Client-Side Primitives

PunkZ Wallet also implements client-side zero-knowledge privacy primitives to enhance transaction privacy without requiring smart contracts.

#### Pedersen Commitments

Pedersen Commitments allow you to create cryptographic proofs of balance ownership without revealing the actual amount.

```typescript
// Create a commitment to hide a balance
const { commitment, secret } = createCommitment(balance);

// Later, verify you own that balance
const isValid = verifyCommitment(commitment, balance, secret);
```

#### Stealth Addresses

Stealth addresses enable recipients to receive payments to unique one-time addresses, preventing address linkability on the blockchain.

### Privacy Considerations

| Feature | Privacy Level | Trade-offs | Status |
|---------|---------------|------------|--------|
| On-Chain Pool | **High** | Requires on-chain program, fixed denominations | Alpha (Withdrawal proof is a dummy) |
| Pedersen Commitments | High (off-chain) | Proofs are local only | Implemented |
| Stealth Addresses | Medium-High | Requires sender cooperation | Implemented |

> **Note**: For on-chain privacy enforcement, smart contract integration (like Punkz Vault) is required.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
