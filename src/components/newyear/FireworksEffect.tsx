import { memo, useEffect, useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FireworksEffectProps {
  active: boolean;
}

interface Firework {
  id: number;
  x: number;
  y: number;
  color: string;
  particles: Particle[];
}

interface Particle {
  id: number;
  angle: number;
  velocity: number;
  size: number;
  decay: number;
}

const colors = [
  'hsl(45 100% 65%)',    // Gold
  'hsl(340 95% 65%)',    // Hot Pink  
  'hsl(280 90% 70%)',    // Purple
  'hsl(160 85% 55%)',    // Emerald
  'hsl(200 100% 60%)',   // Cyan
  'hsl(30 100% 60%)',    // Orange
  'hsl(0 90% 60%)',      // Red
  'hsl(60 100% 70%)',    // Yellow
];

const FireworksEffect = memo(forwardRef<HTMLDivElement, FireworksEffectProps>(({ active }, ref) => {
  const [fireworks, setFireworks] = useState<Firework[]>([]);

  useEffect(() => {
    if (!active) {
      setFireworks([]);
      return;
    }

    const createFirework = () => {
      const particles: Particle[] = [];
      const particleCount = 24 + Math.floor(Math.random() * 12);
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          id: i,
          angle: (i / particleCount) * 360 + Math.random() * 15,
          velocity: 80 + Math.random() * 60,
          size: 2 + Math.random() * 3,
          decay: 0.85 + Math.random() * 0.1,
        });
      }

      const firework: Firework = {
        id: Date.now() + Math.random(),
        x: 15 + Math.random() * 70,
        y: 15 + Math.random() * 40,
        color: colors[Math.floor(Math.random() * colors.length)],
        particles,
      };

      setFireworks(prev => [...prev, firework]);

      setTimeout(() => {
        setFireworks(prev => prev.filter(f => f.id !== firework.id));
      }, 2500);
    };

    // Initial burst
    for (let i = 0; i < 5; i++) {
      setTimeout(createFirework, i * 200);
    }

    // Continuous fireworks
    const interval = setInterval(() => {
      if (Math.random() > 0.3) {
        createFirework();
      }
    }, 600);

    return () => clearInterval(interval);
  }, [active]);

  return (
    <div ref={ref} className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      <AnimatePresence>
        {fireworks.map(firework => (
          <div
            key={firework.id}
            className="absolute"
            style={{
              left: `${firework.x}%`,
              top: `${firework.y}%`,
            }}
          >
            {/* Central flash */}
            <motion.div
              className="absolute rounded-full"
              style={{
                width: 8,
                height: 8,
                background: firework.color,
                boxShadow: `0 0 30px 15px ${firework.color}`,
                left: -4,
                top: -4,
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />

            {/* Particles */}
            {firework.particles.map(particle => (
              <motion.div
                key={particle.id}
                className="absolute rounded-full"
                style={{
                  width: particle.size,
                  height: particle.size,
                  background: firework.color,
                  boxShadow: `0 0 ${particle.size * 3}px ${firework.color}`,
                  left: -particle.size / 2,
                  top: -particle.size / 2,
                }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: Math.cos((particle.angle * Math.PI) / 180) * particle.velocity,
                  y: Math.sin((particle.angle * Math.PI) / 180) * particle.velocity + 40,
                  opacity: 0,
                  scale: 0.2,
                }}
                transition={{
                  duration: 1.8,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              />
            ))}

            {/* Sparkle trails */}
            {firework.particles.filter((_, i) => i % 3 === 0).map(particle => (
              <motion.div
                key={`trail-${particle.id}`}
                className="absolute"
                style={{
                  width: 1,
                  height: 20,
                  background: `linear-gradient(to bottom, ${firework.color}, transparent)`,
                  transformOrigin: 'top',
                  left: 0,
                  top: 0,
                }}
                initial={{ 
                  rotate: particle.angle + 90, 
                  opacity: 0.8, 
                  scaleY: 0,
                  x: 0,
                  y: 0,
                }}
                animate={{ 
                  opacity: 0, 
                  scaleY: 1,
                  x: Math.cos((particle.angle * Math.PI) / 180) * particle.velocity * 0.6,
                  y: Math.sin((particle.angle * Math.PI) / 180) * particle.velocity * 0.6 + 20,
                }}
                transition={{
                  duration: 1.2,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>
        ))}
      </AnimatePresence>

      {/* Ambient glow during fireworks */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at 50% 30%, hsl(217 70% 65% / 0.1) 0%, transparent 60%)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}));

FireworksEffect.displayName = 'FireworksEffect';

export default FireworksEffect;
