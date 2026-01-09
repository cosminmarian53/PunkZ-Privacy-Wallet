import { useNavigate } from 'react-router-dom';
import { Shield, Zap, Lock, Wallet, ArrowRight, Sparkles } from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Logo/Brand */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-cyan-400 mb-6">
              <Wallet className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 
            className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            PUNKZ
          </h1>
          
          <p 
            className="text-2xl md:text-3xl text-slate-400 mb-4 tracking-widest"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            WALLET
          </p>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-cyan-400 mb-6 font-medium">
            Fast. Private. Self-Custody.
          </p>

          {/* Description */}
          <p className="text-lg text-slate-400 max-w-xl mx-auto mb-10">
            The next-gen Solana wallet with a retro-cyber soul. 
            Your keys, your coins, your privacy.
          </p>

          {/* CTA Button */}
          <button
            onClick={() => navigate('/onboarding')}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-fuchsia-600 to-cyan-500 hover:from-fuchsia-500 hover:to-cyan-400 text-white font-bold text-lg rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-fuchsia-500/25"
          >
            <Sparkles className="w-5 h-5" />
            Launch Wallet
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-full text-fuchsia-400 text-sm font-medium mb-4">
              FEATURES
            </span>
            <h2 
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              Why PunkZ?
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Built for the Solana community with privacy and speed in mind
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-fuchsia-500/50 transition-colors">
              <div className="w-12 h-12 bg-fuchsia-500/20 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-fuchsia-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Privacy First</h3>
              <p className="text-slate-400">Your transactions are your business. Complete control over every transfer.</p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-cyan-500/50 transition-colors">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Lightning Fast</h3>
              <p className="text-slate-400">Built on Solana for sub-second finality and minimal fees.</p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-slate-900/50 border border-fuchsia-500/30 rounded-2xl">
              <div className="w-12 h-12 bg-fuchsia-500/20 rounded-xl flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-fuchsia-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Self-Custody</h3>
              <p className="text-slate-400">Your keys, your coins. We never have access to your funds.</p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-cyan-500/50 transition-colors">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-4">
                <Wallet className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Multi-Token</h3>
              <p className="text-slate-400">Support for SOL and all SPL tokens in one place.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="p-10 md:p-16 bg-gradient-to-br from-fuchsia-900/30 to-cyan-900/20 border border-fuchsia-500/30 rounded-3xl text-center">
            <h2 
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              Ready to Go Private?
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
              Join the next generation of self-custody wallets
            </p>
            <button
              onClick={() => navigate('/onboarding')}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-fuchsia-600 to-cyan-500 hover:from-fuchsia-500 hover:to-cyan-400 text-white font-bold text-lg rounded-xl transition-all duration-300 hover:scale-105"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-500 text-sm">
            © 2026 PunkZ Wallet. Built for the Solana community.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
