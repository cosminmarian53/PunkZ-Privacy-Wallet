import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { 
  Shield, 
  Zap, 
  Lock, 
  Wallet, 
  ArrowRight, 
  Sparkles,
  Eye,
  Globe,
  Cpu,
  Database,
  Fingerprint,
  CheckCircle2,
  Star,
  Github,
  Twitter,
  ChevronDown
} from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Set up scroll animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.scroll-animate').forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="min-h-screen animated-bg relative overflow-hidden">
      {/* Grid Background Overlay */}
      <div className="fixed inset-0 grid-bg pointer-events-none" />
      
      {/* Floating Stars */}
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="star"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}

      {/* Floating Particles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={`particle-${i}`}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: '-10px',
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${6 + Math.random() * 4}s`,
          }}
        />
      ))}

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-black/20 backdrop-blur-md border-b border-fuchsia-500/10 animate-fade-in-up">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-fuchsia-500 to-cyan-400 flex items-center justify-center neon-box-pink">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span 
              className="text-2xl font-bold text-fuchsia-400 neon-text-pink"
              style={{ fontFamily: 'Monoton, cursive' }}
            >
              PUNKZ
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-300 hover:text-fuchsia-400 transition-colors">Features</a>
            <a href="#how-it-works" className="text-slate-300 hover:text-fuchsia-400 transition-colors">How It Works</a>
            <a href="#security" className="text-slate-300 hover:text-fuchsia-400 transition-colors">Security</a>
            <button
              onClick={() => navigate('/onboarding')}
              className="px-5 py-2 bg-fuchsia-500/20 border border-fuchsia-500 rounded-lg text-fuchsia-400 hover:bg-fuchsia-500/30 transition-colors neon-btn"
            >
              Launch App
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center pt-20 relative">
        
        <div className="max-w-5xl mx-auto relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-8 animate-fade-in-up delay-100">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 text-sm font-medium">Built on Solana Blockchain</span>
          </div>

          {/* Title with Mascot Behind */}
          <div className="relative mb-8">
            {/* Mascot Image - Behind */}
            <img 
              src="/mask.png" 
              alt="PunkZ Mascot" 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[450px] md:h-[450px] object-contain opacity-40 pointer-events-none"
            />
            
            {/* Title - In Front */}
            <div className="relative z-10 py-16">
              <h1 
                className="text-7xl md:text-9xl font-bold mb-4 text-fuchsia-500 neon-text-pink flicker animate-fade-in-scale delay-200"
                style={{ fontFamily: 'Monoton, cursive' }}
              >
                PUNKZ
              </h1>
              
              <p 
                className="text-3xl md:text-4xl text-cyan-400 mb-6 tracking-[0.3em] neon-text-cyan animate-fade-in-up delay-400"
                style={{ fontFamily: 'Orbitron, sans-serif' }}
              >
                WALLET
              </p>
            </div>
          </div>

          {/* Tagline with Gradient */}
          <p className="text-2xl md:text-4xl gradient-text font-bold mb-6 animate-fade-in-up delay-500">
            The Future is Self-Custody
          </p>

          {/* Description */}
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up delay-600">
            Experience the next evolution of crypto wallets. PunkZ combines 
            <span className="text-fuchsia-400"> blazing speed</span>, 
            <span className="text-cyan-400"> uncompromising privacy</span>, and 
            <span className="text-purple-400"> total self-custody</span> in one 
            beautiful retro-cyber interface.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up delay-700">
            <button
              onClick={() => navigate('/onboarding')}
              className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-white font-bold text-xl rounded-xl neon-btn relative overflow-hidden"
            >
              <Sparkles className="w-6 h-6 group-hover:animate-spin" />
              Create Wallet
              <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => navigate('/restore')}
              className="inline-flex items-center gap-3 px-10 py-5 border-2 border-fuchsia-500/50 text-fuchsia-400 font-bold text-xl rounded-xl hover:bg-fuchsia-500/10 hover:border-fuchsia-500 transition-all duration-300 hover:scale-105"
            >
              Import Existing
            </button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto animate-fade-in-up delay-800">
            <div className="text-center group hover:scale-110 transition-transform duration-300">
              <p className="text-3xl font-bold text-white mb-1 group-hover:text-fuchsia-400 transition-colors">400ms</p>
              <p className="text-slate-500 text-sm">Block Time</p>
            </div>
            <div className="text-center group hover:scale-110 transition-transform duration-300">
              <p className="text-3xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">$0.00025</p>
              <p className="text-slate-500 text-sm">Avg Fee</p>
            </div>
            <div className="text-center group hover:scale-110 transition-transform duration-300">
              <p className="text-3xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">65k+</p>
              <p className="text-slate-500 text-sm">TPS</p>
            </div>
            <div className="text-center group hover:scale-110 transition-transform duration-300">
              <p className="text-3xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">100%</p>
              <p className="text-slate-500 text-sm">Self-Custody</p>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-scroll-indicator">
          <div className="w-6 h-10 border-2 border-fuchsia-500/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-fuchsia-500 rounded-full" />
          </div>
          <ChevronDown className="w-6 h-6 text-fuchsia-500/50 mt-2" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 relative">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20 scroll-animate">
            <span className="inline-block px-5 py-2 bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-full text-fuchsia-400 text-sm font-medium tracking-wider mb-6">
              ⚡ SUPERCHARGED FEATURES
            </span>
            <h2 
              className="text-4xl md:text-6xl font-bold text-white mb-6"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              Built Different
            </h2>
            <p className="text-slate-400 text-xl max-w-2xl mx-auto">
              PunkZ isn't just another wallet. It's a statement. Built from the ground up 
              for those who demand more from their crypto experience.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="scroll-animate p-8 bg-gradient-to-br from-slate-900/50 to-cyan-900/20 rounded-2xl border border-cyan-500/20 neon-card group hover:scale-105 transition-all duration-300" style={{ transitionDelay: '0.1s' }}>
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 rounded-xl flex items-center justify-center mb-6 group-hover:neon-box-cyan transition-all group-hover:scale-110">
                <Shield className="w-7 h-7 text-cyan-400 group-hover:animate-pulse" />
              </div>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">Zero-Knowledge Privacy</h3>
                <span className="text-xs px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded-full">ZK</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Pedersen commitments let you prove properties about your balance without revealing 
                the actual amount. Cryptographic privacy built right in.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="scroll-animate p-8 bg-slate-900/50 rounded-2xl neon-card group hover:scale-105 transition-all duration-300" style={{ transitionDelay: '0.2s' }}>
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 rounded-xl flex items-center justify-center mb-6 group-hover:neon-box-cyan transition-all group-hover:scale-110">
                <Zap className="w-7 h-7 text-cyan-400 group-hover:animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">Lightning Fast</h3>
              <p className="text-slate-400 leading-relaxed">
                Built on Solana for sub-second finality. Send transactions in milliseconds, 
                not minutes. Experience true blockchain speed.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="scroll-animate p-8 bg-slate-900/50 rounded-2xl neon-card group hover:scale-105 transition-all duration-300" style={{ transitionDelay: '0.3s' }}>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-purple-500/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Lock className="w-7 h-7 text-purple-400 group-hover:animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">Self-Custody</h3>
              <p className="text-slate-400 leading-relaxed">
                Your keys, your coins. We never have access to your funds or recovery phrase. 
                True decentralization, true ownership.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="scroll-animate p-8 bg-slate-900/50 rounded-2xl neon-card group hover:scale-105 transition-all duration-300" style={{ transitionDelay: '0.4s' }}>
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Database className="w-7 h-7 text-emerald-400 group-hover:animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">Multi-Token</h3>
              <p className="text-slate-400 leading-relaxed">
                Support for SOL and all SPL tokens in one unified interface. 
                NFTs, meme coins, DeFi tokens – all in one place.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="scroll-animate p-8 bg-slate-900/50 rounded-2xl neon-card group hover:scale-105 transition-all duration-300" style={{ transitionDelay: '0.5s' }}>
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500/20 to-amber-500/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-7 h-7 text-amber-400 group-hover:animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">Web3 Ready</h3>
              <p className="text-slate-400 leading-relaxed">
                Connect to any Solana dApp seamlessly. DeFi, NFT marketplaces, games – 
                your wallet works everywhere you need it.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="scroll-animate p-8 bg-slate-900/50 rounded-2xl neon-card group hover:scale-105 transition-all duration-300" style={{ transitionDelay: '0.6s' }}>
              <div className="w-14 h-14 bg-gradient-to-br from-rose-500/20 to-rose-500/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Cpu className="w-7 h-7 text-rose-400 group-hover:animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-rose-400 transition-colors">Open Source</h3>
              <p className="text-slate-400 leading-relaxed">
                Fully auditable, community-driven development. Verify the code yourself. 
                Trust through transparency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ZK Privacy Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/20 via-purple-950/20 to-fuchsia-950/20 pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Content */}
            <div className="scroll-animate">
              <span className="inline-block px-5 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-medium tracking-wider mb-6">
                🔐 ZERO-KNOWLEDGE CRYPTOGRAPHY
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Prove Without<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">
                  Revealing
                </span>
              </h2>
              <p className="text-xl text-slate-400 mb-8 leading-relaxed">
                PunkZ uses Pedersen commitments — the same cryptographic primitive used in 
                privacy coins like Zcash. Prove you have sufficient balance for a trade 
                without revealing your actual holdings.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Lock className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Balance Commitments</h4>
                    <p className="text-slate-500 text-sm">Generate cryptographic proofs of your balance that can be shared without revealing the amount</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Eye className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Stealth Addresses</h4>
                    <p className="text-slate-500 text-sm">Generate one-time receiving addresses that can't be linked to your public identity</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-fuchsia-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-fuchsia-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Verifiable Privacy</h4>
                    <p className="text-slate-500 text-sm">Others can verify your proofs without learning anything about your balance</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right - Code Visual */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 rounded-3xl blur-xl opacity-50" />
              <div className="relative bg-slate-900/90 border border-slate-700 rounded-2xl p-6 font-mono text-sm overflow-hidden">
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-700">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-slate-500 text-xs ml-2">commitments.ts</span>
                </div>
                
                <div className="space-y-2 text-xs md:text-sm">
                  <p><span className="text-fuchsia-400">const</span> <span className="text-cyan-400">balance</span> = <span className="text-amber-400">1.5</span> <span className="text-slate-500">// SOL</span></p>
                  <p><span className="text-fuchsia-400">const</span> <span className="text-cyan-400">r</span> = <span className="text-emerald-400">generateBlindingFactor</span>()</p>
                  <p className="text-slate-500">// Pedersen commitment: C = G^v × H^r</p>
                  <p><span className="text-fuchsia-400">const</span> <span className="text-cyan-400">C</span> = <span className="text-emerald-400">commit</span>(<span className="text-cyan-400">balance</span>, <span className="text-cyan-400">r</span>)</p>
                  <p className="mt-4 text-slate-500">// Output: commitment hash</p>
                  <p className="text-emerald-400 break-all">"a3f8b2c1e9d7f6a2..."</p>
                  <p className="mt-4 text-slate-500">// Share C publicly</p>
                  <p className="text-slate-500">// Nobody knows balance = 1.5 SOL</p>
                  <p className="text-slate-500">// But you can PROVE it anytime!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-fuchsia-950/10 to-transparent pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-20 scroll-animate">
            <span className="inline-block px-5 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-medium tracking-wider mb-6">
              🚀 GET STARTED IN SECONDS
            </span>
            <h2 
              className="text-4xl md:text-6xl font-bold text-white mb-6"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              Three Simple Steps
            </h2>
            <p className="text-slate-400 text-xl max-w-2xl mx-auto">
              From zero to crypto in under a minute. No complex setup, no confusing processes.
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative scroll-animate group" style={{ transitionDelay: '0.1s' }}>
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-fuchsia-500 to-cyan-500 rounded-full flex items-center justify-center text-2xl font-bold text-white neon-box-pink group-hover:scale-110 transition-transform">
                1
              </div>
              <div className="p-8 pt-12 bg-slate-900/70 border border-slate-800 rounded-2xl hover:border-fuchsia-500/50 transition-all duration-300 hover:scale-105">
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-fuchsia-400 transition-colors">Create Your Wallet</h3>
                <p className="text-slate-400 mb-4">
                  Generate a new wallet with a secure 12-word recovery phrase. 
                  It takes just one click.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Instant generation</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Cryptographically secure</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative md:mt-12 scroll-animate group" style={{ transitionDelay: '0.3s' }}>
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-fuchsia-500 to-cyan-500 rounded-full flex items-center justify-center text-2xl font-bold text-white group-hover:scale-110 transition-transform">
                2
              </div>
              <div className="p-8 pt-12 bg-slate-900/70 border border-slate-800 rounded-2xl hover:border-cyan-500/50 transition-all duration-300 hover:scale-105">
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors">Backup Your Phrase</h3>
                <p className="text-slate-400 mb-4">
                  Write down your recovery phrase and store it somewhere safe. 
                  This is your master key.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>12-word standard</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Works with other wallets</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative md:mt-24 scroll-animate group" style={{ transitionDelay: '0.5s' }}>
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-fuchsia-500 to-cyan-500 rounded-full flex items-center justify-center text-2xl font-bold text-white neon-box-cyan group-hover:scale-110 transition-transform">
                3
              </div>
              <div className="p-8 pt-12 bg-slate-900/70 border border-slate-800 rounded-2xl hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors">Start Transacting</h3>
                <p className="text-slate-400 mb-4">
                  Send, receive, and manage your crypto. Connect to dApps and 
                  explore the Solana ecosystem.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Sub-second transfers</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Minimal fees</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-32 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="scroll-animate">
              <span className="inline-block px-5 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-sm font-medium tracking-wider mb-6">
                🔐 BANK-GRADE SECURITY
              </span>
              <h2 
                className="text-4xl md:text-5xl font-bold text-white mb-6"
                style={{ fontFamily: 'Orbitron, sans-serif' }}
              >
                Your Funds. Your Control.
              </h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                PunkZ is built with security as the foundation. Your private keys are generated 
                locally and never leave your device. We use industry-standard encryption and 
                follow best practices in blockchain security.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-fuchsia-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Fingerprint className="w-6 h-6 text-fuchsia-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg mb-1">Local Key Generation</h4>
                    <p className="text-slate-400">Keys are generated client-side using cryptographically secure random number generation.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Eye className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg mb-1">Zero Knowledge</h4>
                    <p className="text-slate-400">We never see, store, or transmit your private keys or recovery phrase.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Lock className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg mb-1">Encrypted Storage</h4>
                    <p className="text-slate-400">All sensitive data is encrypted before being stored locally on your device.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-slate-900 to-slate-950 border border-fuchsia-500/30 rounded-3xl p-8 neon-card">
                <div className="w-full h-full bg-gradient-to-br from-fuchsia-500/5 to-cyan-500/5 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  {/* Animated Lock Icon */}
                  <div className="relative z-10 text-center">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-fuchsia-500 to-cyan-500 rounded-3xl flex items-center justify-center mb-6 pulse-glow">
                      <Shield className="w-16 h-16 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-white mb-2">Protected</p>
                    <p className="text-slate-400">256-bit encryption</p>
                  </div>
                  
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    {[...Array(20)].map((_, i) => (
                      <div 
                        key={i}
                        className="absolute text-fuchsia-500 font-mono text-xs"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          transform: `rotate(${Math.random() * 360}deg)`,
                        }}
                      >
                        {Math.random().toString(16).substring(2, 10)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials/Social Proof */}
      <section className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-950/10 to-transparent pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-5 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-400 text-sm font-medium tracking-wider mb-6">
              ⭐ COMMUNITY LOVE
            </span>
            <h2 
              className="text-4xl md:text-5xl font-bold text-white mb-6"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              Trusted by Solana Punks
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="p-6 bg-slate-900/70 border border-slate-800 rounded-2xl">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-300 mb-4 leading-relaxed">
                "Finally a wallet that respects my privacy AND has a killer aesthetic. 
                The neon vibes are immaculate. 🔥"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-fuchsia-500 to-cyan-500 rounded-full" />
                <div>
                  <p className="text-white font-medium">CryptoNinja</p>
                  <p className="text-slate-500 text-sm">@cryptoninja_sol</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="p-6 bg-slate-900/70 border border-slate-800 rounded-2xl">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-300 mb-4 leading-relaxed">
                "Transaction speed is insane. Sent SOL to a friend and it confirmed before 
                I could even switch tabs. PunkZ is the future."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full" />
                <div>
                  <p className="text-white font-medium">DegenDev</p>
                  <p className="text-slate-500 text-sm">@degendev_</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="p-6 bg-slate-900/70 border border-slate-800 rounded-2xl">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-300 mb-4 leading-relaxed">
                "Self-custody done right. Open source, clean UI, and no sketchy permissions. 
                This is what I've been waiting for."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-full" />
                <div>
                  <p className="text-white font-medium">SolanaMaxi</p>
                  <p className="text-slate-500 text-sm">@solana_maxi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 px-6 relative">
        <div className="max-w-4xl mx-auto">
          <div className="scroll-animate p-12 md:p-20 bg-gradient-to-br from-fuchsia-900/30 via-purple-900/20 to-cyan-900/30 border border-fuchsia-500/30 rounded-3xl text-center relative overflow-hidden neon-border hover:scale-[1.02] transition-transform duration-500">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-[100px] pointer-events-none animate-glow-pulse" />
            
            <div className="relative z-10">
              <h2 
                className="text-4xl md:text-6xl font-bold text-white mb-6"
                style={{ fontFamily: 'Orbitron, sans-serif' }}
              >
                Ready to Go
                <span className="text-fuchsia-400 neon-text-pink animate-neon-flicker"> Punk</span>?
              </h2>
              <p className="text-slate-300 text-xl mb-10 max-w-xl mx-auto">
                Join thousands of Solana users who've already made the switch to 
                true self-custody with PunkZ.
              </p>
              <button
                onClick={() => navigate('/onboarding')}
                className="group inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-white font-bold text-xl rounded-xl neon-btn hover:scale-105 transition-transform duration-300"
              >
                <Wallet className="w-6 h-6 group-hover:animate-bounce" />
                Create Your Wallet Now
                <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
              </button>
              <p className="text-slate-500 text-sm mt-6">
                Free forever. No hidden fees. No BS.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800 scroll-animate">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4 group">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-fuchsia-500 to-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <span 
                  className="text-2xl font-bold text-fuchsia-400 group-hover:animate-neon-flicker"
                  style={{ fontFamily: 'Monoton, cursive' }}
                >
                  PUNKZ
                </span>
              </div>
              <p className="text-slate-400 max-w-sm mb-6">
                The next-gen Solana wallet with a retro-cyber soul. 
                Your keys, your coins, your privacy.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-fuchsia-500/20 hover:scale-110 transition-all duration-300">
                  <Twitter className="w-5 h-5 text-slate-400 hover:text-fuchsia-400" />
                </a>
                <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-fuchsia-500/20 hover:scale-110 transition-all duration-300">
                  <Github className="w-5 h-5 text-slate-400 hover:text-fuchsia-400" />
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="text-slate-400 hover:text-fuchsia-400 transition-colors">Features</a></li>
                <li><a href="#security" className="text-slate-400 hover:text-fuchsia-400 transition-colors">Security</a></li>
                <li><a href="#" className="text-slate-400 hover:text-fuchsia-400 transition-colors">Roadmap</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-400 hover:text-fuchsia-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="text-slate-400 hover:text-fuchsia-400 transition-colors">GitHub</a></li>
                <li><a href="#" className="text-slate-400 hover:text-fuchsia-400 transition-colors">Support</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              © 2026 PunkZ Wallet. Built with 💜 for the Solana community.
            </p>
            <p className="text-slate-600 text-sm">
              Running on Solana Devnet
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
