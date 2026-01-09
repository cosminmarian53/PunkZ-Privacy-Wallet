import { Suspense, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial, Sphere, Box, Torus } from '@react-three/drei';
import * as THREE from 'three';
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
  ArrowDown
} from 'lucide-react';

// 3D Cyber Car Model Component
const CyberCar = () => {
  const carRef = useRef<THREE.Group>(null);
  const wheelsRef = useRef<THREE.Mesh[]>([]);
  
  useFrame((state) => {
    if (carRef.current) {
      carRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      carRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
    wheelsRef.current.forEach((wheel) => {
      if (wheel) wheel.rotation.x += 0.05;
    });
  });

  const neonMaterial = new THREE.MeshStandardMaterial({
    color: '#ff00ff',
    emissive: '#ff00ff',
    emissiveIntensity: 0.5,
    metalness: 0.9,
    roughness: 0.1,
  });

  const cyanMaterial = new THREE.MeshStandardMaterial({
    color: '#00f0ff',
    emissive: '#00f0ff',
    emissiveIntensity: 0.5,
    metalness: 0.9,
    roughness: 0.1,
  });

  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: '#1a0033',
    metalness: 0.8,
    roughness: 0.2,
  });

  return (
    <group ref={carRef} position={[0, 0, 0]} scale={1.5}>
      {/* Car Body - Main */}
      <mesh position={[0, 0.3, 0]} material={bodyMaterial}>
        <boxGeometry args={[2.4, 0.4, 1]} />
      </mesh>
      
      {/* Car Body - Top */}
      <mesh position={[0.2, 0.65, 0]} material={bodyMaterial}>
        <boxGeometry args={[1.4, 0.3, 0.9]} />
      </mesh>
      
      {/* Windshield */}
      <mesh position={[-0.3, 0.55, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.4, 0.35, 0.85]} />
        <meshStandardMaterial color="#00f0ff" transparent opacity={0.3} />
      </mesh>
      
      {/* Neon Trim - Front */}
      <mesh position={[-1.2, 0.2, 0]} material={neonMaterial}>
        <boxGeometry args={[0.05, 0.1, 1.1]} />
      </mesh>
      
      {/* Neon Trim - Rear */}
      <mesh position={[1.2, 0.2, 0]} material={cyanMaterial}>
        <boxGeometry args={[0.05, 0.1, 1.1]} />
      </mesh>
      
      {/* Neon Trim - Side Lines */}
      <mesh position={[0, 0.15, 0.52]} material={neonMaterial}>
        <boxGeometry args={[2.5, 0.03, 0.03]} />
      </mesh>
      <mesh position={[0, 0.15, -0.52]} material={neonMaterial}>
        <boxGeometry args={[2.5, 0.03, 0.03]} />
      </mesh>
      
      {/* Headlights */}
      <mesh position={[-1.22, 0.3, 0.3]} material={cyanMaterial}>
        <boxGeometry args={[0.05, 0.15, 0.2]} />
      </mesh>
      <mesh position={[-1.22, 0.3, -0.3]} material={cyanMaterial}>
        <boxGeometry args={[0.05, 0.15, 0.2]} />
      </mesh>
      
      {/* Taillights */}
      <mesh position={[1.22, 0.3, 0.35]} material={neonMaterial}>
        <boxGeometry args={[0.05, 0.1, 0.25]} />
      </mesh>
      <mesh position={[1.22, 0.3, -0.35]} material={neonMaterial}>
        <boxGeometry args={[0.05, 0.1, 0.25]} />
      </mesh>
      
      {/* Wheels */}
      {[[-0.7, 0, 0.55], [-0.7, 0, -0.55], [0.7, 0, 0.55], [0.7, 0, -0.55]].map((pos, i) => (
        <mesh 
          key={i} 
          position={pos as [number, number, number]} 
          rotation={[Math.PI / 2, 0, 0]}
          ref={(el) => { if (el) wheelsRef.current[i] = el; }}
        >
          <cylinderGeometry args={[0.2, 0.2, 0.15, 16]} />
          <meshStandardMaterial color="#111" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
      
      {/* Wheel Neon Rings */}
      {[[-0.7, 0, 0.63], [-0.7, 0, -0.63], [0.7, 0, 0.63], [0.7, 0, -0.63]].map((pos, i) => (
        <mesh key={`ring-${i}`} position={pos as [number, number, number]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.18, 0.02, 8, 24]} />
          <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={1} />
        </mesh>
      ))}
      
      {/* Underglow */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[2.2, 0.02, 0.8]} />
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={2} transparent opacity={0.5} />
      </mesh>
    </group>
  );
};

// Floating Geometry Background
const FloatingGeometry = () => {
  return (
    <>
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Sphere args={[0.3, 32, 32]} position={[-4, 2, -3]}>
          <MeshDistortMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={0.3} distort={0.4} speed={2} />
        </Sphere>
      </Float>
      <Float speed={1.5} rotationIntensity={2} floatIntensity={1}>
        <Box args={[0.4, 0.4, 0.4]} position={[4, -1, -2]} rotation={[0.5, 0.5, 0]}>
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.3} />
        </Box>
      </Float>
      <Float speed={1} rotationIntensity={1.5} floatIntensity={1.5}>
        <Torus args={[0.3, 0.1, 16, 32]} position={[3, 2, -4]}>
          <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={0.5} />
        </Torus>
      </Float>
    </>
  );
};

// 3D Scene Component
const Scene3D = () => {
  return (
    <Canvas
      camera={{ position: [4, 2, 5], fov: 50 }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ff00ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00f0ff" />
      <spotLight position={[0, 10, 0]} intensity={1} color="#ffffff" angle={0.3} />
      
      <Suspense fallback={null}>
        <CyberCar />
        <FloatingGeometry />
      </Suspense>
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 4}
      />
      
      <gridHelper args={[20, 40, '#ff00ff', '#1a0033']} position={[0, -0.5, 0]} />
    </Canvas>
  );
};

// Animated Section Component
const AnimatedSection = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
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

// Feature Card Component matching reference
const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description,
  isActive = false
}: { 
  icon: LucideIcon; 
  title: string; 
  description: string;
  isActive?: boolean;
}) => (
  <motion.div
    className="relative p-6 rounded-2xl text-center"
    style={{
      background: isActive 
        ? 'linear-gradient(135deg, rgba(255, 0, 255, 0.15) 0%, rgba(0, 240, 255, 0.05) 100%)'
        : 'rgba(10, 0, 30, 0.5)',
      border: isActive ? '1px solid rgba(255, 0, 255, 0.5)' : '1px solid rgba(255, 0, 255, 0.15)',
    }}
    whileHover={{ 
      borderColor: '#ff00ff',
      boxShadow: '0 0 30px rgba(255, 0, 255, 0.3)',
    }}
  >
    <div 
      className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center"
      style={{
        border: '2px solid #00f0ff',
        background: 'rgba(0, 240, 255, 0.1)',
      }}
    >
      <Icon className="w-7 h-7" style={{ color: '#00f0ff' }} />
    </div>
    <h3 
      className="text-lg font-bold mb-2"
      style={{ 
        fontFamily: 'VT323, monospace',
        color: '#ff00ff',
        textShadow: '0 0 10px rgba(255, 0, 255, 0.5)',
      }}
    >
      {title}
    </h3>
    <p 
      className="text-sm"
      style={{ 
        fontFamily: 'VT323, monospace',
        color: 'rgba(0, 240, 255, 0.7)',
      }}
    >
      {description}
    </p>
  </motion.div>
);

// How It Works Step Component
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
    className="flex items-start gap-6"
    initial={{ opacity: 0, x: -30 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: number * 0.1 }}
    viewport={{ once: true }}
  >
    <div className="relative shrink-0">
      <div 
        className="w-16 h-16 rounded-full flex items-center justify-center"
        style={{
          border: '2px solid #00f0ff',
          background: 'rgba(0, 240, 255, 0.1)',
        }}
      >
        <Icon className="w-7 h-7" style={{ color: '#00f0ff' }} />
      </div>
      <div 
        className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
        style={{
          background: 'linear-gradient(135deg, #ff00ff 0%, #00f0ff 100%)',
          color: 'white',
          fontFamily: 'VT323, monospace',
        }}
      >
        {number}
      </div>
    </div>
    <div className="flex-1">
      <h3 
        className="text-xl font-bold mb-2"
        style={{ 
          fontFamily: 'VT323, monospace',
          color: '#ff00ff',
          textShadow: '0 0 10px rgba(255, 0, 255, 0.5)',
        }}
      >
        {title}
      </h3>
      <p 
        className="text-base leading-relaxed"
        style={{ 
          fontFamily: 'VT323, monospace',
          color: 'rgba(0, 240, 255, 0.7)',
        }}
      >
        {description}
      </p>
    </div>
  </motion.div>
);

export const LandingPage = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
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
            linear-gradient(rgba(255, 0, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 0, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      
      {/* Gradient Orbs */}
      <div 
        className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255, 0, 255, 0.15) 0%, transparent 70%)' }}
      />
      <div 
        className="fixed bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0, 240, 255, 0.1) 0%, transparent 70%)' }}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6">
        <motion.div style={{ opacity }} className="text-center z-10 max-w-4xl mx-auto">
          {/* Logo */}
          <motion.h1 
            className="text-6xl md:text-8xl font-bold mb-4"
            style={{ 
              fontFamily: 'Monoton, cursive',
              color: '#ff00ff',
              textShadow: '0 0 20px #ff00ff, 0 0 40px #ff00ff, 0 0 60px #ff00ff',
            }}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            PUNKZ
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-8"
            style={{ 
              fontFamily: 'VT323, monospace',
              color: '#00f0ff',
              textShadow: '0 0 10px rgba(0, 240, 255, 0.5)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            The Future of Private Transactions on Solana
          </motion.p>

          {/* 3D Car Section */}
          <motion.div 
            className="w-full h-80 md:h-96 mb-8 relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Scene3D />
            {/* Coordinates Display */}
            <div 
              className="absolute bottom-4 left-4 px-3 py-2 rounded-lg text-xs"
              style={{ 
                background: 'rgba(0, 0, 0, 0.7)',
                border: '1px solid rgba(0, 240, 255, 0.3)',
                fontFamily: 'VT323, monospace',
                color: '#00f0ff',
              }}
            >
              X: 4.00 | Y: 2.00 | Z: 5.00
            </div>
          </motion.div>

          <motion.button
            onClick={() => navigate('/onboarding')}
            className="px-10 py-4 rounded-full text-xl font-bold"
            style={{
              fontFamily: 'VT323, monospace',
              background: 'linear-gradient(135deg, #ff00ff 0%, #00f0ff 100%)',
              color: 'white',
              boxShadow: '0 0 30px rgba(255, 0, 255, 0.5)',
            }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(255, 0, 255, 0.8)' }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            Launch Wallet <ChevronRight className="inline w-5 h-5 ml-1" />
          </motion.button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowDown className="w-6 h-6" style={{ color: '#00f0ff' }} />
        </motion.div>
      </section>

      {/* Why PunkZ Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <h2 
              className="text-4xl md:text-5xl font-bold text-center mb-4"
              style={{ 
                fontFamily: 'Permanent Marker, cursive',
                color: '#00f0ff',
                textShadow: '0 0 20px rgba(0, 240, 255, 0.5)',
              }}
            >
              Why PunkZ?
            </h2>
            <p 
              className="text-center mb-16 text-lg"
              style={{ 
                fontFamily: 'VT323, monospace',
                color: 'rgba(255, 255, 255, 0.7)',
              }}
            >
              Experience the future of private transactions on Solana
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Privacy First', description: 'Your transactions are your business. Complete anonymity on every transfer.', active: false },
              { icon: Zap, title: 'Lightning Fast', description: 'Built on Solana for sub-second transaction finality.', active: false },
              { icon: Lock, title: 'Self-Custody', description: 'Your keys, your coins. We never have access to your funds.', active: true },
              { icon: Eye, title: 'Zero Knowledge', description: 'Advanced cryptography ensures transaction privacy.', active: false },
            ].map((feature, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <FeatureCard 
                  icon={feature.icon} 
                  title={feature.title} 
                  description={feature.description}
                  isActive={feature.active}
                />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <h2 
              className="text-4xl md:text-5xl font-bold text-center mb-16"
              style={{ 
                fontFamily: 'Permanent Marker, cursive',
                color: '#00f0ff',
                textShadow: '0 0 20px rgba(0, 240, 255, 0.5)',
              }}
            >
              How It Works
            </h2>
          </AnimatedSection>

          <div className="space-y-12">
            <HowItWorksStep
              number={1}
              icon={Wallet}
              title="Create or Import"
              description="Generate a new wallet or import your existing Solana wallet using your secret recovery phrase. Your keys never leave your device."
            />
            
            <div className="ml-8 h-8 w-0.5" style={{ background: 'linear-gradient(to bottom, #00f0ff, #ff00ff)' }} />
            
            <HowItWorksStep
              number={2}
              icon={Send}
              title="Send Privately"
              description="Send SOL and SPL tokens to any address. Our privacy layer ensures your transactions cannot be traced back to you."
            />
            
            <div className="ml-8 h-8 w-0.5" style={{ background: 'linear-gradient(to bottom, #ff00ff, #00f0ff)' }} />
            
            <HowItWorksStep
              number={3}
              icon={ArrowDownUp}
              title="Swap Anonymously"
              description="Swap between tokens using integrated DEX aggregators. Your trading activity stays private."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <h2 
              className="text-4xl md:text-5xl font-bold mb-6"
              style={{ 
                fontFamily: 'Permanent Marker, cursive',
                color: '#ff00ff',
                textShadow: '0 0 20px rgba(255, 0, 255, 0.5)',
              }}
            >
              Ready to Go Private?
            </h2>
            <p 
              className="text-xl mb-10"
              style={{ 
                fontFamily: 'VT323, monospace',
                color: 'rgba(0, 240, 255, 0.7)',
              }}
            >
              Join thousands of users who value their financial privacy
            </p>
            <motion.button
              onClick={() => navigate('/onboarding')}
              className="px-12 py-5 rounded-full text-2xl font-bold"
              style={{
                fontFamily: 'VT323, monospace',
                background: 'linear-gradient(135deg, #ff00ff 0%, #00f0ff 100%)',
                color: 'white',
                boxShadow: '0 0 40px rgba(255, 0, 255, 0.5)',
              }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 60px rgba(255, 0, 255, 0.8)' }}
              whileTap={{ scale: 0.98 }}
            >
              Launch Wallet Now
            </motion.button>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer 
        className="py-8 px-6 border-t"
        style={{ borderColor: 'rgba(255, 0, 255, 0.2)' }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <p 
            className="text-sm"
            style={{ 
              fontFamily: 'VT323, monospace',
              color: 'rgba(0, 240, 255, 0.5)',
            }}
          >
            © 2024 PunkZ Wallet. Built for the Solana community.
          </p>
        </div>
      </footer>
    </div>
  );
};
