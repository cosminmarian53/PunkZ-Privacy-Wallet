import React from 'react';
import { motion } from 'framer-motion';

const RetroLoader: React.FC = () => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-50">
      {/* Glowing orbs in background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-64 h-64 rounded-full blur-3xl opacity-30"
          style={{ background: 'radial-gradient(circle, #ff00ff, transparent)' }}
          animate={{
            x: ['-20%', '120%'],
            y: ['20%', '80%'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute w-48 h-48 rounded-full blur-3xl opacity-30"
          style={{ background: 'radial-gradient(circle, #00ffff, transparent)' }}
          animate={{
            x: ['120%', '-20%'],
            y: ['60%', '20%'],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Main loader content */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* PunkZ Logo Text */}
        <motion.h1
          className="font-monoton text-5xl md:text-7xl"
          style={{
            background: 'linear-gradient(90deg, #ff00ff, #00ffff, #ff00ff)',
            backgroundSize: '200% 100%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 30px rgba(255, 0, 255, 0.5)',
          }}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          PUNKZ
        </motion.h1>

        {/* Spinning loader ring */}
        <div className="relative w-20 h-20">
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              border: '3px solid transparent',
              borderTop: '3px solid #ff00ff',
              borderRight: '3px solid #00ffff',
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          <motion.div
            className="absolute inset-2 rounded-full"
            style={{
              border: '3px solid transparent',
              borderBottom: '3px solid #ff00ff',
              borderLeft: '3px solid #00ffff',
            }}
            animate={{ rotate: -360 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          <motion.div
            className="absolute inset-4 rounded-full bg-gradient-to-br from-pink-500/20 to-cyan-500/20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        {/* Loading text */}
        <motion.p
          className="font-vt323 text-xl text-cyan-400 tracking-widest"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          LOADING...
        </motion.p>

        {/* Retro scanlines effect */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 255, 0.1) 2px, rgba(0, 255, 255, 0.1) 4px)',
          }}
        />
      </motion.div>
    </div>
  );
};

export default RetroLoader;
