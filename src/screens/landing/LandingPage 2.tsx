import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Zap, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowDown,
  Wallet,
  Send,
  ArrowDownUp,
  Sparkles,
  Globe,
  Users,
  TrendingUp,
  ChevronRight
} from 'lucide-react';

// Animated Section Component
const AnimatedSection = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

// Flickering Neon Text Component
const NeonText = ({ 
  text, 
  className = '',
  color = '#ff00ff'
}: { 
  text: string; 
  className?: string;
  color?: string;
}) => {
  const [flickerIndex, setFlickerIndex] = useState<number | null>(null);

  useEffect(() => {
    let flickerTimeout: NodeJS.Timeout;

    const flicker = () => {
      const randomIndex = Math.floor(Math.random() * text.length);
      setFlickerIndex(randomIndex);

      setTimeout(() => {
        setFlickerIndex(null);
      }, Math.random() * 100 + 50);

      flickerTimeout = setTimeout(flicker, Math.random() * 4000 + 1000);
    };

    flickerTimeout = setTimeout(flicker, Math.random() * 4000 + 1000);

    return () => clearTimeout(flickerTimeout);
  }, [text.length]);

  return (
    <span className={className}>
      {text.split('').map((char, index) => (
        <span
          key={index}
          style={{
            opacity: flickerIndex === index ? 0.1 : 1,
            transition: 'opacity 0.06s',
            textShadow: `0 0 10px ${color}, 0 0 20px ${color}, 0 0 40px ${color}, 0 0 80px ${color}`,
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
};

// Particle Background
const ParticleBackground = () => {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-purple-500/30"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -1000],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
};

// Grid Background
const GridBackground = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    <div 
      className="absolute inset-0 opacity-20"
      style={{
        backgroundImage: `
          linear-gradient(to right, #ff00ff10 1px, transparent 1px),
          linear-gradient(to bottom, #ff00ff10 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        perspective: '1000px',
        transform: 'rotateX(60deg) scale(2.5)',
        transformOrigin: 'center top',
      }}
    />
  </div>
);

// Scanline Effect
const ScanlineEffect = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
    <motion.div
      className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"
      animate={{
        top: ['-2px', '100vh'],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  </div>
);

// Feature Card Component
const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description,
  delay = 0,
  color = '#00f0ff'
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
  delay?: number;
  color?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group"
    >
      <motion.div
        className="relative p-6 rounded-xl border border-purple-500/30 bg-black/50 backdrop-blur-sm overflow-hidden"
        animate={{
          borderColor: isHovered ? color : 'rgba(168, 85, 247, 0.3)',
          boxShadow: isHovered ? `0 0 30px ${color}40, inset 0 0 30px ${color}10` : 'none',
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at center, ${color}20 0%, transparent 70%)`,
          }}
        />
        
        <motion.div 
          className="relative z-10"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <div 
            className="w-16 h-16 rounded-full border-2 flex items-center justify-center mb-4 mx-auto"
            style={{ 
              borderColor: color,
              boxShadow: `0 0 15px ${color}`,
            }}
          >
            <Icon className="w-8 h-8" style={{ color }} />
          </div>
        </motion.div>
        
        <h3 
          className="text-xl font-bold text-center mb-2 font-mono"
          style={{ 
            color,
            textShadow: `0 0 10px ${color}`,
          }}
        >
          {title}
        </h3>
        <p className="text-gray-400 text-center text-sm leading-relaxed font-mono">
          {description}
        </p>
      </motion.div>
    </motion.div>
  );
};

// Step Component
const StepCard = ({ 
  number, 
  title, 
  description,
  icon: Icon,
  delay = 0
}: { 
  number: number; 
  title: string; 
  description: string;
  icon: React.ElementType;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="flex items-start gap-6 group"
  >
    <motion.div 
      className="flex-shrink-0 w-20 h-20 rounded-full border-2 border-cyan-400 flex items-center justify-center relative"
      style={{ boxShadow: '0 0 20px #00f0ff' }}
      whileHover={{ scale: 1.1, boxShadow: '0 0 40px #00f0ff' }}
    >
      <Icon className="w-10 h-10 text-cyan-400" />
      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm border-2 border-purple-400">
        {number}
      </div>
    </motion.div>
    <div className="flex-1">
      <h3 className="text-2xl font-bold text-cyan-400 mb-2 font-mono" style={{ transform: 'rotate(-1deg)' }}>
        {title}
      </h3>
      <p className="text-gray-400 font-mono leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

// Statistics Component
const StatItem = ({ value, label, delay = 0 }: { value: string; label: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="text-center"
  >
    <motion.div 
      className="text-4xl md:text-5xl font-bold font-mono mb-2"
      style={{ 
        color: '#ff00ff',
        textShadow: '0 0 20px #ff00ff, 0 0 40px #ff00ff',
      }}
      animate={{ textShadow: ['0 0 20px #ff00ff', '0 0 40px #ff00ff, 0 0 60px #ff00ff', '0 0 20px #ff00ff'] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      {value}
    </motion.div>
    <div className="text-gray-400 font-mono uppercase tracking-wider text-sm">{label}</div>
  </motion.div>
);

// Main Landing Page Component
export const LandingPage = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0d0221] text-white overflow-x-hidden">
      {/* Background Effects */}
      <ParticleBackground />
      <GridBackground />
      <ScanlineEffect />

      {/* Hero Section */}
      <motion.section 
        className="relative min-h-screen flex flex-col items-center justify-center px-4"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 
            className="text-7xl md:text-9xl font-bold tracking-wider mb-4"
            style={{ 
              fontFamily: 'Monoton, cursive',
              color: '#ff00ff',
            }}
          >
            <NeonText text="PUNKZ" color="#ff00ff" />
          </h1>
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 font-mono tracking-widest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{ textShadow: '0 0 10px #00f0ff' }}
          >
            UNLOCK FINANCIAL PRIVACY ON SOLANA
          </motion.p>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-lg text-gray-400 text-center max-w-2xl mb-12 font-mono"
        >
          The next generation privacy-focused wallet for the Solana blockchain. 
          Send, receive, and swap with complete anonymity.
        </motion.p>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center text-cyan-400 cursor-pointer"
          >
            <span className="text-sm font-mono mb-2 tracking-wider">SCROLL</span>
            <ArrowDown className="w-6 h-6" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section className="relative py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <h2 
              className="text-4xl md:text-6xl font-bold text-center mb-4"
              style={{ 
                fontFamily: 'Permanent Marker, cursive',
                color: '#ff00ff',
                textShadow: '0 0 20px #ff00ff',
                transform: 'rotate(-2deg)',
              }}
            >
              Why PunkZ?
            </h2>
            <p className="text-gray-400 text-center text-lg mb-16 font-mono max-w-2xl mx-auto">
              Experience the future of private transactions on Solana
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={Shield}
              title="Privacy First"
              description="Your transactions are your business. Complete anonymity on every transfer."
              delay={0}
              color="#ff00ff"
            />
            <FeatureCard
              icon={Zap}
              title="Lightning Fast"
              description="Built on Solana for sub-second transaction finality."
              delay={0.1}
              color="#00f0ff"
            />
            <FeatureCard
              icon={Lock}
              title="Self-Custody"
              description="Your keys, your coins. We never have access to your funds."
              delay={0.2}
              color="#ff00ff"
            />
            <FeatureCard
              icon={EyeOff}
              title="Zero Knowledge"
              description="Advanced cryptography ensures transaction privacy."
              delay={0.3}
              color="#00f0ff"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-32 px-4 border-t border-purple-500/20">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <h2 
              className="text-4xl md:text-6xl font-bold text-center mb-16"
              style={{ 
                fontFamily: 'Permanent Marker, cursive',
                color: '#00f0ff',
                textShadow: '0 0 20px #00f0ff',
                transform: 'rotate(-2deg)',
              }}
            >
              How It Works
            </h2>
          </AnimatedSection>

          <div className="space-y-12">
            <StepCard
              number={1}
              icon={Wallet}
              title="Create or Import"
              description="Generate a new wallet or import your existing Solana wallet using your secret recovery phrase. Your keys never leave your device."
              delay={0}
            />
            
            <motion.div 
              className="w-1 h-16 bg-gradient-to-b from-cyan-400 to-purple-500 mx-auto"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              style={{ boxShadow: '0 0 15px #00f0ff' }}
            />
            
            <StepCard
              number={2}
              icon={Send}
              title="Send Privately"
              description="Send SOL and SPL tokens to any address. Our privacy layer ensures your transactions cannot be traced back to you."
              delay={0.1}
            />
            
            <motion.div 
              className="w-1 h-16 bg-gradient-to-b from-purple-500 to-pink-500 mx-auto"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              style={{ boxShadow: '0 0 15px #ff00ff' }}
            />
            
            <StepCard
              number={3}
              icon={ArrowDownUp}
              title="Swap Anonymously"
              description="Swap between tokens using integrated DEX aggregators. Your trading activity stays private."
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="relative py-32 px-4 border-t border-purple-500/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <div className="relative">
                {/* Privacy Graphic */}
                <motion.div 
                  className="w-full aspect-square max-w-md mx-auto border-2 border-dashed border-cyan-400 rounded-xl flex items-center justify-center"
                  style={{ boxShadow: '0 0 30px #00f0ff inset' }}
                  animate={{ 
                    boxShadow: ['0 0 30px #00f0ff inset', '0 0 60px #00f0ff inset', '0 0 30px #00f0ff inset'],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="relative w-3/4 h-3/4"
                  >
                    <Eye className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 text-purple-400" />
                    <Shield className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-12 text-cyan-400" />
                    <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 text-pink-400" />
                    <EyeOff className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 text-purple-400" />
                  </motion.div>
                  <Sparkles className="absolute w-16 h-16 text-yellow-400" />
                </motion.div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <h2 
                className="text-4xl md:text-5xl font-bold mb-6"
                style={{ 
                  fontFamily: 'Permanent Marker, cursive',
                  color: '#ff00ff',
                  textShadow: '0 0 20px #ff00ff',
                  transform: 'rotate(-2deg)',
                }}
              >
                True Privacy on Solana
              </h2>
              <p className="text-gray-400 font-mono leading-relaxed mb-6">
                PunkZ leverages advanced cryptographic techniques to ensure your financial 
                transactions remain private. Unlike traditional wallets, we break the on-chain 
                link between your addresses.
              </p>
              <p className="text-gray-400 font-mono leading-relaxed mb-6">
                Using zero-knowledge proofs and mixing protocols, PunkZ makes it impossible 
                for anyone to trace your transaction history or link your wallets together.
              </p>
              <p className="text-gray-400 font-mono leading-relaxed">
                Your financial privacy is a <span className="text-cyan-400">fundamental right</span>. 
                PunkZ makes it a reality on Solana.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="relative py-32 px-4 border-t border-purple-500/20">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <h2 
              className="text-4xl md:text-6xl font-bold text-center mb-16"
              style={{ 
                fontFamily: 'Permanent Marker, cursive',
                color: '#00f0ff',
                textShadow: '0 0 20px #00f0ff',
                transform: 'rotate(-2deg)',
              }}
            >
              Join the Movement
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem value="10K+" label="Users" delay={0} />
            <StatItem value="$50M+" label="Volume" delay={0.1} />
            <StatItem value="100K+" label="Transactions" delay={0.2} />
            <StatItem value="99.9%" label="Uptime" delay={0.3} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4 border-t border-purple-500/20">
        <div className="max-w-3xl mx-auto text-center">
          <AnimatedSection>
            <h2 
              className="text-5xl md:text-7xl font-bold mb-6"
              style={{ 
                fontFamily: 'Permanent Marker, cursive',
                color: '#ff00ff',
                textShadow: '0 0 30px #ff00ff',
                transform: 'rotate(-2deg)',
              }}
            >
              Go Dark.
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <p className="text-xl text-gray-400 font-mono mb-12 max-w-xl mx-auto">
              Take the first step towards financial anonymity on Solana. 
              Your privacy journey starts now.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <motion.button
              onClick={() => navigate('/onboarding')}
              className="group relative px-12 py-5 text-2xl font-bold font-mono uppercase tracking-wider text-white rounded-lg overflow-hidden"
              style={{ 
                fontFamily: 'Monoton, cursive',
                background: 'linear-gradient(45deg, #ff00ff, #00f0ff)',
                boxShadow: '0 0 30px #ff00ff80, 0 0 30px #00f0ff80',
              }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 0 50px #ff00ffcc, 0 0 50px #00f0ffcc',
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center gap-3">
                Launch Wallet
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </span>
              
              {/* Animated gradient overlay */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: 'linear-gradient(45deg, #00f0ff, #ff00ff)',
                }}
              />
            </motion.button>
          </AnimatedSection>

          {/* Devnet Notice */}
          <AnimatedSection delay={0.3}>
            <div className="mt-8 p-4 rounded-lg border border-yellow-500/30 bg-yellow-500/5 max-w-md mx-auto">
              <p className="text-yellow-400 font-mono text-sm flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                Currently running on Solana Devnet for testing
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-4 border-t border-purple-500/20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ 
                  background: 'linear-gradient(135deg, #ff00ff, #00f0ff)',
                  boxShadow: '0 0 20px #ff00ff80',
                }}
              >
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span 
                className="text-2xl font-bold"
                style={{ 
                  fontFamily: 'Monoton, cursive',
                  color: '#ff00ff',
                  textShadow: '0 0 10px #ff00ff',
                }}
              >
                PUNKZ
              </span>
            </div>

            <div className="flex items-center gap-6 text-gray-400 font-mono text-sm">
              <a href="#" className="hover:text-cyan-400 transition-colors">Docs</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">GitHub</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Twitter</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Discord</a>
            </div>

            <p className="text-gray-500 font-mono text-sm">
              © 2026 PunkZ Wallet. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
