import { memo, useEffect, useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DownloadConfettiProps {
  active: boolean;
}

const confettiColors = [
  'hsl(45 90% 55%)',
  'hsl(350 80% 55%)',
  'hsl(200 80% 55%)',
  'hsl(140 70% 50%)',
  'hsl(280 70% 55%)',
  'hsl(30 90% 55%)',
];

const DownloadConfetti = memo(forwardRef<HTMLDivElement, DownloadConfettiProps>(({ active }, ref) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    color: string;
    size: number;
    rotation: number;
    delay: number;
  }>>([]);

  useEffect(() => {
    if (active) {
      const newParticles = Array.from({ length: 60 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        size: 6 + Math.random() * 8,
        rotation: Math.random() * 360,
        delay: Math.random() * 0.3,
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [active]);

  return (
    <div ref={ref}>
      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute"
                style={{
                  left: `${particle.x}%`,
                  top: '-20px',
                  width: particle.size,
                  height: particle.size * 0.6,
                  background: particle.color,
                  borderRadius: '2px',
                }}
                initial={{ 
                  y: -20, 
                  rotate: particle.rotation,
                  opacity: 1,
                }}
                animate={{ 
                  y: window.innerHeight + 50,
                  rotate: particle.rotation + 720,
                  opacity: [1, 1, 0],
                  x: [0, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 150],
                }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 2 + Math.random(),
                  delay: particle.delay,
                  ease: 'easeOut',
                }}
              />
            ))}
            
            {/* Sparkle emojis */}
            {['🎉', '✨', '🎊', '⭐', '💫'].map((emoji, i) => (
              <motion.span
                key={`emoji-${i}`}
                className="absolute text-3xl"
                style={{ left: `${20 + i * 15}%`, top: '-50px' }}
                initial={{ y: -50, opacity: 0 }}
                animate={{ 
                  y: window.innerHeight / 2,
                  opacity: [0, 1, 0],
                  rotate: [0, 360],
                  scale: [0.5, 1.5, 0.5],
                }}
                transition={{ 
                  duration: 1.5,
                  delay: 0.1 * i,
                }}
              >
                {emoji}
              </motion.span>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}));

DownloadConfetti.displayName = 'DownloadConfetti';

export default DownloadConfetti;