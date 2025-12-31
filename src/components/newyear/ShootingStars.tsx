import { memo, useEffect, useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Star {
  id: number;
  startX: number;
  startY: number;
  angle: number;
  length: number;
  duration: number;
}

interface ShootingStarsProps {
  active?: boolean;
  frequency?: number;
}

const ShootingStars = memo(forwardRef<HTMLDivElement, ShootingStarsProps>(({ active = true, frequency = 3000 }, ref) => {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    if (!active) return;

    const createStar = () => {
      const star: Star = {
        id: Date.now() + Math.random(),
        startX: Math.random() * 100,
        startY: Math.random() * 40,
        angle: 30 + Math.random() * 30,
        length: 100 + Math.random() * 200,
        duration: 0.8 + Math.random() * 0.5,
      };

      setStars(prev => [...prev, star]);

      setTimeout(() => {
        setStars(prev => prev.filter(s => s.id !== star.id));
      }, star.duration * 1000 + 500);
    };

    const interval = setInterval(createStar, frequency);
    createStar(); // Initial star

    return () => clearInterval(interval);
  }, [active, frequency]);

  return (
    <div ref={ref} className="fixed inset-0 pointer-events-none overflow-hidden z-30">
      <AnimatePresence>
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute"
            style={{
              left: `${star.startX}%`,
              top: `${star.startY}%`,
              width: star.length,
              height: 2,
              background: `linear-gradient(90deg, hsl(var(--magical-gold) / 0), hsl(var(--magical-gold)), hsl(var(--foreground)))`,
              borderRadius: '1px',
              transformOrigin: 'left center',
              transform: `rotate(${star.angle}deg)`,
              boxShadow: '0 0 10px hsl(var(--magical-gold)), 0 0 20px hsl(var(--magical-gold) / 0.5)',
            }}
            initial={{ 
              scaleX: 0, 
              opacity: 0,
              x: 0,
              y: 0,
            }}
            animate={{ 
              scaleX: [0, 1, 1, 0],
              opacity: [0, 1, 1, 0],
              x: [0, star.length * 0.5],
              y: [0, star.length * 0.3],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: star.duration,
              ease: 'easeOut',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}));

ShootingStars.displayName = 'ShootingStars';

export default ShootingStars;