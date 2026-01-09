import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
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
  Sparkles
} from 'lucide-react';

// Import Scene3D component
import Scene3D from '../../components/Scene3D';

// Animated Section Component with better animations
const AnimatedSection = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
};

// Feature Card Component with enhanced styling
const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description,
  isActive = false,
  index = 0
}: { 
  icon: LucideIcon; 
  title: string; 
  description: string;
  isActive?: boolean;
  index?: number;
}) => (
  <motion.div
    className="relative p-8 rounded-3xl text-center h-full"
    style={{
      background: isActive 
        ? 'linear-gradient(135deg, rgba(255, 0, 255, 0.2) 0%, rgba(0, 240, 255, 0.08) 100%)'
        : 'linear-gradient(135deg, rgba(15, 0, 35, 0.8) 0%, rgba(10, 0, 25, 0.9) 100%)',
      border: isActive ? '2px solid rgba(255, 0, 255, 0.6)' : '1px solid rgba(255, 0, 255, 0.2)',
      backdropFilter: 'blur(20px)',
    }}
    initial={{ opacity: 0, y: 50, scale: 0.9 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: index * 0.15 }}
    whileHover={{ 
      borderColor: '#ff00ff',
      boxShadow: '0 0 50px rgba(255, 0, 255, 0.4), inset 0 0 30px rgba(255, 0, 255, 0.1)',
      y: -8,
      scale: 1.02,
    }}
  >
    <motion.div 
      className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center"
      style={{
        border: '2px solid #00f0ff',
        background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.15) 0%, rgba(255, 0, 255, 0.05) 100%)',
        boxShadow: '0 0 25px rgba(0, 240, 255, 0.3)',
      }}
      whileHover={{ 
        rotate: [0, -5, 5, 0],
        boxShadow: '0 0 40px rgba(0, 240, 255, 0.5)',
      }}
      transition={{ duration: 0.5 }}
    >
      <Icon className="w-10 h-10" style={{ color: '#00f0ff', filter: 'drop-shadow(0 0 10px #00f0ff)' }} />
    </motion.div>
    <h3 
      className="text-2xl font-bold mb-4"
      style={{ 
        fontFamily: 'VT323, monospace',
        color: '#ff00ff',
        textShadow: '0 0 15px rgba(255, 0, 255, 0.6)',
        letterSpacing: '0.05em',
      }}
    >
      {title}
    </h3>
    <p 
      className="text-lg leading-relaxed"
      style={{ 
        fontFamily: 'VT323, monospace',
        color: 'rgba(0, 240, 255, 0.8)',
        lineHeight: '1.6',
      }}
    >
      {description}
    </p>
  </motion.div>
);

// How It Works Step Component with enhanced animations
const HowItWorksStep = ({ 
  number, 
  icon: Icon, 
  title, 
  description 
}: { 
  number: number; 
  icon: LucideIcon; 
  title: string; 
  description: string;
}) => (
  <motion.div 
    className="flex items-start gap-8"
    initial={{ opacity: 0, x: -50 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay: number * 0.2 }}
    viewport={{ once: true }}
  >
    <div className="relative shrink-0">
      <motion.div 
        className="w-20 h-20 rounded-2xl flex items-center justify-center"
        style={{
          border: '2px solid #00f0ff',
          background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.15) 0%, rgba(255, 0, 255, 0.05) 100%)',
          boxShadow: '0 0 25px rgba(0, 240, 255, 0.3)',
        }}
        whileHover={{ 
          scale: 1.1,
          boxShadow: '0 0 40px rgba(0, 240, 255, 0.5)',
        }}
      >
        <Icon className="w-10 h-10" style={{ color: '#00f0ff', filter: 'drop-shadow(0 0 10px #00f0ff)' }} />
      </motion.div>
      <motion.div 
        className="absolute -top-3 -right-3 w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
        style={{
          background: 'linear-gradient(135deg, #ff00ff 0%, #00f0ff 100%)',
          color: 'white',
          fontFamily: 'VT323, monospace',
          boxShadow: '0 0 20px rgba(255, 0, 255, 0.5)',
        }}
        whileHover={{ scale: 1.2, rotate: 10 }}
      >
        {number}
      </motion.div>
    </div>
    <div className="flex-1 pt-2">
      <h3 
        className="text-2xl font-bold mb-3"
        style={{ 
          fontFamily: 'VT323, monospace',
          color: '#ff00ff',
          textShadow: '0 0 15px rgba(255, 0, 255, 0.5)',
          letterSpacing: '0.05em',
        }}
      >
        {title}
      </h3>
      <p 
        className="text-lg leading-relaxed"
        style={{ 
          fontFamily: 'VT323, monospace',
          color: 'rgba(0, 240, 255, 0.8)',
          lineHeight: '1.8',
        }}
      >
        {description}
      </p>
    </div>
  </motion.div>
);

// Animated neon line connector
const NeonConnector = () => (
  <motion.div 
    className="ml-10 h-16 w-1 rounded-full"
    style={{ 
      background: 'linear-gradient(to bottom, #00f0ff, #ff00ff)',
      boxShadow: '0 0 15px rgba(0, 240, 255, 0.5)',
    }}
    initial={{ scaleY: 0, opacity: 0 }}
    whileInView={{ scaleY: 1, opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  />
);

// Loading screen component
const LoadingScreen = () => (
  <motion.div 
    className="fixed inset-0 z-50 flex items-center justify-center"
    style={{ background: '#0d0221' }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  >
    <motion.div className="text-center">
      <motion.h1 
        className="text-5xl font-bold mb-4"
        style={{ 
          fontFamily: 'Monoton, cursive',
          color: '#ff00ff',
          textShadow: '0 0 30px #ff00ff',
        }}
        animate={{ 
          textShadow: ['0 0 30px #ff00ff', '0 0 60px #ff00ff', '0 0 30px #ff00ff'],
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
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>
    </motion.div>
  </motion.div>
);

export const LandingPage = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen />}
      </AnimatePresence>
      
      <div 
        className="min-h-screen overflow-x-hidden"
        style={{
          background: 'linear-gradient(180deg, #0d0221 0%, #1a0033 50%, #0d0221 100%)',
        }}
      >
        {/* Animated Grid Background */}
        <div 
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 0, 255, 0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 0, 255, 0.04) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
        
        {/* Gradient Orbs with animation */}
        <motion.div 
          className="fixed top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255, 0, 255, 0.2) 0%, transparent 70%)' }}
          animate={{ 
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div 
          className="fixed bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0, 240, 255, 0.15) 0%, transparent 70%)' }}
          animate={{ 
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Hero Section */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-12 lg:px-20">
          <motion.div 
            style={{ opacity, scale }} 
            className="text-center z-10 w-full max-w-7xl mx-auto"
          >
            {/* Logo with enhanced animation */}
            <motion.div
              initial={{ opacity: 0, y: -60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <motion.h1 
                className="text-7xl md:text-9xl lg:text-[10rem] font-bold mb-6"
                style={{ 
                  fontFamily: 'Monoton, cursive',
                  color: '#ff00ff',
                  textShadow: '0 0 30px #ff00ff, 0 0 60px #ff00ff, 0 0 90px #ff00ff',
                }}
                animate={{ 
                  textShadow: [
                    '0 0 30px #ff00ff, 0 0 60px #ff00ff, 0 0 90px #ff00ff',
                    '0 0 40px #ff00ff, 0 0 80px #ff00ff, 0 0 120px #ff00ff',
                    '0 0 30px #ff00ff, 0 0 60px #ff00ff, 0 0 90px #ff00ff',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                PUNKZ
              </motion.h1>
            </motion.div>
            
            <motion.p 
              className="text-2xl md:text-3xl lg:text-4xl mb-12"
              style={{ 
                fontFamily: 'VT323, monospace',
                color: '#00f0ff',
                textShadow: '0 0 15px rgba(0, 240, 255, 0.6)',
                letterSpacing: '0.1em',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              The Future of Private Transactions on Solana
            </motion.p>

            {/* 3D Car Section */}
            <motion.div 
              className="w-full h-[400px] md:h-[500px] lg:h-[600px] mb-12 relative mx-auto"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
            >
              <Scene3D />
            </motion.div>

            {/* CTA Button */}
            <motion.button
              onClick={() => navigate('/onboarding')}
              className="px-12 py-5 rounded-full text-2xl font-bold inline-flex items-center gap-3"
              style={{
                fontFamily: 'VT323, monospace',
                background: 'linear-gradient(135deg, #ff00ff 0%, #00f0ff 100%)',
                color: 'white',
                boxShadow: '0 0 40px rgba(255, 0, 255, 0.6)',
                letterSpacing: '0.1em',
              }}
              whileHover={{ 
                scale: 1.08, 
                boxShadow: '0 0 70px rgba(255, 0, 255, 0.9)',
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Sparkles className="w-6 h-6" />
              Launch Wallet
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowDown className="w-8 h-8" style={{ color: '#00f0ff', filter: 'drop-shadow(0 0 10px #00f0ff)' }} />
          </motion.div>
        </section>

        {/* Why PunkZ Section */}
        <section className="py-32 px-6 md:px-12 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <AnimatedSection className="text-center mb-20">
              <motion.div
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full mb-8"
                style={{
                  background: 'rgba(255, 0, 255, 0.1)',
                  border: '1px solid rgba(255, 0, 255, 0.3)',
                }}
              >
                <Sparkles className="w-5 h-5" style={{ color: '#ff00ff' }} />
                <span style={{ fontFamily: 'VT323, monospace', color: '#ff00ff', letterSpacing: '0.1em' }}>
                  FEATURES
                </span>
              </motion.div>
              <h2 
                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
                style={{ 
                  fontFamily: 'Permanent Marker, cursive',
                  color: '#00f0ff',
                  textShadow: '0 0 30px rgba(0, 240, 255, 0.6)',
                }}
              >
                Why PunkZ?
              </h2>
              <p 
                className="text-xl md:text-2xl max-w-3xl mx-auto"
                style={{ 
                  fontFamily: 'VT323, monospace',
                  color: 'rgba(255, 255, 255, 0.7)',
                  lineHeight: '1.6',
                }}
              >
                Experience the future of private transactions on Solana with cutting-edge technology
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Shield, title: 'Privacy First', description: 'Your transactions are your business. Complete anonymity on every transfer.', active: false },
                { icon: Zap, title: 'Lightning Fast', description: 'Built on Solana for sub-second transaction finality and minimal fees.', active: false },
                { icon: Lock, title: 'Self-Custody', description: 'Your keys, your coins. We never have access to your funds.', active: true },
                { icon: Eye, title: 'Zero Knowledge', description: 'Advanced cryptography ensures complete transaction privacy.', active: false },
              ].map((feature, index) => (
                <FeatureCard 
                  key={index}
                  icon={feature.icon} 
                  title={feature.title} 
                  description={feature.description}
                  isActive={feature.active}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-32 px-6 md:px-12 lg:px-20">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection className="text-center mb-20">
              <motion.div
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full mb-8"
                style={{
                  background: 'rgba(0, 240, 255, 0.1)',
                  border: '1px solid rgba(0, 240, 255, 0.3)',
                }}
              >
                <Wallet className="w-5 h-5" style={{ color: '#00f0ff' }} />
                <span style={{ fontFamily: 'VT323, monospace', color: '#00f0ff', letterSpacing: '0.1em' }}>
                  GET STARTED
                </span>
              </motion.div>
              <h2 
                className="text-5xl md:text-6xl lg:text-7xl font-bold"
                style={{ 
                  fontFamily: 'Permanent Marker, cursive',
                  color: '#00f0ff',
                  textShadow: '0 0 30px rgba(0, 240, 255, 0.6)',
                }}
              >
                How It Works
              </h2>
            </AnimatedSection>

            <div className="space-y-6">
              <HowItWorksStep
                number={1}
                icon={Wallet}
                title="Create or Import"
                description="Generate a new wallet or import your existing Solana wallet using your secret recovery phrase. Your keys never leave your device."
              />
              
              <NeonConnector />
              
              <HowItWorksStep
                number={2}
                icon={Send}
                title="Send Privately"
                description="Send SOL and SPL tokens to any address. Our privacy layer ensures your transactions cannot be traced back to you."
              />
              
              <NeonConnector />
              
              <HowItWorksStep
                number={3}
                icon={ArrowDownUp}
                title="Swap Anonymously"
                description="Swap between tokens using integrated DEX aggregators. Your trading activity stays completely private."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6 md:px-12 lg:px-20">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="text-center p-12 md:p-16 lg:p-20 rounded-3xl relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 0, 255, 0.15) 0%, rgba(0, 240, 255, 0.08) 100%)',
                border: '2px solid rgba(255, 0, 255, 0.3)',
              }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {/* Background glow effect */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, rgba(255, 0, 255, 0.1) 0%, transparent 60%)',
                }}
              />
              
              <motion.h2 
                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 relative z-10"
                style={{ 
                  fontFamily: 'Permanent Marker, cursive',
                  color: '#ff00ff',
                  textShadow: '0 0 30px rgba(255, 0, 255, 0.6)',
                }}
              >
                Ready to Go Private?
              </motion.h2>
              <p 
                className="text-xl md:text-2xl mb-12 relative z-10"
                style={{ 
                  fontFamily: 'VT323, monospace',
                  color: 'rgba(0, 240, 255, 0.8)',
                }}
              >
                Join thousands of users who value their financial privacy
              </p>
              <motion.button
                onClick={() => navigate('/onboarding')}
                className="px-14 py-6 rounded-full text-2xl md:text-3xl font-bold inline-flex items-center gap-4 relative z-10"
                style={{
                  fontFamily: 'VT323, monospace',
                  background: 'linear-gradient(135deg, #ff00ff 0%, #00f0ff 100%)',
                  color: 'white',
                  boxShadow: '0 0 50px rgba(255, 0, 255, 0.6)',
                  letterSpacing: '0.1em',
                }}
                whileHover={{ scale: 1.08, boxShadow: '0 0 80px rgba(255, 0, 255, 0.9)' }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles className="w-7 h-7" />
                Launch Wallet Now
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer 
          className="py-12 px-6 md:px-12 lg:px-20 border-t"
          style={{ borderColor: 'rgba(255, 0, 255, 0.2)' }}
        >
          <div className="max-w-7xl mx-auto text-center">
            <motion.p 
              className="text-lg"
              style={{ 
                fontFamily: 'VT323, monospace',
                color: 'rgba(0, 240, 255, 0.5)',
              }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              © 2026 PunkZ Wallet. Built for the Solana community.
            </motion.p>
          </div>
        </footer>
      </div>
    </>
  );
};
