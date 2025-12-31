import { memo, useMemo, forwardRef } from 'react';
import { motion } from 'framer-motion';

interface CelebrationParticlesProps {
  active: boolean;
}

const CelebrationParticles = memo(forwardRef<HTMLDivElement, CelebrationParticlesProps>(({ active }, ref) => {
  const particles = useMemo(() => {
    return [...Array(100)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 4 + Math.random() * 4,
      size: 4 + Math.random() * 8,
      type: ['star', 'circle', 'heart', 'sparkle'][Math.floor(Math.random() * 4)],
      color: [
        'hsl(45 90% 65%)',    // gold
        'hsl(280 60% 75%)',   // lavender
        'hsl(340 70% 75%)',   // rose
        'hsl(200 80% 70%)',   // blue
        'hsl(320 70% 65%)',   // pink
      ][Math.floor(Math.random() * 5)],
    }));
  }, []);

  if (!active) return null;

  return (
    <div ref={ref} className="fixed inset-0 pointer-events-none overflow-hidden z-40">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: '-20px',
          }}
          initial={{ y: -50, opacity: 0, rotate: 0 }}
          animate={{
            y: ['0vh', '120vh'],
            opacity: [0, 1, 1, 0],
            rotate: [0, 360, 720],
            x: [0, Math.sin(p.id) * 100, Math.sin(p.id * 2) * 50],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {p.type === 'star' && (
            <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill={p.color}>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          )}
          {p.type === 'circle' && (
            <div
              style={{
                width: p.size,
                height: p.size,
                borderRadius: '50%',
                background: p.color,
                boxShadow: `0 0 ${p.size}px ${p.color}`,
              }}
            />
          )}
          {p.type === 'heart' && (
            <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill={p.color}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          )}
          {p.type === 'sparkle' && (
            <div
              style={{
                width: p.size,
                height: p.size,
                background: p.color,
                clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
              }}
            />
          )}
        </motion.div>
      ))}

      {/* Floating orbs */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute rounded-full"
          style={{
            width: 20 + Math.random() * 40,
            height: 20 + Math.random() * 40,
            left: `${Math.random() * 100}%`,
            background: `radial-gradient(circle at 30% 30%, hsl(${280 + i * 10} 70% 80%), hsl(${280 + i * 10} 70% 50%))`,
            boxShadow: `0 0 30px hsl(${280 + i * 10} 70% 60% / 0.5)`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.sin(i) * 50, 0],
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 5 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}

      {/* Sparkle trails */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`trail-${i}`}
          className="absolute h-px"
          style={{
            width: 100 + Math.random() * 200,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `linear-gradient(90deg, transparent, hsl(45 90% 70%), transparent)`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scaleX: [0, 1, 0],
            x: [-100, 100],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
}));

CelebrationParticles.displayName = 'CelebrationParticles';

export default CelebrationParticles;