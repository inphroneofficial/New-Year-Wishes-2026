import { memo } from 'react';
import { motion } from 'framer-motion';

interface PremiumBackgroundProps {
  variant?: 'aurora' | 'spotlight' | 'mesh';
  intensity?: 'low' | 'medium' | 'high';
}

// Optimized with will-change and transform for GPU acceleration
const PremiumBackground = memo(({ variant = 'aurora', intensity = 'medium' }: PremiumBackgroundProps) => {
  const opacityMultiplier = intensity === 'low' ? 0.5 : intensity === 'high' ? 1.5 : 1;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 will-change-transform">
      {/* Base gradient - static, no animation */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 100% 70% at 50% 100%, hsl(var(--muted) / ${0.2 * opacityMultiplier}) 0%, transparent 50%),
            radial-gradient(ellipse 80% 50% at 0% 50%, hsl(var(--luxury-aurora-1) / ${0.05 * opacityMultiplier}) 0%, transparent 50%),
            radial-gradient(ellipse 80% 50% at 100% 50%, hsl(var(--luxury-aurora-2) / ${0.05 * opacityMultiplier}) 0%, transparent 50%),
            linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--luxury-deep)) 100%)
          `,
        }}
      />

      {variant === 'aurora' && (
        <>
          {/* Optimized aurora - using CSS animations instead of framer-motion for bg elements */}
          <div
            className="absolute w-[800px] h-[400px] rounded-full animate-aurora-float-1"
            style={{
              background: `radial-gradient(ellipse, hsl(var(--luxury-aurora-1) / ${0.15 * opacityMultiplier}) 0%, transparent 70%)`,
              filter: 'blur(80px)',
              top: '10%',
              left: '15%',
              willChange: 'transform, opacity',
            }}
          />
          
          <div
            className="absolute w-[600px] h-[350px] rounded-full animate-aurora-float-2"
            style={{
              background: `radial-gradient(ellipse, hsl(var(--luxury-aurora-2) / ${0.12 * opacityMultiplier}) 0%, transparent 70%)`,
              filter: 'blur(60px)',
              bottom: '15%',
              right: '10%',
              willChange: 'transform, opacity',
            }}
          />
          
          {/* Magical center glow pulse */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
            style={{
              background: `radial-gradient(circle, hsl(var(--magical-gold) / ${0.08 * opacityMultiplier}) 0%, transparent 60%)`,
              filter: 'blur(60px)',
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      {variant === 'spotlight' && (
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background: `radial-gradient(circle, hsl(var(--luxury-glow) / ${0.2 * opacityMultiplier}) 0%, transparent 60%)`,
            filter: 'blur(60px)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Subtle star field - static for performance */}
      <div className="absolute inset-0">
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-foreground/20 animate-twinkle"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Vignette effect */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 0%, hsl(var(--background) / 0.4) 100%)',
        }}
      />
    </div>
  );
});

PremiumBackground.displayName = 'PremiumBackground';

export default PremiumBackground;