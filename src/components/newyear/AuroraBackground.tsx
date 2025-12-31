import { memo } from 'react';
import { motion } from 'framer-motion';

const AuroraBackground = memo(() => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Deep base gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 120% 80% at 50% 100%, hsl(var(--muted) / 0.5) 0%, transparent 70%),
            radial-gradient(ellipse 100% 60% at 50% 0%, hsl(var(--luxury-aurora-1) / 0.08) 0%, transparent 50%),
            linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--luxury-deep)) 100%)
          `,
        }}
      />
      
      {/* Primary aurora - slow, majestic movement */}
      <motion.div 
        className="absolute w-[250%] h-[250%] left-1/2 top-1/2"
        style={{
          background: `
            radial-gradient(ellipse 50% 30% at 30% 40%, 
              hsl(var(--luxury-aurora-1) / 0.25) 0%, 
              transparent 60%
            ),
            radial-gradient(ellipse 40% 25% at 70% 50%, 
              hsl(var(--luxury-aurora-2) / 0.2) 0%, 
              transparent 60%
            ),
            radial-gradient(ellipse 45% 28% at 50% 60%, 
              hsl(var(--luxury-aurora-3) / 0.15) 0%, 
              transparent 60%
            )
          `,
          transformOrigin: 'center center',
        }}
        animate={{
          x: ['-50%', '-45%', '-55%', '-50%'],
          y: ['-50%', '-55%', '-45%', '-50%'],
          rotate: [0, 5, -5, 0],
          scale: [1, 1.05, 0.95, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Secondary aurora layer - counter movement */}
      <motion.div 
        className="absolute w-[200%] h-[200%] left-1/2 top-1/2"
        style={{
          background: `
            radial-gradient(ellipse 35% 20% at 60% 35%, 
              hsl(var(--luxury-aurora-2) / 0.2) 0%, 
              transparent 70%
            ),
            radial-gradient(ellipse 30% 18% at 35% 55%, 
              hsl(var(--luxury-aurora-1) / 0.15) 0%, 
              transparent 70%
            )
          `,
          transformOrigin: 'center center',
        }}
        animate={{
          x: ['-50%', '-55%', '-45%', '-50%'],
          y: ['-50%', '-45%', '-55%', '-50%'],
          rotate: [0, -8, 8, 0],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Subtle light rays */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            conic-gradient(from 180deg at 50% 0%, 
              transparent 0deg,
              hsl(var(--luxury-aurora-1) / 0.03) 30deg,
              transparent 60deg,
              hsl(var(--luxury-aurora-2) / 0.02) 120deg,
              transparent 150deg,
              hsl(var(--luxury-aurora-3) / 0.02) 210deg,
              transparent 240deg,
              hsl(var(--luxury-aurora-1) / 0.02) 300deg,
              transparent 330deg,
              transparent 360deg
            )
          `,
        }}
        animate={{
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Cinematic vignette */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, hsl(var(--background) / 0.4) 80%, hsl(var(--background) / 0.9) 100%)
          `,
        }}
      />

      {/* Top fade for depth */}
      <div 
        className="absolute top-0 left-0 right-0 h-48"
        style={{
          background: 'linear-gradient(180deg, hsl(var(--background)) 0%, transparent 100%)',
        }}
      />
    </div>
  );
});

AuroraBackground.displayName = 'AuroraBackground';

export default AuroraBackground;
