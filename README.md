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
git clone https://github.com/yourusername/punkz-wallet.git
cd punkz-wallet
```

2. Install dependencies
```bash
pnpm install
```

3. Start the development server
```bash
pnpm dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

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

## 📁 Project Structure

```
punkz-wallet/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── navigation/   # TopAppBar, BottomNavigation
│   │   ├── wallet/       # BalanceWidget, TransactionList
│   │   └── ui/           # Button, Card, Input, Modal
│   ├── screens/          # Page components
│   │   ├── landing/      # Landing page
│   │   ├── onboarding/   # Create/Import wallet
│   │   ├── home/         # Main wallet view
│   │   ├── send/         # Send SOL
│   │   ├── receive/      # Receive with QR code
│   │   ├── history/      # Transaction history
│   │   └── settings/     # App settings
│   ├── store/            # Zustand state management
│   └── assets/           # Images and icons
├── public/               # Static assets
└── index.html            # Entry point
```

## 🔐 Security

- **No Private Keys on Servers** - All keys are generated and stored locally
- **Browser-Native Crypto** - Uses Web Crypto API for HD key derivation
- **Encrypted Storage** - Wallet data stored in browser's localStorage
- **Open Source** - Full code transparency

⚠️ **Important**: Always back up your recovery phrase! PunkZ Wallet cannot recover your funds without it.

## 🎨 Design System

### Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Neon Magenta | `#ff00ff` | Primary accents, CTAs |
| Cyber Cyan | `#00f0ff` | Secondary accents |
| Success Green | `#00ff88` | Success states |
| Error Red | `#ff4444` | Error states |
| Dark Purple | `#0a0014` | Background base |

### Fonts

- **Monoton** - Logo and hero text
- **VT323** - Retro terminal feel
- **Orbitron** - Futuristic headings
- **Outfit** - Body text

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the [Zashi Wallet](https://github.com/Electric-Coin-Company/zashi-android) architecture
- Retro styling inspired by 80s cyberpunk aesthetics
- Built for the Solana community with ♥

---

<div align="center">

**Made with ♥ by PunkZ Team**

[⬆ Back to top](#-punkz-wallet)

</div>
