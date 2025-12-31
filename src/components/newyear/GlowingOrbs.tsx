import { memo, forwardRef } from 'react';
import { motion } from 'framer-motion';

interface GlowingOrbsProps {
  count?: number;
  className?: string;
}

const GlowingOrbs = memo(forwardRef<HTMLDivElement, GlowingOrbsProps>(({ count = 5, className = '' }, ref) => {
  const orbs = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 200 + Math.random() * 400,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 15 + Math.random() * 20,
    delay: Math.random() * 5,
    color: i % 3 === 0 
      ? 'hsl(var(--luxury-aurora-1))' 
      : i % 3 === 1 
        ? 'hsl(var(--magical-gold))' 
        : 'hsl(var(--magical-rose))',
  }));

  return (
    <div ref={ref} className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}>
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            background: `radial-gradient(circle at center, ${orb.color} 0%, transparent 70%)`,
            filter: 'blur(60px)',
            opacity: 0.15,
          }}
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -80, 40, 0],
            scale: [1, 1.3, 0.8, 1],
            opacity: [0.1, 0.25, 0.15, 0.1],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}));

GlowingOrbs.displayName = 'GlowingOrbs';

export default GlowingOrbs;