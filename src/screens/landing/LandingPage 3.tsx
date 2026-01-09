import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Zap, 
  Lock, 
  Eye,
  Send,
  ArrowDownUp,
  ChevronRight,
  Wallet,
  ArrowDown,
  Sparkles,
  Download
} from 'lucide-react';

// Loading Screen
const LoadingScreen = () => (
  <motion.div
    className="fixed inset-0 z-50 flex items-center justify-center"
    style={{ background: '#0d0221' }}
    initial={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  >
    <motion.div
      className="text-center"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-5xl md:text-7xl font-bold mb-4"
        style={{
          fontFamily: 'Monoton, cursive',
          color: '#ff00ff',
          textShadow: '0 0 30px #ff00ff',
        }}
        animate={{
          textShadow: [
            '0 0 30px #ff00ff',
            '0 0 60px #ff00ff',
            '0 0 30px #ff00ff',
          ],
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        PUNKZ
      </motion.h1>
      <motion.div
        className="w-48 h-1 mx-auto rounded-full overflow-hidden"
        style={{ background: 'rgba(255, 0, 255, 0.2)' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #ff00ff, #00f0ff)' }}
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.div>
  </motion.div>
);

// Feature Card
const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description,
  isActive = false,
}: { 
  icon: typeof Shield; 
  title: string; 
  description: string;
  isActive?: boolean;
  delay?: number;
}) => (
  <div
    className="relative p-6 md:p-8 rounded-2xl text-center"
    style={{
      background: isActive 
        ? 'linear-gradient(135deg, rgba(255, 0, 255, 0.15) 0%, rgba(0, 240, 255, 0.08) 100%)'
        : 'linear-gradient(135deg, rgba(15, 0, 35, 0.7) 0%, rgba(10, 0, 25, 0.8) 100%)',
      border: isActive ? '2px solid rgba(255, 0, 255, 0.5)' : '1px solid rgba(255, 0, 255, 0.2)',
    }}
  >
    <div 
      className="w-16 h-16 mx-auto mb-5 rounded-xl flex items-center justify-center"
      style={{
        border: '1px solid #00f0ff',
        background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.1) 0%, rgba(255, 0, 255, 0.05) 100%)',
        boxShadow: '0 0 20px rgba(0, 240, 255, 0.2)',
      }}
    >
      <Icon className="w-8 h-8" style={{ color: '#00f0ff' }} />
    </div>
    <h3 
      className="text-xl md:text-2xl font-bold mb-3"
      style={{ 
        fontFamily: 'VT323, monospace',
        color: '#ff00ff',
        textShadow: '0 0 10px rgba(255, 0, 255, 0.5)',
      }}
    >
      {title}
    </h3>
    <p 
      className="text-base md:text-lg"
      style={{ 
        fontFamily: 'VT323, monospace',
        color: 'rgba(0, 240, 255, 0.8)',
        lineHeight: '1.5',
      }}
    >
      {description}
    </p>
  </div>
);

// How It Works Step
const StepCard = ({ 
  number, 
  icon: Icon, 
  title, 
  description,
}: { 
  number: number; 
  icon: typeof Wallet; 
  title: string; 
  description: string;
  delay?: number;
}) => (
  <div 
    className="flex items-start gap-5 p-6 rounded-2xl"
    style={{
      background: 'linear-gradient(135deg, rgba(15, 0, 35, 0.6) 0%, rgba(10, 0, 25, 0.7) 100%)',
      border: '1px solid rgba(0, 240, 255, 0.15)',
    }}
  >
    <div className="relative shrink-0">
      <div 
        className="w-14 h-14 rounded-xl flex items-center justify-center"
        style={{
          border: '1px solid #00f0ff',
          background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.1) 0%, rgba(255, 0, 255, 0.05) 100%)',
        }}
      >
        <Icon className="w-6 h-6" style={{ color: '#00f0ff' }} />
      </div>
      <div 
        className="absolute -top-2 -right-2 w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold"
        style={{
          background: 'linear-gradient(135deg, #ff00ff 0%, #00f0ff 100%)',
          color: 'white',
          fontFamily: 'VT323, monospace',
        }}
      >
        {number}
      </div>
    </div>
    <div className="flex-1 pt-1">
      <h3 
        className="text-xl md:text-2xl font-bold mb-2"
        style={{ 
          fontFamily: 'VT323, monospace',
          color: '#ff00ff',
          textShadow: '0 0 10px rgba(255, 0, 255, 0.4)',
        }}
      >
        {title}
      </h3>
      <p 
        className="text-base md:text-lg"
        style={{ 
          fontFamily: 'VT323, monospace',
          color: 'rgba(0, 240, 255, 0.75)',
          lineHeight: '1.5',
        }}
      >
        {description}
      </p>
    </div>
  </div>
);

// Main Landing Page
export const LandingPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen />}
      </AnimatePresence>
      
      <div 
        className="min-h-screen w-full"
        style={{
          background: 'linear-gradient(180deg, #0d0221 0%, #1a0033 50%, #0d0221 100%)',
        }}
      >
        {/* Grid Background */}
        <div 
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 0, 255, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 0, 255, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
        
        {/* Gradient Orbs */}
        <div 
          className="fixed top-1/3 left-1/3 w-96 h-96 rounded-full blur-3xl pointer-events-none z-0 opacity-40"
          style={{ background: 'radial-gradient(circle, rgba(255, 0, 255, 0.3) 0%, transparent 70%)' }}
        />
        <div 
          className="fixed bottom-1/3 right-1/3 w-96 h-96 rounded-full blur-3xl pointer-events-none z-0 opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(0, 240, 255, 0.25) 0%, transparent 70%)' }}
        />

        {/* ==================== HERO SECTION ==================== */}
        <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
          <div className="w-full max-w-4xl mx-auto text-center relative z-10">
            {/* Main Title */}
            <motion.h1 
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-2"
              style={{ 
                fontFamily: 'Monoton, cursive',
                color: '#ff00ff',
                textShadow: '0 0 30px #ff00ff, 0 0 60px #ff00ff',
              }}
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              PUNKZ
            </motion.h1>
            
            <motion.div
              className="text-2xl sm:text-3xl md:text-4xl mb-8"
              style={{
                fontFamily: 'VT323, monospace',
                color: 'rgba(255, 255, 255, 0.8)',
                letterSpacing: '0.3em',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              WALLET
            </motion.div>
            
            {/* Slogan */}
            <motion.p 
              className="text-xl sm:text-2xl md:text-3xl mb-6"
              style={{ 
                fontFamily: 'VT323, monospace',
                color: '#00f0ff',
                textShadow: '0 0 15px rgba(0, 240, 255, 0.5)',
                letterSpacing: '0.08em',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Neon-fast. Self-custody. Built for Solana.
            </motion.p>

            {/* Description */}
            <motion.p
              className="text-lg md:text-xl max-w-2xl mx-auto mb-10 px-4"
              style={{
                fontFamily: 'Outfit, sans-serif',
                color: 'rgba(255, 255, 255, 0.65)',
                lineHeight: '1.7',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              Send, receive, and swap SOL with a clean retro-cyber interface. 
              Your keys stay on your device—always.
            </motion.p>

            {/* CTA Button */}
            <motion.button
              onClick={() => navigate('/onboarding')}
              className="px-10 py-4 rounded-full text-xl md:text-2xl font-bold inline-flex items-center gap-3"
              style={{
                fontFamily: 'VT323, monospace',
                background: 'linear-gradient(135deg, #ff00ff 0%, #00f0ff 100%)',
                color: 'white',
                boxShadow: '0 0 30px rgba(255, 0, 255, 0.5)',
                letterSpacing: '0.08em',
              }}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: '0 0 50px rgba(255, 0, 255, 0.7)',
              }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <Sparkles className="w-5 h-5" />
              Launch Wallet
              <ChevronRight className="w-5 h-5" />
            </motion.button>

            {/* Scroll indicator */}
            <motion.div 
              className="absolute bottom-8 left-1/2 -translate-x-1/2"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ArrowDown className="w-6 h-6" style={{ color: '#00f0ff', opacity: 0.7 }} />
            </motion.div>
          </div>
        </section>

        {/* ==================== FEATURES SECTION ==================== */}
        <section className="py-24 px-6 overflow-hidden">
          <div className="w-full max-w-6xl mx-auto relative">
            {/* Section Header */}
            <div className="text-center mb-16">
              <motion.div
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6"
                style={{
                  background: 'rgba(255, 0, 255, 0.1)',
                  border: '1px solid rgba(255, 0, 255, 0.25)',
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Sparkles className="w-4 h-4" style={{ color: '#ff00ff' }} />
                <span style={{ fontFamily: 'VT323, monospace', color: '#ff00ff', letterSpacing: '0.1em', fontSize: '1.1rem' }}>
                  FEATURES
                </span>
              </motion.div>
              
              <motion.h2 
                className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4"
                style={{ 
                  fontFamily: 'Permanent Marker, cursive',
                  color: '#00f0ff',
                  textShadow: '0 0 25px rgba(0, 240, 255, 0.5)',
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                Why PunkZ?
              </motion.h2>
              
              <motion.p 
                className="text-lg md:text-xl max-w-2xl mx-auto"
                style={{ 
                  fontFamily: 'VT323, monospace',
                  color: 'rgba(255, 255, 255, 0.6)',
                }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Experience the future of transactions on Solana
              </motion.p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeatureCard 
                icon={Shield} 
                title="Privacy First" 
                description="Your transactions are your business. Complete control on every transfer."
                delay={0}
              />
              <FeatureCard 
                icon={Zap} 
                title="Lightning Fast" 
                description="Built on Solana for sub-second finality and minimal fees."
                delay={0.1}
              />
              <FeatureCard 
                icon={Lock} 
                title="Self-Custody" 
                description="Your keys, your coins. We never have access to your funds."
                isActive
                delay={0.2}
              />
              <FeatureCard 
                icon={Eye} 
                title="Zero Knowledge" 
                description="Advanced cryptography ensures complete transaction privacy."
                delay={0.3}
              />
            </div>
          </div>
        </section>

        {/* ==================== HOW IT WORKS SECTION ==================== */}
        <section className="py-24 px-6 overflow-hidden">
          <div className="w-full max-w-3xl mx-auto relative">
            {/* Section Header */}
            <div className="text-center mb-16">
              <motion.div
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6"
                style={{
                  background: 'rgba(0, 240, 255, 0.1)',
                  border: '1px solid rgba(0, 240, 255, 0.25)',
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Wallet className="w-4 h-4" style={{ color: '#00f0ff' }} />
                <span style={{ fontFamily: 'VT323, monospace', color: '#00f0ff', letterSpacing: '0.1em', fontSize: '1.1rem' }}>
                  GET STARTED
                </span>
              </motion.div>
              
              <motion.h2 
                className="text-4xl sm:text-5xl md:text-6xl font-bold"
                style={{ 
                  fontFamily: 'Permanent Marker, cursive',
                  color: '#ff00ff',
                  textShadow: '0 0 25px rgba(255, 0, 255, 0.5)',
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                How It Works
              </motion.h2>
            </div>

            {/* Steps */}
            <div className="space-y-5">
              <StepCard
                number={1}
                icon={Download}
                title="Create or Import"
                description="Generate a new wallet or import your existing Solana wallet using your secret recovery phrase. Your keys never leave your device."
                delay={0}
              />
              <StepCard
                number={2}
                icon={Send}
                title="Send Privately"
                description="Send SOL and SPL tokens to any address. Our privacy layer ensures your transactions cannot be traced back to you."
                delay={0.1}
              />
              <StepCard
                number={3}
                icon={ArrowDownUp}
                title="Swap Anonymously"
                description="Swap between tokens using integrated DEX aggregators. Your trading activity stays completely private."
                delay={0.2}
              />
            </div>
          </div>
        </section>

        {/* ==================== CTA SECTION ==================== */}
        <section className="py-24 px-6">
          <div className="w-full max-w-4xl mx-auto">
            <motion.div
              className="p-10 md:p-14 rounded-3xl text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 0, 255, 0.12) 0%, rgba(0, 240, 255, 0.08) 100%)',
                border: '2px solid rgba(255, 0, 255, 0.3)',
                backdropFilter: 'blur(10px)',
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
                style={{ 
                  fontFamily: 'Permanent Marker, cursive',
                  color: '#ff00ff',
                  textShadow: '0 0 20px rgba(255, 0, 255, 0.5)',
                }}
              >
                Ready to Go Private?
              </h2>
              <p 
                className="text-lg md:text-xl mb-8 max-w-xl mx-auto"
                style={{ 
                  fontFamily: 'VT323, monospace',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                Join thousands of users who value their financial privacy
              </p>
              <motion.button
                onClick={() => navigate('/onboarding')}
                className="px-10 py-4 rounded-full text-xl md:text-2xl font-bold inline-flex items-center gap-3"
                style={{
                  fontFamily: 'VT323, monospace',
                  background: 'linear-gradient(135deg, #ff00ff 0%, #00f0ff 100%)',
                  color: 'white',
                  boxShadow: '0 0 30px rgba(255, 0, 255, 0.5)',
                }}
                whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(255, 0, 255, 0.7)' }}
                whileTap={{ scale: 0.97 }}
              >
                <Sparkles className="w-5 h-5" />
                Launch Wallet Now
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* ==================== FOOTER ==================== */}
        <footer className="py-10 px-6 border-t border-white/10">
          <div className="w-full max-w-6xl mx-auto text-center">
            <p 
              style={{ 
                fontFamily: 'VT323, monospace',
                color: 'rgba(255, 255, 255, 0.4)',
                fontSize: '1.1rem',
              }}
            >
              © 2026 PunkZ Wallet. Built for the Solana community.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;
